const logout = async (req, res) => {
  try {
    const hasToken = req.cookies.token
    const hasRefreshToken = req.cookies?.refreshToken

    if (!hasToken && !hasRefreshToken) {
      return res.status(400).json({ message: 'No hay sesión activa' })
    }

    // Asegúrate de usar las mismas opciones que usaste al crear las cookies
    const cookieOptions = {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: process.env.NODE_ENV === 'production' ? 'strict' : 'lax',
      path: '/' // Es crucial especificar la misma ruta con la que se creó
    }

    // Limpia las cookies
    res.clearCookie('token', cookieOptions)
    res.clearCookie('refreshToken', cookieOptions)

    // Verifica que las cookies se hayan eliminado
    console.log('Cookies después de limpiar:', req.cookies)

    res.status(200).json({ message: 'Logout exitoso' })
  } catch (error) {
    console.error('Error en logout:', error)
    res.status(500).json({ message: 'Error en el servidor', error: error.message })
  }
}

export default logout