import User from '../../../models/user.js'
import jwt from 'jsonwebtoken'
import bcrypt from 'bcrypt'
import logger from '../../../utils/winstonLogger/loggers.js'

const login = async (req, res, next) => {
  try {
    const { email, password } = req.body
    const ip = req.ip
    const userAgent = req.headers['user-agent']

    if (!email || !password) {
      logger.warn(`[LOGIN] Faltan credenciales | IP: ${ip} | UA: ${userAgent}`)
      return res.status(400).json({ message: 'Faltan credenciales' })
    }

    const user = await User.findOne({ email })
    if (!user) {
      logger.warn(`[LOGIN] Usuario no encontrado: ${email} | IP: ${ip}`)
      return res.status(401).json({ message: 'Credenciales incorrectas' })
    }

    const isMatch = await bcrypt.compare(password, user.password)
    if (!isMatch) {
      logger.warn(`[LOGIN] Contraseña incorrecta | Email: ${email} | IP: ${ip}`)
      return res.status(401).json({ message: 'Credenciales incorrectas' })
    }

    const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET, {
      expiresIn: '1h'
    })
    const refreshToken = jwt.sign(
      { id: user._id },
      process.env.REFRESH_TOKEN_SECRET,
      { expiresIn: '7d' }
    )

    if (!token || !refreshToken) {
      logger.error(`[LOGIN] Fallo al generar tokens para ${email}`)
      return res.status(500).json({ message: 'Error generando token' })
    }

    // Configurar cookies seguras
    res.cookie('token', token, {
      httpOnly: true,
      secure: true,
      sameSite: 'none',
      path: '/',
      maxAge: 60 * 60 * 1000 // 1 hora
    })

    res.cookie('refreshToken', refreshToken, {
      httpOnly: true,
      secure: true,
      sameSite: 'none',
      path: '/',
      maxAge: 7 * 24 * 60 * 60 * 1000 // 7 días
    })

    logger.info(
      `[LOGIN] Éxito | Usuario: ${email} | ID: ${user._id} | IP: ${ip}`
    )

    res.status(200).json({
      message: 'Inicio de sesión exitoso',
      token,
      userId: user._id,
      username: user.username,
      email: user.email,
      role: user.role,
      profileImage: user.profileImage
    })
  } catch (error) {
    logger.error(
      `[LOGIN] Error inesperado para ${req.body.email || 'N/A'}: ${error.message}`,
      { stack: error.stack }
    )
    next(error)
  }
}

export default login
