import logger from '../../../utils/winstonLogger/loggers.js'
import allowedOrigins, { normalizeOrigin } from '../cors/config/allowedOrigins.js'

const handlePreflight = (req, res, next) => {
  if (req.method === 'OPTIONS') {
    const requestOrigin = req.headers.origin
    const normalizedOrigin = normalizeOrigin(requestOrigin)

    if (!normalizedOrigin || !allowedOrigins.includes(normalizedOrigin)) {
      logger.warn('Preflight rechazado: origen no permitido', {
        origin: requestOrigin,
        ip: req.ip,
        method: req.method
      })

      return res.status(401).json({
        message: 'CORS: Origin no autorizado para preflight'
      })
    }

    logger.info('Preflight permitido', {
      origin: normalizedOrigin,
      method: req.method
    })

    res.header('Access-Control-Allow-Origin', normalizedOrigin)
    res.header('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE')
    res.header('Access-Control-Allow-Headers', 'Content-Type, Authorization')
    res.header('Access-Control-Allow-Credentials', 'true')

    return res.sendStatus(204)
  }

  return next()
}

export default handlePreflight
