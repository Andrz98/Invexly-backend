import jwt from 'jsonwebtoken'

const refreshToken = (req, res) => {
  try {
    const refreshToken = req.cookies.refreshToken // Se obtiene desde las cookies HTTP-only

    if (!refreshToken) {
      return res.status(401).json({ message: 'Refresh Token no proporcionado' })
    }

    jwt.verify(
      refreshToken,
      process.env.REFRESH_TOKEN_SECRET,
      (error, decoded) => {
        if (error) {
          return res
            .status(403)
            .json({ message: 'Refresh Token inválido o expirado' })
        }

        const accessToken = jwt.sign(
          { id: decoded.id },
          process.env.JWT_SECRET,
          { expiresIn: '1h' }
        )

        res.cookie('token', accessToken, {
          // Ahora usamos accessToken correctamente
          httpOnly: true, // Protege contra accesos desde JavaScript (previene ataques XSS)
          secure: process.env.NODE_ENV === 'production', // En producción debe ser `true`, en local `false`
          sameSite: 'lax', // Permite compartir cookies entre frontend y backend en localhost
          maxAge: 60 * 60 * 1000 // Expira en 1 hora
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
