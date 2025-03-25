import { describe, it, expect, beforeAll, afterAll, beforeEach } from 'vitest'
import request from 'supertest'
import bcrypt from 'bcrypt'
import app from '../../app.js'
import User from '../../models/user.js'

// Start suite test
describe('Test de integración: /auth/login', () => {
  let server

  beforeAll(() => {
    server = app.listen(0)
  })

  afterAll(async () => {
    await server.close()
  })

  beforeEach(async () => {
    await User.deleteMany({})
  })

  // Tarea 1: Faltan credenciales
  it('debería de devolver un 400 si faltan credenciales', async () => {
    const res = await request(app).post('/auth/login').send({})

    expect(res.status).toBe(400)
    expect(res.body.message).toBe('Todos los campos son obligatorios')
  })

  // Tarea 2: Usuario no existe
  it('debería devolver un 401 si el usuario no existe', async () => {
    const res = await request(app).post('/auth/login').send({
      email: 'noexiste@intentalodenuevo.com',
      password: 'Password123*'
    })

    expect(res.status).toBe(401)
    expect(res.body.message).toBe('Credenciales incorrectas')
  })

  // Tarea 3: Contraseña incorrecta
  it('debería de mostrar un 401 si la contraseña es incorrecta', async () => {
    const email = `admin_${Date.now()}@trendPulse.com`
    const hashed = await bcrypt.hash('correctPassword', 10)

    await User.create({
      email,
      password: hashed,
      username: 'admin',
      role: 'admin'
    })

    const res = await request(app)
      .post('/auth/login')
      .send({ email, password: 'contraseñaIncorrecta' })

    expect(res.status).toBe(401)
    expect(res.body.message).toBe('Credenciales incorrectas')
  })

  // Tarea 4: Login correcto
  it('debería de devolver el preciado 200 y datos si el login es exitoso', async () => {
    const email = `admin_${Date.now()}@trendPulse.com`
    const hashed = await bcrypt.hash('validPassword', 10)

    const user = await User.create({
      email,
      password: hashed,
      username: 'admin',
      role: 'admin'
    })

    const res = await request(app)
      .post('/auth/login')
      .send({ email, password: 'validPassword' })

    expect(res.status).toBe(200)
    expect(res.body).toHaveProperty('token')
    expect(res.body.username).toBe('admin')
    expect(res.body.email).toBe(email)
    expect(res.body.role).toBe('admin')
    expect(res.body.userId).toBe(user._id.toString())
  })
})
