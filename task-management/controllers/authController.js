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
 * @param {Object} req.body - Contiene los datos enviados en la solicitud.
 * @param {string} [req.body.email] - Correo electrónico del usuario.
 * @param {string} [req.body.username] - Nombre de usuario.
 * @param {string} req.body.password - Contraseña del usuario.
 * @param {Object} res - Objeto de la respuesta HTTP.
 * @param {Function} next - Función para manejar errores.
 */
exports.login = async (req, res, next) => {
  try {
    const { email, username, password } = req.body

    //  Permitir login por email o username
    const user = await User.findOne({
      $or: [{ email }, { username }],
    })

    if (!user) {
      const error = new Error('Usuario no encontrado')
      error.status = 401
      throw error
    }

    const isMatch = await bcrypt.compare(password, user.password)
    if (!isMatch) {
      const error = new Error('Contraseña incorrecta')
      error.status = 401
      throw error
    }

    const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET, {
      expiresIn: '1h',
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
 * @param {Object} req.body - Contiene los datos enviados en la solicitud.
 * @param {string} req.body.username - Nombre de usuario.
 * @param {string} req.body.email - Correo electrónico del usuario.
 * @param {string} req.body.password - Contraseña del usuario.
 * @param {Object} res - Objeto de la respuesta HTTP.
 * @param {Function} next - Función para manejar errores.
 */
exports.register = async (req, res, next) => {
  try {
    const { username, email, password } = req.body

    const existingUser = await User.findOne({ $or: [{ email }, { username }] })
    if (existingUser) {
      const error = new Error('El usuario ya está registrado')
      error.status = 400
      throw error
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
      expiresIn: '1h',
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
// Controlador: Cierre de Sesión
// ========================
/**
 * Controlador para el cierre de sesión (Sign Out).
 *
 * @param {Object} req - Objeto de la solicitud HTTP.
 * @param {Object} res - Objeto de la respuesta HTTP.
 */
exports.signOut = (req, res) => {
  res.json({ message: 'Sesión cerrada con éxito' })
}
