import brevoApi from '../../config/brevo.js'
import Brevo from '@getbrevo/brevo'
import logger from '../../../utils/winstonLogger/loggers.js'

export const sendEmail = async (options = {}) => {
  try {
    const recipientList = (options.to || []).map((r) => r.email).join(', ')
    logger.info(`[EMAIL] Intentando enviar correo a: ${recipientList}`)

    // Validación básica
    if (!options.to || !Array.isArray(options.to) || options.to.length === 0) {
      logger.warn('[EMAIL] Error: Campo "to" faltante o vacío')
      throw new Error('Se requiere al menos un destinatario en el campo "to".')
    }

    options.to.forEach((recipient) => {
      if (
        typeof recipient.email !== 'string' ||
        recipient.email.trim() === ''
      ) {
        logger.warn(`[EMAIL] Email inválido: ${JSON.stringify(recipient)}`)
        throw new Error(
          `Email no válido para el destinatario ${JSON.stringify(recipient)}`
        )
      }
    })

    const sendSmtpEmail = new Brevo.SendSmtpEmail()
    sendSmtpEmail.templateId = options.templateId || 2
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

    logger.debug(
      `[EMAIL] Configuración final: ${JSON.stringify(sendSmtpEmail, null, 2)}`
    )

    const response = await brevoApi.sendTransacEmail(sendSmtpEmail)
    logger.info(`[EMAIL] Enviado correctamente a: ${recipientList}`)

    return response
  } catch (error) {
    logger.error(`[EMAIL] Fallo al enviar email: ${error.message}`, {
      stack: error.stack
    })
    throw new Error('Hubo un problema enviando el email: ' + error.message)
  }
}

export default { sendEmail }
