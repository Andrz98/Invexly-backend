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

describe('Test de integración: /auth/login', () => {
  let server

  beforeAll(async () => {
    // Conexión a MongoDB con URI de pruebas
    server = app.listen(0) // Se asigna un puerto de prueba
  })

  afterAll(async () => {
    await mongoose.connection?.dropDatabase?.()
    await mongoose.disconnect()
    await server.close()
  })

  beforeEach(async () => {
    await User.deleteMany({})
  })

  // Tarea 1: Faltan credenciales
  it('debería de devolver un 400 si faltan credenciales', async () => {
    const res = await request(app).post('/auth/login').send({})
    expect(res.status).toBe(400)
    expect(res.body.message).toBe(
      'El usuario o el correo electrónico y la contraseña son obligatorios'
    )
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
      email: 'admin@trendPulse.com',
      password: hashed,
      username: 'admin',
      role: 'admin'
    })

    const res = await request(app)
      .post('/auth/login')
      .send({ email: 'admin@trendPulse.com', password: 'contraseñaIncorrecta' })

    expect(res.status).toBe(401)
    expect(res.body.message).toBe('Credenciales incorrectas')
  })

  // Tarea 4: Login correcto
  it('debería de devolver el preciado 200 y datos si el login es exitoso', async () => {
    const email = `admin_${Date.now()}@trendPulse.com`
    const hashed = await bcrypt.hash('validPassword', 10)
    const user = await User.create({
      email: 'admin@trendPulse.com',
      password: hashed,
      username: 'admin',
      role: 'admin'
    })

    const res = await request(app)
      .post('/auth/login')
      .send({ email: 'admin@trendPulse.com', password: 'validPassword' })

    expect(res.status).toBe(200)
    expect(res.body).toHaveProperty('token')
    expect(res.body.username).toBe('admin')
    expect(res.body.email).toBe('admin@trendPulse.com')
    expect(res.body.role).toBe('admin')
    expect(res.body.userId).toBe(user._id.toString())
  })
})
