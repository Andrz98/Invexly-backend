const allowedOrigins = [process.env.FRONTEND_URL]

const handlePreflight = (req, res, next) => {
  if (req.method === 'OPTIONS') {
    const origin = req.headers.origin

    if (!allowedOrigins.includes(origin)) {
      return res.status(401).json({
        message: 'CORS: Origin no autorizado para preflight'
      })
    }

    res.header('Access-Control-Allow-Origin', origin)
    res.header('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE')
    res.header('Access-Control-Allow-Headers', 'Content-Type, Authorization')
    res.header('Access-Control-Allow-Credentials', 'true')

    return res.sendStatus(204)
  }

  next()
}

export default handlePreflight
