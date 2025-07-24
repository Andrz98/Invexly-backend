import express from 'express'
import multer from 'multer'

import register from '../controllers/auth/registerController.js'
import login from '../controllers/auth/loginController.js'
import logout from '../controllers/auth/logoutController.js'
import validateToken from '../security/jwt/controllers/tokenController.js'
import refreshToken from '../security/jwt/controllers/refreshTokenController.js'
import {
  getProfile,
  updateUsername,
  updateEmail,
  updatePassword,
  updateAvatar
} from '../controllers/user/profileController.js'

import {
  registerValidation,
  loginValidation
} from '../middlewares/auth/authValidator.js'
import validateResult from '../middlewares/auth/validateResult.js'

import authenticateToken from '../security/jwt/middlewares/authenticateToken.js'

const router = express.Router()

// Configuración de `multer`
const storage = multer.memoryStorage()
const upload = multer({ storage })

// Rutas de Autenticación
router.post('/register', registerValidation, validateResult, register)
router.post('/login', loginValidation, validateResult, login)
router.get('/validate-token', authenticateToken, validateToken)
router.post('/logout', authenticateToken, logout)
router.get('/profile', authenticateToken, getProfile)
router.post('/refresh-token', refreshToken)

// Ruta: Actualización de Perfil
router.put('/profile/username', authenticateToken, updateUsername)
router.put('/profile/email', authenticateToken, updateEmail)
router.put('/profile/password', authenticateToken, updatePassword)
router.put(
  '/profile/avatar',
  authenticateToken,
  upload.single('profileImage'),
  updateAvatar
)

export default router
