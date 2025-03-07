import jwt from 'jsonwebtoken'
import User from '../../models/user.js'

const validateToken = async (req, res) => {
  try {
    const token =
      req.cookies.token ||
      (req.headers.authorization && req.headers.authorization.split(' ')[1])

    if (!token) {
      return res.status(401).json({ message: 'Token no proporcionado' })
    }

    let decoded
    try {
      decoded = jwt.verify(token, process.env.JWT_SECRET)
    } catch (error) {
      console.error('Error al verificar el token:', error)
      return res.status(401).json({ message: 'Token inválido o expirado' })
    }

    const user = await User.findById(decoded.id)
    if (!user) {
      return res.status(401).json({ message: 'Usuario no encontrado' })
    }

    console.log('Usuario devuelto en validateToken:', user)

    res.json({
      message: 'Token válido',
      username: user.username,
      email: user.email,
      role: user.role,
      profileImage: user.profileImage
    })
  } catch (error) {
    console.error('Error en validateToken:', error)
    res
      .status(500)
      .json({ message: 'Error en validación', error: error.message })
  }
}

export default validateToken
