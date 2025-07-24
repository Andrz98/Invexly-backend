// =========================================
// Configuración de la Base de Datos
// =========================================

import mongoose from 'mongoose'
// Registro centralizado con Winston
import logger from '../../utils/winstonLogger/loggers.js'

const connectDB = async () => {
  try {
    // Log informativo previo a la conexión
    logger.info('Intentando conectar a MongoDB...')

    await mongoose.connect(process.env.MONGO_URI)

    // Log de éxito con detalle del host conectado
    logger.info(`👾 MongoDB conectado en: ${mongoose.connection.host}`)
  } catch (error) {
    // Log de error detallado con mensaje y stack trace
    logger.error(`😵‍💫 Error en la conexión a MongoDB: ${error.message}`, {
      stack: error.stack
    })

    // Detiene el proceso si no se logra conectar
    process.exit(1)
  }
}

export default connectDB
