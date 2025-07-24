import { verifyToken } from '../helpers/token/verifyToken.js'

import logger from '../../../utils/winstonLogger/loggers.js'

/**
 * Middleware para autenticar usuarios mediante token JWT.
 * Verifica token desde cookie o header y expone el payload en req.user.
 */
const authenticateToken = (req, res, next) => {
  const token =
    req.cookies?.token ||
    (req.headers.authorization && req.headers.authorization.split(' ')[1])

  try {
    const decoded = verifyToken(token, process.env.JWT_SECRET)
    req.user = decoded
    next()
  } catch (error) {
    // Log de advertencia si hay token inválido o expirado
    logger.warn(
      `🫸🏽 Token inválido o expirado al acceder a ${req.originalUrl}`,
      {
        ip: req.ip,
        method: req.method,
        tokenSnippet: token ? token.slice(0, 10) + '...' : 'Token ausente',
        errorMessage: error.message
      }
    )

    return res.status(error.statusCode || 403).json({ message: error.message })
  }
}

export default authenticateToken
