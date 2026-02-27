import { describe, it, expect, vi, beforeEach } from 'vitest'

const {
  mockFindOne,
  mockFindById,
  mockJwtSign,
  mockBcryptCompare,
  mockVerifyToken,
  mockLoggerInfo,
  mockLoggerWarn,
  mockLoggerError
} = vi.hoisted(() => ({
  mockFindOne: vi.fn(),
  mockFindById: vi.fn(),
  mockJwtSign: vi.fn(),
  mockBcryptCompare: vi.fn(),
  mockVerifyToken: vi.fn(),
  mockLoggerInfo: vi.fn(),
  mockLoggerWarn: vi.fn(),
  mockLoggerError: vi.fn()
}))

vi.mock('../../models/user.js', () => ({
  default: {
    findOne: mockFindOne,
    findById: mockFindById
  }
}))

vi.mock('jsonwebtoken', () => ({
  default: {
    sign: mockJwtSign
  }
}))

vi.mock('bcrypt', () => ({
  default: {
    compare: mockBcryptCompare
  }
}))

vi.mock('../../task-management/security/jwt/helpers/token/verifyToken.js', () => ({
  verifyToken: mockVerifyToken
}))

vi.mock('../../utils/winstonLogger/loggers.js', () => ({
  default: {
    info: mockLoggerInfo,
    warn: mockLoggerWarn,
    error: mockLoggerError
  }
}))

import login from '../../task-management/controllers/auth/loginController.js'
import tokenController from '../../task-management/security/jwt/controllers/tokenController.js'

describe('Consistencia profileImage en login y validate-token', () => {
  beforeEach(() => {
    vi.clearAllMocks()
    process.env.JWT_SECRET = 'test-secret'
    process.env.REFRESH_TOKEN_SECRET = 'test-refresh-secret'
  })

  it('login responde profileImage y no usa la clave legacy profile', async () => {
    const user = {
      _id: 'user-id',
      password: 'hashed-password',
      username: 'test-user',
      email: 'test@example.com',
      role: 'user',
      profileImage: 'https://cdn.example.com/avatar.png'
    }

    mockFindOne.mockResolvedValue(user)
    mockBcryptCompare.mockResolvedValue(true)
    mockJwtSign.mockReturnValueOnce('access-token').mockReturnValueOnce('refresh-token')

    const req = {
      body: { email: 'test@example.com', password: 'Password123!' },
      ip: '127.0.0.1',
      headers: { 'user-agent': 'vitest' }
    }

    const res = {
      cookie: vi.fn(),
      status: vi.fn().mockReturnThis(),
      json: vi.fn()
    }

    await login(req, res, vi.fn())

    expect(res.status).toHaveBeenCalledWith(200)
    const loginPayload = res.json.mock.calls[0][0]
    expect(loginPayload.profileImage).toBe('https://cdn.example.com/avatar.png')
    expect(loginPayload).not.toHaveProperty('profile')
  })

  it('validate-token responde user.profileImage', async () => {
    mockVerifyToken.mockReturnValue({ id: 'user-id' })
    mockFindById.mockReturnValue({
      select: vi.fn().mockResolvedValue({
        _id: 'user-id',
        username: 'test-user',
        email: 'test@example.com',
        role: 'user',
        profileImage: 'https://cdn.example.com/avatar.png'
      })
    })

    const req = {
      cookies: { token: 'valid-token' },
      headers: {},
      ip: '127.0.0.1',
      originalUrl: '/auth/validate-token',
      method: 'GET'
    }
    const res = { status: vi.fn().mockReturnThis(), json: vi.fn() }

    await tokenController(req, res)

    expect(res.status).toHaveBeenCalledWith(200)
    expect(res.json).toHaveBeenCalledWith({
      user: {
        id: 'user-id',
        username: 'test-user',
        email: 'test@example.com',
        role: 'user',
        profileImage: 'https://cdn.example.com/avatar.png'
      }
    })
  })
})
