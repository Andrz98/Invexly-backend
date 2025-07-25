import { doubleCsrf } from 'csrf-csrf'
import logger from '../../../../utils/winstonLogger/loggers.js'

// Configuración y extracción de funciones del middleware csrf-csrf
const { generateToken, validateRequest } = doubleCsrf({
  getSecret: () => process.env.CSRF_SECRET || 'insecure_default_secret',
  cookieName: '__Host-csrf-token',
  cookieOptions: {
    sameSite: 'strict',
    path: '/',
    secure: process.env.NODE_ENV === 'production',
    httpOnly: false // Se requiere que el frontend pueda leer esta cookie
  },
  getTokenFromRequest: (req) => req.headers['x-csrf-token']
})

// Middleware para validar el token CSRF en rutas sensibles (solo en producción)
export const csrfProtectionMiddleware = (req, res, next) => {
  if (process.env.NODE_ENV !== 'production') {
    return next()
  }

  const valid = validateRequest(req)
  if (!valid) {
    logger.warn('[CSRF] Token inválido o ausente', {
      path: req.path,
      ip: req.ip
    })
    return res.status(403).json({ message: 'CSRF token inválido o ausente' })
  }

  logger.debug('[CSRF] Token verificado correctamente')
  next()
}

// Middleware para emitir el token CSRF como cookie accesible desde el cliente
export const csrfCookieMiddleware = (req, res) => {
  const token = generateToken(res)
  logger.info('[CSRF] Token emitido correctamente')
  res.status(200).json({ message: 'CSRF cookie enviada', token })
}
