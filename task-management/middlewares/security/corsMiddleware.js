import cors from 'cors'

// =========================================
// Lista de orígenes permitidos
// =========================================
// Define en tu archivo `.env` la variable `ALLOWED_ORIGINS` separando
// los dominios con comas. Puedes emplear comodines para subdominios con
// el formato `*.dominio.com`. Ejemplo:
// ALLOWED_ORIGINS=https://*.netlify.app,https://localhost:3000
const allowedOrigins = process.env.ALLOWED_ORIGINS
  ? process.env.ALLOWED_ORIGINS.split(',').map((origin) => origin.trim())
  : []

// ======================================================
// Convierte un patrón (posiblemente con '*') en RegExp
// ======================================================
const patternToRegex = (pattern) => {
  const escaped = pattern.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')
  const regexStr = `^${escaped.replace(/\\\*/g, '.*')}$`
  return new RegExp(regexStr)
}

// ======================================================
// Verifica si el origen está permitido considerando comodines
// ======================================================
export const isAllowedOrigin = (origin, origins = allowedOrigins) => {
  if (!origin) return true
  return origins.some((allowed) => patternToRegex(allowed).test(origin))
}

const corsOptions = {
  origin: function (origin, callback) {
    if (isAllowedOrigin(origin)) {
      callback(null, true)
    } else {
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
