import express from 'express'
import request from 'supertest'
import { describe, it, expect, beforeEach } from 'vitest'
import corsMiddleware from '../../task-management/security/cors/middlewares/corsMiddleware.js'
import handlePreflight from '../../task-management/security/preflight/handlePreflight.js'
import allowedOrigins from '../../task-management/security/cors/config/allowedOrigins.js'

/**
 * Crea una aplicación mínima para validar el comportamiento conjunto
 * de CORS y preflight sin depender del resto del sistema.
 *
 * @returns {import('express').Express} Aplicación lista para test.
 */
const createTestApp = () => {
  const app = express()

  app.use(corsMiddleware)
  app.use(handlePreflight)

  app.get('/health', (req, res) => {
    res.status(200).json({ ok: true })
  })

  app.use((error, req, res, next) => {
    if (error?.message === 'No autorizado por CORS') {
      return res.status(403).json({ message: error.message })
    }

    return next(error)
  })

  return app
}

describe('Alineación entre CORS y preflight', () => {
  let app
  const allowedOrigin = allowedOrigins[0]
  const blockedOrigin = 'https://origen-no-permitido.example'

  beforeEach(() => {
    app = createTestApp()
  })

  it('debería permitir OPTIONS preflight y request real para origen autorizado', async () => {
    const preflightResponse = await request(app)
      .options('/health')
      .set('Origin', allowedOrigin)
      .set('Access-Control-Request-Method', 'GET')

    expect(preflightResponse.status).toBe(204)
    expect(preflightResponse.headers['access-control-allow-origin']).toBe(
      allowedOrigin
    )

    const getResponse = await request(app)
      .get('/health')
      .set('Origin', allowedOrigin)

    expect(getResponse.status).toBe(200)
    expect(getResponse.headers['access-control-allow-origin']).toBe(
      allowedOrigin
    )
  })

  it('debería bloquear OPTIONS preflight y request real para origen no autorizado', async () => {
    const preflightResponse = await request(app)
      .options('/health')
      .set('Origin', blockedOrigin)
      .set('Access-Control-Request-Method', 'GET')

    expect(preflightResponse.status).toBe(403)
    expect(preflightResponse.body.message).toBe('No autorizado por CORS')

    const getResponse = await request(app)
      .get('/health')
      .set('Origin', blockedOrigin)

    expect(getResponse.status).toBe(403)
    expect(getResponse.body.message).toBe('No autorizado por CORS')
  })
})
