// Middleware para agregar una Cartera
import Portfolio from '../../models/portfolio.js'

const addCartera = async (req, res) => {
  try {
    const { userId, name, stocks } = req.body // userId es el identificador del usuario, name es el nombre de la cartera,
    // stocks es el nombre de una acción, si es que quiero agregarla cuando creo la cartera

    // Validar que el userId esté presente
    if (!userId) {
      console.log('No se proporcionó userId en la consulta')
      return res.status(400).json({ error: 'El userId es requerido' })
    }

    // ⚡ Validación básica
    if (!userId || !name) {
      return res
        .status(400)
        .json({ message: 'userId y name son obligatorios.' })
    }

    // 🌟 Crear la cartera
    const nuevaCartera = new Portfolio({
      userId,
      name,
      stocks: stocks || [] // Si no se pasan acciones, inicializa vacío
    })

    // 💾 Guardar en la base de datos
    const carteraGuardada = await nuevaCartera.save()
    res.status(201).json(carteraGuardada) // ✅ Respuesta exitosa
  } catch (error) {
    console.error('Error en addCartera:', error)
    return res.status(500).json({
      error: 'Error interno del servidor guardar portfolio nuevo'
    })
  }
}

export { addCartera }
