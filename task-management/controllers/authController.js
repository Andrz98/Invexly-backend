// =========================================
// Controladores de Autenticación y Perfil de Usuario
// =========================================

import User from '../../models/user.js'
import jwt from 'jsonwebtoken'
import bcrypt from 'bcrypt'
import cloudinary from '../config/cloudinary.js'

// =========================================
// Controlador: Inicio de Sesión (Corrección aplicada)
// =========================================

export const login = async (req, res, next) => {
  try {
    // ========================
    // Validación de datos en req.body
    // ========================
    console.log('DAtos recibidos en login', req.body)
    const { email, password } = req.body

    if (!email || !password) {
      return res
        .status(400)
        .json({ message: 'Faltan credenciales: email y contraseña requeridos' })
    }

    // ========================
    // Buscar usuario en la base de datos solo con email
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
    // Generar token JWT para autenticación
    // ========================
    const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET, {
      expiresIn: '7d',
    })

    // ========================
    // Configurar cookie con el token de sesión
    // ========================
    res.cookie('token', token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
      maxAge: 7 * 24 * 60 * 60 * 1000,
    })

    // ========================
    // Respuesta con datos del usuario autenticado
    // ========================
    res.json({
      message: 'Inicio de sesión exitoso',
      token,
      username: user.username,
      email: user.email,
    })
  } catch (error) {
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
      role: 'user',
    })

    await newUser.save()

    const token = jwt.sign({ id: newUser._id }, process.env.JWT_SECRET, {
      expiresIn: '7d',
    })

    res.status(201).json({
      message: 'Usuario registrado con éxito',
      token,
      username: newUser.username,
      email: newUser.email,
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
      role: user.role,
    })
  } catch (error) {
    res.status(500).json({ message: 'Error al validar el token' })
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
// Controlador: Actualización de Perfil
// ========================
export const updateProfile = async (req, res) => {
  try {
    const { username, email, currentPassword, newPassword } = req.body
    const userId = req.user.id

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
    const user = await User.findById(userId)

    if (newPassword) {
      if (!currentPassword) {
        return res.status(400).json({
          message: 'Debes proporcionar la contraseña actual para cambiarla.',
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
          message: 'La nueva contraseña debe tener al menos 6 caracteres.',
        })
      }

      const hashedPassword = await bcrypt.hash(newPassword, 10)
      user.password = hashedPassword
    }

    // ========================
    // Manejo de Imagen de Perfil en Cloudinary
    // ========================
    if (req.file) {
      if (user.profileImage && !user.profileImage.startsWith('http')) {
        await cloudinary.uploader.destroy(`profile_${userId}`)
      }

      const uploadedImage = await cloudinary.uploader.upload(req.file.path, {
        folder: 'user_profiles',
        public_id: `profile_${userId}`,
        overwrite: true,
      })

      if (uploadedImage.secure_url) {
        user.profileImage = uploadedImage.secure_url
      } else {
        return res
          .status(500)
          .json({ message: 'Error al subir la imagen a Cloudinary' })
      }
    }

    if (username) user.username = username
    if (email) user.email = email

    await user.save()

    res.json({
      message: 'Perfil actualizado con éxito.',
      username: user.username,
      email: user.email,
      profileImage: user.profileImage,
    })
  } catch (error) {
    res
      .status(500)
      .json({ message: 'Error al actualizar el perfil.', error: error.message })
  }
}
