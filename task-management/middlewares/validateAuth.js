// ========================
// Middleware: Validar Datos de Autenticación
// ========================
// Asegura que los datos enviados sean válidos antes de procesarlos.
/**
 * Middleware para validar los datos de autenticación en las solicitudes.
 *
 * @param {Object} req - Objeto de la solicitud HTTP.
 * @param {Object} req.body - Contiene los datos enviados en la solicitud.
 * @param {string} [req.body.username] - Nombre de usuario (opcional si se usa email).
 * @param {string} [req.body.email] - Correo electrónico del usuario (opcional si se usa username).
 * @param {string} req.body.password - Contraseña del usuario.
 * @param {Object} res - Objeto de la respuesta HTTP.
 * @param {Function} next - Función para pasar al siguiente middleware o controlador.
 */
module.exports = (req, res, next) => {
  const { username, email, password } = req.body

  // Verifica que haya al menos un identificador (username o email) y la contraseña
  if ((!username && !email) || !password) {
    return res.status(400).json({
      error: true,
      message:
        'El usuario o el correo electrónico y la contraseña son obligatorios',
    })
  }

  next() // Pasa al siguiente middleware o controlador
}
