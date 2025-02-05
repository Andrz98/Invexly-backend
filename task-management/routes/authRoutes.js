// =========================================
// Rutas para la Autenticación de Usuarios
// =========================================

const express = require('express') // Framework para manejar rutas y solicitudes
const {
  register,
  login,
  signOut,
  validateToken,
} = require('../controllers/authController') // Importación de los controladores de autenticación
const validateAuth = require('../middlewares/validateAuth') // Middleware para validar datos de entrada
const authenticateToken = require('../middlewares/authenticateToken') // Middleware para autenticar tokens JWT

const router = express.Router() // Instancia de router de Express

// ========================
// Ruta: Registro de Usuario
// ========================
/**
 * Ruta para el registro de nuevos usuarios.
 *
 * @name POST /auth/register
 * @function
 */
router.post('/register', validateAuth, register)

// ========================
// Ruta: Inicio de Sesión
// ========================
/**
 * Ruta para el inicio de sesión (Login).
 *
 * @name POST /auth/login
 * @function
 */
router.post('/login', validateAuth, login)

// ========================
// Ruta: Validación de Token
// ========================
/**
 * Ruta para validar la autenticación del token JWT.
 * Solo los tokens válidos podrán acceder a esta ruta.
 *
 * @name GET /auth/validate-token
 * @function
 */
router.get('/validate-token', authenticateToken, validateToken)

// ========================
// Ruta: Cierre de Sesión
// ========================
/**
 * Ruta para el cierre de sesión (Sign Out).
 *
 * @name POST /auth/sign-out
 * @function
 */
router.post('/sign-out', signOut)

module.exports = router // Exporta el router para ser utilizado en app.js
