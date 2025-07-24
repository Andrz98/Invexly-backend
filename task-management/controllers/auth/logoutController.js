import logger from '../../../utils/winstonLogger/loggers.js'

const logout = async (req, res) => {
  try {
    const ip = req.ip
    const userAgent = req.headers['user-agent']
    const tokenFromCookie = req.cookies.token
    const tokenFromHeader = req.headers.authorization?.split(' ')[1]
    const refreshToken = req.cookies?.refreshToken

    const hasToken = tokenFromCookie || tokenFromHeader
    const hasRefreshToken = !!refreshToken

    if (!hasToken && !hasRefreshToken) {
      logger.warn(`[LOGOUT] Solicitud sin token | IP: ${ip} | UA: ${userAgent}`)
      return res.status(401).json({ message: 'Token no proporcionado' })
    }

    res.clearCookie('token', {
      httpOnly: true,
      secure: true,
      sameSite: 'none',
      path: '/'
    })

    res.clearCookie('refreshToken', {
      httpOnly: true,
      secure: true,
      sameSite: 'none',
      path: '/'
    })

    logger.info(
      `[LOGOUT] Sesión cerrada correctamente | IP: ${ip} | UA: ${userAgent}`
    )

    return res.status(200).json({ message: 'Sesión cerrada correctamente' })
  } catch (error) {
    logger.error(`[LOGOUT] Error inesperado: ${error.message}`, {
      stack: error.stack
    })
    res.status(500).json({ message: 'Error en el servidor', error })
  }
}

export default logout
