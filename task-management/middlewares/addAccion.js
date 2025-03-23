// Middleware para añadir una acción a una cartera específica
import mongoose from 'mongoose'
import Portfolio from '../../models/portfolio.js'

const addAccion = async (req, res) => {
  try {
    const { portfolioId } = req.params // portfolioId es el Id de la Cartera a la que le voy a agregar una acción
    const { ticker, title, price, cantidad, userId } = req.body // Ticker, nombre de la acción, precio, cantidad e identificador de usuario

    const portfolio = await Portfolio.findOne({
      _id: portfolioId,
      userId: userId
    })

    if (!portfolio) {
      return res.status(404).json({ message: 'Portfolio no encontrado' })
    }

    portfolio.stocks.push({
      ticker,
      title,
      price,
      cantidad
    })

    await portfolio.save()
    res.status(201).json(portfolio)
  } catch (error) {
    res.status(500).json({ message: error.message })
  }
}

export { addAccion }
