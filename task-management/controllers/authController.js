/* eslint-disable no-unused-vars */
const User = require('../../models/user') // Importación del modelo de usuario
const jwt = require('jsonwebtoken') // Librería para generar y verificar tokens JWT
const bcrypt = require('bcrypt') // Librería para encriptar y comparar contraseñas

// ========================
// Controlador: Inicio de Sesión
// ========================
/**
 * Controlador para el inicio de sesión (Login).
 *
 * @param {Object} req - Objeto de la solicitud HTTP.
 * @param {Object} res - Objeto de la respuesta HTTP.
 */
exports.login = async (req, res, next) => {
  try {
    const { email, username, password } = req.body

    const user = await User.findOne({ $or: [{ email }, { username }] }) // Busca al usuario por email o nombre de usuario
    if (!user) {
      return res.status(401).json({ message: 'Usuario no encontrado' })
    }

    const isMatch = await bcrypt.compare(password, user.password) // Esta linea compara la contraseña ingresada con la almacenada en la base de datos
    if (!isMatch) {
      return res.status(401).json({ message: 'Contraseña incorrecta' })
    }

    const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET, {
      expiresIn: '7d', // Token válido por 7 días
    })

    res.cookie('token', token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
      maxAge: 7 * 24 * 60 * 60 * 1000, // Duración de 7 días en milisegundos
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
/**
 * Controlador para el registro de nuevos usuarios.
 *
 * @param {Object} req - Objeto de la solicitud HTTP.
 * @param {Object} res - Objeto de la respuesta HTTP.
 */
exports.register = async (req, res, next) => {
  try {
    const { username, email, password } = req.body

    const existingUser = await User.findOne({ $or: [{ email }, { username }] })
    if (existingUser) {
      return res.status(400).json({ message: 'El usuario ya está registrado' })
    }

    const hashedPassword = await bcrypt.hash(password, 10) // Encriptación de la contraseña
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
/**
 * Controlador para validar el token JWT.
 *
 * @param {Object} req - Objeto de la solicitud HTTP.
 * @param {Object} res - Objeto de la respuesta HTTP.
 */
exports.validateToken = async (req, res) => {
  try {
    const user = await User.findById(req.user.id) // Información del usuario obtenida del token
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
/**
 * Controlador para el cierre de sesión (Sign Out).
 *
 * @param {Object} req - Objeto de la solicitud HTTP.
 * @param {Object} res - Objeto de la respuesta HTTP.
 */
exports.signOut = (req, res) => {
  res.clearCookie('token') // Elimina la cookie para cerrar sesión
  res.json({ message: 'Sesión cerrada con éxito' })
}
