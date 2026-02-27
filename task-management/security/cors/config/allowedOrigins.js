const DEFAULT_ALLOWED_ORIGINS = ['https://invexly.netlify.app']

/**
 * Normaliza un origin para evitar fallos por diferencias de formato
 * (por ejemplo, slash final o mayúsculas en el host).
 *
 * @param {string} rawOrigin - Valor de origin sin normalizar.
 * @returns {string|null} Origin normalizado o null si no es válido.
 */
const normalizeOrigin = (rawOrigin) => {
  if (typeof rawOrigin !== 'string') {
    return null
  }

  const trimmedOrigin = rawOrigin.trim()
  if (!trimmedOrigin) {
    return null
  }

  try {
    const parsedOrigin = new URL(trimmedOrigin)
    return parsedOrigin.origin
  } catch {
    return null
  }
}

/**
 * Construye la lista final de orígenes permitidos para CORS y preflight.
 * - Prioriza `ALLOWED_ORIGINS` (lista separada por comas).
 * - Mantiene compatibilidad con `FRONTEND_URL` si está definido.
 * - Si no existe configuración por entorno, utiliza un valor seguro por defecto.
 *
 * @returns {string[]} Lista de orígenes normalizados y sin duplicados.
 */
const getAllowedOrigins = (environment = process.env) => {
  const allowedOriginsFromEnv = (environment.ALLOWED_ORIGINS || '')
    .split(',')
    .map((origin) => normalizeOrigin(origin))
    .filter(Boolean)

  const legacyFrontendUrl = normalizeOrigin(environment.FRONTEND_URL)
  const defaultOrigins = DEFAULT_ALLOWED_ORIGINS.map((origin) =>
    normalizeOrigin(origin)
  ).filter(Boolean)

  const combinedOrigins = [
    ...allowedOriginsFromEnv,
    ...(legacyFrontendUrl ? [legacyFrontendUrl] : [])
  ]

  if (combinedOrigins.length === 0) {
    return defaultOrigins
  }

  return [...new Set(combinedOrigins)]
}

const allowedOrigins = getAllowedOrigins()

export { getAllowedOrigins }
export { normalizeOrigin }
export default allowedOrigins
