// Middleware para añadir una acción a una cartera específica
import mongoose from 'mongoose'
import Portfolio from '../../models/portfolio.js'

const actualizaAccion = async (req, res) => {
  try {
    const { portfolioId, ticker } = req.params
    const { cantidad, price } = req.body

    const portfolio = await Portfolio.findById(portfolioId)
    if (!portfolio) {
      return res.status(404).json({ message: 'Portfolio no encontrado' })
    }

    const stockIndex = portfolio.stocks.findIndex(
      (stock) => stock.ticker === ticker
    )
    if (stockIndex === -1) {
      return res
        .status(404)
        .json({ message: 'Acción no encontrada en el portfolio' })
    }

    // Actualizar la cantidad y el precio
    portfolio.stocks[stockIndex].cantidad += cantidad
    portfolio.stocks[stockIndex].price = price

    await portfolio.save()
    res.json(portfolio)
  } catch (error) {
    res.status(500).json({ message: error.message })
  }
}

export { actualizaAccion }
