/**
 * Convierte un string de expiración (como '15m', '1h') en milisegundos.
 * @param {string} duration - Duración del token (ej: '15m', '1h', '7d').
 * @returns {number} Tiempo equivalente en milisegundos.
 */
export const parseDurationToMs = (duration) => {
  const match = /^(\d+)([smhd])$/.exec(duration)
  if (!match) {
    return 15 * 60 * 1000
  }

  const value = parseInt(match[1], 10)
  const unit = match[2]
  const multipliers = {
    s: 1000,
    m: 60 * 1000,
    h: 60 * 60 * 1000,
    d: 24 * 60 * 60 * 1000
  }

  return value * multipliers[unit]
}
