import logger from '../../../utils/winstonLogger/loggers.js'

const allowedOrigins = [process.env.FRONTEND_URL]

const handlePreflight = (req, res, next) => {
  if (req.method === 'OPTIONS') {
    const origin = req.headers.origin

    if (!allowedOrigins.includes(origin)) {
      logger.warn('Preflight rechazado: origen no permitido', {
        origin,
        ip: req.ip,
        method: req.method
      })

      return res.status(401).json({
        message: 'CORS: Origin no autorizado para preflight'
      })
    }

    logger.info('Preflight permitido', {
      origin,
      method: req.method
    })

    res.header('Access-Control-Allow-Origin', origin)
    res.header('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE')
    res.header('Access-Control-Allow-Headers', 'Content-Type, Authorization')
    res.header('Access-Control-Allow-Credentials', 'true')

    return res.sendStatus(204)
  }

  next()
}

export default handlePreflight
