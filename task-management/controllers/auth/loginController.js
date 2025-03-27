import User from '../../../models/user.js'
import jwt from 'jsonwebtoken'
import bcrypt from 'bcrypt'

const login = async (req, res, next) => {
  try {
    const { email, password } = req.body
    console.log('Email recibido:', email)
    console.log('Contraseña recibida:', password)

    if (!email || !password) {
      console.log('Validación activada: faltan credenciales') // console.log para vitest
      return res.status(400).json({ message: 'Faltan credenciales' })
    }

    const user = await User.findOne({ email })
    if (!user) {
      return res.status(401).json({ message: 'Credenciales incorrectas' }) // Evita enumeración de usuarios
    }

    console.log('Contraseña almacenada:', user.password)
    const isMatch = await bcrypt.compare(password, user.password)
    console.log('¿Contraseña coincide?:', isMatch)

    if (!isMatch) {
      return res.status(401).json({ message: 'Credenciales incorrectas' }) // Mensaje unificado
    }

    // Generar token de acceso (access token)
    const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET, {
      expiresIn: '1h'
    })

    // Generar token de renovación (refresh token)
    const refreshToken = jwt.sign(
      { id: user._id },
      process.env.REFRESH_TOKEN_SECRET,
      { expiresIn: '7d' }
    )

    if (!token || !refreshToken) {
      return res.status(500).json({ message: 'Error generando token' })
    }

    // Configurar cookie del access token
    res.cookie('token', token, {
      httpOnly: true, // Acceso restringido desde JS
      secure: true, // Solo se envía por HTTPS
      sameSite: 'none', // Permitir cross-site (Netlify + Render)
      path: '/',
      maxAge: 60 * 60 * 1000 // 1 hora
    })

    // Configurar cookie del refresh token
    res.cookie('refreshToken', refreshToken, {
      httpOnly: true, // Acceso restringido desde JS
      secure: true, // Solo se envía por HTTPS
      sameSite: 'none', // Permitir cross-site
      path: '/',
      maxAge: 7 * 24 * 60 * 60 * 1000 // 7 días
    })

    // Enviar respuesta exitosa
    res.status(200).json({
      message: 'Inicio de sesión exitoso',
      token,
      userId: user._id, // incorporo el id de rama2
      username: user.username,
      email: user.email,
      role: user.role,
      profile: user.profileImage
    })
  } catch (error) {
    console.error('Error en login:', error)
    next(error)
  }
}

export default login
