import User from '../../../../models/user.js'
import { signAndSendAccessToken } from '../helpers/token/signAndSendAccessToken.js'
import { verifyToken } from '../helpers/token/verifyToken.js'
import logger from '../../../../utils/winstonLogger/loggers.js'
import { issueCsrfToken } from '../../csrfValidator/csrfValidator.js'

/**
 * Controlador que renueva el token de acceso utilizando el refresh token.
 */
const refreshTokenController = async (req, res) => {
  const refreshTokenCookie = req.cookies.refreshToken

  if (!refreshTokenCookie) {
    logger.warn('Intento de renovación sin refresh token', {
      ip: req.ip,
      url: req.originalUrl,
      method: req.method
    })

    return res.status(401).json({ message: 'Refresh Token no proporcionado' })
  }

  let decoded
  try {
    decoded = verifyToken(refreshTokenCookie, process.env.REFRESH_TOKEN_SECRET)
  } catch (error) {
    logger.warn('Refresh token inválido o manipulado', {
      ip: req.ip,
      tokenSnippet: refreshTokenCookie.slice(0, 10) + '...',
      errorMessage: error.message
    })

    return res.status(403).json({ message: 'Refresh Token inválido' })
  }

  try {
    const user = await User.findById(decoded.id).select('-password')

    if (!user) {
      logger.warn('Usuario no encontrado durante la renovación de token', {
        userId: decoded.id
      })

      return res.status(404).json({ message: 'Usuario no encontrado' })
    }

    const accessToken = signAndSendAccessToken(res, user.id, '1h')
    issueCsrfToken(req, res)

    logger.info('Token de acceso renovado correctamente', {
      userId: user.id,
      ip: req.ip
    })

    return res.status(200).json({
      message: 'Token renovado',
      accessToken,
      user
    })
  } catch (error) {
    logger.error('Error inesperado al renovar token', {
      message: error.message,
      stack: error.stack
    })

    return res.status(500).json({
      message: 'Error en la renovación del token',
      error: error.message
    })
  }
}

export default refreshTokenController
