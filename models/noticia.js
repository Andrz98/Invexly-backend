import mongoose from 'mongoose'
import axios from 'axios'
import { getIO } from '../socket/socketserver.js'

const noticiaSchema = new mongoose.Schema({
  titulo: {
    type: String,
    required: true
  },
  descripcion: {
    type: String,
    required: true
  },
  tickers: {
    type: [String],
    required: true
  },
  fuente: {
    type: String,
    required: false
  },
  importancia: {
    type: String,
    enum: ['baja', 'media', 'alta', 'ultimo momento'],
    default: 'media'
  },
  fecha: {
    type: Date,
    default: Date.now
  },
  url: {
    type: String,
    required: true
  },
  userId: {
    // Agrega el campo userId
    type: String,
    required: true // Obligatorio
  }
})

// Función para extraer tickers de un portfolio con la estructura específica
function extractTickersFromPortfolio(portfolioData) {
  console.log(
    'Estructura de datos recibida:',
    JSON.stringify(portfolioData, null, 2)
  )

  try {
    if (Array.isArray(portfolioData)) {
      console.log('Los datos son un array')
      const allTickers = []

      portfolioData.forEach((portfolio) => {
        if (portfolio.stocks && Array.isArray(portfolio.stocks)) {
          portfolio.stocks.forEach((stock) => {
            if (stock.ticker) {
              allTickers.push(stock.ticker)
              console.log(`Ticker encontrado: ${stock.ticker}`)
            }
          })
        }
      })

      return [...new Set(allTickers)]
    }

    if (
      portfolioData &&
      portfolioData.portfolios &&
      Array.isArray(portfolioData.portfolios)
    ) {
      console.log('Los datos tienen estructura objeto.portfolios')
      const allTickers = []

      portfolioData.portfolios.forEach((portfolio) => {
        if (portfolio.stocks && Array.isArray(portfolio.stocks)) {
          portfolio.stocks.forEach((stock) => {
            if (stock.ticker) {
              allTickers.push(stock.ticker)
              console.log(`Ticker encontrado: ${stock.ticker}`)
            }
          })
        }
      })

      return [...new Set(allTickers)]
    }

    console.log(
      'Formato de datos no reconocido, intentando formatos alternativos'
    )

    if (
      portfolioData &&
      portfolioData.stocks &&
      Array.isArray(portfolioData.stocks)
    ) {
      console.log('Los datos tienen estructura objeto.stocks')
      const allTickers = portfolioData.stocks
        .filter((stock) => stock.ticker)
        .map((stock) => stock.ticker)

      allTickers.forEach((ticker) =>
        console.log(`Ticker encontrado: ${ticker}`)
      )
      return [...new Set(allTickers)]
    }

    console.log(
      'No se pudo extraer tickers de la estructura de datos proporcionada'
    )
    return []
  } catch (error) {
    console.error('Error al extraer tickers:', error)
    return []
  }
}

// Método para obtener portfolios de usuarios con manejo de errores mejorado
async function getUserPortfolios(userId) {
  try {
    console.log('Intentando obtener portfolios para userId:', userId)

    // Definir API_URL fuera de los bloques condicionales
    let API_URL
    if (process.env.NODE_ENV === 'production') {
      // Configuración para Render
      API_URL = 'https://tfm-backend-verde.onrender.com'
    } else {
      // Configuración para localhost
      API_URL = 'http://localhost:3000'
    }
    console.log('Api del wevsocket', API_URL)
    const response = await axios.get(`${API_URL}/portfolios?userId=${userId}`)
    console.log('Respuesta recibida. Estado:', response.status)
    console.log('Tipo de datos recibidos:', typeof response.data)

    if (!response.data) {
      console.log('No se recibieron datos en la respuesta')
      return []
    }

    const portfolioTickers = extractTickersFromPortfolio(response.data)
    console.log('Tickers encontrados en portfolios:', portfolioTickers)

    return portfolioTickers
  } catch (error) {
    console.error('Error fetching user portfolios:', error.message)
    if (error.response) {
      console.error('Detalles de la respuesta de error:', {
        status: error.response.status,
        data: error.response.data
      })
    }
    return []
  }
}

// Método para notificar a través de WebSockets cuando se crea una nueva noticia
noticiaSchema.post('save', async function (doc) {
  try {
    console.log('Procesando noticia guardada:', doc.titulo)
    console.log('Tickers de la noticia:', doc.tickers)
    console.log('Usuario:', doc.userId)

    const io = getIO()
    if (!io) {
      console.log('Socket.io no está inicializado')
      return
    }

    // Verifica si userId está definido
    if (!doc.userId) {
      console.log('Usuario no autenticado, no se emite la noticia')
      return
    }

    // Obtener los tickers del portfolio del usuario
    const portfolioTickers = await getUserPortfolios(doc.userId)

    if (!portfolioTickers || portfolioTickers.length === 0) {
      console.log('No hay tickers disponibles en los portfolios')
      console.log('No se emite la noticia porque no hay portfolios asociados')
      return
    }

    // Verificar si hay coincidencia entre los tickers de la noticia y los del portfolio
    const hasMatch = doc.tickers.some((ticker) =>
      portfolioTickers.includes(ticker)
    )

    console.log('¿Hay coincidencia con portfolios?:', hasMatch)

    if (hasMatch) {
      io.emit('FinancialNews', {
        newsId: doc._id,
        title: doc.titulo,
        tickers: doc.tickers,
        fecha: doc.fecha,
        url: doc.url,
        importance: doc.importancia
      })
      console.log(
        'Noticia emitida: coincidencia de tickers encontrada en portfolios'
      )
    } else {
      console.log(
        'Noticia no emitida: ningún ticker coincide con los portfolios de usuarios'
      )
    }
  } catch (error) {
    console.error('Error al procesar/emitir evento de socket:', error)
    try {
      const io = getIO()
      if (io) {
        io.emit('FinancialNews', {
          newsId: doc._id,
          title: doc.titulo,
          tickers: doc.tickers,
          fecha: doc.fecha,
          url: doc.url,
          importance: doc.importancia
        })
        console.log('Noticia emitida como respaldo debido a un error')
      }
    } catch (socketError) {
      console.error('Error al emitir noticia de respaldo:', socketError)
    }
  }
})

// Exportamos el modelo
const Noticia = mongoose.model('Noticia', noticiaSchema)
export { Noticia }
