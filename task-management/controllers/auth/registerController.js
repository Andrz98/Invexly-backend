import User from '../../../models/user.js'
import jwt from 'jsonwebtoken'
import bcrypt from 'bcrypt'
import { sendEmail } from '../emails/emailController.js'
import logger from '../../../utils/winstonLogger/loggers.js'

const register = async (req, res) => {
  try {
    const { username, email, password, profileImage } = req.body
    const ip = req.ip
    const userAgent = req.headers['user-agent']

    if (!username || !email || !password) {
      logger.warn(
        `[REGISTER] Faltan datos obligatorios | IP: ${ip} | UA: ${userAgent}`
      )
      return res
        .status(400)
        .json({ message: 'Todos los campos son obligatorios' })
    }

    logger.info(`[REGISTER] Intentando registrar: ${email} | IP: ${ip}`)

    const existingUser = await User.findOne({ $or: [{ email }, { username }] })
    if (existingUser) {
      logger.warn(`[REGISTER] Usuario ya registrado: ${email} | IP: ${ip}`)
      return res.status(400).json({ message: 'El usuario ya está registrado' })
    }

    const passwordRegex =
      /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/
    if (!passwordRegex.test(password)) {
      logger.warn(`[REGISTER] Contraseña débil para ${email} | IP: ${ip}`)
      return res.status(400).json({
        message: 'La contraseña no cumple con los requisitos de seguridad.'
      })
    }

    const hashedPassword = await bcrypt.hash(password, 10)

    const newUser = new User({
      username,
      email,
      password: hashedPassword,
      role: 'user',
      profileImage
    })

    try {
      await newUser.save()
      logger.info(
        `[REGISTER] Usuario registrado correctamente: ${email} | ID: ${newUser._id} | IP: ${ip}`
      )
    } catch (error) {
      if (error.code === 11000) {
        logger.warn(
          `[REGISTER] Error duplicado en MongoDB para ${email} | IP: ${ip}`
        )
        return res
          .status(400)
          .json({ message: 'El usuario ya está registrado' })
      }
      throw error
    }

    const token = jwt.sign({ id: newUser._id }, process.env.JWT_SECRET, {
      expiresIn: '1h'
    })
    const refreshToken = jwt.sign(
      { id: newUser._id },
      process.env.REFRESH_TOKEN_SECRET,
      { expiresIn: '7d' }
    )

    res.cookie('token', token, {
      httpOnly: true,
      secure: true,
      sameSite: 'none',
      path: '/',
      maxAge: 60 * 60 * 1000
    })

    res.cookie('refreshToken', refreshToken, {
      httpOnly: true,
      secure: true,
      sameSite: 'none',
      path: '/',
      maxAge: 7 * 24 * 60 * 60 * 1000
    })

    await sendEmail({
      to: [{ email, name: username }],
      templateId: 2,
      params: { username }
    })

    logger.info(`[REGISTER] Email de bienvenida enviado a ${email}`)

    return res.status(201).json({
      message: 'Usuario registrado con éxito y email enviado correctamente',
      token,
      username: newUser.username,
      email: newUser.email
    })
  } catch (error) {
    logger.error(
      `[REGISTER] Error inesperado para ${req.body.email || 'N/A'}: ${error.message}`,
      { stack: error.stack }
    )

    if (!res.headersSent) {
      return res
        .status(500)
        .json({ message: 'Error en el registro', error: error.message })
    }
  }
}

export default register
