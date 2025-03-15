import jwt from 'jsonwebtoken'
import User from '../../../models/user.js' // Se mantiene la ruta de tu código

const validateToken = async (req, res) => {
  try {
    // Obtiene el token desde las cookies o el header Authorization
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

    // Obtener datos actualizados desde la base de datos
    const user = await User.findById(decoded.id).select(
      'username email role profileImage'
    )

    if (!user) {
      return res.status(401).json({ message: 'Usuario no encontrado' })
    }

    console.log('Usuario devuelto en validateToken:', user) // Útil para depuración en desarrollo

    res.json({
      message: 'Token válido',
      id: user._id,
      username: user.username,
      email: user.email,
      role: user.role, // Se mantiene en la respuesta si es necesario
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
