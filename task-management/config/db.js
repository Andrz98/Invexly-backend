const mongoose = require('mongoose')

// Función para conectar a MongoDB
const connectDB = async () => {
  try {
    console.log(' Intentando conectar a MongoDB...')

    await mongoose.connect(process.env.MONGO_URI)

    console.log(`✅ MongoDB conectado en: ${mongoose.connection.host}`)
  } catch (error) {
    console.error(`❌ Error en la conexión a MongoDB: ${error.message}`)
    process.exit(1)
  }
}

module.exports = connectDB
