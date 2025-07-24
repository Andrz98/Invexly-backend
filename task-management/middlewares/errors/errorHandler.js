import logger from '../../../utils/winstonLogger/loggers.js'

const errorHandler = (err, req, res, next) => {
  // Registrar el error de forma estructurada con winston
  logger.error(`[ERROR]: ${err.message || 'Error desconocido'}`, {
    method: req.method,
    url: req.originalUrl,
    ip: req.ip,
    stack: err.stack
  })

  const statusCode = err.status || 500
  const errorMessage = err.message || 'Error interno del servidor'

  // Enviar respuesta estándar
  res.status(statusCode).json({
    error: true,
    message: errorMessage
  })

  next()
}

export default errorHandler
