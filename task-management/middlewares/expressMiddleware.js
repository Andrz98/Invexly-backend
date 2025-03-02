import express from 'express'
import cookieParser from 'cookie-parser'
import morgan from 'morgan' // Para registrar solicitudes HTTP en la consola
import helmet from 'helmet' // Para mejorar la seguridad de las cabeceras HTTP

const applyMiddlewares = (app) => {
  app.use(express.json()) // Permite recibir JSON en las solicitudes
  app.use(express.urlencoded({ extended: true })) // Permite recibir datos en formularios
  app.use(cookieParser()) // Habilita el análisis de cookies
  app.use(morgan('dev')) // Registra solicitudes en la consola
  app.use(helmet()) // Protege la aplicación con cabeceras HTTP seguras
}

export default applyMiddlewares
