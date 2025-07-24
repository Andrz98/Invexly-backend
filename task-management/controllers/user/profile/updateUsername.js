import User from '../../../../models/user.js'
import logger from '../../../../utils/winstonLogger/loggers.js'

const updateUsername = async (req, res) => {
  try {
    const { username } = req.body
    const user = await User.findById(req.user.id)

    if (!user) {
      logger.warn(
        `[PROFILE] Usuario no encontrado al intentar cambiar nombre: ID ${req.user.id}`
      )
      return res.status(404).json({ message: 'Usuario no encontrado' })
    }

    const oldUsername = user.username
    user.username = username
    await user.save({ validateModifiedOnly: true })

    const updatedUser = await User.findById(req.user.id).select('-password')
    logger.info(
      `[PROFILE] Usuario ${oldUsername} actualizó su nombre a ${username}`
    )

    res.json({ message: 'Nombre actualizado con éxito.', updatedUser })
  } catch (error) {
    logger.error(`[PROFILE] Error al actualizar nombre: ${error.message}`, {
      stack: error.stack
    })
    res
      .status(500)
      .json({ message: 'Error al actualizar el nombre.', error: error.message })
  }
}

export default updateUsername
