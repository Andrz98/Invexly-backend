import express from 'express'
import multer from 'multer'

import register from '../../controllers/auth/registerController.js'
import login from '../../controllers/auth/loginController.js'
import logout from '../../controllers/auth/logoutController.js'
import validateToken from '../../controllers/auth/tokenController.js'
import refreshToken from '../../controllers/auth/refreshTokenController.js'
import {
  getProfile,
  updateUsername,
  updateEmail,
  updatePassword,
  updateAvatar
} from '../../controllers/user/profileController.js'

import validateAuth from '../../middlewares/auth/validateAuth.js'
import authenticateToken from '../../middlewares/auth/authenticateToken.js'

const router = express.Router()

// Configuración de `multer`
const storage = multer.memoryStorage()
const upload = multer({ storage })

// Rutas de Autenticación
router.post('/register', validateAuth, register)
router.post('/login', validateAuth, login)
router.get('/validate-token', authenticateToken, validateToken)
router.post('/logout', authenticateToken, logout)
router.get('/profile', authenticateToken, getProfile)
router.post('/refresh-token', authenticateToken, refreshToken)

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
