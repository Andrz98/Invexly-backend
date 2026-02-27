import Tokens from 'csrf'
import logger from '../../../utils/winstonLogger/loggers.js'

// Instancia única para generar y validar tokens CSRF con secretos por cookie.
const csrfTokens = new Tokens()
const CSRF_SECRET_COOKIE_NAME = 'csrfSecret'
const CSRF_HEADER_NAME = 'x-csrf-token'
const XSRF_HEADER_NAME = 'x-xsrf-token'
const CSRF_TOKEN_COOKIE_NAME = 'XSRF-TOKEN'

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
 * Genera y envía un token CSRF legible por JavaScript para clientes SPA.
 *
 * @param {import('express').Request} req - Solicitud HTTP entrante.
 * @param {import('express').Response} res - Respuesta HTTP saliente.
 * @returns {string | null} Token CSRF emitido o null si no fue posible.
 */
const issueCsrfToken = (req, res) => {
  const csrfSecret = ensureCsrfSecret(req, res)
  if (!csrfSecret) {
    return null
  }

  const token = csrfTokens.create(csrfSecret)
  res.cookie(CSRF_TOKEN_COOKIE_NAME, token, getCsrfTokenCookieOptions())

  return token
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

  // Obtenemos el token enviado por header o por body para soportar clientes variados.
  const sentToken =
    req.get(CSRF_HEADER_NAME) || req.get(XSRF_HEADER_NAME) || req.body?._csrf
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
  issueCsrfToken,
  CSRF_TOKEN_COOKIE_NAME
}
