import User from '../../models/user.js'
import bcrypt from 'bcrypt'
import cloudinary from '../config/cloudinary.js'

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
    const user = await User.findById(req.user.id)
    if (!user) {
      return res.status(404).json({ message: 'Usuario no encontrado' })
    }

    user.username = username

    // Se guarda solo validando los campos modificados
    await user.save({ validateModifiedOnly: true })
    res.json({
      message: 'Nombre actualizado con éxito.',
      username: user.username
    })
  } catch (error) {
    res
      .status(500)
      .json({ message: 'Error al actualizar el nombre.', error: error.message })
  }
}

// Actualizar correo electrónico
export const updateEmail = async (req, res) => {
  try {
    const { email } = req.body
    const user = await User.findById(req.user.id)
    if (!user) {
      return res.status(404).json({ message: 'Usuario no encontrado' })
    }

    user.email = email
    await user.save({ validateModifiedOnly: true })
    res.json({ message: 'Correo actualizado con éxito.', email: user.email })
  } catch (error) {
    res
      .status(500)
      .json({ message: 'Error al actualizar el correo.', error: error.message })
  }
}

// Actualizar contraseña
export const updatePassword = async (req, res) => {
  try {
    const { currentPassword, newPassword, confirmNewPassword } = req.body

    // Mostrar los valores recibidos para depuración
    console.log('currentPassword:', currentPassword)
    console.log('newPassword:', newPassword)
    console.log('confirmNewPassword:', confirmNewPassword)

    // Validación para asegurarse de que la nueva contraseña coincida con la confirmación
    if (newPassword !== confirmNewPassword) {
      console.log('Las contraseñas no coinciden')
      return res.status(400).json({ message: 'Las contraseñas no coinciden.' })
    }

    const user = await User.findById(req.user.id)
    if (!user) {
      console.log('Usuario no encontrado')
      return res.status(404).json({ message: 'Usuario no encontrado' })
    }

    // Comparar la contraseña actual con la almacenada
    const isMatch = await bcrypt.compare(currentPassword, user.password)
    if (!isMatch) {
      console.log('La contraseña actual es incorrecta')
      return res
        .status(400)
        .json({ message: 'La contraseña actual es incorrecta.' })
    }

    // Validar que la nueva contraseña y la confirmación sean distintas de la contraseña actual
    if (currentPassword === newPassword) {
      console.log('La nueva contraseña no puede ser la misma que la actual')
      return res.status(400).json({
        message: 'La nueva contraseña no puede ser la misma que la actual.'
      })
    }

    // Hacer hash de la nueva contraseña
    const hashedPassword = await bcrypt.hash(newPassword, 10)

    // Actualizar la contraseña en la base de datos
    user.password = hashedPassword
    await user.save()

    console.log('Contraseña actualizada con éxito')
    res.json({ message: 'Contraseña actualizada con éxito' })
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

    // Si el usuario ya tiene una imagen personalizada, eliminarla de Cloudinary
    if (user.profileImage && user.profileImage !== '') {
      const publicId = user.profileImage.split('/').pop().split('.')[0]
      await cloudinary.uploader.destroy(publicId)
    }

    user.profileImage = profileImage
    await user.save()
    res.json({
      message: 'Imagen de perfil actualizada con éxito.',
      profileImage: user.profileImage
    })
  } catch (error) {
    res
      .status(500)
      .json({ message: 'Error al actualizar la imagen.', error: error.message })
  }
}
