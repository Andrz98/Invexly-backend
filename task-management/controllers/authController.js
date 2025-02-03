const User = require('../../models/user') // Modelo de usuario para interactuar con MongoDB
const jwt = require('jsonwebtoken') // Librería para generar y verificar tokens JWT
const bcrypt = require('bcrypt') // Librería para encriptar y comparar contraseñas

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
  console.log('📥 Entrando al controlador de registro') // Debug para verificar que se está alcanzando el controlador
  try {
    const { username, email, password } = req.body

    const existingUser = await User.findOne({ email })
    if (existingUser) {
      console.warn('⚠️ El usuario ya está registrado') // Debug para usuario duplicado
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
    console.log('✅ Usuario registrado con éxito') // Debug para registro exitoso

    const token = jwt.sign({ id: newUser._id }, process.env.JWT_SECRET, {
      expiresIn: '1h',
    })

    res.status(201).json({ message: 'Usuario registrado con éxito', token })
  } catch (error) {
    console.error('❌ Error en el registro:', error.message) // Debug para errores en registro
    next(error)
  }
}

// ========================
// Controlador: Inicio de Sesión
// ========================
/**
 * Controlador para el inicio de sesión (Login).
 *
 * @param {Object} req - Objeto de la solicitud HTTP.
 * @param {Object} req.body - Contiene los datos enviados en la solicitud.
 * @param {string} req.body.email - Correo electrónico del usuario.
 * @param {string} req.body.password - Contraseña del usuario.
 * @param {Object} res - Objeto de la respuesta HTTP.
 * @param {Function} next - Función para manejar errores.
 */
exports.login = async (req, res, next) => {
  console.log('📥 Entrando al controlador de login') // Debug para verificar que se está alcanzando el controlador
  try {
    const { email, password } = req.body

    const user = await User.findOne({ email })
    if (!user) {
      console.warn('⚠️ Usuario no encontrado') // Debug para usuario no encontrado
      const error = new Error('Usuario no encontrado')
      error.status = 401
      throw error
    }

    const isMatch = await bcrypt.compare(password, user.password)
    if (!isMatch) {
      console.warn('⚠️ Contraseña incorrecta') // Debug para contraseña incorrecta
      const error = new Error('Contraseña incorrecta')
      error.status = 401
      throw error
    }

    const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET, {
      expiresIn: '1h',
    })

    console.log('✅ Inicio de sesión exitoso') // Debug para login exitoso
    res.json({ message: 'Inicio de sesión exitoso', token })
  } catch (error) {
    console.error('❌ Error en el login:', error.message) // Debug para errores en login
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
  console.log('👋 Usuario cerró sesión') // Debug para confirmar el cierre de sesión
  res.json({ message: 'Sesión cerrada con éxito' })
}
