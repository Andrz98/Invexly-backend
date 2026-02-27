import { describe, it, expect, vi, beforeEach } from 'vitest'

const {
  mockFindUserById,
  mockSaveUser,
  mockLoggerInfo,
  mockLoggerWarn,
  mockLoggerError
} = vi.hoisted(() => ({
  mockFindUserById: vi.fn(),
  mockSaveUser: vi.fn(),
  mockLoggerInfo: vi.fn(),
  mockLoggerWarn: vi.fn(),
  mockLoggerError: vi.fn()
}))

vi.mock('../../task-management/services/profileService/profileService.js', () => ({
  findUserById: mockFindUserById,
  saveUser: mockSaveUser
}))

vi.mock('../../utils/winstonLogger/loggers.js', () => ({
  default: {
    info: mockLoggerInfo,
    warn: mockLoggerWarn,
    error: mockLoggerError
  }
}))

import {
  getProfile,
  updateAvatar
} from '../../task-management/controllers/user/profile/profileController.js'

describe('profileController - consistencia de profileImage', () => {
  beforeEach(() => {
    vi.clearAllMocks()
  })

  it('getProfile devuelve profileImage como campo canónico', async () => {
    mockFindUserById.mockResolvedValue({
      username: 'test-user',
      email: 'test@example.com',
      profileImage: 'https://cdn.example.com/avatar.png'
    })

    const req = { user: { id: 'user-id' } }
    const res = { status: vi.fn().mockReturnThis(), json: vi.fn() }

    await getProfile(req, res)

    expect(res.status).toHaveBeenCalledWith(200)
    expect(res.json).toHaveBeenCalledWith({
      username: 'test-user',
      email: 'test@example.com',
      profileImage: 'https://cdn.example.com/avatar.png'
    })
  })

  it('updateAvatar persiste profileImage desde body.profileImage', async () => {
    const user = { profileImage: '' }
    mockFindUserById.mockResolvedValue(user)
    mockSaveUser.mockResolvedValue(user)

    const req = {
      user: { id: 'user-id' },
      body: { profileImage: 'https://cdn.example.com/new-avatar.png' }
    }
    const res = { status: vi.fn().mockReturnThis(), json: vi.fn() }

    await updateAvatar(req, res)

    expect(user.profileImage).toBe('https://cdn.example.com/new-avatar.png')
    expect(mockSaveUser).toHaveBeenCalledWith(user)
    expect(res.status).toHaveBeenCalledWith(200)
  })
})
