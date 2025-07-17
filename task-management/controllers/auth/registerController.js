import User from '../../../models/user.js'
import jwt from 'jsonwebtoken'
import bcrypt from 'bcrypt'
import { sendEmail } from '../emails/emailController.js'

const register = async (req, res) => {
  try {

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
      //profileImage: profileImage || 'https://res.cloudinary.com/dwsnf2wlr/image/upload/v1743014124/p83xds6yhage9eatibgm.jpg'
      profileImage: profileImage
    })
    console.log('Correo a enviar1:', email)

    // Aquí capturamos un error de calve duplicada desde MongoDB
    try {
      await newUser.save()
      console.log('Usuario guardado correctamente en la base de datos')
    } catch (error) {
      if (error.code === 11000) {
        console.log('Error: usuario duplicado')
        return res
          .status(400)
          .json({ message: 'El usuario ya está registrado' })
      }
      throw error
    }

    console.log('Generando Token JWT...')
    const token = jwt.sign({ id: newUser._id }, process.env.JWT_SECRET, {
      expiresIn: '1h'
    })

    console.log('Generando Refresh Token...')
    const refreshToken = jwt.sign(
      { id: newUser._id },
      process.env.REFRESH_TOKEN_SECRET,
      { expiresIn: '7d' }
    )

    console.log('Configurando Cookies...')
    res.cookie('token', token, {
      httpOnly: true, // Solo accesible por el navegador
      secure: true, // Solo por HTTPS
      sameSite: 'none', // Cross-site (Netlify + Render)
      path: '/',
      maxAge: 60 * 60 * 1000 // 1 hora
    })

    res.cookie('refreshToken', refreshToken, {
      httpOnly: true, // Solo accesible por el navegador
      secure: true, // Solo por HTTPS
      sameSite: 'none', // Cross-site
      path: '/',
      maxAge: 7 * 24 * 60 * 60 * 1000 // 7 días
    })

    console.log('Enviando correo de bienvenida...')
    await sendEmail({
      to: [{ email, name: username }],
      templateId: 2, // ID del template de bienvenida
      params: { username }
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
