import User from '../../../models/user.js'
import jwt from 'jsonwebtoken'
import bcrypt from 'bcrypt'
import emailController from '../emails/emailController.js'

const register = async (req, res) => {
  try {
    console.log('Datos recibidos en el backend:', req.body) // <-- Verifica los datos

    const { username, email, password, profileImage } = req.body

    if (!username || !email || !password) {
      console.log('Faltan datos obligatorios.')
      return res
        .status(400)
        .json({ message: 'Todos los campos son obligatorios' })
    }

    console.log('Buscando si el usuario ya existe...')
    const existingUser = await User.findOne({ $or: [{ email }, { username }] })

    if (existingUser) {
      console.log('El usuario ya está registrado.')
      return res.status(400).json({ message: 'El usuario ya está registrado' })
    }

    console.log('Validando contraseña antes de encriptar...')
    const passwordRegex =
      /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/
    if (!passwordRegex.test(password)) {
      console.log('Contraseña inválida.')
      return res.status(400).json({
        message: 'La contraseña no cumple con los requisitos de seguridad.'
      })
    }

    console.log('Encriptando contraseña...')
    const hashedPassword = await bcrypt.hash(password, 10)

    console.log('Creando usuario en la base de datos...')
    const newUser = new User({
      username,
      email,
      password: hashedPassword,
      role: 'user',
      profileImage: profileImage || 'default-profile.png'
    })

    await newUser.save()
    console.log('Usuario guardado correctamente en la base de datos')

    console.log('Generando Token JWT...')
    const token = jwt.sign({ id: newUser._id }, process.env.JWT_SECRET, {
      expiresIn: '1h'
    })

    console.log('Configurando Cookie...')
    res.cookie('token', token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
      maxAge: 60 * 60 * 1000 // 1 hora
    })

    console.log('Enviando correo de bienvenida...')
    await emailController.sendEmail({
      to: [{ email, name: username }],
      subject: 'Bienvenido a TrendPulse',
      htmlContent: `<html><body><h1>Hola ${username}, gracias por registrarte en TrendPulse</h1></body></html>`
    })

    console.log('Registro exitoso, enviando respuesta...')
    return res.status(201).json({
      message: 'Usuario registrado con éxito y email enviado correctamente',
      token,
      username: newUser.username,
      email: newUser.email
    })
  } catch (error) {
    console.error('Error en el registro:', error)

    if (!res.headersSent) {
      return res
        .status(500)
        .json({ message: 'Error en el registro', error: error.message })
    }
  }
}

export default register
