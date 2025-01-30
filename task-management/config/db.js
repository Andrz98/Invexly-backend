const mongoose = require('mongoose')

const connectDB = async () => {
  try {
    const conn = await mongoose.connect(process.env.MONGO_URI, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    })
    console.log(`✅ MongoDB conectado en: ${conn.connection.host}`)
  } catch (error) {
    console.error(`❌ Error en la conexión a MongoDB: ${error.message}`)
    process.exit(1) // Cierra el proceso si falla la conexión
  }
}

module.exports = connectDB
