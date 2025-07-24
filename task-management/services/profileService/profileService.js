import User from '../../../models/user.js'
import logger from '../../../utils/winstonLogger/loggers.js'

export const findUserById = async (id) => {
  try {
    return await User.findById(id)
  } catch (error) {
    logger.error(`Error en findUserById (${id}): ${error.message}`)
    throw new Error('Error al buscar usuario por ID')
  }
}

export const saveUser = async (user) => {
  try {
    return await user.save()
  } catch (error) {
    logger.error(
      `Error en saveUser (${user?._id || 'sin ID'}): ${error.message}`
    )
    throw new Error('Error al guardar usuario')
  }
}
