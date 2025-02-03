const express = require('express') // Framework para manejar rutas y solicitudes
const { register, login, signOut } = require('../controllers/authController') // Controladores de autenticación
const validateAuth = require('../middlewares/validateAuth') // Middleware para validar datos de entrada

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
router.post(
  '/register',
  (req, res, next) => {
    console.log('📥 Solicitud recibida en /auth/register') // Debug para verificar la solicitud
    next()
  },
  validateAuth,
  register
)

// ========================
// Ruta: Inicio de Sesión
// ========================
/**
 * Ruta para el inicio de sesión (Login).
 *
 * @name POST /auth/login
 * @function
 */
router.post('/login', validateAuth, login) // Asegúrate de incluir esta línea si usarás `login`

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

module.exports = router
