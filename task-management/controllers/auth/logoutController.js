const logout = async (req, res) => {
  try {
    const hasToken = req.cookies.token
    const hasRefreshToken = req.cookies?.refreshToken

    if (!hasToken && !hasRefreshToken) {
      return res.status(400).json({ message: 'No hay sesión activa' })
    }

    // En el entorno de desarrollo, `secure` debe ser `false` porque localhost no usa HTTPS
    // En producción, `secure` debe ser `true` para mayor seguridad
    // limpia cookies en el backend
    res.clearCookie('token', {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax' // De esta forma frontend y backend en localhost compartan cookies
    })

    // También eliminamos el refreshToken en caso de que esté presente
    res.clearCookie('refreshToken', {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax'
    })

    res.status(200).json({ message: 'Logout exitoso' })
  } catch (error) {
    // Si ocurre un error en el servidor, lo registramos y enviamos un mensaje de error
    console.error('Error en logout:', error)
    res.status(500).json({ message: 'Error en el servidor', error })
  }
}

export default logout
