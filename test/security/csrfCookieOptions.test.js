import { afterEach, describe, expect, it } from 'vitest'
import {
  getCsrfSecretCookieOptions,
  getCsrfTokenCookieOptions
} from '../../task-management/security/csrfValidator/csrfValidator.js'

/**
 * Restaura NODE_ENV entre pruebas para evitar contaminación global.
 */
afterEach(() => {
  delete process.env.NODE_ENV
})

describe('Opciones de cookies CSRF', () => {
  it('debería usar SameSite=None y secure en producción para soportar front cross-site', () => {
    process.env.NODE_ENV = 'production'

    const secretOptions = getCsrfSecretCookieOptions()
    const tokenOptions = getCsrfTokenCookieOptions()

    expect(secretOptions).toMatchObject({
      httpOnly: true,
      sameSite: 'none',
      secure: true
    })

    expect(tokenOptions).toMatchObject({
      httpOnly: false,
      sameSite: 'none',
      secure: true
    })
  })

  it('debería mantener SameSite=Strict en desarrollo para entorno local', () => {
    process.env.NODE_ENV = 'development'

    const secretOptions = getCsrfSecretCookieOptions()
    const tokenOptions = getCsrfTokenCookieOptions()

    expect(secretOptions).toMatchObject({
      httpOnly: true,
      sameSite: 'strict',
      secure: false
    })

    expect(tokenOptions).toMatchObject({
      httpOnly: false,
      sameSite: 'strict',
      secure: false
    })
  })
})
