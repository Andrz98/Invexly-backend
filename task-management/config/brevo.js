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

export default apiInstance
