/* eslint-disable no-unused-vars */
// =========================================
// Middleware para la Autenticación de Tokens JWT
// =========================================
/**
 * Este middleware se encarga de verificar la validez del token JWT enviado
 * en las solicitudes protegidas. Si el token es válido, se permite el acceso
 * a la siguiente función del controlador, de lo contrario, se retorna un error.
 */

const jwt = require('jsonwebtoken') // Importación de JWT para verificar tokens

/**
 * Middleware para autenticar el token JWT.
 *
 * @param {Object} req - Objeto de la solicitud HTTP.
 * @param {Object} res - Objeto de la respuesta HTTP.
 * @param {Function} next - Función que permite continuar con el siguiente middleware o controlador.
 */
const authenticateToken = (req, res, next) => {
  const token = req.cookies.token || req.headers.authorization?.split(' ')[1] // Obtiene el token de la cookie o del encabezado Authorization

  if (!token) {
    return res.status(401).json({ message: 'Token no proporcionado' }) // Retorna error si no hay token
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET) // Verifica el token usando la clave secreta
    req.user = decoded // Guarda la información decodificada del usuario en la solicitud
    next() // Permite que la solicitud continúe hacia el siguiente middleware o controlador
  } catch (error) {
    return res.status(401).json({ message: 'Token inválido o expirado' }) // Retorna error si el token no es válido
  }
}

module.exports = authenticateToken // Exporta el middleware para su uso en otras partes de la aplicación
