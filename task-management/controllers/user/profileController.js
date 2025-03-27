import User from '../../../models/user.js'
import bcrypt from 'bcrypt'
import cloudinary from '../../config/cloudinary.js'

// Obtener perfil del usuario
export const getProfile = async (req, res) => {
  try {
    const user = await User.findById(req.user.id).select('-password')
    if (!user) {
      return res.status(404).json({ message: 'Usuario no encontrado' })
    }
    res.status(200).json(user)
  } catch (error) {
    res
      .status(500)
      .json({ message: 'Error al obtener el perfil', error: error.message })
  }
}

// Actualizar nombre de usuario
export const updateUsername = async (req, res) => {
  try {
    const { username } = req.body

    // Buscar al usuario
    const user = await User.findById(req.user.id)
    if (!user) {
      return res.status(404).json({ message: 'Usuario no encontrado' })
    }

    // Actualizar el nombre de usuario
    user.username = username

    // Guardar solo los cambios
    await user.save({ validateModifiedOnly: true })

    // Volver a consultar el usuario actualizado SIN el campo password
    const updatedUser = await User.findById(req.user.id).select('-password')

    // Enviar el usuario actualizado al frontend
    res.json({
      message: 'Nombre actualizado con éxito.',
      updatedUser
    })
  } catch (error) {
    res.status(500).json({
      message: 'Error al actualizar el nombre.',
      error: error.message
    })
  }
}
// Actualizar correo electrónico
export const updateEmail = async (req, res) => {
  try {
    const { email } = req.body

    // Buscar al usuario actual
    const user = await User.findById(req.user.id)
    if (!user) {
      return res.status(404).json({ message: 'Usuario no encontrado' })
    }

    // Actualizar el correo
    user.email = email
    await user.save({ validateModifiedOnly: true })

    // Recuperar nuevamente el usuario sin el password
    const updatedUser = await User.findById(req.user.id).select('-password')

    // Respuesta con el objeto completo
    res.json({
      message: 'Correo actualizado con éxito.',
      updatedUser
    })
  } catch (error) {
    res.status(500).json({
      message: 'Error al actualizar el correo.',
      error: error.message
    })
  }
}

// Actualizar contraseña
export const updatePassword = async (req, res) => {
  try {
    const { currentPassword, newPassword, confirmNewPassword } = req.body

    // Validación para asegurarse de que la nueva contraseña coincida con la confirmación
    if (newPassword !== confirmNewPassword) {
      return res.status(400).json({ message: 'Las contraseñas no coinciden.' })
    }

    const user = await User.findById(req.user.id)
    if (!user) {
      if (process.env.NODE_ENV !== 'production') {
        console.log('Usuario no encontrado')
      }
      return res.status(404).json({ message: 'Usuario no encontrado' })
    }

    // Comparar la contraseña actual con la almacenada
    const isMatch = await bcrypt.compare(currentPassword, user.password)
    if (!isMatch) {
      return res
        .status(400)
        .json({ message: 'La contraseña actual es incorrecta.' })
    }

    // Validar que la nueva contraseña y la confirmación sean distintas de la contraseña actual
    if (currentPassword === newPassword) {
      return res.status(400).json({
        message: 'La nueva contraseña no puede ser la misma que la actual.'
      })
    }

    // Hacer hash de la nueva contraseña
    const hashedPassword = await bcrypt.hash(newPassword, 10)

    // Actualizar la contraseña en la base de datos
    user.password = hashedPassword
    await user.save({ validateModifiedOnly: true })

    // Recuperar nuevamente el usuario sin contraseña para el contexto del frontend
    const updatedUser = await User.findById(req.user.id).select('-password')

    res.json({
      message: 'Contraseña actualizada con éxito',
      updatedUser
    })
  } catch (error) {
    console.error('Error en updatePassword:', error)
    res.status(500).json({
      message: 'Error al actualizar la contraseña.',
      error: error.message
    })
  }
}

// Actualizar imagen de perfil
export const updateAvatar = async (req, res) => {
  try {
    const { profileImage } = req.body

    const user = await User.findById(req.user.id)
    if (!user) {
      return res.status(404).json({ message: 'Usuario no encontrado' })
    }

    // Eliminar imagen anterior de Cloudinary si existía
    if (user.profileImage && user.profileImage.includes('cloudinary')) {
      const publicId = user.profileImage.split('/').pop().split('.')[0]
      try {
        await cloudinary.uploader.destroy(publicId)
      } catch (error) {
        if (process.env.NODE_ENV !== 'production') {
          console.warn(
            'No se pudo eliminar la imagen de Cloudinary:',
            error.message
          )
        }
      }
    }

    // Actualizar nueva imagen
    user.profileImage = profileImage
    await user.save({ validateModifiedOnly: true })

    // Obtener usuario actualizado sin contraseña
    const updatedUser = await User.findById(req.user.id).select('-password')

    res.json({
      message: 'Imagen de perfil actualizada con éxito.',
      updatedUser
    })
  } catch (error) {
    res.status(500).json({
      message: 'Error al actualizar la imagen.',
      error: error.message
    })
  }
}
