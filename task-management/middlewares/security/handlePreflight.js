const allowedOrigin = 'https://aqtrade.netlify.app'

const handlePreflight = (req, res, next) => {
  if (req.method === 'OPTIONS') {
    const origin = req.headers.origin

    if (origin === allowedOrigin) {
      console.log('[Preflight] Solicitud OPTIONS recibida de Netlify')

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
      console.warn(`[Preflight] Origen bloqueado en producción: ${origin}`)
      return res
        .status(403)
        .send('CORS policy: Origin no permitido en producción.')
    }
  }

  next()
}

export default handlePreflight
