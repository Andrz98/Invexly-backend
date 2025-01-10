const express = require('express') // Framework para manejar rutas y solicitudes
const { signIn, signOut } = require('../controllers/authController') // Controladores de autenticación
const validateAuth = require('../middlewares/validateAuth') // Middleware para validar datos de entrada

const router = express.Router() // Instancia de router de Express

// ========================
// Ruta: Sign In
// ========================
// Valida los datos enviados y procesa el inicio de sesión.
/**
 * Ruta para el inicio de sesión (Sign In).
 *
 * @name POST /auth/sign-in
 * @function
 * @memberof module:authRoutes
 */
router.post('/sign-in', validateAuth, signIn)

// ========================
// Ruta: Sign Out
// ========================
// Finaliza la sesión del usuario.
/**
 * Ruta para el cierre de sesión (Sign Out).
 *
 * @name POST /auth/sign-out
 * @function
 * @memberof module:authRoutes
 */
router.post('/sign-out', signOut)

module.exports = router // Exporta el router
