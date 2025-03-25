import cors from 'cors'

const allowedOrigins = ['https://equipo-verde.netlify.app']

const corsOptions = {
  origin: function (origin, callback) {
    if (!origin || allowedOrigins.includes(origin)) {
      callback(null, true)
    } else {
      callback(new Error(`Origen no permitido por CORS: ${origin}`))
    }
  },
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE'],
  allowedHeaders: ['Content-Type', 'Authorization', 'Cookie']
}

const corsMiddleware = cors(corsOptions)

export default corsMiddleware
