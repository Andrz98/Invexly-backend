// ========================================================
// Middleware: para manejar solicitudes Preflight (OPTIONS)
// ========================================================

/**
 * Este middleware gestiona las solicitudes preflight (OPTIONS) en CORS.
 *
 * ¿Qué es un preflight?
 * Es una verificación previa que realiza nuestro navegador antes de enviar solicitudes sensibles como (POST, PUT, DELETE).
 * Se envía automáticamente para verificar si el servidor permite la solicitud real.
 *
 * Entonces, si la solicitud es de tipo OPTIONS, responde con los encabezados CORS permitidos.
 */

const handlePreflight = (req, res, next) => {
  if (req.method === 'OPTIONS') {
    // Definimos los métodos HTTP que el servidor acepta
    res.header(
      'Access-Control-Allow-Methods',
      'GET, POST, PUT, DELETE, OPTIONS'
    )

    // Definimos qué cabeceras HTTP están permitidas en la solicitud
    res.header('Access-Control-Allow-Headers', 'Content-Type, Authorization')

    // Acto seguido, respondemos con un código 200 (OK), de esta forma indicamos que la solicitud preflight fue exitosa
    return res.sendStatus(200)
  }

  // Finalmente, si no es una solicitud OPTIONS, continúa con el siguiente middleware
  next()
}

module.exports = handlePreflight
