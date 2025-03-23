// Este script permite insertar noticias a la base de datos

import mongoose from 'mongoose'
import path from 'path'
import { fileURLToPath } from 'url'
import dotenv from 'dotenv'
import Noticia from './noticia.js'

const __filename = fileURLToPath(import.meta.url)
const __dirname = path.dirname(__filename)

dotenv.config({ path: path.join(__dirname, '..', '.env') })

console.log('MONGO_URI:', process.env.MONGO_URI)

const noticias = [
  {
    titulo: 'Apple y Tesla presentan sus nuevos productos',
    descripcion: 'Apple y Tesla anuncian nuevos productos con IA integrada.',
    tickers: ['AAPL', 'TSLA'], // ✅ Ahora es un array
    fuente: 'CNBC',
    importancia: 'alta',
    url: 'https://www.cnbc.com/apple-tesla-products'
  },
  {
    titulo: 'Microsoft compra OpenAI',
    descripcion:
      'Microsoft ha adquirido OpenAI para reforzar su presencia en IA.',
    tickers: ['MSFT', 'GOOGL'], // ✅ Noticia con múltiples empresas
    fuente: 'The Verge',
    importancia: 'ultimo momento',
    url: 'https://www.theverge.com/microsoft-openai'
  },
  {
    titulo: 'Amazon y Meta forman alianza tecnológica',
    descripcion:
      'Las compañías buscan revolucionar el mercado con su tecnología conjunta.',
    tickers: ['AMZN', 'META'], // ✅ Más de un ticker
    fuente: 'Bloomberg',
    importancia: 'media',
    url: 'https://www.bloomberg.com/amazon-meta'
  }
]

// Conectar a MongoDB e insertar las acciones
mongoose
  .connect(process.env.MONGO_URI, {
    // Opcionalmente puedes agregar opciones de conexión aquí si son necesarias
  })
  .then(async () => {
    console.log('Conectado a MongoDB')
    try {
      const resultado = await Noticia.insertMany(noticias)
      console.log('Noticias insertadas exitosamente:', resultado)
    } catch (error) {
      console.error('Error al insertar las noticias:', error)
    } finally {
      await mongoose.connection.close()
      console.log('Conexión cerrada')
    }
  })
  .catch((error) => {
    console.error('Error al conectar a MongoDB:', error)
    process.exit(1)
  })
