import cors from 'cors'
import corsOptions from '../config/corsOptions.js'
import logger from '../../../../utils/winstonLogger/loggers.js'

const corsMiddleware = cors(corsOptions)

logger.info('Middleware CORS registrado con opciones personalizadas', {
  mode: process.env.NODE_ENV
})

export default corsMiddleware
