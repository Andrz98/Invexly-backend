// =============================================================
// Importaciones de las dependencias necesarias para el proyecto
// =============================================================
const express = require('express')
const mongoose = require('mongoose')
const authRoutes = require('./task-management/routes/authRoutes')
const errorHandler = require('./task-management/middlewares/errorHandler')
const corsMiddleware = require('./task-management/middlewares/corsMiddleware')
const handlePreflight = require('./task-management/middlewares/handlePreflight')
const cookieParser = require('cookie-parser')
const User = require('./models/user')
require('dotenv').config()

// ===================================
// Instancia express y puerto definido
// ===================================
const app = express()
const port = process.env.PORT || 3000

// =====================================
// Configuración de middlewares globales
// =====================================
app.use(corsMiddleware) // 1️⃣ Permitir solicitudes de diferentes orígenes (CORS)
app.use(express.json()) // 2️⃣ Habilitar parsing de JSON en el body de las solicitudes
app.use(cookieParser()) // 3️⃣ Analizar cookies para la autenticación
app.use(handlePreflight) // 4️⃣ Manejar solicitudes preflight (CORS para métodos OPTIONS)

// =====================================
// Conexión a la base de datos MongoDB
// =====================================
const dbConectar = process.env.MONGO_URI

mongoose
  .connect(dbConectar, {})
  .then(() => {
    console.log('✅ Conexión a MongoDB establecida')
    crearAdminPorDefecto() // Llamamos la función después de la conexión exitosa
  })
  .catch((error) => {
    if (process.env.NODE_ENV === 'development') {
      console.error('❌ Error de conexión a MongoDB:', error) // Solo lo mostramos en modo desarrollo
    }
    process.exit(1) // Finaliza la aplicación si la conexión falla
  })

// ==============================================
// Función para crear el administrador si no existe
// ==============================================
async function crearAdminPorDefecto() {
  try {
    const existingAdmin = await User.findOne({ role: 'admin' }) // Verificamos si ya hay un admin
    if (!existingAdmin) {
      const admin = new User({
        username: process.env.ADMIN_USERNAME || 'Admin',
        email: process.env.ADMIN_EMAIL,
        password: process.env.ADMIN_PASSWORD,
        role: 'admin', // Asignamos el rol de administrador de forma automática
      })
      await admin.save() // Guardamos el admin en la base de datos
      console.log('✅ Admin creado con éxito')
    } else {
      console.log(
        '✅ Admin ya existe en la base de datos, no se ha creado uno nuevo'
      )
    }
  } catch (error) {
    if (process.env.NODE_ENV === 'development') {
      console.error('❌ Error al crear el administrador:', error) // Solo mostramos el error en modo desarrollo
    }
  }
}

// =====================================
// Rutas de la aplicación
// =====================================
app.use('/auth', authRoutes) // Rutas de autenticación

// Ruta para comprobar que el sistema funciona correctamente
app.get('/', (req, res) => {
  res.send('Hello World') // Corregido: era res.setDefaultEncoding
})

// =====================================
// Middleware Global de Manejo de Errores
// =====================================
app.use(errorHandler) // Corregido: era 'app.users', ahora es 'app.use'

// Añadimos también el middleware para manejar rutas no encontradas (404)
app.use((req, res) => {
  res.status(404).json({ message: 'Ruta no encontrada' })
})

// =====================================
// Inicio del Servidor
// =====================================
app.listen(port, () => {
  console.log(`Servidor iniciado en http://localhost:${port}`)
})
