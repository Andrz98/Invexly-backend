import cors from 'cors'

const allowedOrigins = ['http://localhost:5173', 'http://localhost:3000']

const corsMiddleware = (req, res, next) => {
  res.header('Access-Control-Allow-Credentials', 'true') // Asegura que los navegadores acepten credenciales
  cors({
    origin: allowedOrigins,
    credentials: true,
    methods: ['GET', 'POST', 'PUT', 'DELETE'],
    allowedHeaders: ['Content-Type', 'Authorization', 'Cookie']
  })(req, res, next)
}

export default corsMiddleware
