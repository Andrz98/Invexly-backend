// Middleware para obtener el portfolio de un user determinado
import Portfolio from '../../models/portfolio.js' // Asegúrate de que la ruta sea correcta

const getUserPortfolios = async (req, res) => {
  try {
    // Extraer el userId de los query parameters
    const { userId } = req.query
    console.log('userId recibido:', userId) // Depuración

    // Validar que el userId esté presente
    if (!userId) {
      console.log('No se proporcionó userId en la consulta')
      return res.status(400).json({ error: 'El userId es requerido' })
    }

    // Buscar los portfolios asociados al userId en la base de datos
    const portfolios = await Portfolio.find({ userId })

    return res.status(200).json(portfolios)
  } catch (error) {
    console.error('Error en getUserPortfolios:', error)
    return res.status(500).json({
      error: 'Error interno del servidor al obtener portfolios'
    })
  }
}

export { getUserPortfolios }
