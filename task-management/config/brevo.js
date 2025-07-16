import dotenv from 'dotenv'
import Brevo from '@getbrevo/brevo'

dotenv.config()

export const configureBrevoAPI = () => {
  console.log('Variables de entorno:', {
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

    // Configuración del cliente
    const defaultClient = Brevo.ApiClient.instance
    const apiKeyAuth = defaultClient.authentications['api-key']
    apiKeyAuth.apiKey = apiKey

    // Crear instancia de API
    const apiInstance = new Brevo.TransactionalEmailsApi(defaultClient)

    console.log('Configuración de Brevo:', {
      apiKeyPresent: !!apiKey,
      configurationMethod: 'ApiClient'
    })

    return apiInstance
  } catch (error) {
    console.error('Error al configurar Brevo:', error)
    throw error
  }
}

// Instancia única de la API para reutilizar en toda la aplicación
const brevoApiInstance = configureBrevoAPI()

export default brevoApiInstance
