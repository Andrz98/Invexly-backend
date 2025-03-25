// ==========================
// Imports y configuración
// ==========================

import {
  describe,
  it,
  expect,
  beforeAll,
  afterAll,
  beforeEach,
  vi
} from 'vitest'

// El mock debe declararse antes de cualquier import que lo use (como app.js) de esta forma no hay problemas
vi.mock('../../task-management/controllers/emails/emailController.js', () => ({
  sendEmail: vi.fn().mockResolvedValue('Correo enviado correctamente')
}))

import request from 'supertest'
import app from '../../app.js'
import User from '../../models/user.js'
import bcrypt from 'bcrypt'
import * as emailController from '../../task-management/controllers/emails/emailController.js'

let server

// ==========================
// Suite de pruebas
// ==========================

describe('test de integración: /auth/register', () => {
  beforeAll(() => {
    server = app.listen(0)
  })

  afterAll(async () => {
    await server.close()
  })

  beforeEach(async () => {
    await User.deleteMany({})
    vi.clearAllMocks()
  })

  // Tarea 1: Faltan datos obligatorios
  it('debería devolver un 400 si faltan campos obligatorios', async () => {
    const res = await request(app)
      .post('/auth/register')
      .send({ email: 'noexiste@intentalodenuevo.com' })

    expect(res.status).toBe(400)
    expect(res.body.message).toBe('Todos los campos son obligatorios')
  })

  // Tarea 2: Usuario ya registrado
  it('debería devolver un 400 si el usuario ya existe', async () => {
    await User.create({
      username: 'admin',
      email: 'admin@trendPulse.com',
      password: await bcrypt.hash('Password123!', 10),
      role: 'admin'
    })

    const res = await request(app).post('/auth/register').send({
      username: 'admin',
      email: 'admin@trendPulse.com',
      password: 'Password123!'
    })

    expect(res.status).toBe(400)
    expect(res.body.message).toBe('El usuario ya está registrado')
  })

  // Tarea 3: Contraseña insegura
  it('debería devolver un 400 si la contraseña no cumple requisitos', async () => {
    const res = await request(app).post('/auth/register').send({
      username: 'Roberto',
      email: 'roberto1@gmail.com',
      password: '123'
    })

    expect(res.status).toBe(400)
    expect(res.body.message).toBe(
      'La contraseña no cumple con los requisitos de seguridad.'
    )
  })

  // Tarea 4: Registro exitoso
  it('debería devolver un 201 y los datos si el registro es exitoso', async () => {
    const res = await request(app).post('/auth/register').send({
      username: 'Roberto',
      email: 'roberto1@gmail.com',
      password: 'Password123!'
    })

    expect(res.status).toBe(201)
    expect(res.body.message).toBe(
      'Usuario registrado con éxito y email enviado correctamente'
    )
    expect(res.body).toHaveProperty('token')
    expect(emailController.sendEmail).toHaveBeenCalledTimes(1)
  })
})
