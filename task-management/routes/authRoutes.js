import express from 'express'
import multer from 'multer'

import register from '../controllers/registerController.js'
import login from '../controllers/loginController.js'
import logout from '../controllers/logoutController.js'
import validateToken from '../controllers/tokenController.js'
import refreshToken from '../controllers/refreshTokenController.js'
import { getProfile, updateProfile } from '../controllers/profileController.js'

import validateAuth from '../middlewares/validateAuth.js'
import authenticateToken from '../middlewares/authenticateToken.js'

const router = express.Router()

// Configuración de `multer`
const storage = multer.memoryStorage()
const upload = multer({ storage })

// Rutas de Autenticación
router.post('/register', validateAuth, register)
router.post('/login', validateAuth, login)
router.get('/validate-token', authenticateToken, validateToken)
router.post('/logout', logout)
router.get('/profile', authenticateToken, getProfile)
router.post('/refresh-token', refreshToken)

// Ruta: Actualización de Perfil
router.put(
  '/profile',
  authenticateToken,
  upload.single('profileImage'),
  updateProfile
)

export default router
