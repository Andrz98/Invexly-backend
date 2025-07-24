import { v2 as cloudinary } from 'cloudinary'
import dotenv from 'dotenv'
// Importación del logger centralizado
import logger from '../../../utils/winstonLogger/loggers.js'

dotenv.config()

try {
  // Configuración de credenciales de Cloudinary
  cloudinary.config({
    cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
    api_key: process.env.CLOUDINARY_API_KEY,
    api_secret: process.env.CLOUDINARY_API_SECRET
  })

  // Confirmación en logs de que la configuración fue exitosa
  logger.info('👌🏽Cloudinary configurado correctamente.')
} catch (error) {
  // Registro de errores si la configuración falla
  logger.error('🫸🏽Error al configurar Cloudinary:', {
    message: error.message,
    stack: error.stack
  })
  throw error
}

export default cloudinary
