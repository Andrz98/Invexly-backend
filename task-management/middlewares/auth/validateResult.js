import { validationResult } from 'express-validator'
import logger from '../../../utils/winstonLogger/loggers.js'

const validateResult = (req, res, next) => {
  const errors = validationResult(req)

  if (!errors.isEmpty()) {
    logger.warn('🫸🏽 Validación de entrada fallida', {
      method: req.method,
      url: req.originalUrl,
      ip: req.ip,
      errores: errors.array().map((err) => ({
        campo: err.param,
        mensaje: err.msg
      }))
    })

    return res.status(400).json({
      errors: errors.array().map((err) => ({
        campo: err.param,
        mensaje: err.msg
      }))
    })
  }

  next()
}

export default validateResult
