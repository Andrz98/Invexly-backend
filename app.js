// =============================================================
// Importaciones de las dependencias necesarias para el proyecto
// =============================================================
import express from 'express'
import connectDB from './task-management/config/db.js'
import authRoutes from './task-management/routes/authRoutes.js'
import errorHandler from './task-management/middlewares/errorHandler.js'
import corsMiddleware from './task-management/middlewares/corsMiddleware.js'
import handlePreflight from './task-management/middlewares/handlePreflight.js'
import cookieParser from 'cookie-parser'
import bcrypt from 'bcrypt'
import dotenv from 'dotenv'
import User from './models/user.js'

dotenv.config()

import { fileURLToPath } from 'url'
import { dirname } from 'path'

const __filename = fileURLToPath(import.meta.url)
const __dirname = dirname(__filename)

// ===================================
// Instancia express y puerto definido
// ===================================
const app = express()
const port = process.env.PORT || 3000

// =====================================
// Configuración de middlewares globales
// =====================================
app.use(corsMiddleware) // Permitir solicitudes de diferentes orígenes (CORS)
app.use(express.json()) // Habilitar parsing de JSON en el body de las solicitudes
app.use(cookieParser()) // Analizar cookies para la autenticación

// =====================================
// Middleware para depurar cookies recibidas
// =====================================
app.use((req, res, next) => {
  console.log('Cookies recibidas:', req.cookies) // Registro de las cookies en cada solicitud
  next() // Permite que la solicitud continúe hacia el siguiente middleware o ruta
})

app.use(handlePreflight) // Manejar solicitudes preflight (CORS para métodos OPTIONS)

// =====================================
// Conexión a la base de datos MongoDB
// =====================================
connectDB()
  .then(async () => {
    console.log('✅ Conexión a MongoDB establecida')
    await crearAdminPorDefecto()
  })
  .catch((error) => {
    console.error('❌ Error al conectar con MongoDB:', error)
    process.exit(1)
  })

// ==============================================
// Función para crear el administrador si no existe
// ==============================================
async function crearAdminPorDefecto() {
  try {
    console.log(' Verificando la existencia del usuario administrador...')
    const existingAdmin = await User.findOne({ role: 'admin' })
    if (!existingAdmin) {
      console.log(' Creando usuario administrador...')
      if (
        !process.env.ADMIN_EMAIL ||
        !process.env.ADMIN_PASSWORD ||
        !process.env.ADMIN_USERNAME
      ) {
        console.error(
          '❌ ERROR: Faltan variables de entorno para el administrador'
        )
        return
      }
      const hashedPassword = await bcrypt.hash(process.env.ADMIN_PASSWORD, 10)
      const admin = new User({
        username: process.env.ADMIN_USERNAME,
        email: process.env.ADMIN_EMAIL,
        password: hashedPassword,
        role: 'admin',
      })
      await admin.save()
      console.log('✅ Usuario administrador creado con éxito')
    } else {
      console.log(
        '⚠️ Admin ya existe en la base de datos, no se ha creado uno nuevo'
      )
    }
  } catch (error) {
    if (process.env.NODE_ENV === 'development') {
      console.error('❌ Error al crear el administrador:', error)
    }
  }
}

// =====================================
// Rutas de la aplicación
// =====================================
app.use('/auth', authRoutes)

// Ruta para comprobar que el sistema funciona correctamente
app.get('/', (req, res) => {
  res.send('Hello World')
})

// =====================================
// Middleware Global de Manejo de Errores
// =====================================
app.use(errorHandler)

app.use((req, res) => {
  res.status(404).json({ message: 'Ruta no encontrada' })
})

// =====================================
// Inicio del Servidor
// =====================================
app.listen(port, () => {
  console.log(`🚀 Servidor iniciado en http://localhost:${port}`)
})

export default app
