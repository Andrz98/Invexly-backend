import express from 'express'
import multer from 'multer'
import {
  register,
  login,
  logout,
  validateToken,
  updateProfile,
  getProfile
} from '../controllers/authController.js'
import validateAuth from '../middlewares/validateAuth.js'
import authenticateToken from '../middlewares/authenticateToken.js'

const router = express.Router()

// Configuración de `multer` para manejar imágenes
const storage = multer.memoryStorage()
const upload = multer({ storage })

// Rutas de Autenticación
router.post('/register', validateAuth, register)
router.post('/login', validateAuth, login)
router.get('/validate-token', authenticateToken, validateToken)
router.post('/logout', logout)
router.get('/profile', authenticateToken, getProfile) // <-- Se añade la ruta

// Ruta: Actualización de Perfil
router.put(
  '/profile',
  authenticateToken,
  upload.single('profileImage'),
  updateProfile
)

export default router
