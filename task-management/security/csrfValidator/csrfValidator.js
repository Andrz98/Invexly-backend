import csrf from 'csurf'
import logger from '../../../utils/winstonLogger/loggers.js'

const csrfProtection = csrf({
  cookie: {
    httpOnly: true,
    sameSite: 'Strict',
    secure: process.env.NODE_ENV === 'production'
  }
})

const csrfValidator = (req, res, next) => {
  if (!req.cookies) {
    logger.error('[CSRF] cookie-parser no está aplicado antes de csrfValidator')
    return res
      .status(500)
      .json({ message: 'Error interno de configuración CSRF' })
  }

  csrfProtection(req, res, (err) => {
    if (err) {
      logger.warn(`[CSRF] Token inválido o ausente: ${err.message}`, {
        path: req.path,
        ip: req.ip
      })
      return res.status(403).json({ message: 'CSRF token inválido o ausente' })
    }

    logger.debug('[CSRF] Token verificado correctamente')
    next()
  })
}

export default csrfValidator
