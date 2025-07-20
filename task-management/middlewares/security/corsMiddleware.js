import cors from 'cors'
import corsOptions from '../../config/corsOptions.js'

const corsMiddleware = cors(corsOptions) // Middleware para manejar CORS

export default corsMiddleware
