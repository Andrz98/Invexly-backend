import User from '../../../../models/user.js'
import { verifyToken } from '../helpers/token/verifyToken.js'
import logger from '../../../../utils/winstonLogger/loggers.js'

/**
 * Controlador que valida un access token y devuelve el usuario.
 */
const tokenController = async (req, res) => {
  const requestContext = {
    ip: req.ip,
    method: req.method,
    origin: req.headers.origin || 'sin-origin',
    hasTokenCookie: Boolean(req.cookies?.token),
    hasAuthorizationHeader: Boolean(req.headers.authorization)
  }

  try {
    const token =
      req.cookies.token ||
      (req.headers.authorization && req.headers.authorization.split(' ')[1])

    if (!token) {
      logger.warn('Access token no proporcionado', {
        ...requestContext,
        url: req.originalUrl,
        status: 401
      })

      return res.status(401).json({ message: 'Token no proporcionado' })
    }

    let decoded
    try {
      decoded = verifyToken(token, process.env.JWT_SECRET)
    } catch (error) {
      logger.warn('Access token inválido', {
        ...requestContext,
        tokenSnippet: token.slice(0, 10) + '...',
        status: error.statusCode || 500,
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
        ...requestContext,
        userId: decoded.id,
        status: 404
      })

      return res.status(404).json({ message: 'Usuario no encontrado' })
    }

    logger.info('Access token validado correctamente', {
      ...requestContext,
      userId: user.id,
      status: 200
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
      ...requestContext,
      status: 500,
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
