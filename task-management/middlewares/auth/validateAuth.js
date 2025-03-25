// ========================
// Middleware: Validar Datos de Autenticación
// ========================

const validateAuth = (req, res, next) => {
  const { username, email, password } = req.body

  if ((!username && !email) || !password) {
    return res.status(400).json({
      error: true,
      message: 'Todos los campos son obligatorios'
    })
  }

  next()
}

export default validateAuth
