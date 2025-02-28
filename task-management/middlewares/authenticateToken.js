import jwt from 'jsonwebtoken'

/**
 * Middleware para autenticar el token JWT.
 */
const authenticateToken = (req, res, next) => {
  const token = req.cookies.token || req.headers.authorization?.split(' ')[1]

  if (!token) {
    return res.status(401).json({ message: 'Token no proporcionado' })
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET)
    req.user = decoded
    next()
  } catch (error) {
    return res.status(401).json({ message: 'Token inválido o expirado' })
  }
}

export default authenticateToken
