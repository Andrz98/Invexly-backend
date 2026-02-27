/**
 * Construye un resumen seguro del estado CSRF de una request.
 *
 * @param {import('express').Request} req - Request entrante.
 * @returns {{
 *  origin: string,
 *  referer: string,
 *  method: string,
 *  path: string,
 *  hasCsrfSecretCookie: boolean,
 *  hasXsrfTokenCookie: boolean,
 *  hasCsrfHeader: boolean,
 *  hasXsrfHeader: boolean,
 *  hasAuthCookie: boolean,
 *  hasRefreshCookie: boolean
 * }} Contexto útil para diagnóstico en logs.
 */
const getCsrfRequestDiagnostics = (req) => {
  const cookies = req.cookies || {}

  return {
    origin: req.headers.origin || 'sin-origin',
    referer: req.headers.referer || 'sin-referer',
    method: req.method,
    path: req.originalUrl || req.path,
    hasCsrfSecretCookie: Boolean(cookies.csrfSecret),
    hasXsrfTokenCookie: Boolean(cookies['XSRF-TOKEN']),
    hasCsrfHeader: Boolean(req.get('x-csrf-token')),
    hasXsrfHeader: Boolean(req.get('x-xsrf-token')),
    hasAuthCookie: Boolean(cookies.token),
    hasRefreshCookie: Boolean(cookies.refreshToken)
  }
}

export default getCsrfRequestDiagnostics
