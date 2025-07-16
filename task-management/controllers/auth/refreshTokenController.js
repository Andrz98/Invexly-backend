import jwt from 'jsonwebtoken'
import User from '../../../models/user.js'

/**
 * Controlador que renueva el token de acceso utilizando el refresh token.
 * @param {import('express').Request} req - Petición HTTP.
 * @param {import('express').Response} res - Respuesta HTTP.
 */
const refreshTokenController = async (req, res) => {
  // Cabeceras CORS para mantener coherencia en todas las respuestas
  res.header('Access-Control-Allow-Origin', 'https://invexly.netlify.app')
  res.header('Access-Control-Allow-Credentials', 'true')

  const refreshTokenCookie = req.cookies.refreshToken

  // Validación: se requiere el refresh token en cookies
  if (!refreshTokenCookie) {
    return res.status(401).json({ message: 'Refresh Token no proporcionado' })
  }

  let decoded
  try {
    // Verificación sincrónica del refresh token
    decoded = jwt.verify(
      refreshTokenCookie,
      process.env.REFRESH_TOKEN_SECRET
    )
  } catch (error) {
    return res
      .status(403)
      .json({ message: 'Refresh Token inválido o expirado' })
  }

  try {
    const user = await User.findById(decoded.id).select('-password')

    if (!user) {
      return res.status(404).json({ message: 'Usuario no encontrado' })
    }

    const newAccessToken = jwt.sign(
      { id: decoded.id },
      process.env.JWT_SECRET,
      { expiresIn: '1h' }
    )

    res.cookie('token', newAccessToken, {
      httpOnly: true,
      sameSite: 'none',
      secure: true,
      maxAge: 60 * 60 * 1000 // 1 hora
    })

    return res.status(200).json({
      message: 'Token renovado',
      accessToken: newAccessToken,
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
