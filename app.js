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
import {
  csrfCookieMiddleware,
  csrfProtectionMiddleware
} from './task-management/security/csrf/csrfMiddlewares/csrfMiddleware.js'

//=================================
// Configuración de variables de entorno
//=================================
dotenv.config()

// ===================================
// Instancia express y puerto definido
// ===================================
const app = express()
const port = process.env.PORT || 8080

// =====================================
// Middleware para parsear cookies
// =====================================
app.use(cookieParser())

// =====================================
// Aplicación de middlewares globales
// =====================================
app.use(corsMiddleware) // Aplica CORS antes de definir rutas
app.use(handlePreflight) // Manejar solicitudes preflight (CORS OPTIONS)
applyMiddlewares(app) // Aplica middlewares generales

// =====================================
// Ruta pública para obtener token CSRF
// =====================================
app.get('/api/token/csrf', csrfCookieMiddleware)

// =====================================
// Protección CSRF en rutas sensibles (solo en producción)
// =====================================
if (process.env.NODE_ENV === 'production') {
  app.use(['/api/profile', '/api/user'], csrfProtectionMiddleware)
  app.use('/auth/logout', csrfProtectionMiddleware)
}

// =====================================
// Middleware para depurar cookies recibidas
// Solo se ejecuta en entorno de desarrollo
// =====================================
if (process.env.NODE_ENV === 'development') {
  app.use((req, res, next) => {
    console.log('Cookies recibidas:', req.cookies) // Log estándar de cookies
    console.log('Headers de la solicitud:', req.headers) // Log de todas las cabeceras
    console.log('Header Cookie:', req.headers.cookie) // Muestra lo que realmente se envía en el header "Cookie"
    next()
  })
}

// =====================================
// Conexión a la base de datos MongoDB
// =====================================
connectDB()
  .then(async () => {
    console.log('🙂‍ Conexión a MongoDB establecida')
    await crearAdminPorDefecto()
  })
  .catch((error) => {
    console.error('🤯 Error al conectar con MongoDB:', error)
    process.exit(1)
  })

// ==============================================
// Función para crear el administrador si no existe
// ==============================================
async function crearAdminPorDefecto() {
  try {
    console.log('Verificando la existencia del usuario administrador...')
    const existingAdmin = await User.findOne({ role: 'admin' })
    if (!existingAdmin) {
      console.log('Creando usuario administrador...')
      if (
        !process.env.ADMIN_EMAIL ||
        !process.env.ADMIN_PASSWORD ||
        !process.env.ADMIN_USERNAME
      ) {
        console.error(
          ' 🦽 ERROR: Faltan variables de entorno para el administrador'
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
      console.log('😶‍🌫️ Usuario administrador creado con éxito')
    } else {
      console.log(
        '😉 Admin ya existe en la base de datos, no se ha creado uno nuevo'
      )
    }
  } catch (error) {
    if (process.env.NODE_ENV === 'development') {
      console.error('🦽 Error al crear el administrador:', error)
    }
  }
}

// =====================================
// Rutas para saber que ya esta operativo el servidor en render
// =====================================
app.get('/', (req, res) => {
  res.send('No esperes más, ya estoy listo🔛')
})

// =====================================
// Rutas de la aplicación
// =====================================
app.use('/auth', authRoutes)

// =====================================
// Rutas de email sending
// =====================================
app.post('/send-email', async (req, res) => {
  try {
    console.log(
      'JSON recibido en /send-email:',
      JSON.stringify(req.body, null, 2)
    )

    const { to, subject, message, htmlContent } = req.body

    // Validar que `to` sea un array y tenga al menos un destinatario
    if (!Array.isArray(to) || to.length === 0) {
      return res
        .status(400)
        .send('Error: Se requiere al menos un destinatario.')
    }

    // Validar que cada destinatario tenga un email válido
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

    // Hacemos la llamada a `sendEmail` desde `emailController`
    await sendEmail({
      to,
      subject: subject || 'Usuario registrado con éxito',
      htmlContent:
        htmlContent ||
        `<html><body><p>${message || 'Este email confirma tu registro'}</p></body></html>`
    })

    res.send('Email enviado correctamente')
  } catch (error) {
    console.error('Error al enviar el email', error)
    res.status(500).send('Error al enviar el email')
  }
})

// =====================================
// Middleware Global de Manejo de Errores
// =====================================
app.use(errorHandler)

app.use((req, res, next) => {
  if (!res.headersSent) {
    res.status(404).json({ message: 'Ruta no encontrada' })
  }
  next()
})

app._router.stack.forEach((r) => {
  if (r.route && r.route.path) {
    console.log(r.route.path)
  }
})

// =====================================
// Inicio del Servidor e inicialización de WebSocket
// =====================================
if (process.env.NODE_ENV !== 'test') {
  app.listen(port, () => {
    console.log(`🛰️ Entorno: ${process.env.NODE_ENV}`)
  })
}

export default app
