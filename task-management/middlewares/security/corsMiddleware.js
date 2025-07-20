const allowedOrigins = ['https://invexly.netlify.app']

const corsMiddleware = {
  origin: (origin, callback) => {
    if (!origin) {
      // Silencia requests sin Origin (ej: bots, Render healthchecks)
      return callback(null, true)
    }

    if (allowedOrigins.includes(origin)) {
      return callback(null, true)
    }

    // Producción: sin logs innecesarios
    return callback(new Error('No autorizado por CORS'))
  },
  credentials: true
}

export default corsMiddleware
