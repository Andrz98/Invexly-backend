import User from '../../../models/user.js'
import jwt from 'jsonwebtoken'
import bcrypt from 'bcrypt'

const login = async (req, res, next) => {
  try {
    const { email, password } = req.body

    if (!email || !password) {
      return res.status(400).json({ message: 'Faltan credenciales' })
    }

    const user = await User.findOne({ email })
    if (!user) {
      return res.status(401).json({ message: 'Credenciales incorrectas' }) // Evita enumeración de usuarios
    }

    const isMatch = await bcrypt.compare(password, user.password)
    if (!isMatch) {
      return res.status(401).json({ message: 'Credenciales incorrectas' }) // Mensaje unificado
    }

    // Definir si estamos en producción o desarrollo
    const isProduction = process.env.NODE_ENV === 'production'

    // Generar el token con duración de 1 hora
    const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET, {
      expiresIn: '1h'
    })

    if (!token) {
      return res.status(500).json({ message: 'Error generando token' }) // Si falla la generación
    }

    // Configurar la cookie para mantener la sesión
    res.cookie('token', token, {
      httpOnly: false, // Solo `true` en producción
      secure: isProduction, // Solo `true` en producción
      sameSite: 'lax',
      path: '/',
      maxAge: 60 * 60 * 1000 // 1 hora de duración
    })

    res.status(200).json({
      message: 'Inicio de sesión exitoso',
      token, // Devolvemos el token por compatibilidad con el frontend
      username: user.username,
      email: user.email,
      role: user.role
    })
  } catch (error) {
    console.error('Error en login:', error)
    next(error)
  }
}

export default login
