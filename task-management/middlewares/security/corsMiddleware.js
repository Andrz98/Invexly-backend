import cors from 'cors'

const devOrigins = ['http://localhost:5173', 'http://localhost:3000']
const prodOrigins = ['https://equipo-verde.netlify.app']

// Configuración basada en entorno
const allowedOrigins =
  process.env.NODE_ENV === 'production' ? prodOrigins : devOrigins

const corsOptions = {
  origin: function (origin, callback) {
    if (!origin || allowedOrigins.includes(origin)) {
      callback(null, true)
    } else {
      callback(new Error(`Origin o permitido por CORS: ${origin}`))
    }
  },
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE'],
  allowedHeaders: ['Content-Type', 'Authorization', 'Cookie']
}

const corsMiddleware = cors(corsOptions)

export default corsMiddleware
