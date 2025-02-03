// ========================================================
// Middleware: para manejar solicitudes Preflight (OPTIONS)
// ========================================================

const handlePreflight = (req, res, next) => {
  if (req.method === 'OPTIONS') {
    console.log('[Preflight] Solicitud OPTIONS recibida') // 🚀 Debug para solicitudes preflight

    res.header(
      'Access-Control-Allow-Methods',
      'GET, POST, PUT, DELETE, OPTIONS'
    )
    res.header('Access-Control-Allow-Headers', 'Content-Type, Authorization')

    const origin = req.headers.origin
    if (origin) {
      res.header('Access-Control-Allow-Origin', origin)
      console.log(`[Preflight] Origen permitido en preflight: ${origin}`)
    }

    return res.sendStatus(200) // Finaliza la respuesta para OPTIONS
  }

  next()
}

module.exports = handlePreflight
