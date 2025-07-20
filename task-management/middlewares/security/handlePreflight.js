/**
 * Maneja los errores capturados en la aplicación Express.
 *
 * @param {Error} err Error arrojado por la aplicación.
 * @param {Request} req Objeto de solicitud HTTP.
 */
const allowedOrigins = ['https://invexly.netlify.app']

const handlePreflight = (req, res, next) => {
  if (req.method === 'OPTIONS') {
    const origin = req.headers.origin

    if (!origin || allowedOrigins.includes(origin)) {
      res.header('Access-Control-Allow-Origin', origin || '')
      res.header('Access-Control-Allow-Credentials', 'true')
      res.header(
        'Access-Control-Allow-Methods',
        'GET, POST, PUT, DELETE, OPTIONS'
      )
      res.header(
        'Access-Control-Allow-Headers',
        'Content-Type, Authorization, Cookie'
      )
      return res.sendStatus(200)
    }

    // En producción no se imprime nada, solo se rechaza.
    return res.sendStatus(403)
  }

  // Continuar si no es una preflight request
  next()
}

export default handlePreflight
