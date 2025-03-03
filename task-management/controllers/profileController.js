import User from '../../models/user.js'
import bcrypt from 'bcrypt'

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

export const updateProfile = async (req, res) => {
  try {
    const { username, email, currentPassword, newPassword } = req.body
    const userId = req.user.id

    const user = await User.findById(userId)
    if (!user) {
      return res.status(404).json({ message: 'Usuario no encontrado' })
    }

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

      const hashedPassword = await bcrypt.hash(newPassword, 10)
      user.password = hashedPassword
    }

    if (username) {
      user.username = username
    }
    if (email) {
      user.email = email
    }

    await user.save()
    res.json({ message: 'Perfil actualizado con éxito.' })
  } catch (error) {
    res
      .status(500)
      .json({ message: 'Error al actualizar el perfil.', error: error.message })
  }
}
