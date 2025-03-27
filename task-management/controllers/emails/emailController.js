/* eslint-disable prettier/prettier */
import Brevo from '@getbrevo/brevo'

// Configuración de la instancia de API con logging detallado
const configureBrevoAPI = () => {
  try {
    console.log('Configurando instancia de Brevo') 

    console.log('Variables de entorno:', {
      BREVO_API_KEY: process.env.BREVO_API_KEY ? 'Presente' : 'Ausente',
      NODE_ENV: process.env.NODE_ENV
    })

    console.log('Detalles de Brevo:', {
      BrevoModule: Brevo,
      ApiClientMethods: Object.keys(Brevo.ApiClient),
      AuthenticationMethods: Object.keys(Brevo.ApiClient.instance.authentications)
    })

    // Verifica que la variable de entorno exista
    if (!process.env.BREVO_API_KEY) {
      throw new Error('API Key de Brevo no configurada') 
    }

    // Obtener el cliente por defecto
    const defaultClient = Brevo.ApiClient.instance

    // Configurar la autenticación
    const apiKey = defaultClient.authentications['api-key']
    apiKey.apiKey = process.env.BREVO_API_KEY

    // Crear la instancia de API transaccional
    const apiInstance = new Brevo.TransactionalEmailsApi(defaultClient)
    
    console.log('Detalles de autenticación:', {
      apiKeyPresent: !!apiKey.apiKey,
      apiKeyLength: apiKey.apiKey.length
    })

    console.log('Instancia de Brevo configurada correctamente') 
    return apiInstance 
  } catch (error) {
    console.error('Error al configurar Brevo:', error) 
    throw error 
  }
} 

// Función de envío de email mejorada

export const sendEmail = async (options = {}) => {
  try {
    console.group('🔔 Envío de Email') 

    // Definir un sender con valores obligatorios
    const senderConfig = {
      name: options.sender?.name || process.env.EMAIL_SENDER_NAME || 'Admin TrendPulse',
      email: options.sender?.email || process.env.EMAIL_SENDER_ADDRESS || 'equipoverde237@gmail.com'
    }

    // Validación de opciones obligatorias
    if (!options.to) {
      throw new Error('Destinatario es obligatorio')
    }
    // Configurar instancia de API
    const defaultClient = Brevo.ApiClient.instance
    const apiKey = defaultClient.authentications['api-key']
    apiKey.apiKey = process.env.BREVO_API_KEY

    const apiInstance = new Brevo.TransactionalEmailsApi(defaultClient)

    const recipientEmail = typeof options.to === 'string' 
      ? options.to 
      : options.to.email

    if (!recipientEmail) {
      throw new Error('Dirección de email del destinatario es obligatoria')
    }


    // Crear el objeto SendSmtpEmail de manera explícita
    const sendSmtpEmail = {
      sender: senderConfig,
      to: [{
        email: recipientEmail,
        name: (typeof options.to === 'object' ? options.to.name : 'Usuario') || 'Usuario'
      }],
      subject: options.subject || 'Bienvenido a TrendPulse',
      htmlContent: options.htmlContent || '<html><body><h1>Gracias por registrarte</h1></body></html>'
    }
    
    
    // Verificaciones adicionales
    console.log('Configuración de sender:', {
      name: sendSmtpEmail.sender.name,
      email: sendSmtpEmail.sender.email
    })

    // Envío de email con manejo de errores detallado
    try {
      const response = await apiInstance.sendTransacEmail(sendSmtpEmail) 
      console.log('✅ Email enviado con éxito:', response) 
      console.groupEnd() 
      return response 
    } catch (sendError) {
      // Registro detallado del error de envío
      console.error('❌ Error detallado al enviar email:', {
        status: sendError.response?.status,
        headers: sendError.response?.headers,
        body: sendError.response?.data,
        message: sendError.message,
        fullError: sendError
      }) 
      
      // Intentar extraer mensaje de error más detallado
      const errorMessage = sendError.response?.data?.message || 
                           sendError.message || 
                           'Error desconocido al enviar email'
      
      throw new Error(`Error de envío: ${errorMessage}`) 
    }
  } catch (error) {
    console.error('❌ Error general en sendEmail:', {
      message: error.message,
      stack: error.stack
    }) 
    console.groupEnd() 
    throw new Error('Hubo un problema enviando el email: ' + error.message) 
  }
}




export default { sendEmail }