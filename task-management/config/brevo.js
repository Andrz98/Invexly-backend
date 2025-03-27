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

// Función de envío de email
export const sendEmail = async (options = {}) => {
  try {
    // Validación de parámetros
    if (!options.to || !options.to.email) {
      throw new Error('Destinatario (email) es obligatorio')
    }

    // Configurar instancia de API
    const apiInstance = configureBrevoAPI()

    // Preparar email con formato correcto
    const sendSmtpEmail = new Brevo.SendSmtpEmail({
      subject: options.subject || 'Bienvenido a TrendPulse',
      htmlContent:
        options.htmlContent ||
        '<html><body><h1>Gracias por registrarte</h1></body></html>',
      sender: {
        name: options.sender?.name || process.env.EMAIL_SENDER_NAME || 'Admin',
        email:
          options.sender?.email ||
          process.env.EMAIL_SENDER_ADDRESS ||
          'equipoverde237@gmail.com'
      },
      // Formato correcto para destinatarios
      to: [
        {
          email: options.to.email,
          name: options.to.name || 'Usuario'
        }
      ]
    })

    // Envío de email
    const response = await apiInstance.sendTransacEmail(sendSmtpEmail)
    console.log('Email enviado con éxito:', response)
    return response
  } catch (error) {
    console.error('Error en el envío de email:', {
      message: error.message,
      response: error.response?.data
    })
    throw new Error(`Hubo un problema enviando el email: ${error.message}`)
  }
}

export default { sendEmail, configureBrevoAPI }
