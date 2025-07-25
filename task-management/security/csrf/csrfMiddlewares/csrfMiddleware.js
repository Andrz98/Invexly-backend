import { createRequire } from 'module'
import logger from '../../../../utils/winstonLogger/loggers.js'

// Importar la librería de forma compatible con ESM
const require = createRequire(import.meta.url)
const { doubleCsrf } = require('csrf-csrf') // Función raíz

// Inicializar la protección CSRF
const { doubleCsrfProtection, generateToken, validateRequest } = doubleCsrf({
  getSecret: () => process.env.CSRF_SECRET || 'debug_csrf_secret',
  cookieName: '__Host-csrf-token',
  cookieOptions: {
    sameSite: 'strict',
    path: '/',
    secure: process.env.NODE_ENV === 'production',
    httpOnly: false
  },
  getTokenFromRequest: (req) => req.headers['x-csrf-token']
})

// Middleware para emitir la cookie y token
export const csrfCookieMiddleware = (req, res) => {
  logger.info('[CSRF DEBUG] csrfCookieMiddleware ejecutado')
  try {
    const token = generateToken(res)
    logger.info('[CSRF DEBUG] Token generado correctamente:', token)
    res.status(200).json({ message: 'CSRF cookie enviada' })
  } catch (err) {
    logger.error('[CSRF ERROR] generateToken falló:', err)
    res.status(500).json({ error: true, message: err.message })
  }
}

// Middleware para proteger rutas en producción
export const csrfProtectionMiddleware = (req, res, next) => {
  logger.info('[CSRF DEBUG] csrfProtectionMiddleware ejecutado')

  if (process.env.NODE_ENV !== 'production') {
    logger.info('[CSRF DEBUG] CSRF deshabilitado en desarrollo')
    return next()
  }

  doubleCsrfProtection(req, res, (err) => {
    if (err || !validateRequest(req)) {
      logger.warn('[CSRF] Token inválido o ausente', {
        path: req.path,
        ip: req.ip,
        message: err?.message || 'Token faltante o incorrecto'
      })
      return res.status(403).json({ message: 'CSRF token inválido o ausente' })
    }

    logger.debug('[CSRF] Token verificado correctamente')
    next()
  })
}
