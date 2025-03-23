import { describe, it, expect, beforeAll, afterAll, beforeEach } from 'vitest'
import request from 'supertest'
import mongoose from 'mongoose'
import bcrypt from 'bcrypt'
import app from '../../app.js'
import User from '../../models/user.js'

// Declaramos la base de datos de prueba:
const MONGO_TEST_URI =
  process.env.MONGO_TEST_URI || 'mongodb://127.0.0.1:27017/testdb-auth'

// Start suite test
describe('test de integración: /auth/logout', () => {
  let server

  beforeAll(() => {
    server = app.listen(0) // Inicializa el servidor en un puerto aleatorio
  })

  afterAll(async () => {
    await server.close() // Solo cierra el servidor porque la conexión a MongoDB ya se maneja desde vitest.setup.js
  })

  beforeEach(async () => {
    await User.deleteMany({})
  })

  // Tarea 1: Se cierra la sesión correctamente
  it('debería de devolver un 200 y cerrar la sesión correctamente', async () => {
    const hashedPassword = await bcrypt.hash('Password123!', 10)
    const email = `admin_${Date.now()}@trendPulse.com`

    await User.create({
      email,
      password: hashedPassword,
      username: 'admin',
      role: 'admin'
    })

    const loginResponse = await request(app)
      .post('/auth/login')
      .send({ email, password: 'Password123!' })

    const token = loginResponse.body.token

    const logoutResponse = await request(app)
      .post('/auth/logout')
      .set('Authorization', `Bearer ${token}`)

    expect(logoutResponse.status).toBe(200)
    expect(logoutResponse.body.message).toBe('Sesión cerrada correctamente')
  })

  // Tarea 2: No se proporciona token
  it('debería de devolver un 401 si no se proporciona token', async () => {
    const res = await request(app).post('/auth/logout')

    expect(res.status).toBe(401)
    expect(res.body.message).toBe('Token no proporcionado')
  })
})
