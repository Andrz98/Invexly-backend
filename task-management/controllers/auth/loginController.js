/* eslint-disable prettier/prettier */
import User from '../../../models/user.js'
import jwt from 'jsonwebtoken'
import bcrypt from 'bcrypt'

const login = async (req, res, next) => {
  try {
    const { email, password } = req.body
    console.log('Email recibido:', email) 
    console.log('Contraseña recibida:', password) 

    if (!email || !password) {
      return res.status(400).json({ message: 'Faltan credenciales' })
    }

    const user = await User.findOne({ email })
    console.log('Usuario encontrado:', user) 

    // Buscar usuarios con diferentes variaciones
    const userByEmail = await User.findOne({ email: email }) 
    const userByEmailTrimmed = await User.findOne({ email: email.trim() }) 
    const userByEmailLowerCase = await User.findOne({ email: email.toLowerCase() }) 

    console.log('Búsqueda por email exacto:', userByEmail) 
    console.log('Búsqueda por email trimmed:', userByEmailTrimmed) 
    console.log('Búsqueda por email lowercase:', userByEmailLowerCase) 



    if (!user) {
      return res.status(401).json({ message: 'Usuario no encontrado' })
    }

    console.log('Contraseña almacenada:', user.password)
    const isMatch = await bcrypt.compare(password, user.password)
    console.log('¿Contraseña coincide?:', isMatch)
    

    if (!isMatch) {
      return res.status(401).json({ message: 'Contraseña incorrecta' })
    }

    // Generar el token con duración de 1 hora
    const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET, {
      expiresIn: '1h'
    })

    // Configurar la cookie para mantener la sesión
    res.cookie('token', token, {
      httpOnly: true,
      secure: true, // Debe ser true, cuando sameSite es 'none'
      sameSite: 'none', //Lo cambie de Lax a none, porque hace que las cookies no se envien
      maxAge: 60 * 60 * 1000 // 1 hora de duración
    })

    res.status(200).json({
      message: 'Inicio de sesión exitoso',
      token, // devolvemos el token por compatibilidad
      userId: user._id, // <---- Enviamos el _id del usuario
      username: user.username,
      email: user.email,
      role: user.role,
      profile: user.profileImage
    })
  } catch (error) {
    console.error('❌ Error en login:', error)
    next(error)
  }
}

export default login
