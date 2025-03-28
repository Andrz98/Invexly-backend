//Este script permite insertar un portfolio en la base de datos del usuario
//Referenciado por su userId
import mongoose from 'mongoose'
import path from 'path'
import { fileURLToPath } from 'url'
import dotenv from 'dotenv'
import Portfolio from './portfolio.js'

const __filename = fileURLToPath(import.meta.url)
const __dirname = path.dirname(__filename)

dotenv.config({ path: path.join(__dirname, '..', '.env') })

console.log('MONGO_URI:', process.env.MONGO_URI)

// Datos de las carteras
const portfolioData = {
  portfolios: [
    {
      name: 'Energía',
      stocks: [
        { ticker: 'XOM', title: 'Exxon Mobil', price: 105.5, cantidad: 20 },
        {
          ticker: 'CVX',
          title: 'Chevron Corporation',
          price: 156.75,
          cantidad: 15
        },
        { ticker: 'SHEL', title: 'Shell PLC', price: 65.3, cantidad: 25 },
        { ticker: 'BP', title: 'BP plc', price: 38.9, cantidad: 30 },
        { ticker: 'EQNR', title: 'Equinor ASA', price: 28.45, cantidad: 35 },
        { ticker: 'ENB', title: 'Enbridge Inc.', price: 47.2, cantidad: 40 },
        { ticker: 'NEE', title: 'NextEra Energy', price: 72.6, cantidad: 18 },
        { ticker: 'DUK', title: 'Duke Energy', price: 95.25, cantidad: 22 },
        { ticker: 'SO', title: 'Southern Company', price: 68.4, cantidad: 28 },
        { ticker: 'PPL', title: 'PPL Corporation', price: 26.75, cantidad: 45 }
      ]
    },
    {
      name: 'Farmacéuticas',
      stocks: [
        { ticker: 'PFE', title: 'Pfizer Inc.', price: 28.9, cantidad: 50 },
        {
          ticker: 'JNJ',
          title: 'Johnson & Johnson',
          price: 152.3,
          cantidad: 25
        },
        { ticker: 'MRK', title: 'Merck & Co.', price: 115.75, cantidad: 30 },
        { ticker: 'ABBV', title: 'AbbVie Inc.', price: 142.6, cantidad: 20 },
        {
          ticker: 'BMY',
          title: 'Bristol-Myers Squibb',
          price: 62.4,
          cantidad: 35
        },
        {
          ticker: 'GILD',
          title: 'Gilead Sciences',
          price: 72.15,
          cantidad: 40
        },
        { ticker: 'AMGN', title: 'Amgen Inc.', price: 278.9, cantidad: 15 },
        {
          ticker: 'REGN',
          title: 'Regeneron Pharmaceuticals',
          price: 825.5,
          cantidad: 10
        },
        {
          ticker: 'VRTX',
          title: 'Vertex Pharmaceuticals',
          price: 398.75,
          cantidad: 12
        },
        { ticker: 'BIIB', title: 'Biogen Inc.', price: 246.8, cantidad: 18 }
      ]
    },
    {
      name: 'Software',
      stocks: [
        {
          ticker: 'MSFT',
          title: 'Microsoft Corporation',
          price: 410.25,
          cantidad: 15
        },
        {
          ticker: 'ORCL',
          title: 'Oracle Corporation',
          price: 115.6,
          cantidad: 25
        },
        { ticker: 'ADBE', title: 'Adobe Inc.', price: 525.75, cantidad: 10 },
        { ticker: 'CRM', title: 'Salesforce', price: 298.4, cantidad: 18 },
        { ticker: 'INTU', title: 'Intuit Inc.', price: 625.3, cantidad: 8 },
        { ticker: 'NOW', title: 'ServiceNow', price: 715.2, cantidad: 7 },
        { ticker: 'ZS', title: 'Zscaler', price: 185.9, cantidad: 20 },
        { ticker: 'CRWD', title: 'CrowdStrike', price: 320.75, cantidad: 12 },
        { ticker: 'NET', title: 'Cloudflare', price: 95.45, cantidad: 30 },
        { ticker: 'DBX', title: 'Dropbox', price: 24.8, cantidad: 50 }
      ]
    }
  ]
}

// 🔥 Aquí ponemos un 'userId' real que esté en la base de datos
const userId = '67e3362bfc6ef5b1e1998737'

// Conectar a MongoDB
mongoose
  .connect(process.env.MONGO_URI)
  .then(() => {
    console.log('✅ Conectado a MongoDB')
    return addPortfolios(userId, portfolioData) // 🔥 Insertamos todas las carteras
  })
  .catch((err) => console.error('❌ Error al conectar a MongoDB:', err))

// Función para insertar todas las carteras
async function addPortfolios(userId, portfolioData) {
  try {
    console.log('📌 userId recibido:', userId)

    // Iterar sobre cada cartera y guardarla en la base de datos
    for (const portfolio of portfolioData.portfolios) {
      const newPortfolio = new Portfolio({
        userId, // Asignar el userId a cada cartera
        name: portfolio.name,
        stocks: portfolio.stocks || []
      })

      await newPortfolio.save()
      console.log(`✅ Portafolio "${portfolio.name}" agregado correctamente.`)
      console.log(`✅ Guardado:`, JSON.stringify(newPortfolio, null, 2))
    }
  } catch (error) {
    console.error('❌ Error al insertar los portafolios:', error)
  } finally {
    mongoose.connection.close() // 🔥 Cerramos la conexión después de insertar
  }
}

// Cambiamos el module.exports por export default
export default addPortfolios
