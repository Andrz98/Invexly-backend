import express from 'express'
import cookieParser from 'cookie-parser'
import morgan from 'morgan'
import helmet from 'helmet'
import logger from '../../../utils/winstonLogger/loggers.js'

const applyMiddlewares = (app) => {
  app.use(express.json())
  app.use(express.urlencoded({ extended: true }))
  app.use(cookieParser())

  // Middleware de seguridad: se puede extender con configuración explícita
  app.use(
    helmet({
      contentSecurityPolicy: false, // Si tienes frontend en otro dominio y necesitas flexibilidad
      crossOriginResourcePolicy: { policy: 'cross-origin' },
      frameguard: { action: 'deny' }
    })
  )

  // Activar morgan solo en desarrollo
  if (process.env.NODE_ENV === 'development') {
    app.use(
      morgan('dev', {
        stream: {
          write: (message) => logger.http(message.trim())
        }
      })
    )
  }

  logger.info('Middlewares de Express aplicados correctamente', {
    entorno: process.env.NODE_ENV
  })
}

export default applyMiddlewares
