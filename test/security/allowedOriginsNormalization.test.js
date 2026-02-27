import { describe, it, expect } from 'vitest'
import { getAllowedOrigins, normalizeOrigin } from '../../task-management/security/cors/config/allowedOrigins.js'

/**
 * Este bloque valida que la normalización de orígenes sea robusta
 * para configuraciones productivas con slash final o entradas inválidas.
 */
describe('Normalización de orígenes CORS', () => {
  it('debería normalizar orígenes con slash final y deduplicar', () => {
    const origins = getAllowedOrigins({
      ALLOWED_ORIGINS:
        'https://invexly.netlify.app/, https://INVEXLY.netlify.app, https://api.example.com/',
      FRONTEND_URL: 'https://invexly.netlify.app/'
    })

    expect(origins).toEqual([
      'https://invexly.netlify.app',
      'https://api.example.com'
    ])
  })

  it('debería ignorar orígenes inválidos y mantener el fallback seguro', () => {
    const origins = getAllowedOrigins({
      ALLOWED_ORIGINS: 'valor-no-url',
      FRONTEND_URL: ''
    })

    expect(origins).toEqual(['https://invexly.netlify.app'])
    expect(normalizeOrigin('https://invexly.netlify.app/')).toBe(
      'https://invexly.netlify.app'
    )
  })
})
