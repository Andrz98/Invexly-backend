// =========================================
// Middleware para manejar CORS
// =========================================
const cors = require('cors')
/**
 * Con este middleware buscamos gestionar las políticas de Cors
 * Cors es una política de seguridad que controla como las aplicaciones web pueden acceder a neustros recursos.
 * Aquí definimos que origenes del frontend pueden hacer solicitudes a nuestro backend.
 * Por lo tanto controlan que métodos están permitidos.
 * Aquí mismo permitimos el uso de cookies o de tokens de autenticación con 'credentials: true'.
 */

const corsMiddleware = cors({
  origin: ['http://localhost:5173', 'http://localhost:3000'],
  credentials: true, // Permitimos el envio de cookies y encabezados de autenticación(como los tokens JWT)
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization'],
})

module.exports = corsMiddleware
