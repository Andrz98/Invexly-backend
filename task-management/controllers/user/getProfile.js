import User from '../../../models/user.js'
import logger from '../../../utils/winstonLogger/loggers.js'

const getProfile = async (req, res) => {
  try {
    const user = await User.findById(req.user.id).select('-password')

    if (!user) {
      logger.warn(`[PROFILE] Usuario no encontrado: ID ${req.user.id}`)
      return res.status(404).json({ message: 'Usuario no encontrado' })
    }

    logger.info(`[PROFILE] Perfil consultado para el usuario ${user.username}`)
    res.status(200).json(user)
  } catch (error) {
    logger.error(`[PROFILE] Error al obtener perfil: ${error.message}`, {
      stack: error.stack
    })
    res
      .status(500)
      .json({ message: 'Error al obtener el perfil', error: error.message })
  }
}

export default getProfile
