import express from 'express'
import cookieParser from 'cookie-parser'
import request from 'supertest'
import { describe, it, expect } from 'vitest'
import csrfValidator, {
  issueCsrfToken,
  CSRF_TOKEN_COOKIE_NAME
} from '../../task-management/security/csrfValidator/csrfValidator.js'

/**
 * Construye una app mínima para comprobar compatibilidad CSRF
 * con clientes axios y flujo de emisión de token.
 *
 * @returns {import('express').Express} Aplicación de pruebas.
 */
const createCsrfApp = () => {
  const app = express()

  app.use(cookieParser())
  app.use(express.json())

  app.get('/token', csrfValidator, (req, res) => {
    const token = issueCsrfToken(req, res)
    return res.status(200).json({ token })
  })

  app.put('/profile', csrfValidator, (req, res) => {
    return res.status(200).json({ ok: true })
  })

  return app
}

describe('Compatibilidad de CSRF con clientes SPA', () => {
  it('debería aceptar el header x-xsrf-token utilizado por axios', async () => {
    const app = createCsrfApp()
    const agent = request.agent(app)

    const tokenResponse = await agent.get('/token')
    const { token } = tokenResponse.body

    expect(tokenResponse.status).toBe(200)
    expect(typeof token).toBe('string')
    expect(token.length).toBeGreaterThan(10)

    const mutationResponse = await agent
      .put('/profile')
      .set('x-xsrf-token', token)
      .send({ profileImage: 'https://example.com/avatar.png' })

    expect(mutationResponse.status).toBe(200)
    expect(mutationResponse.body.ok).toBe(true)
  })

  it('debería emitir la cookie pública XSRF-TOKEN al solicitar token', async () => {
    const app = createCsrfApp()

    const tokenResponse = await request(app).get('/token')
    const cookies = tokenResponse.headers['set-cookie'] || []

    expect(tokenResponse.status).toBe(200)
    expect(
      cookies.some((cookieEntry) =>
        cookieEntry.startsWith(`${CSRF_TOKEN_COOKIE_NAME}=`)
      )
    ).toBe(true)
  })
})
