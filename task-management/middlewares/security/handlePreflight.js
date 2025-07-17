import { isAllowedOrigin } from '../../utils/originUtils.js'

const handlePreflight = (req, res, next) => {
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

  next()
}

export default handlePreflight
