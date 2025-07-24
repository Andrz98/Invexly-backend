import { validationResult } from 'express-validator'

const validateResult = (req, res, next) => {
  const errors = validationResult(req)
  if (!errors.isEmpty()) {
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
