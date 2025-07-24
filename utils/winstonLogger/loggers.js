import winston from 'winston'
import path from 'path'
import fs from 'fs'

// Se crea la carpeta de paths
const logDir = path.resolve('logs')
if (!fs.existsSync(logDir)) {
  fs.mkdirSync(logDir)
}

// Niveles personalizados de log (puedes usar los de winston por defecto también)
const levels = {
  error: 0,
  warn: 1,
  info: 2,
  http: 3,
  debug: 4
}

// Colores en consola solo en entorno desarrollo
winston.addColors({
  error: 'red',
  warn: 'yellow',
  info: 'green',
  http: 'magenta',
  debug: 'gray'
})

// Formato común para todos los logs
const format = winston.format.combine(
  winston.format.timestamp({ format: 'YYYY-MM-DD HH:mm:ss' }),
  winston.format.errors({ stack: true }),
  winston.format.printf(({ timestamp, level, message, stack }) => {
    return stack
      ? `[${timestamp}] ${level}: ${message} - ${stack}`
      : `[${timestamp}] ${level}: ${message}`
  })
)

// Transportes (archivo y consola)
const transports = [
  new winston.transports.File({
    filename: path.join(logDir, 'error.log'),
    level: 'error'
  }),
  new winston.transports.File({
    filename: path.join(logDir, 'combined.log')
  })
]

if (process.env.NODE_ENV !== 'production') {
  transports.push(
    new winston.transports.Console({
      format: winston.format.combine(
        winston.format.colorize({ all: true }),
        format
      )
    })
  )
}

// Instancia del logger principal
const logger = winston.createLogger({
  level: 'info',
  levels,
  format,
  transports
})

export default logger
