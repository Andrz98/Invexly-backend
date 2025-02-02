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
 * @param {string} req.body.password - Contraseña del usuario.
 * @param {Object} res - Objeto de la respuesta HTTP.
 * @param {Function} next - Función para pasar al siguiente middleware o controlador.
 */
console.log('🛡️ Middleware de validación cargado') // Debug para confirmar que el middleware está activo

module.exports = (req, res, next) => {
  const { username, password } = req.body

  // Verifica que el usuario y contraseña estén presentes
  if (!username || !password) {
    return res.status(400).json({
      error: true, // Indica que ocurrió un error
      message: 'El usuario y la contraseña son obligatorios', // Mensaje descriptivo
    })
  }

  next() // Pasa al siguiente middleware o controlador
}
