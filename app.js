// =============================================================
// Importaciones de las dependencias necesarias para el proyecto
// =============================================================
import express from 'express'
import dotenv from 'dotenv'
import connectDB from './task-management/config/db.js'
import authRoutes from './task-management/routes/auth/authRoutes.js'
import errorHandler from './task-management/middlewares/errors/errorHandler.js'
import corsMiddleware from './task-management/middlewares/security/corsMiddleware.js'
import handlePreflight from './task-management/middlewares/security/handlePreflight.js'
import applyMiddlewares from './task-management/middlewares/express/expressMiddleware.js'
import emailController from './task-management/controllers/emails/emailController.js'
import { getUserPortfolios } from './task-management/controllers/portfolio/getPortfolio.js'
import { addCartera } from './task-management/controllers/cartera/addCartera.js'
import { borraCartera } from './task-management/controllers/cartera/borraCartera.js'
import { deleteAccion } from './task-management/controllers/acciones/deleteAccion.js'
import { addAccion } from './task-management/controllers/acciones/addAccion.js'
import { getAcciones } from './task-management/controllers/acciones/getAcciones.js'
import { verifAccion } from './task-management/controllers/acciones/verifAccion.js'
import { actualizaAccion } from './task-management/controllers/acciones/actualizaAccion.js'
import { addNoticias } from './task-management/controllers/noticias/addNoticias.js'
import { getIndices } from './task-management/controllers/indices/getIndices.js'
import User from './models/user.js'
import bcrypt from 'bcrypt'
import { init } from './socket/socketserver.js'
import http from 'http' // Importar http para crear el servidor

dotenv.config()

// ===================================
// Instancia express y puerto definido
// ===================================
const app = express()
const port = process.env.PORT || 8080
// Crear el servidor HTTP explícitamente, para poder iniciar WebSockets
const server = http.createServer(app)

// =====================================
// Aplicación de middlewares globales
// =====================================
applyMiddlewares(app) // Aplica middlewares generales
app.use(corsMiddleware) // Aplica CORS antes de definir rutas
app.use(handlePreflight) // Manejar solicitudes preflight (CORS OPTIONS)

// =====================================
// Middleware para depurar cookies recibidas
// =====================================
app.use((req, res, next) => {
  console.log('Cookies recibidas:', req.cookies) // Log estándar de cookies
  console.log('Headers de la solicitud:', req.headers) // Log de todas las cabeceras
  console.log('Header Cookie:', req.headers.cookie) // Muestra lo que realmente se envía en el header "Cookie"
  next()
})

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
// Rutas para manejo de portfolios
// =====================================

//Ruta para obtener las carteras del usuario logueado
app.get('/portfolios', getUserPortfolios)

//Ruta para agregar una cartera nueva al Portfolio
app.post('/portfolios/', addCartera)

//Ruta para borrar una cartera del Portfolio
app.delete('/portfolios/:userId/:portfolioName', borraCartera)

//Ruta para eliminar una accion de una cartera
app.delete('/portfolios/:userId/:portfolioName/stock/:ticker', deleteAccion)

//Ruta para agregar una accion a una cartera
app.post('/portfolios/:portfolioId/stock', addAccion)

// Ruta para obtener el listado de todas las acciones disponibles para operar
app.get('/accions/', getAcciones)

//Ruta para buscar si una accion existe en el portfolio
app.get('/portfolios/:portfolioId/stock/:ticker', verifAccion)

// Ruta para actualizar una acción existente en el portfolio
app.put('/portfolios/:portfolioId/stock/:ticker', actualizaAccion)

//=====================================
//Ruta para guardar las noticias
app.post('/noticias', addNoticias)

//Ruta permitir peticiones desde el frontend
//Las peticiones a Finnhub se haran desde aqui, dado que
//Finnhub no tiene configurados los encabezados CORS necesarios para permitir solicitudes
//desde mi front y me daria problemas de Cors

// Ruta proxy para Finnhub
app.get('/api/quote/', getIndices)

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
    await emailController.sendEmail({
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
  server.listen(port, () => {
    console.log(`🛰️ Servidor iniciado en http://localhost:${port}`)
    // Inicializar Socket.io con el servidor HTTP
    init(server)
  })
}

export default app
