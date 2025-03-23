const logout = async (req, res) => {
  try {
    console.log('Cookies recibidas en logout:', req.cookies)

    const isProduction = process.env.NODE_ENV === 'production'

<<<<<<< HEAD
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
=======
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
>>>>>>> 8aec277d6bb275b976e22d6476718ba496964059

    console.log('Cookies después de logout:', req.cookies) // Verificar si se eliminaron correctamente

    res.status(200).json({ message: 'Logout exitoso' })
  } catch (error) {
    console.error('Error en logout:', error)
    res.status(500).json({ message: 'Error en el servidor', error: error.message })
  }
}

export default logout