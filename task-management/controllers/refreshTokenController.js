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

        res.json({ accessToken })
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
