import {
  findUserById,
  saveUser
} from '../../../services/profileService/profileService.js'
import bcrypt from 'bcrypt'

import logger from '../../../../utils/winstonLogger/loggers.js'

// Obtener perfil del usuario
export const getProfile = async (req, res) => {
  try {
    const user = await findUserById(req.user.id)
    if (!user) {
      logger.warn(`Perfil no encontrado (ID: ${req.user.id})`)
      return res.status(404).json({ message: 'Usuario no encontrado' })
    }
    logger.info(`Perfil cargado correctamente (ID: ${req.user.id})`)
    res.status(200).json({
      username: user.username,
      email: user.email,
      profileImage: user.profileImage
    })
  } catch (error) {
    logger.error(`Error en getProfile: ${error.message}`)
    res.status(500).json({ message: 'Error al obtener el perfil' })
  }
}

// Actualizar avatar del usuario
export const updateAvatar = async (req, res) => {
  try {
    const user = await findUserById(req.user.id)
    if (!user) {
      logger.warn(
        `No se encontró el usuario al actualizar avatar (ID: ${req.user.id})`
      )
      return res.status(404).json({ message: 'Usuario no encontrado' })
    }
    // Mantener un único campo persistente para la imagen de perfil.
    const profileImage = req.body.profileImage ?? req.body.avatar

    user.profileImage = profileImage
    await saveUser(user)
    logger.info(`Avatar actualizado (ID: ${req.user.id})`)
    res.status(200).json({ message: 'Avatar actualizado correctamente' })
  } catch (error) {
    logger.error(`Error en updateAvatar: ${error.message}`)
    res.status(500).json({ message: 'Error al actualizar el avatar' })
  }
}

// Actualizar email
export const updateEmail = async (req, res) => {
  try {
    const user = await findUserById(req.user.id)
    if (!user) {
      logger.warn(
        `No se encontró el usuario al actualizar email (ID: ${req.user.id})`
      )
      return res.status(404).json({ message: 'Usuario no encontrado' })
    }
    user.email = req.body.email
    await saveUser(user)
    logger.info(`Email actualizado (ID: ${req.user.id})`)
    res.status(200).json({ message: 'Email actualizado correctamente' })
  } catch (error) {
    logger.error(`Error en updateEmail: ${error.message}`)
    res.status(500).json({ message: 'Error al actualizar el email' })
  }
}

// Actualizar contraseña
export const updatePassword = async (req, res) => {
  try {
    const user = await findUserById(req.user.id)
    if (!user) {
      logger.warn(
        `No se encontró el usuario al actualizar contraseña (ID: ${req.user.id})`
      )
      return res.status(404).json({ message: 'Usuario no encontrado' })
    }
    // Hashear la contraseña antes de persistir para evitar almacenamiento en texto plano.
    const hashedPassword = await bcrypt.hash(req.body.password, 10)
    user.password = hashedPassword
    await saveUser(user)
    logger.info(`Contraseña actualizada (ID: ${req.user.id})`)
    res.status(200).json({ message: 'Contraseña actualizada correctamente' })
  } catch (error) {
    logger.error(`Error en updatePassword: ${error.message}`)
    res.status(500).json({ message: 'Error al actualizar la contraseña' })
  }
}

// Actualizar nombre de usuario
export const updateUsername = async (req, res) => {
  try {
    const user = await findUserById(req.user.id)
    if (!user) {
      logger.warn(
        `No se encontró el usuario al actualizar username (ID: ${req.user.id})`
      )
      return res.status(404).json({ message: 'Usuario no encontrado' })
    }
    user.username = req.body.username
    await saveUser(user)
    logger.info(`Username actualizado (ID: ${req.user.id})`)
    res
      .status(200)
      .json({ message: 'Nombre de usuario actualizado correctamente' })
  } catch (error) {
    logger.error(`Error en updateUsername: ${error.message}`)
    res
      .status(500)
      .json({ message: 'Error al actualizar el nombre de usuario' })
  }
}
