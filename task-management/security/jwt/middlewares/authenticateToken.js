import { verifyToken } from '../helpers/token/verifyToken.js'

/**
 * Middleware para autenticar usuarios mediante token JWT.
 * Verifica token desde cookie o header y expone el payload en req.user.
 */
export const authenticateToken = (req, res, next) => {
  const token =
    req.cookies?.token ||
    (req.headers.authorization && req.headers.authorization.split(' ')[1])

  try {
    const decoded = verifyToken(token, process.env.JWT_SECRET)
    req.user = decoded
    next()
  } catch (error) {
    return res.status(error.statusCode || 403).json({ message: error.message })
  }
}
