import csrfValidator from './csrfValidator.js'

/**
 * Aplica la protección CSRF sobre rutas sensibles cuando el entorno es producción.
 *
 * @param {import('express').Express} app - Instancia de Express donde se registra la protección.
 * @param {string} nodeEnv - Valor del entorno de ejecución.
 * @returns {string[]} Rutas montadas con protección CSRF.
 */
const applyCsrfProtection = (app, nodeEnv = process.env.NODE_ENV) => {
  // Definimos explícitamente las rutas reales que se encuentran montadas bajo /auth.
  const protectedRoutes = ['/auth/profile', '/auth/logout']

  // Solo endurecemos estas rutas en producción para mantener el comportamiento esperado en tests y desarrollo.
  if (nodeEnv === 'production') {
    app.use(protectedRoutes, csrfValidator)
  }

  return protectedRoutes
}

export default applyCsrfProtection
