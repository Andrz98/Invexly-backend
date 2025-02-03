// =========================================
// Middleware para manejar CORS
// =========================================
const cors = require('cors')
/**
 * Con este middleware buscamos gestionar las políticas de CORS.
 * CORS es una política de seguridad que controla cómo las aplicaciones web pueden acceder a nuestros recursos.
 * Aquí definimos qué orígenes del frontend pueden hacer solicitudes a nuestro backend,
 * qué métodos están permitidos, y permitimos el uso de cookies o tokens de autenticación con 'credentials: true'.
 */

const corsMiddleware = cors({
  origin: ['http://localhost:5174', 'http://localhost:3000'], // Incluye el puerto 5174
  credentials: true, // Permitimos el envío de cookies y encabezados de autenticación (como los tokens JWT)
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization'],
  optionsSuccessStatus: 200, // Asegura que las solicitudes preflight respondan correctamente
})

module.exports = corsMiddleware
