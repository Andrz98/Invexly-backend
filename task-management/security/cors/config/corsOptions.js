import allowedOrigins from './allowedOrigins.js'

const corsOptions = {
  origin: (origin, callback) => {
    if (!origin) {
      return callback(null, true)
    }

    if (allowedOrigins.includes(origin)) {
      return callback(null, true)
    }

    return callback(new Error('No autorizado por CORS'))
  },
  credentials: true
}

export default corsOptions
