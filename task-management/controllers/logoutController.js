import { invalidTokens } from '../../config/tokenBlacklist.js'

export const logout = (req, res) => {
  try {
    const token = req.cookies.token

    if (!token) {
      return res.status(400).json({ message: 'No hay sesión activa' })
    }

    // Revocar el token agregándolo a la lista de tokens inválidos
    invalidTokens.add(token)

    // Eliminar la cookie en el cliente
    res.clearCookie('token', {
      httpOnly: true,
      secure: true,
      sameSite: 'strict'
    })

    res.json({ message: 'Logout exitoso' })
  } catch (error) {
    res.status(500).json({ message: 'Error en el servidor', error })
  }
}
