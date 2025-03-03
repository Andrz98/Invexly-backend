import User from '../../models/user.js'

export const getProfile = async (req, res) => {
  try {
    const user = await User.findById(req.user.id).select('-password')

    if (!user) {
      return res.status(404).json({ message: 'Usuario no encontrado' })
    }

    res.status(200).json(user)
  } catch (error) {
    res
      .status(500)
      .json({ message: 'Error al obtener el perfil', error: error.message })
  }
}
