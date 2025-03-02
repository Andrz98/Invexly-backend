import cors from 'cors'

const allowedOrigins = ['http://localhost:5173', 'http://localhost:3000']

const corsMiddleware = cors({
  origin: allowedOrigins, // Lista blanca de dominios permitidos
  credentials: true, // Permite cookies/credenciales
  methods: ['GET', 'POST', 'PUT', 'DELETE'], // Métodos permitidos
  allowedHeaders: [
    'Content-Type',
    'Authorization',
    'Cookie', // Necesario para leer cookies manualmente
  ],
})

export default corsMiddleware
