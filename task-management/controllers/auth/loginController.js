import User from '../../../models/user.js'
import jwt from 'jsonwebtoken'
import bcrypt from 'bcrypt'

const login = async (req, res, next) => {
  try {
    const { email, password } = req.body

    if (!email || !password) {
      console.log('Validación activada: faltan credenciales') // console.log para vitest
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

    const isProduction = process.env.NODE_ENV === 'production'

    const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET, {
      expiresIn: '1h'
    })

    if (!token) {
      return res.status(500).json({ message: 'Error generando token' })
    }

    res.cookie('token', token, {
      httpOnly: isProduction, // Solo true en producción
      secure: isProduction,   // Solo true en producción
      sameSite: isProduction ? 'none' : 'lax', // none en producción (requiere HTTPS), lax en dev
      path: '/',
      maxAge: 60 * 60 * 1000 // 1 hora
    })

    res.status(200).json({
      message: 'Inicio de sesión exitoso',
      token,
      userId: user._id, // incorporo el id de rama2
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
