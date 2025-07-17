import cors from 'cors'
import { isAllowedOrigin } from '../../utils/originUtils.js'

const corsOptions = {
  origin: function (origin, callback) {
    if (isAllowedOrigin(origin)) {
      console.log(`[CORS] Origin permitido: ${origin}`)
      callback(null, true)
    } else {
      console.warn(`[CORS] Origin bloqueado: ${origin}`)
      callback(new Error(`Origen no permitido por CORS: ${origin}`))
    }
  },
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization', 'Cookie'],
  exposedHeaders: ['Set-Cookie']
}

const corsMiddleware = cors(corsOptions)

export default corsMiddleware
