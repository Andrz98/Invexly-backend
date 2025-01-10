// ========================
// Middleware Global de Manejo de Errores
// ========================
// Este middleware centraliza la gestión de errores, proporcionando
// respuestas consistentes y registrando los errores en el servidor.
/**
 * Middleware global para manejar errores.
 *
 * @param {Object} err - Objeto de error generado en la aplicación.
 * @param {Object} req - Objeto de la solicitud HTTP.
 * @param {Object} res - Objeto de la respuesta HTTP.
 * @param {Function} next - Función para pasar al siguiente middleware.
 */
module.exports = (err, req, res, next) => {
  console.error(`[ERROR]: ${err.message || 'Error desconocido'}`) // Log del error en el servidor

  const statusCode = err.status || 500 // Código HTTP por defecto: 500
  const errorMessage = err.message || 'Error interno del servidor' // Mensaje por defecto

  // Respuesta JSON con el error
  res.status(statusCode).json({
    error: true, // Indica que ocurrió un error
    message: errorMessage, // Mensaje descriptivo del error
  })
  next()
}
