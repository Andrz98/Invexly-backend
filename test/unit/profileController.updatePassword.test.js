import { describe, it, expect, vi, beforeEach } from 'vitest'

const {
  mockFindUserById,
  mockSaveUser,
  mockHash,
  mockLoggerInfo,
  mockLoggerWarn,
  mockLoggerError
} = vi.hoisted(() => ({
  mockFindUserById: vi.fn(),
  mockSaveUser: vi.fn(),
  mockHash: vi.fn(),
  mockLoggerInfo: vi.fn(),
  mockLoggerWarn: vi.fn(),
  mockLoggerError: vi.fn()
}))

vi.mock(
  '../../task-management/services/profileService/profileService.js',
  () => ({
    findUserById: mockFindUserById,
    saveUser: mockSaveUser
  })
)

vi.mock('bcrypt', () => ({
  default: {
    hash: mockHash
  }
}))

vi.mock('../../utils/winstonLogger/loggers.js', () => ({
  default: {
    info: mockLoggerInfo,
    warn: mockLoggerWarn,
    error: mockLoggerError
  }
}))

import { updatePassword } from '../../task-management/controllers/user/profile/profileController.js'

describe('updatePassword controller', () => {
  beforeEach(() => {
    vi.clearAllMocks()
  })

  it('hashea la contraseña antes de guardar el usuario', async () => {
    const user = { _id: 'user-id', password: 'old-password' }

    mockFindUserById.mockResolvedValue(user)
    mockHash.mockResolvedValue('$2b$10$hashedPasswordValue')
    mockSaveUser.mockResolvedValue(user)

    const req = {
      user: { id: 'user-id' },
      body: { password: 'NuevaClave123!' }
    }

    const res = {
      status: vi.fn().mockReturnThis(),
      json: vi.fn()
    }

    await updatePassword(req, res)

    expect(mockHash).toHaveBeenCalledWith('NuevaClave123!', 10)
    expect(user.password).toBe('$2b$10$hashedPasswordValue')
    expect(mockSaveUser).toHaveBeenCalledWith(user)
    expect(res.status).toHaveBeenCalledWith(200)
    expect(res.json).toHaveBeenCalledWith({
      message: 'Contraseña actualizada correctamente'
    })
  })
})
