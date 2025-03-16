// Middleware para borrar una Cartera
import Portfolio from '../../models/portfolio.js' // Asegúrate de que la ruta sea correcta

const borraCartera = async (req, res) => {
  try {
    const { userId, portfolioName } = req.params // userId es el identificador del usuario. portfolioName es el nombre de la Cartera

    // Verificar que los parámetros necesarios estén presentes
    if (!userId || !portfolioName) {
      return res.status(400).json({
        success: false,
        message: 'Se requieren userId y portfolioName'
      })
    }

    // Buscar y eliminar el portafolio
    const result = await Portfolio.findOneAndDelete({
      userId: userId,
      name: portfolioName
    })

    // Verificar si se encontró y eliminó el portafolio
    if (!result) {
      return res.status(404).json({
        success: false,
        message: `No se encontró el portafolio "${portfolioName}" para el usuario especificado`
      })
    }

    // Respuesta exitosa
    res.status(200).json({
      success: true,
      message: `Portafolio "${portfolioName}" eliminado exitosamente`,
      deleted: result
    })
  } catch (error) {
    console.error('Error en addCartera:', error)
    return res.status(500).json({
      error: 'Error interno del servidor guardar portfolio nuevo'
    })
  }
}

export { borraCartera }
