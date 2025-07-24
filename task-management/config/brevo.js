import dotenv from 'dotenv'
import Brevo from '@getbrevo/brevo'
// Registro centralizado con Winston
import logger from '../../utils/winstonLogger/loggers.js'

dotenv.config()

export const configureBrevoAPI = () => {
  // Logs de depuración (pueden comentarse en producción si no se desea verbosidad)
  logger.debug('=== DEBUG SMTP CONFIG ===')
  logger.debug('Variables de entorno:', {
    BREVO_API_KEY: process.env.BREVO_API_KEY ? 'Presente' : 'Ausente',
    NODE_ENV: process.env.NODE_ENV
  })

  try {
    const apiKey = process.env.BREVO_API_KEY

    if (!apiKey) {
      throw new Error(
        'BREVO_API_KEY no está definida en las variables de entorno'
      )
    }

    // Configuración del cliente Brevo
    const defaultClient = Brevo.ApiClient.instance
    const apiKeyAuth = defaultClient.authentications['api-key']
    apiKeyAuth.apiKey = apiKey

    // Crear instancia de la API
    const apiInstance = new Brevo.TransactionalEmailsApi(defaultClient)

    // Confirmar configuración en los logs
    logger.info('👌🏽 Brevo configurado correctamente con API Key.')

    return apiInstance
  } catch (error) {
    // Log detallado si ocurre un error durante la configuración
    logger.error('🫸🏽 Error al configurar Brevo:', {
      message: error.message,
      stack: error.stack
    })
    throw error
  }
}

// Instancia única de la API para toda la aplicación
const brevoApiInstance = configureBrevoAPI()

export default brevoApiInstance
