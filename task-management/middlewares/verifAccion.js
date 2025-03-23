// Middleware para verificar si una accion existe en un Portfolio
import mongoose from 'mongoose'
import Portfolio from '../../models/portfolio.js' // Asegúrate de que la ruta sea correcta

const verifAccion = async (req, res) => {
  try {
    const { portfolioId, ticker } = req.params

    const portfolio = await Portfolio.findById(portfolioId)
    if (!portfolio) {
      return res.status(404).json({ message: 'Portfolio no encontrado' })
    }

    const existingStock = portfolio.stocks.find(
      (stock) => stock.ticker === ticker
    )

    res.json({
      exists: !!existingStock,
      stock: existingStock
    })
  } catch (error) {
    res.status(500).json({ message: error.message })
  }
}

export { verifAccion }
