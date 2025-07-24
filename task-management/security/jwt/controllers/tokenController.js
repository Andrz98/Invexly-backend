import User from '../../../../models/user.js'
import { verifyToken } from '../helpers/token/verifyToken.js'
import logger from '../../../../utils/winstonLogger/loggers.js'

/**
 * Controlador que valida un access token y devuelve el usuario.
 */
const tokenController = async (req, res) => {
  try {
    const token =
      req.cookies.token ||
      (req.headers.authorization && req.headers.authorization.split(' ')[1])

    if (!token) {
      logger.warn('Access token no proporcionado', {
        ip: req.ip,
        url: req.originalUrl,
        method: req.method
      })

      return res.status(401).json({ message: 'Token no proporcionado' })
    }

    let decoded
    try {
      decoded = verifyToken(token, process.env.JWT_SECRET)
    } catch (error) {
      logger.warn('Access token inválido', {
        ip: req.ip,
        tokenSnippet: token.slice(0, 10) + '...',
        errorMessage: error.message
      })

      return res
        .status(error.statusCode || 500)
        .json({ message: error.message })
    }

    const user = await User.findById(decoded.id).select(
      'username email role profileImage'
    )

    if (!user) {
      logger.warn('Usuario no encontrado al validar token', {
        userId: decoded.id
      })

      return res.status(404).json({ message: 'Usuario no encontrado' })
    }

    logger.info('Access token validado correctamente', {
      userId: user.id,
      ip: req.ip
    })

    return res.status(200).json({
      user: {
        id: user._id,
        username: user.username,
        email: user.email,
        role: user.role,
        profileImage: user.profileImage
      }
    })
  } catch (error) {
    logger.error('Error inesperado al validar access token', {
      message: error.message,
      stack: error.stack
    })

    return res.status(500).json({
      message: 'Error en la validación del token',
      error: error.message
    })
  }
}

export default tokenController
