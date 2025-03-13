import dotenv from 'dotenv'
import Brevo from '@getbrevo/brevo'

// ===============================
// Cargar variables de entorno
// ===============================
dotenv.config()

// ===============================
// Inicializar la instancia de API
// ===============================
const apiInstance = new Brevo.TransactionalEmailsApi()

// Configuración de la API Key
apiInstance.apiClient.authentications['api-key'].apiKey =
  process.env.BREVO_API_KEY

// ========================================
// Función para enviar correos electrónicos
// ========================================
export const sendEmail = async (options = {}) => {
  try {
    const sendSmtpEmail = new Brevo.SendSmtpEmail()

    // =======================================================================
    // Validar destinatarios antes de enviar el correo
    // =======================================================================
    if (!options.to || options.to.length === 0) {
      throw new Error(
        'Error: Se requiere al menos un destinatario en el campo "to".'
      )
    }

    // =======================================================================
    // Configurar el correo electrónico con opciones o valores predeterminados
    // =======================================================================
    sendSmtpEmail.subject = options.subject || 'My {{params.subject}}'
    sendSmtpEmail.htmlContent =
      options.htmlContent ||
      '<html><body><h1>Common: This is my first transactional email {{params.parameter}}</h1></body></html>'

    sendSmtpEmail.sender = options.sender || {
      name: process.env.EMAIL_SENDER_NAME || 'Admin',
      email: process.env.EMAIL_SENDER_ADDRESS || 'equipoverde237@gmail.com'
    }

    sendSmtpEmail.to = options.to
    sendSmtpEmail.replyTo = options.replyTo || {
      email: 'support@trendPulse.com',
      name: 'Soporte'
    }

    sendSmtpEmail.params = options.params || {
      parameter: 'Default param',
      subject: 'Funcionó'
    }

    // =======================================================================
    // Enviar el correo con manejo de promesas usando `await`
    // =======================================================================
    const response = await apiInstance.sendTransacEmail(sendSmtpEmail)
    console.log('API call successful. Returned data:', JSON.stringify(response))
    return 'Email enviado correctamente'
  } catch (error) {
    console.error('Error en sendEmail:', error)
    throw new Error('Hubo un problema enviando el email')
  }
}

// ==================================================================
// Exportar funciones específicas o un objeto con todas las funciones
// ==================================================================
export default { sendEmail }
