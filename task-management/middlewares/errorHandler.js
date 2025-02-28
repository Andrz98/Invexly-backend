const errorHandler = (err, req, res, next) => {
  console.error(`[ERROR]: ${err.message || 'Error desconocido'}`)

  const statusCode = err.status || 500
  const errorMessage = err.message || 'Error interno del servidor'

  res.status(statusCode).json({
    error: true,
    message: errorMessage,
  })

  next()
}

export default errorHandler
