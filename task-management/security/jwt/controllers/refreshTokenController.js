import jwt from 'jsonwebtoken'
import User from '../../../../models/user.js'
import { signAndSendAccessToken } from '../helpers/token/signAndSendAccessToken.js'

/**
 * Controlador que renueva el token de acceso utilizando el refresh token.
 * @param {import('express').Request} req - Petición HTTP.
 * @param {import('express').Response} res - Respuesta HTTP.
 */
const refreshTokenController = async (req, res) => {
  const refreshTokenCookie = req.cookies.refreshToken

  // Validación: token debe estar presente
  if (!refreshTokenCookie) {
    return res.status(401).json({ message: 'Refresh Token no proporcionado' })
  }

  let decoded
  try {
    decoded = jwt.verify(refreshTokenCookie, process.env.REFRESH_TOKEN_SECRET)
  } catch (error) {
    console.error('Error al verificar el refresh token:', error)
    return res.status(403).json({ message: 'Refresh Token inválido' })
  }

  try {
    const user = await User.findById(decoded.id).select('-password')

    if (!user) {
      return res.status(404).json({ message: 'Usuario no encontrado' })
    }

    const accessToken = signAndSendAccessToken(res, user.id, '1h')

    return res.status(200).json({
      message: 'Token renovado',
      accessToken,
      user
    })
  } catch (error) {
    return res.status(500).json({
      message: 'Error en la renovación del token',
      error: error.message
    })
  }
}

export default refreshTokenController
