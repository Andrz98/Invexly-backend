import User from '../../../../models/user.js'
import logger from '../../../../utils/winstonLogger/loggers.js'

const updateEmail = async (req, res) => {
  try {
    const { email } = req.body
    const user = await User.findById(req.user.id)

    if (!user) {
      logger.warn(
        `[PROFILE] Usuario no encontrado al intentar cambiar correo: ID ${req.user.id}`
      )
      return res.status(404).json({ message: 'Usuario no encontrado' })
    }

    const oldEmail = user.email
    user.email = email
    await user.save({ validateModifiedOnly: true })

    const updatedUser = await User.findById(req.user.id).select('-password')
    logger.info(
      `[PROFILE] Usuario ${user.username} cambió su email de ${oldEmail} a ${email}`
    )

    res.json({ message: 'Correo actualizado con éxito.', updatedUser })
  } catch (error) {
    logger.error(`[PROFILE] Error al actualizar email: ${error.message}`, {
      stack: error.stack
    })
    res
      .status(500)
      .json({ message: 'Error al actualizar el correo.', error: error.message })
  }
}

export default updateEmail
