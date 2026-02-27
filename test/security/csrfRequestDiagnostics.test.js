import express from 'express'
import cookieParser from 'cookie-parser'
import request from 'supertest'
import { afterEach, describe, it, expect } from 'vitest'
import csrfValidator from '../../task-management/security/csrfValidator/csrfValidator.js'

/**
 * Crea una app de prueba para validar el payload de diagnóstico CSRF.
 *
 * @returns {import('express').Express} Aplicación preparada para tests.
 */
const createApp = () => {
  const app = express()

  app.use(cookieParser())
  app.use(express.json())

  app.put('/auth/profile/avatar', csrfValidator, (req, res) => {
    return res.status(200).json({ ok: true })
  })

  return app
}

describe('Diagnóstico en errores CSRF', () => {
  afterEach(() => {
    delete process.env.NODE_ENV
  })

  it('debería devolver contexto de diagnóstico en entornos no productivos', async () => {
    process.env.NODE_ENV = 'test'
    const app = createApp()

    const response = await request(app)
      .put('/auth/profile/avatar')
      .set('origin', 'https://invexly.netlify.app')
      .send({ profileImage: 'x' })

    expect(response.status).toBe(403)
    expect(response.body.message).toBe('CSRF token inválido o ausente')
    expect(response.body.diagnostics).toMatchObject({
      origin: 'https://invexly.netlify.app',
      method: 'PUT',
      hasCsrfHeader: false,
      hasXsrfHeader: false,
      hasCsrfSecretCookie: false,
      hasXsrfTokenCookie: false
    })
  })
})
