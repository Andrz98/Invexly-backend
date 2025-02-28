// =========================================
// Controladores de Autenticación
// =========================================

import User from '../../models/user.js'
import jwt from 'jsonwebtoken'
import bcrypt from 'bcrypt'

// ========================
// Controlador: Inicio de Sesión
// ========================
export const login = async (req, res, next) => {
  try {
    const { email, username, password } = req.body
    const user = await User.findOne({ $or: [{ email }, { username }] })

    if (!user) {
      return res.status(401).json({ message: 'Usuario no encontrado' })
    }

    const isMatch = await bcrypt.compare(password, user.password)
    if (!isMatch) {
      return res.status(401).json({ message: 'Contraseña incorrecta' })
    }

    const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET, {
      expiresIn: '7d',
    })

    res.cookie('token', token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
      maxAge: 7 * 24 * 60 * 60 * 1000,
    })

    res.json({
      message: 'Inicio de sesión exitoso',
      token,
      username: user.username,
      email: user.email,
    })
  } catch (error) {
    next(error)
  }
}

// ========================
// Controlador: Registro de Usuario
// ========================
export const register = async (req, res, next) => {
  try {
    const { username, email, password } = req.body
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
    })

    await newUser.save()

    const token = jwt.sign({ id: newUser._id }, process.env.JWT_SECRET, {
      expiresIn: '7d',
    })

    res.status(201).json({
      message: 'Usuario registrado con éxito',
      token,
      username: newUser.username,
      email: newUser.email,
    })
  } catch (error) {
    next(error)
  }
}

// ========================
// Controlador: Validación del Token
// ========================
export const validateToken = async (req, res) => {
  try {
    const user = await User.findById(req.user.id)
    if (!user) {
      return res
        .status(401)
        .json({ message: 'Token inválido o usuario no encontrado' })
    }

    res.json({
      message: 'Token válido',
      username: user.username,
      email: user.email,
      role: user.role,
    })
  } catch (error) {
    res.status(500).json({ message: 'Error al validar el token' })
  }
}

// ========================
// Controlador: Cierre de Sesión
// ========================
export const signOut = (req, res) => {
  res.clearCookie('token')
  res.json({ message: 'Sesión cerrada con éxito' })
}
