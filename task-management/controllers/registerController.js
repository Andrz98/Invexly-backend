import User from '../../models/user.js'
import jwt from 'jsonwebtoken'
import bcrypt from 'bcrypt'

const register = async (req, res, next) => {
  try {
    const { username, email, password, profileImage } = req.body

    if (!username || !email || !password) {
      return res
        .status(400)
        .json({ message: 'Todos los campos son obligatorios' })
    }

    const existingUser = await User.findOne({ $or: [{ email }, { username }] })

    if (existingUser) {
      return res.status(400).json({ message: 'El usuario ya está registrado' })
    }

    const hashedPassword = await bcrypt.hash(password, 10)
    const newUser = new User({
      username,
      email,
      password: hashedPassword,
      role: 'user',
      profileImage: profileImage || 'default-profile.png'
    })

    await newUser.save()

    const token = jwt.sign({ id: newUser._id }, process.env.JWT_SECRET, {
      expiresIn: '7d'
    })

    res.cookie('token', token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
      maxAge: 7 * 24 * 60 * 60 * 1000
    })

    res.status(201).json({ message: 'Usuario registrado con éxito', token })
  } catch (error) {
    console.error('❌ Error en register:', error)
    next(error)
  }
}

export default register
