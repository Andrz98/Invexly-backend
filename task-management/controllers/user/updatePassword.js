import User from '../../../models/user.js'
import bcrypt from 'bcrypt'
import logger from '../../../utils/winstonLogger/loggers.js'

const updatePassword = async (req, res) => {
  try {
    const { currentPassword, newPassword, confirmNewPassword } = req.body

    if (newPassword !== confirmNewPassword) {
      logger.warn('[PROFILE] Contraseñas no coinciden')
      return res.status(400).json({ message: 'Las contraseñas no coinciden.' })
    }

    const user = await User.findById(req.user.id)
    if (!user) {
      logger.warn(
        `[PROFILE] Usuario no encontrado al actualizar contraseña: ID ${req.user.id}`
      )
      return res.status(404).json({ message: 'Usuario no encontrado' })
    }

    const isMatch = await bcrypt.compare(currentPassword, user.password)
    if (!isMatch) {
      logger.warn(
        `[PROFILE] Contraseña actual incorrecta para usuario ${user.username}`
      )
      return res
        .status(400)
        .json({ message: 'La contraseña actual es incorrecta.' })
    }

    if (currentPassword === newPassword) {
      logger.warn(
        `[PROFILE] Usuario ${user.username} intentó usar la misma contraseña`
      )
      return res.status(400).json({
        message: 'La nueva contraseña no puede ser la misma que la actual.'
      })
    }

    user.password = await bcrypt.hash(newPassword, 10)
    await user.save({ validateModifiedOnly: true })

    logger.info(
      `[PROFILE] Usuario ${user.username} actualizó su contraseña exitosamente`
    )
    const updatedUser = await User.findById(req.user.id).select('-password')
    res.json({ message: 'Contraseña actualizada con éxito', updatedUser })
  } catch (error) {
    logger.error(`[PROFILE] Error al actualizar contraseña: ${error.message}`, {
      stack: error.stack
    })
    res.status(500).json({
      message: 'Error al actualizar la contraseña.',
      error: error.message
    })
  }
}

export default updatePassword
