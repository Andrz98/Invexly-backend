const logout = async (req, res) => {
  try {
    const hasToken = req.cookies.token
    const hasRefreshToken = req.cookies?.refreshToken

    if (!hasToken && !hasRefreshToken) {
      return res.status(400).json({ message: 'No hay sesión activa' })
    }

    res.cookie('token', '', {
      httpOnly: true,
      expires: new Date(0), // Expira inmediatamente
      sameSite: 'lax',
      secure: process.env.NODE_ENV === 'production'
    })

    res.cookie('refreshToken', '', {
      httpOnly: true,
      expires: new Date(0), // Expira inmediatamente
      sameSite: 'lax',
      secure: process.env.NODE_ENV === 'production'
    })

    res.status(200).json({ message: 'Logout exitoso' })
  } catch (error) {
    console.error('Error en logout:', error)
    res.status(500).json({ message: 'Error en el servidor', error })
  }
}
export default logout
