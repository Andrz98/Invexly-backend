import cors from 'cors'

const allowedOrigins = ['http://localhost:5173', 'http://localhost:3000']

const corsMiddleware = cors({
  origin: (origin, callback) => {
    console.log(`[CORS] Solicitud desde: ${origin}`)

    if (!origin || allowedOrigins.includes(origin)) {
      console.log(`[CORS] Origen permitido: ${origin || 'Sin origen'}`)
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

export default corsMiddleware
