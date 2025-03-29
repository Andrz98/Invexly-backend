const validateAuth = (req, res, next) => {
  console.log('[validateAuth] Inicio de la validación')
  console.log('[validateAuth] req.body recibido:', req.body)

  const { username, email, password } = req.body
  console.log('[validateAuth] Datos extraídos:', { username, email, password })

  // Para registro, verifica username, email y password
  if (req.path.includes('/register')) {
    if (!username || !email || !password) {
      console.log('[validateAuth] Error en registro: Faltan campos')
      return res.status(400).json({
        error: true,
        message: 'Username, email y password son obligatorios para registro'
      })
    } // Para login, verifica email y password
  } else if (req.path.includes('/login')) {
    if (!email || !password) {
      console.log('[validateAuth] Error en login: Faltan campos')
      return res.status(400).json({
        error: true,
        message: 'Email y password son obligatorios para login'
      })
    }
  }

  console.log(
    '[validateAuth] Validación exitosa. Pasando al siguiente middleware...'
  )
  next()
}

export default validateAuth
