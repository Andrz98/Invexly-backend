// ========================
// Middleware: Validar Datos de Autenticación
// ========================
// Asegura que los datos enviados sean válidos antes de procesarlos.
/**
 * Middleware para validar los datos de autenticación en las solicitudes.
 *
 * @param {Object} req - Objeto de la solicitud HTTP.
 * @param {Object} req.body - Contiene los datos enviados en la solicitud.
 * @param {string} req.body.username - Nombre de usuario.
 * @param {string} req.body.email - Correo electrónico del usuario.
 * @param {string} req.body.password - Contraseña del usuario.
 * @param {Object} res - Objeto de la respuesta HTTP.
 * @param {Function} next - Función para pasar al siguiente middleware o controlador.
 */
console.log('🛡️ Middleware de validación cargado') // Debug para confirmar que el middleware está activo

module.exports = (req, res, next) => {
  const { username, email, password } = req.body

  // Verifica que los datos estén presentes según la ruta
  if (req.path.includes('register')) {
    // ✅ Validación para el registro: Se requiere username, email y password
    if (!username || !email || !password) {
      return res.status(400).json({
        error: true, // Indica que ocurrió un error
        message:
          'El usuario, el correo electrónico y la contraseña son obligatorios', // Mensaje descriptivo
      })
    }
  } else if (req.path.includes('login')) {
    // ✅ Validación para el login: Se requiere email y password
    if (!email || !password) {
      return res.status(400).json({
        error: true, // Indica que ocurrió un error
        message: 'El correo electrónico y la contraseña son obligatorios', // Mensaje descriptivo
      })
    }
  }

  next() // Pasa al siguiente middleware o controlador
}
