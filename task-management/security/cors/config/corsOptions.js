import allowedOrigins, { normalizeOrigin } from './allowedOrigins.js'

const corsOptions = {
  origin: (origin, callback) => {
    if (!origin) {
      return callback(null, true)
    }

    const normalizedOrigin = normalizeOrigin(origin)

    if (normalizedOrigin && allowedOrigins.includes(normalizedOrigin)) {
      return callback(null, true)
    }

    return callback(new Error('No autorizado por CORS'))
  },
  credentials: true
}

export default corsOptions
