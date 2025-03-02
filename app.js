// =============================================================
// Importaciones de las dependencias necesarias para el proyecto
// =============================================================
import express from 'express'
import dotenv from 'dotenv'
import connectDB from './task-management/config/db.js'
import authRoutes from './task-management/routes/authRoutes.js'
import errorHandler from './task-management/middlewares/errorHandler.js'
import corsMiddleware from './task-management/middlewares/corsMiddleware.js'
import handlePreflight from './task-management/middlewares/handlePreflight.js'
import applyMiddlewares from './task-management/middlewares/expressMiddleware.js'
import User from './models/user.js'
import bcrypt from 'bcrypt'

dotenv.config()

// ===================================
// Instancia express y puerto definido
// ===================================
const app = express()
const port = process.env.PORT || 3000

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
  console.log('Cookies recibidas:', req.cookies) // Registro de cookies en cada solicitud
  next()
})

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
          '❌ ERROR: Faltan variables de entorno para el administrador'
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
