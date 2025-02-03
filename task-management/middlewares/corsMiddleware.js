// =========================================
// Middleware para manejar CORS
// =========================================
const cors = require('cors')

const allowedOrigins = ['http://localhost:5173', 'http://localhost:3000'] // Incluye el puerto 5173

const corsMiddleware = cors({
  origin: (origin, callback) => {
    console.log(`[CORS] Solicitud desde: ${origin}`) //  Debug del origen de la solicitud

    if (!origin || allowedOrigins.includes(origin)) {
      console.log(
        `[CORS] Origen permitido: ${origin || 'Sin origen (Postman o servidor local)'}`
      )
      callback(null, true)
    } else {
      console.error('[ERROR]: No permitido por CORS')
      callback(new Error('No permitido por CORS'))
    }
  },
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization'],
  optionsSuccessStatus: 200,
})

module.exports = corsMiddleware
