// =========================================
// Controladores de Autenticación y Perfil de Usuario
// =========================================

import User from '../../models/user.js'
import jwt from 'jsonwebtoken'
import bcrypt from 'bcrypt'

// =========================================
// Controlador: Inicio de Sesión
// =========================================
export const login = async (req, res, next) => {
  try {
    console.log('Datos recibidos en login:', req.body)
    const { email, password } = req.body

    if (!email || !password) {
      res
        .status(400)
        .json({ message: 'Faltan credenciales: email y contraseña requeridos' })
      return
    }

    // ========================
    // Buscar usuario en la base de datos
    // ========================
    const user = await User.findOne({ email })

    if (!user) {
      return res.status(401).json({ message: 'Usuario no encontrado' })
    }

    // ========================
    // Comparar contraseña ingresada con la almacenada
    // ========================
    const isMatch = await bcrypt.compare(password, user.password)
    if (!isMatch) {
      return res.status(401).json({ message: 'Contraseña incorrecta' })
    }

    // ========================
    // Generar token JWT
    // ========================
    const tokenExpiry = 7 * 24 * 60 * 60
    const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET, {
      expiresIn: tokenExpiry
    })

    // ========================
    // Configurar cookie con token
    // ========================
    res.cookie('token', token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
      maxAge: tokenExpiry * 1000
    })

    // ========================
    // Responder con datos del usuario autenticado
    // ========================
    res.json({
      message: 'Inicio de sesión exitoso',
      token,
      username: user.username,
      email: user.email
    })
  } catch (error) {
    console.error('❌ Error en login:', error)
    next(error)
  }
}

// ========================
// Controlador: Registro de Usuario
// ========================
export const register = async (req, res, next) => {
  try {
    const { username, email, password } = req.body
    const existingUser = await User.findOne({ $or: [{ email }, { username }] })

    if (existingUser) {
      return res.status(400).json({ message: 'El usuario ya está registrado' })
    }

    const hashedPassword = await bcrypt.hash(password, 10)
    const newUser = new User({
      username,
      email,
      password: hashedPassword,
      role: 'user'
    })

    await newUser.save()

    const token = jwt.sign({ id: newUser._id }, process.env.JWT_SECRET, {
      expiresIn: '7d'
    })

    res.status(201).json({
      message: 'Usuario registrado con éxito',
      token,
      username: newUser.username,
      email: newUser.email
    })
  } catch (error) {
    next(error)
  }
}

// ========================
// Controlador: Validación del Token
// ========================
export const validateToken = async (req, res) => {
  try {
    if (!req.user) {
      return res.status(401).json({ message: 'Token inválido o expirado' })
    }

    const user = await User.findById(req.user.id)
    if (!user) {
      return res.status(401).json({ message: 'Usuario no encontrado' })
    }

    res.json({
      message: 'Token válido',
      username: user.username,
      email: user.email,
      role: user.role
    })
  } catch (error) {
    res.status(500).json({
      message: 'Error al actualizar el perfil.',
      error: error.message
    })
  }
}

// ========================
// Controlador: Cierre de Sesión
// ========================
export const logout = (req, res) => {
  res.clearCookie('token', { httpOnly: true, secure: true, sameSite: 'strict' })
  res.status(200).json({ message: 'logout exitoso' })
}

// ========================
// Controlador: Obtener Perfil de Usuario
// ========================
export const getProfile = async (req, res) => {
  try {
    if (!req.user) {
      return res.status(401).json({ message: 'No autorizado' })
    }

    const user = await User.findById(req.user.id).select('-password')

    if (!user) {
      return res.status(404).json({ message: 'Usuario no encontrado' })
    }

    res.status(200).json({
      username: user.username,
      email: user.email,
      role: user.role,
      profileImage: user.profileImage
    })
  } catch (error) {
    res
      .status(500)
      .json({ message: 'Error al obtener el perfil', error: error.message })
  }
}

// ========================
// Controlador: Actualización de Perfil
// ========================
export const updateProfile = async (req, res) => {
  try {
    const { username, email, currentPassword, newPassword } = req.body
    const userId = req.user.id

    // ✅ Se obtiene el usuario de la BD antes de modificarlo
    const user = await User.findById(userId)
    if (!user) {
      return res.status(404).json({ message: 'Usuario no encontrado' })
    }

    // ========================
    // Validaciones de Email y Username
    // ========================
    if (email) {
      const emailExists = await User.findOne({ email })
      if (emailExists && emailExists._id.toString() !== userId) {
        return res.status(400).json({ message: 'El email ya está en uso.' })
      }
    }

    if (username) {
      const usernameExists = await User.findOne({ username })
      if (usernameExists && usernameExists._id.toString() !== userId) {
        return res.status(400).json({ message: 'El username ya está en uso.' })
      }
    }

    // ========================
    // Manejo de Cambio de Contraseña con Validación
    // ========================
    if (newPassword) {
      if (!currentPassword) {
        return res.status(400).json({
          message: 'Debes proporcionar la contraseña actual para cambiarla.'
        })
      }

      const isMatch = await bcrypt.compare(currentPassword, user.password)
      if (!isMatch) {
        return res
          .status(400)
          .json({ message: 'La contraseña actual es incorrecta.' })
      }

      if (newPassword.length < 6) {
        return res.status(400).json({
          message: 'La nueva contraseña debe tener al menos 6 caracteres.'
        })
      }

      const hashedPassword = await bcrypt.hash(newPassword, 10)
      user.password = hashedPassword
    }

    // ✅ Aplicar cambios al usuario
    if (username) {
      user.username = username
    }
    if (email) {
      user.email = email
    }

    await user.save()

    res.json({
      message: 'Perfil actualizado con éxito.',
      username: user.username,
      email: user.email,
      profileImage: user.profileImage
    })
  } catch (error) {
    res
      .status(500)
      .json({ message: 'Error al actualizar el perfil.', error: error.message })
  }
}
