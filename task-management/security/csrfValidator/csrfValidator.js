import Tokens from 'csrf'
import logger from '../../../utils/winstonLogger/loggers.js'
import allowedOrigins, {
  normalizeOrigin
} from '../cors/config/allowedOrigins.js'

// Instancia única para generar y validar tokens CSRF con secretos por cookie.
const csrfTokens = new Tokens()
const CSRF_SECRET_COOKIE_NAME = 'csrfSecret'
const CSRF_HEADER_NAMES = ['x-csrf-token', 'x-xsrf-token', 'csrf-token']

/**
 * Define opciones de cookie compatibles con flujos same-site y cross-site.
 *
 * En producción forzamos `SameSite=None` para que navegadores modernos envíen
 * cookies en requests con credenciales desde dominios distintos (frontend/backend).
 *
 * @returns {{ httpOnly: boolean, sameSite: 'none' | 'strict', secure: boolean }}
 */
const getCsrfSecretCookieOptions = () => {
  const isProduction = process.env.NODE_ENV === 'production'

  return {
    httpOnly: true,
    sameSite: isProduction ? 'none' : 'strict',
    secure: isProduction
  }
}

/**
 * Define opciones de cookie para exponer el token CSRF al cliente.
 *
 * El token debe ser legible por JavaScript para enviarlo en `x-csrf-token`.
 * En producción usamos `SameSite=None` para soportar frontend en otro dominio.
 *
 * @returns {{ httpOnly: boolean, sameSite: 'none' | 'strict', secure: boolean }}
 */
const getCsrfTokenCookieOptions = () => {
  const isProduction = process.env.NODE_ENV === 'production'

  return {
    httpOnly: false,
    sameSite: isProduction ? 'none' : 'strict',
    secure: isProduction
  }
}

/**
 * Resuelve el origin de la request a partir de `Origin` o `Referer`.
 *
 * @param {import('express').Request} req - Solicitud HTTP entrante.
 * @returns {string | null} Origin normalizado o null cuando no existe.
 */
const getRequestOrigin = (req) => {
  const explicitOrigin = normalizeOrigin(req.get('origin'))
  if (explicitOrigin) {
    return explicitOrigin
  }

  const refererHeader = req.get('referer')
  if (typeof refererHeader !== 'string' || refererHeader.trim().length === 0) {
    return null
  }

  try {
    const refererOrigin = new URL(refererHeader).origin
    return normalizeOrigin(refererOrigin)
  } catch {
    return null
  }
}

/**
 * Determina si la request viene desde un origin confiable.
 *
 * Esto reduce falsos positivos de CSRF en flujos SPA cross-site donde el
 * frontend está explícitamente permitido por CORS.
 *
 * @param {import('express').Request} req - Solicitud HTTP entrante.
 * @returns {boolean} true si el origin está permitido; false en otro caso.
 */
const isTrustedOriginRequest = (req) => {
  const requestOrigin = getRequestOrigin(req)

  return Boolean(requestOrigin && allowedOrigins.includes(requestOrigin))
}

/**
 * Obtiene el token CSRF desde headers soportados o desde el body.
 *
 * Aceptamos múltiples nombres para ser compatibles con clientes comunes
 * (por ejemplo Axios usa `X-XSRF-TOKEN` por defecto).
 *
 * @param {import('express').Request} req - Solicitud HTTP entrante.
 * @returns {string | undefined} Token CSRF recibido por el cliente.
 */
const getCsrfTokenFromRequest = (req) => {
  for (const headerName of CSRF_HEADER_NAMES) {
    const tokenFromHeader = req.get(headerName)

    if (
      typeof tokenFromHeader === 'string' &&
      tokenFromHeader.trim().length > 0
    ) {
      return tokenFromHeader
    }
  }

  if (typeof req.body?._csrf === 'string' && req.body._csrf.trim().length > 0) {
    return req.body._csrf
  }

  return undefined
}

/**
 * Obtiene el secreto CSRF actual desde cookies o crea uno nuevo.
 *
 * @param {import('express').Request} req - Solicitud HTTP entrante.
 * @param {import('express').Response} res - Respuesta HTTP saliente.
 * @returns {string | null} Secreto CSRF válido o null si no fue posible generarlo.
 */
const ensureCsrfSecret = (req, res) => {
  const currentSecret = req.cookies?.[CSRF_SECRET_COOKIE_NAME]

  // Reutilizamos el secreto existente para mantener estable el token por sesión.
  if (typeof currentSecret === 'string' && currentSecret.length > 0) {
    return currentSecret
  }

  // Generamos un nuevo secreto cuando no existe cookie previa.
  const generatedSecret = csrfTokens.secretSync()
  if (!generatedSecret) {
    return null
  }

  // Persistimos el secreto en una cookie HttpOnly para evitar acceso desde JavaScript.
  res.cookie(
    CSRF_SECRET_COOKIE_NAME,
    generatedSecret,
    getCsrfSecretCookieOptions()
  )

  return generatedSecret
}

/**
 * Middleware CSRF para rutas de emisión y validación de token.
 *
 * @param {import('express').Request} req - Solicitud HTTP entrante.
 * @param {import('express').Response} res - Respuesta HTTP saliente.
 * @param {import('express').NextFunction} next - Siguiente middleware.
 * @returns {void}
 */
const csrfValidator = (req, res, next) => {
  if (!req.cookies) {
    logger.error('[CSRF] cookie-parser no está aplicado antes de csrfValidator')
    return res
      .status(500)
      .json({ message: 'Error interno de configuración CSRF' })
  }

  // Garantizamos que siempre exista un secreto para construir o validar tokens.
  const csrfSecret = ensureCsrfSecret(req, res)
  if (!csrfSecret) {
    logger.error('[CSRF] No fue posible generar el secreto CSRF')
    return res
      .status(500)
      .json({ message: 'Error interno de configuración CSRF' })
  }

  // Exponemos la función req.csrfToken() para mantener compatibilidad con el resto de la app.
  req.csrfToken = () => csrfTokens.create(csrfSecret)

  const isMutationMethod = ['POST', 'PUT', 'PATCH', 'DELETE'].includes(
    req.method
  )
  if (!isMutationMethod) {
    logger.debug('[CSRF] Método seguro detectado, no se valida token')
    return next()
  }

  // Permitimos mutaciones desde origins explícitamente autorizados para evitar
  // bloqueos en SPAs cross-site que ya pasan por validación estricta de CORS.
  if (isTrustedOriginRequest(req)) {
    logger.debug('[CSRF] Request mutante permitida por origin confiable')
    return next()
  }

  // Obtenemos el token enviado por headers compatibles o por body.
  const sentToken = getCsrfTokenFromRequest(req)
  const isTokenValid =
    typeof sentToken === 'string' && csrfTokens.verify(csrfSecret, sentToken)

  if (!isTokenValid) {
    logger.warn('[CSRF] Token inválido o ausente', {
      path: req.path,
      ip: req.ip
    })
    return res.status(403).json({ message: 'CSRF token inválido o ausente' })
  }

  logger.debug('[CSRF] Token verificado correctamente')
  return next()
}

export default csrfValidator
export {
  getCsrfSecretCookieOptions,
  getCsrfTokenCookieOptions,
  getCsrfTokenFromRequest,
  getRequestOrigin,
  isTrustedOriginRequest
}
