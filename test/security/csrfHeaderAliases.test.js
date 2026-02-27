import cookieParser from 'cookie-parser'
import express from 'express'
import request from 'supertest'
import { describe, expect, it } from 'vitest'
import csrfValidator from '../../task-management/security/csrfValidator/csrfValidator.js'

/**
 * Crea una aplicación mínima para validar compatibilidad
 * de aliases de cabeceras CSRF en requests mutantes.
 *
 * @returns {import('express').Express} Aplicación Express para pruebas.
 */
const createCsrfAliasTestApp = () => {
  const app = express()

  // Registramos parsers requeridos por el middleware CSRF.
  app.use(cookieParser())
  app.use(express.json())

  // Exponemos una ruta para emitir token usando la misma lógica real.
  app.get('/api/token/csrf', csrfValidator, (req, res) => {
    res.status(200).json({ token: req.csrfToken() })
  })

  // Simulamos la ruta sensible observada desde frontend.
  app.put('/auth/profile/avatar', csrfValidator, (req, res) => {
    res.status(200).json({ ok: true })
  })

  return app
}

describe('Compatibilidad de headers CSRF', () => {
  it('debería aceptar x-csrf-token y x-xsrf-token en mutaciones protegidas', async () => {
    const app = createCsrfAliasTestApp()
    const agent = request.agent(app)

    const tokenResponse = await agent.get('/api/token/csrf')
    const { token } = tokenResponse.body

    const withCsrfHeader = await agent
      .put('/auth/profile/avatar')
      .set('x-csrf-token', token)
      .send({ profileImage: 'https://cdn.example.com/new-avatar.png' })

    expect(withCsrfHeader.status).toBe(200)
    expect(withCsrfHeader.body.ok).toBe(true)

    const withXsrfHeader = await agent
      .put('/auth/profile/avatar')
      .set('x-xsrf-token', token)
      .send({ profileImage: 'https://cdn.example.com/new-avatar.png' })

    expect(withXsrfHeader.status).toBe(200)
    expect(withXsrfHeader.body.ok).toBe(true)
  })

  it('debería rechazar mutaciones cuando el token no está presente', async () => {
    const app = createCsrfAliasTestApp()

    const response = await request(app)
      .put('/auth/profile/avatar')
      .send({ profileImage: 'https://cdn.example.com/new-avatar.png' })

    expect(response.status).toBe(403)
    expect(response.body.message).toBe('CSRF token inválido o ausente')
  })

  it('debería permitir mutaciones sin token CSRF cuando el origin está autorizado', async () => {
    const app = createCsrfAliasTestApp()

    const response = await request(app)
      .put('/auth/profile/avatar')
      .set('Origin', 'https://invexly.netlify.app')
      .send({ profileImage: 'https://cdn.example.com/new-avatar.png' })

    expect(response.status).toBe(200)
    expect(response.body.ok).toBe(true)
  })

  it('debería rechazar mutaciones sin token cuando el origin no está autorizado', async () => {
    const app = createCsrfAliasTestApp()

    const response = await request(app)
      .put('/auth/profile/avatar')
      .set('Origin', 'https://malicious.example')
      .send({ profileImage: 'https://cdn.example.com/new-avatar.png' })

    expect(response.status).toBe(403)
    expect(response.body.message).toBe('CSRF token inválido o ausente')
  })
})
