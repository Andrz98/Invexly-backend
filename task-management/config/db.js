// =========================================
// Configuración de la Base de Datos
// =========================================

import mongoose from 'mongoose'

const connectDB = async () => {
  try {
    console.log('Intentando conectar a MongoDB...')
    await mongoose.connect(process.env.MONGO_URI)
    console.log(`👾 MongoDB conectado en: ${mongoose.connection.host}`)
  } catch (error) {
    console.error(`❌ Error en la conexión a MongoDB: ${error.message}`)
    process.exit(1)
  }
}

export default connectDB
