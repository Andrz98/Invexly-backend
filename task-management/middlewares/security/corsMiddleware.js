import cors from 'cors'

const allowedOrigins = ['http://localhost:5173', 'http://localhost:3000']

const corsOptions = {
  origin: allowedOrigins,
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE'],
  allowedHeaders: ['Content-Type', 'Authorization', 'Cookie']
}

const corsMiddleware = cors(corsOptions)

export default corsMiddleware
