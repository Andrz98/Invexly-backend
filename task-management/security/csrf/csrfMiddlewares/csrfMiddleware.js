import { createRequire } from 'module'
import logger from '../../../../utils/winstonLogger/loggers.js'

// Importar correctamente la librería como CommonJS
const require = createRequire(import.meta.url)
const { doubleCsrf } = require('csrf-csrf')

// Inicializar la protección CSRF con las opciones
const {
  doubleCsrfProtection: csrfProtect,
  generateToken,
  validateRequest
} = doubleCsrf({
  getSecret: () => process.env.CSRF_SECRET || 'default_unsafe_csrf_secret',
  cookieName: '__Host-csrf-token',
  cookieOptions: {
    sameSite: 'strict',
    path: '/',
    secure: process.env.NODE_ENV === 'production',
    httpOnly: false // necesario para que el frontend lea la cookie
  },
  getTokenFromRequest: (req) => req.headers['x-csrf-token']
})

// Middleware para emitir el token (el token se genera automáticamente)
export const csrfCookieMiddleware = (req, res) => {
  generateToken(res) // establece cookie
  logger.info('[CSRF] Token CSRF enviado correctamente')
  res.status(200).json({ message: 'CSRF cookie enviada' })
}

// Middleware de protección para rutas sensibles
export const csrfProtectionMiddleware = (req, res, next) => {
  if (process.env.NODE_ENV !== 'production') {
    return next()
  }

  return csrfProtect(req, res, (err) => {
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
