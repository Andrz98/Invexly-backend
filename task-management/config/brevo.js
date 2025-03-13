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
    console.log('JSON recibido en sendEmail:', JSON.stringify(options, null, 2))

    // =======================================================================
    // Validar destinatarios antes de enviar el correo
    // =======================================================================
    if (!options.to || !Array.isArray(options.to) || options.to.length === 0) {
      throw new Error(
        // eslint-disable-next-line quotes
        "Error: Se requiere al menos un destinatario en el campo 'to'."
      )
    }

    // Verificar que cada destinatario tenga un email válido (string no vacío)
    options.to.forEach((recipient) => {
      if (
        typeof recipient.email !== 'string' ||
        recipient.email.trim() === ''
      ) {
        throw new Error(
          `Error: Email no válido para el destinatario ${JSON.stringify(recipient)}`
        )
      }
    })

    // =======================================================================
    // Configurar el correo electrónico con opciones o valores predeterminados
    // =======================================================================
    const sendSmtpEmail = new Brevo.SendSmtpEmail()

    sendSmtpEmail.subject = options.subject || 'My {{params.subject}}'
    sendSmtpEmail.htmlContent =
      options.htmlContent ||
      '<html><body><h1>Contenido por defecto</h1></body></html>'

    sendSmtpEmail.sender = options.sender || {
      name: process.env.EMAIL_SENDER_NAME || 'Admin',
      email: process.env.EMAIL_SENDER_ADDRESS || 'equipoverde237@gmail.com'
    }

    sendSmtpEmail.to = options.to
    sendSmtpEmail.replyTo = options.replyTo || {
      email: 'support@trendPulse.com',
      name: 'Soporte'
    }

    sendSmtpEmail.params =
      options.params && Object.keys(options.params).length > 0
        ? options.params
        : { placeholder: 'default' }

    console.log(
      'Configuración final del email:',
      JSON.stringify(sendSmtpEmail, null, 2)
    )

    // =======================================================================
    // Enviar el correo
    // =======================================================================
    const response = await apiInstance.sendTransacEmail(sendSmtpEmail)
    console.log('Email enviado con éxito:', response)
    return response
  } catch (error) {
    console.error('Error al enviar el email:', error)
    throw new Error('Hubo un problema enviando el email: ' + error.message)
  }
}

// ==================================================================
// Exportar la función para ser utilizada en otros módulos
// ==================================================================
export default { sendEmail }
