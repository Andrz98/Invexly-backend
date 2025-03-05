import User from '../../models/user.js'
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
      return res.status(401).json({ message: 'Usuario no encontrado' })
    }

    const isMatch = await bcrypt.compare(password, user.password)
    if (!isMatch) {
      return res.status(401).json({ message: 'Contraseña incorrecta' })
    }

    // Generar el token con duración de 1 hora
    const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET, {
      expiresIn: '1h'
    })

    // Configurar la cookie para mantener la sesión
    res.cookie('token', token, {
      httpOnly: true,
      secure: false, // `true` en producción, `false` en local
      sameSite: 'lax',
      maxAge: 60 * 60 * 1000 // 1 hora de duración
    })

    res.status(200).json({
      message: 'Inicio de sesión exitoso',
      token, // devolvemos el token por compatibilidad
      username: user.username,
      email: user.email,
      role: user.role
    })
  } catch (error) {
    console.error('❌ Error en login:', error)
    next(error)
  }
}

export default login
