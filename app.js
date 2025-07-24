import express from 'express'
import dotenv from 'dotenv'
import connectDB from './task-management/config/db.js'
import authRoutes from './task-management/routes/authRoutes.js'
import errorHandler from './task-management/middlewares/errors/errorHandler.js'
import corsMiddleware from './task-management/security/cors/middlewares/corsMiddleware.js'
import handlePreflight from './task-management/security/preflight/handlePreflight.js'
import applyMiddlewares from './task-management/middlewares/express/expressMiddleware.js'
import { sendEmail } from './task-management/controllers/emails/emailController.js'
import User from './models/user.js'
import bcrypt from 'bcrypt'
import cookieParser from 'cookie-parser'
import logger from '../../../utils/winstonLogger/loggers.js'

dotenv.config()

const app = express()
const port = process.env.PORT || 8080

app.use(cookieParser())
app.use(corsMiddleware)
app.use(handlePreflight)
applyMiddlewares(app)

if (process.env.NODE_ENV === 'development') {
  app.use((req, res, next) => {
    logger.debug('Cookies recibidas:', req.cookies)
    logger.debug('Headers de la solicitud:', req.headers)
    logger.debug('Header Cookie:', req.headers.cookie)
    next()
  })
}

connectDB()
  .then(async () => {
    logger.info('🙂‍ Conexión a MongoDB establecida')
    await crearAdminPorDefecto()
  })
  .catch((error) => {
    logger.error('🤯 Error al conectar con MongoDB:', {
      message: error.message,
      stack: error.stack
    })
    process.exit(1)
  })

async function crearAdminPorDefecto() {
  try {
    logger.info('Verificando la existencia del usuario administrador...')
    const existingAdmin = await User.findOne({ role: 'admin' })

    if (!existingAdmin) {
      logger.info('Creando usuario administrador...')

      if (
        !process.env.ADMIN_EMAIL ||
        !process.env.ADMIN_PASSWORD ||
        !process.env.ADMIN_USERNAME
      ) {
        logger.error(
          '🦽 ERROR: Faltan variables de entorno para el administrador'
        )
        return
      }

      const hashedPassword = await bcrypt.hash(process.env.ADMIN_PASSWORD, 10)
      const admin = new User({
        username: process.env.ADMIN_USERNAME,
        email: process.env.ADMIN_EMAIL,
        password: hashedPassword,
        role: 'admin'
      })

      await admin.save()
      logger.info('😶‍🌫️ Usuario administrador creado con éxito')
    } else {
      logger.info(
        '😉 Admin ya existe en la base de datos, no se ha creado uno nuevo'
      )
    }
  } catch (error) {
    if (process.env.NODE_ENV === 'development') {
      logger.error('🦽 Error al crear el administrador:', {
        message: error.message,
        stack: error.stack
      })
    }
  }
}

app.get('/', (req, res) => {
  res.send('No esperes más, ya estoy listo🔛')
})

app.use('/auth', authRoutes)

app.post('/send-email', async (req, res) => {
  try {
    logger.debug('JSON recibido en /send-email:', req.body)

    const { to, subject, message, htmlContent } = req.body

    if (!Array.isArray(to) || to.length === 0) {
      return res
        .status(400)
        .send('Error: Se requiere al menos un destinatario.')
    }

    to.forEach((recipient) => {
      if (
        typeof recipient.email !== 'string' ||
        recipient.email.trim() === ''
      ) {
        return res
          .status(400)
          .send(
            `Error: Email no válido para el destinatario ${JSON.stringify(recipient)}`
          )
      }
    })

    await sendEmail({
      to,
      subject: subject || 'Usuario registrado con éxito',
      htmlContent:
        htmlContent ||
        `<html><body><p>${message || 'Este email confirma tu registro'}</p></body></html>`
    })

    res.send('Email enviado correctamente')
  } catch (error) {
    logger.error('Error al enviar el email', {
      message: error.message,
      stack: error.stack
    })
    res.status(500).send('Error al enviar el email')
  }
})

app.use(errorHandler)

app.use((req, res, next) => {
  if (!res.headersSent) {
    res.status(404).json({ message: 'Ruta no encontrada' })
  }
  next()
})

app._router.stack.forEach((r) => {
  if (r.route && r.route.path) {
    logger.info(`Ruta registrada: ${r.route.path}`)
  }
})

if (process.env.NODE_ENV !== 'test') {
  app.listen(port, () => {
    logger.info(`🛰️ Entorno: ${process.env.NODE_ENV}`)
  })
}

export default app
