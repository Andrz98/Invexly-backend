import { describe, it, expect } from 'vitest'
import { isAllowedOrigin } from '../../task-management/middlewares/security/corsMiddleware.js'

describe('isAllowedOrigin', () => {
  it('permite origenes undefined', () => {
    expect(isAllowedOrigin(undefined, ['https://example.com'])).toBe(true)
  })

  it('acepta coincidencias exactas', () => {
    const origins = ['https://example.com']
    expect(isAllowedOrigin('https://example.com', origins)).toBe(true)
  })

  it('reconoce comodines de subdominio', () => {
    const origins = ['https://*.dominio.com']
    expect(isAllowedOrigin('https://sub.dominio.com', origins)).toBe(true)
  })

  it('rechaza origenes no permitidos', () => {
    const origins = ['https://example.com']
    expect(isAllowedOrigin('https://otro.com', origins)).toBe(false)
  })
})
