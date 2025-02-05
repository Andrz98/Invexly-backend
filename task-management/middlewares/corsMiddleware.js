// =========================================
// Middleware para manejar CORS
// =========================================
const cors = require('cors')

/**
 * Lista de orígenes permitidos para acceder a la API.
 * Incluimos el frontend que corre en localhost:5173 y la API en localhost:3000.
 */
const allowedOrigins = ['http://localhost:5173', 'http://localhost:3000']

/**
 * Middleware para configurar las políticas de CORS.
 * - Permite solicitudes del frontend asegurando la transmisión de cookies para la autenticación.
 * - 'credentials: true' habilita el envío de cookies y encabezados de autenticación.
 * - Configuración simplificada para mayor compatibilidad con el frontend en desarrollo.
 */
const corsMiddleware = cors({
  origin: (origin, callback) => {
    console.log(`[CORS] Solicitud desde: ${origin}`) // Debug para rastrear el origen de la solicitud

    // Permitir solicitudes si el origen está en la lista permitida o si es una solicitud sin origen (como Postman)
    if (!origin || allowedOrigins.includes(origin)) {
      console.log(
        `[CORS] Origen permitido: ${origin || 'Sin origen (Postman o servidor local)'}`
      )
      callback(null, true)
    } else {
      console.error('[ERROR]: No permitido por CORS')
      callback(new Error('No permitido por CORS')) // Bloqueo para orígenes no autorizados
    }
  },
  credentials: true, // Habilita el envío de cookies y encabezados de autenticación (para JWT)
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'], // Métodos HTTP permitidos
  allowedHeaders: ['Content-Type', 'Authorization'], // Encabezados permitidos en las solicitudes
  optionsSuccessStatus: 200, // Código de éxito para solicitudes preflight (mejora compatibilidad con algunos navegadores)
})

module.exports = corsMiddleware
