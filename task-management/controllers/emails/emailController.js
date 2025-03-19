import apiInstance from '../../config/brevo.js'
import Brevo from '@getbrevo/brevo'

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

    // Verificar que cada destinatario tenga un email válido
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
    // Configurar el correo electrónico
    // =======================================================================
    const sendSmtpEmail = new Brevo.SendSmtpEmail()

    sendSmtpEmail.templateId = options.templateId || 2 // 2 es el número Id de la plantilla que he creado en Brevo
    sendSmtpEmail.to = options.to
    sendSmtpEmail.params = options.params || {}

    sendSmtpEmail.sender = options.sender || {
      name: process.env.EMAIL_SENDER_NAME || 'support@trendPulse',
      email: process.env.EMAIL_SENDER_ADDRESS || 'equipoverde237@gmail.com'
    }

    sendSmtpEmail.replyTo = options.replyTo || {
      email: 'support@trendPulse.com',
      name: 'Soporte'
    }

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

// Exportar función para ser utilizada en otros módulos
export default { sendEmail }
