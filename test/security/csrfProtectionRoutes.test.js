import express from 'express'
import cookieParser from 'cookie-parser'
import request from 'supertest'
import { describe, it, expect } from 'vitest'
import applyCsrfProtection from '../../task-management/security/csrfValidator/applyCsrfProtection.js'

/**
 * Construye una app mínima para validar el montaje de CSRF
 * en el mismo prefijo que usa el router real (/auth).
 *
 * @returns {import('express').Express} Aplicación de prueba.
 */
const createProductionApp = () => {
  const app = express()

  // Parseamos cookies porque csrfValidator depende de req.cookies.
  app.use(cookieParser())
  // Parseamos JSON para aceptar requests de prueba sin ruido.
  app.use(express.json())

  applyCsrfProtection(app, 'production')

  // Simulamos rutas sensibles reales bajo /auth.
  app.put('/auth/profile/username', (req, res) => {
    res.status(200).json({ ok: true })
  })

  app.post('/auth/logout', (req, res) => {
    res.status(200).json({ ok: true })
  })

  // Simulamos una ruta legacy /api/profile para comprobar que no queda protegida por error.
  app.post('/api/profile', (req, res) => {
    res.status(200).json({ ok: true })
  })

  return app
}

/**
 * Obtiene los patrones montados para el middleware csrfValidator.
 *
 * @param {import('express').Express} app - Aplicación de prueba.
 * @returns {string[]} Lista serializada de regex montadas por Express.
 */
const getCsrfMountRegexList = (app) =>
  app._router.stack
    .filter((layer) => layer?.handle?.name === 'csrfValidator')
    .map((layer) => String(layer.regexp))

describe('Protección CSRF alineada con rutas reales montadas', () => {
  it('debería montar CSRF sobre /auth/profile y /auth/logout en producción', () => {
    const app = createProductionApp()
    const mountedRegex = getCsrfMountRegexList(app)

    expect(mountedRegex.some((entry) => entry.includes('auth\\/profile'))).toBe(
      true
    )
    expect(mountedRegex.some((entry) => entry.includes('auth\\/logout'))).toBe(
      true
    )
    expect(mountedRegex.some((entry) => entry.includes('api\\/profile'))).toBe(
      false
    )
  })

  it('debería bloquear requests mutantes sin token CSRF en rutas sensibles reales', async () => {
    const app = createProductionApp()

    const profileMutation = await request(app)
      .put('/auth/profile/username')
      .send({ username: 'attacker' })

    expect(profileMutation.status).toBe(403)
    expect(profileMutation.body.message).toBe('CSRF token inválido o ausente')

    const logoutMutation = await request(app).post('/auth/logout')

    expect(logoutMutation.status).toBe(403)
    expect(logoutMutation.body.message).toBe('CSRF token inválido o ausente')
  })

  it('no debería bloquear rutas legacy fuera del scope CSRF configurado', async () => {
    const app = createProductionApp()

    const legacyRoute = await request(app).post('/api/profile').send({})

    expect(legacyRoute.status).toBe(200)
    expect(legacyRoute.body.ok).toBe(true)
  })
})
