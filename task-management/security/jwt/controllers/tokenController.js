import User from '../../../../models/user.js'
import { verifyToken } from '../helpers/token/verifyToken.js'

/**
 * Controlador que valida un access token y devuelve el usuario.
 * @param {import('express').Request} req
 * @param {import('express').Response} res
 */
const tokenController = async (req, res) => {
  try {
    const token =
      req.cookies.token ||
      (req.headers.authorization && req.headers.authorization.split(' ')[1])

    if (!token) {
      return res.status(401).json({ message: 'Token no proporcionado' })
    }

    let decoded
    try {
      decoded = verifyToken(token, process.env.JWT_SECRET)
    } catch (error) {
      console.error('Token inválido:', error)
      return res
        .status(error.statusCode || 500)
        .json({ message: error.message })
    }

    const user = await User.findById(decoded.id).select(
      'username email role profileImage'
    )

    if (!user) {
      return res.status(404).json({ message: 'Usuario no encontrado' })
    }

    return res.status(200).json({
      user: {
        id: user._id,
        username: user.username,
        email: user.email,
        role: user.role,
        profileImage: user.profileImage
      }
    })
  } catch (error) {
    console.error('Error interno en tokenController:', error)
    return res.status(500).json({
      message: 'Error en la validación del token',
      error: error.message
    })
  }
}

export default tokenController
