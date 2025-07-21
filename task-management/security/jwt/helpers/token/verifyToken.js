import jwt from 'jsonwebtoken'

/**
 * Verifica un token JWT y devuelve su payload decodificado.
 * Lanza errores con status HTTP diferenciados:
 * - 401: Token ausente
 * - 403: Token inválido o expirado
 *
 * @param {string} token - JWT firmado.
 * @param {string} secret - Clave JWT correspondiente.
 * @returns {object} payload decodificado
 * @throws {Error} con propiedad statusCode (401 o 403)
 */
export const verifyToken = (token, secret) => {
  if (!token) {
    const error = new Error('Token no proporcionado')
    error.statusCode = 401
    throw error
  }

  try {
    return jwt.verify(token, secret)
  } catch {
    const error = new Error('Token inválido o expirado')
    error.statusCode = 403
    throw error
  }
}
