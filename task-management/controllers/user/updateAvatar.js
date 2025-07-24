import User from '../../../models/user.js'
import cloudinary from '../../config/cloudinary.js'
import logger from '../../../utils/winstonLogger/loggers.js'

const updateAvatar = async (req, res) => {
  try {
    const { profileImage } = req.body
    const user = await User.findById(req.user.id)

    if (!user) {
      logger.warn(
        `[PROFILE] Usuario no encontrado al actualizar avatar: ID ${req.user.id}`
      )
      return res.status(404).json({ message: 'Usuario no encontrado' })
    }

    if (user.profileImage && user.profileImage.includes('cloudinary')) {
      const publicId = user.profileImage.split('/').pop().split('.')[0]
      try {
        await cloudinary.uploader.destroy(publicId)
        logger.info(
          `[PROFILE] Imagen anterior eliminada de Cloudinary (public_id: ${publicId})`
        )
      } catch (error) {
        logger.warn(
          `[PROFILE] No se pudo eliminar la imagen anterior de Cloudinary: ${error.message}`
        )
      }
    }

    user.profileImage = profileImage
    await user.save({ validateModifiedOnly: true })

    const updatedUser = await User.findById(req.user.id).select('-password')
    logger.info(
      `[PROFILE] Imagen de perfil actualizada para el usuario ${user.username}`
    )

    res.json({
      message: 'Imagen de perfil actualizada con éxito.',
      updatedUser
    })
  } catch (error) {
    logger.error(`[PROFILE] Error al actualizar avatar: ${error.message}`, {
      stack: error.stack
    })
    res
      .status(500)
      .json({ message: 'Error al actualizar la imagen.', error: error.message })
  }
}

export default updateAvatar
