// =========================================
// Rutas para la Autenticación de Usuarios
// =========================================

import express from 'express'
import {
  register,
  login,
  signOut,
  validateToken,
} from '../controllers/authController.js'
import validateAuth from '../middlewares/validateAuth.js'
import authenticateToken from '../middlewares/authenticateToken.js'

const router = express.Router()

// ========================
// Ruta: Registro de Usuario
// ========================
router.post('/register', validateAuth, register)

// ========================
// Ruta: Inicio de Sesión
// ========================
router.post('/login', validateAuth, login)

// ========================
// Ruta: Validación de Token
// ========================
router.get('/validate-token', authenticateToken, validateToken)

// ========================
// Ruta: Cierre de Sesión
// ========================
router.post('/sign-out', signOut)

export default router
