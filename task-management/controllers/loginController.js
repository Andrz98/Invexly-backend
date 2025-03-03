import User from '../../models/user.js'
import jwt from 'jsonwebtoken'
import bcrypt from 'bcrypt'

export const login = async (req, res, next) => {
  try {
    const { email, password } = req.body

    if (!email || !password) {
      return res
        .status(400)
        .json({ message: 'Faltan credenciales: email y contraseña requeridos' })
    }

    const user = await User.findOne({ email })

    if (!user) {
      return res.status(401).json({ message: 'Usuario no encontrado' })
    }

    const isMatch = await bcrypt.compare(password, user.password)
    if (!isMatch) {
      return res.status(401).json({ message: 'Contraseña incorrecta' })
    }

    const tokenExpiry = 7 * 24 * 60 * 60
    const token = jwt.sign(
      {
        id: user._id,
        username: user.username,
        email: user.email,
        role: user.role
      },
      process.env.JWT_SECRET,
      { expiresIn: tokenExpiry }
    )

    res.cookie('token', token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
      maxAge: tokenExpiry * 1000
    })

    res.json({
      message: 'Inicio de sesión exitoso',
      token,
      username: user.username,
      email: user.email
    })
  } catch (error) {
    console.error('❌ Error en login:', error)
    next(error)
  }
}
