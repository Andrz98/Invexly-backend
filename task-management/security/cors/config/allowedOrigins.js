const DEFAULT_ALLOWED_ORIGINS = ['https://invexly.netlify.app']

/**
 * Construye la lista final de orígenes permitidos para CORS y preflight.
 * - Prioriza `ALLOWED_ORIGINS` (lista separada por comas).
 * - Mantiene compatibilidad con `FRONTEND_URL` si está definido.
 * - Si no existe configuración por entorno, utiliza un valor seguro por defecto.
 *
 * @returns {string[]} Lista de orígenes normalizados y sin duplicados.
 */
const getAllowedOrigins = () => {
  const allowedOriginsFromEnv = (process.env.ALLOWED_ORIGINS || '')
    .split(',')
    .map((origin) => origin.trim())
    .filter(Boolean)

  const legacyFrontendUrl = process.env.FRONTEND_URL?.trim()

  const combinedOrigins = [
    ...allowedOriginsFromEnv,
    ...(legacyFrontendUrl ? [legacyFrontendUrl] : [])
  ]

  if (combinedOrigins.length === 0) {
    return DEFAULT_ALLOWED_ORIGINS
  }

  return [...new Set(combinedOrigins)]
}

const allowedOrigins = getAllowedOrigins()

export { getAllowedOrigins }
export default allowedOrigins
