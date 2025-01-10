const User = require('../../models/user') // Modelo de usuario para interactuar con MongoDB
const jwt = require('jsonwebtoken') // Librería para generar y verificar tokens JWT
const bcrypt = require('bcrypt') // Librería para encriptar y comparar contraseñas

// ========================
// Controlador: Sign In
// ========================
// Busca al usuario, valida la contraseña y genera un token JWT.
/**
 * Controlador para el inicio de sesión (Sign In).
 *
 * @param {Object} req - Objeto de la solicitud HTTP.
 * @param {Object} req.body - Contiene los datos enviados en la solicitud.
 * @param {string} req.body.username - Nombre de usuario.
 * @param {string} req.body.password - Contraseña del usuario.
 * @param {Object} res - Objeto de la respuesta HTTP.
 * @param {Function} next - Función para manejar errores y pasar al middleware global.
 */
exports.signIn = async (req, res, next) => {
  try {
    const { username, password } = req.body

    // Buscar usuario en la base de datos
    const user = await User.findOne({ username })
    if (!user) {
      const error = new Error('Usuario no encontrado')
      error.status = 401 // Código HTTP 401: No autorizado
      throw error // Lanzar error para el middleware global
    }

    // Validar la contraseña
    const isMatch = await bcrypt.compare(password, user.password)
    if (!isMatch) {
      const error = new Error('Contraseña incorrecta')
      error.status = 401 // Código HTTP 401: No autorizado
      throw error // Lanzar error para el middleware global
    }

    // Generar el token JWT
    const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET, {
      expiresIn: '1h',
    })

    // Responder con el token generado
    res.json({ token })
  } catch (error) {
    next(error) // Pasar el error al middleware de manejo global
  }
}

// ========================
// Controlador: Sign Out
// ========================
// Devuelve un mensaje confirmando que la sesión se cerró correctamente.
/**
 * Controlador para el cierre de sesión (Sign Out).
 *
 * @param {Object} req - Objeto de la solicitud HTTP.
 * @param {Object} res - Objeto de la respuesta HTTP.
 */
exports.signOut = (req, res) => {
  res.json({ message: 'Sesión cerrada con éxito' })
}
