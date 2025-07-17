// ==============================
// Transformamos el patrón con '*' a RegExp
// ==============================
export const patternToRegex = (pattern) => {
  const escaped = pattern.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')
  const regexstr = `^${escaped.replace(/\\\*/g, '.*')}$`
  return new RegExp(regexstr)
}

// ==============================
// Lista de orígenes permitidos desde .env
// ==============================
export const allowedOrigins = process.env.ALLOWED_ORIGINS
  ? process.env.ALLOWED_ORIGINS.split(',').map((origin) => origin.trim())
  : []

// ==============================
// Verifica si un origen está permitido
// ==============================
export const isAllowedOrigin = (origin, origins = allowedOrigins) => {
  if (!origin) {
    return true
  }
  return origins.some((allowed) => patternToRegex(allowed).test(origin))
}
