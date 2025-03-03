import User from '../../models/user.js'
import jwt from 'jsonwebtoken'
import bcrypt from 'bcrypt'

export const register = async (req, res, next) => {
  try {
    const { username, email, password, profileImage } = req.body

    if (!username || !email || !password) {
      return res
        .status(400)
        .json({ message: 'Todos los campos son obligatorios' })
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
    if (!emailRegex.test(email)) {
      return res.status(400).json({ message: 'El email no es válido' })
    }

    const passwordRegex =
      /^(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{6,}$/
    if (!passwordRegex.test(password)) {
      return res.status(400).json({
        message:
          'La contraseña debe tener al menos 6 caracteres, una mayúscula, un número y un carácter especial'
      })
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

    const tokenExpiry = 7 * 24 * 60 * 60
    const token = jwt.sign(
      {
        id: newUser._id,
        username: newUser.username,
        email: newUser.email,
        role: newUser.role
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

    res.status(201).json({
      message: 'Usuario registrado con éxito',
      token,
      username: newUser.username,
      email: newUser.email,
      profileImage: newUser.profileImage
    })
  } catch (error) {
    console.error('❌ Error en register:', error)
    next(error)
  }
}
