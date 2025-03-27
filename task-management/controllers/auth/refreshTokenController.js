import jwt from 'jsonwebtoken'
import User from '../../models/user.js'

const refreshToken = async (req, res) => {
  try {
    const refreshToken = req.cookies.refreshToken
    if (!refreshToken) {
      return res.status(401).json({ message: 'Refresh Token no proporcionado' })
    }

    jwt.verify(
      refreshToken,
      process.env.REFRESH_TOKEN_SECRET,
      async (error, decoded) => {
        if (error) {
          return res
            .status(403)
            .json({ message: 'Refresh Token inválido o expirado' })
        }

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
          sameSite: 'lax',
          secure: process.env.NODE_ENV === 'production',
          maxAge: 60 * 60 * 1000 // 1 hora
        })

        res.status(200).json({
          message: 'Token renovado',
          accessToken: newAccessToken,
          user
        })
      }
    )
  } catch (error) {
    res.status(500).json({
      message: 'Error en la renovación del token',
      error: error.message
    })
  }
}

export default refreshToken
