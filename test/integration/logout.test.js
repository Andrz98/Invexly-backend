import { describe, it, expect, beforeAll, afterAll, beforeEach } from 'vitest'
import request from 'supertest'
import bcrypt from 'bcrypt'
import app from '../../app.js'
import User from '../../models/user.js'

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
    // Arrange: crear usuario con contraseña hasheada
    const hashedPassword = await bcrypt.hash('Password123!', 10)
    const email = `admin_${Date.now()}@trendPulse.com`

    await User.create({
      email,
      password: hashedPassword,
      username: 'admin',
      role: 'admin'
    })

    // Act 1: iniciar sesión para obtener el token
    const loginResponse = await request(app)
      .post('/auth/login')
      .send({ email, password: 'Password123!' })

    const token = loginResponse.body.token
    const cookie = `token=${token}` // Construir la cookie manualmente

    // Act 2: realizar logout con cookie
    const logoutResponse = await request(app)
      .post('/auth/logout')
      .set('Cookie', cookie)

    // Assert: validar que responde 200 y mensaje esperado
    expect(logoutResponse.status).toBe(200)
    expect(logoutResponse.body.message).toBe('Sesión cerrada correctamente')
  })

  // Tarea 2: No se proporciona token
  it('debería de devolver un 401 si no se proporciona token', async () => {
    // Act: logout sin token ni cookie
    const res = await request(app).post('/auth/logout')

    // Assert: debe fallar con 401 y mensaje adecuado
    expect(res.status).toBe(401)
    expect(res.body.message).toBe('Token no proporcionado')
  })
})
