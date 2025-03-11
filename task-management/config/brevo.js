import brevo from '@getbrevo/brevo'
// ===============================
// Inicializar la instancia de API
// ===============================
const apiInstance = new brevo.TransactionalEmailsApi()
apiInstance.setApiKey('api-key', process.env.BREVO_API_KEY)

// ========================================
// Función para enviar correos electrónicos
// ========================================
export const sendEmail = (options = {}) => {
  const sendSmtpEmail = new brevo.SendSmtpEmail()

  // =======================================================================
  // Configurar el correo electrónico con opciones o valores predeterminados
  // =======================================================================
  sendSmtpEmail.subject = options.subject || 'My {{params.subject}}'
  sendSmtpEmail.htmlContent =
    options.htmlContent ||
    '<html><body><h1>Common: This is my first transactional email {{params.parameter}}</h1></body></html>'

  sendSmtpEmail.sender = options.sender || {
    name: process.env.EMAIL_SENDER_NAME || 'Admin',
    email: process.env.EMAIL_SENDER_ADDRESS || 'admin@trendPulse.com'
  }

  sendSmtpEmail.to = options.to || []
  sendSmtpEmail.replyTo = options.replyTo || sendSmtpEmail.sender
  sendSmtpEmail.params = options.params || {}

  return apiInstance.sendTransacEmail(sendSmtpEmail)
}

// ==================================================================
// Exportar funciones específicas o un objeto con todas las funciones
// ==================================================================
export default {
  sendEmail
}
