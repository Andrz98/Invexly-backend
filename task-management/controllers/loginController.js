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

    const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET, {
      expiresIn: '1h'
    })

    res.cookie('token', token, {
      httpOnly: true,
      secure: 'false', // En el entorno de desarrollo debe ser false porque localhost no usa HTTPS
      sameSite: 'lax', // De esta forma frontend y backend en localhost compartan cookies
      maxAge: 60 * 60 * 1000
    })

    res.json({ message: 'Inicio de sesión exitoso', token })
  } catch (error) {
    console.error('❌ Error en login:', error)
    next(error)
  }
}

export default login
