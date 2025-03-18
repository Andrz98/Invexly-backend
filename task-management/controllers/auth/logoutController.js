const logout = async (req, res) => {
  try {
    console.log('Cookies recibidas en logout:', req.cookies)

    const isProduction = process.env.NODE_ENV === 'production'

    res.cookie('token', '', {
      httpOnly: true,
      expires: new Date(0), // Expira inmediatamente
      sameSite: 'Lax',
      secure: isProduction, // Solo en producción
      path: '/' // Asegurar que se elimine en toda la app
    })

    res.cookie('refreshToken', '', {
      httpOnly: true,
      expires: new Date(0),
      sameSite: 'Lax',
      secure: isProduction,
      path: '/'
    })

    console.log('Cookies después de logout:', req.cookies) // Verificar si se eliminaron correctamente

    res.status(200).json({ message: 'Logout exitoso' })
  } catch (error) {
    console.error('Error en logout:', error)
    res.status(500).json({ message: 'Error en el servidor', error })
  }
}

export default logout
