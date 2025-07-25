import { doubleCsrfProtection } from 'csrf-csrf'
import logger from '../../../../utils/winstonLogger/loggers.js'

// Middleware completo de protección
const csrfProtect = doubleCsrfProtection({
  getSecret: () => process.env.CSRF_SECRET || 'default_unsafe_csrf_secret',
  cookieName: '__Host-csrf-token',
  cookieOptions: {
    sameSite: 'strict',
    path: '/',
    secure: process.env.NODE_ENV === 'production',
    httpOnly: false // necesario para que el frontend/cliente lea la cookie
  },
  getTokenFromRequest: (req) => req.headers['x-csrf-token']
})

// Middleware para emitir el token (el token es generado automáticamente por csrf-csrf)
export const csrfCookieMiddleware = (req, res) => {
  logger.info('[CSRF] Token CSRF enviado correctamente')
  res.status(200).json({ message: 'CSRF cookie enviada' })
}

// Middleware de protección para rutas sensibles
export const csrfProtectionMiddleware = (req, res, next) => {
  if (process.env.NODE_ENV !== 'production') {
    return next()
  }
  return csrfProtect(req, res, (err) => {
    if (err) {
      logger.warn('[CSRF] Token inválido o ausente', {
        path: req.path,
        ip: req.ip,
        message: err.message
      })
      return res.status(403).json({ message: 'CSRF token inválido o ausente' })
    }
    logger.debug('[CSRF] Token verificado correctamente')
    next()
  })
}
