const logout = async (req, res) => {
  try {
    const hasToken = req.cookies.token
    const hasRefreshToken = req.cookies?.refreshToken

    if (!hasToken && !hasRefreshToken) {
      return res.status(400).json({ message: 'No hay sesión activa' })
    }

    // console.log('Cookies recibidas en logout:', req.cookies) // Útil en desarrollo

    const isProduction = process.env.NODE_ENV === 'production'

    res.clearCookie('token', {
      httpOnly: true,
      secure: isProduction,
      sameSite: 'lax',
      path: '/'
    })

    res.clearCookie('refreshToken', {
      httpOnly: true,
      secure: isProduction,
      sameSite: 'lax',
      path: '/'
    })

    // console.log('Cookies después de logout:', req.cookies) // Solo en debugging

    res.status(200).json({ message: 'Logout exitoso' })
  } catch (error) {
    console.error('Error en logout:', error)
    res.status(500).json({ message: 'Error en el servidor', error })
  }
}

export default logout
