import { isAllowedOrigin } from '../../../utils/origins/originUtils.js'

/**
 * Maneja los errores capturados en la aplicación Express.
 *
 * @param {Error} err Error arrojado por la aplicación.
 * @param {Request} req Objeto de solicitud HTTP.
 */
const handlePreflight = (req, res) => {
  if (req.method === 'OPTIONS') {
    const origin = req.headers.origin

    if (!origin || isAllowedOrigin(origin)) {
      console.log(`[Preflight] Origin permitido: ${origin}`)
      res.header('Access-Control-Allow-Origin', origin)
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
    } else {
      console.warn(`[Preflight] Origin bloqueado: ${origin}`)
      return res
        .status(403)
        .send('CORS policy: Origin no permitido en producción.')
    }
  }
}

export default handlePreflight
