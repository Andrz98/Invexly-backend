import mongoose from 'mongoose'

// Modelo de una acción dentro de la cartera
const StockSchema = new mongoose.Schema({
  ticker: { type: String, required: true },
  title: { type: String, required: true },
  price: { type: Number, required: true },
  cantidad: { type: Number, required: true, default: 0 } // Agregado el campo cantidad
})

// Modelo de cartera
const PortfolioSchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, required: true }, // ✅ Solo guardamos el ID sin referencia a "User"
  name: { type: String, required: true },
  stocks: [StockSchema]
})

// Evita sobreescribir el modelo si ya está definido
const Portfolio =
  mongoose.models.Portfolio || mongoose.model('Portfolio', PortfolioSchema)

// Exportamos el modelo
export default Portfolio
