const logout = async (req, res) => {
  try {
    res.header('Access-Control-Allow-Origin', 'https://invexly.netlify.app/')
    res.header('Access-Control-Allow-Credentials', 'true')

    // Recuperamos el token desde cookies o desde el header Authorization
    const tokenFromCookie = req.cookies.token
    const tokenFromHeader = req.headers.authorization?.split(' ')[1]
    const refreshToken = req.cookies?.refreshToken

    const hasToken = tokenFromCookie || tokenFromHeader
    const hasRefreshToken = !!refreshToken

    // Si no hay token ni refreshToken, no hay sesión activa
    if (!hasToken && !hasRefreshToken) {
      return res.status(401).json({ message: 'Token no proporcionado' })
    }

    // Borramos las cookies de autenticación
    res.clearCookie('token', {
      httpOnly: true,
      secure: true,
      sameSite: 'none',
      path: '/'
    })

    res.clearCookie('refreshToken', {
      httpOnly: true,
      secure: true,
      sameSite: 'none',
      path: '/'
    })

    // Devolvemos una respuesta exitosa
    return res.status(200).json({ message: 'Sesión cerrada correctamente' })
  } catch (error) {
    console.error('Error en logout:', error)
    res.status(500).json({ message: 'Error en el servidor', error })
  }
}

export default logout
