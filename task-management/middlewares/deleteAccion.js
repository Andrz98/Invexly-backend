// Middleware para borrar una acción de una cartera específica
import Portfolio from '../../models/portfolio.js' // Asegúrate de que la ruta sea correcta

const deleteAccion = async (req, res) => {
  try {
    const { userId, ticker, portfolioName } = req.params

    // Verificar que todos los parámetros necesarios estén presentes
    if (!userId || !portfolioName || !ticker) {
      return res.status(400).json({
        success: false,
        message: 'Se requieren userId, portfolioName y ticker'
      })
    }

    const portfolio = await Portfolio.findOne({
      userId: userId,
      name: portfolioName
    })

    if (!portfolio) {
      return res.status(404).json({
        success: false,
        message: 'Portafolio no encontrado'
      })
    }

    // Eliminar la acción del array de acciones
    portfolio.stocks = portfolio.stocks.filter(
      (stock) => stock.ticker !== ticker
    )
    await portfolio.save()

    // Responder con éxito
    res
      .status(200)
      .json({ message: 'Acción eliminada correctamente', portfolio })
  } catch (error) {
    console.error('❌ Error al eliminar la acción:', error)
    res.status(500).json({ message: 'Error al eliminar la acción' })
  }
}

export { deleteAccion }
