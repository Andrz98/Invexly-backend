// =============================================================
// Importaciones de las dependencias necesarias para el proyecto
// =============================================================
const express = require('express')
const connectDB = require('./task-management/config/db')
const authRoutes = require('./task-management/routes/authRoutes')
const errorHandler = require('./task-management/middlewares/errorHandler')
const corsMiddleware = require('./task-management/middlewares/corsMiddleware')
const handlePreflight = require('./task-management/middlewares/handlePreflight')
const cookieParser = require('cookie-parser')
const jwt = require('jsonwebtoken') // Importación de JWT para la gestión de tokens
const User = require('./models/user')
const bcrypt = require('bcrypt') // Para el cifrado de contraseñas
require('dotenv').config()

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
    await crearAdminPorDefecto() // Llamamos la función después de la conexión exitosa
  })
  .catch((error) => {
    console.error('❌ Error al conectar con MongoDB:', error)
    process.exit(1) // Cerrar la aplicación en caso de error
  })

// ==============================================
// Función para crear el administrador si no existe
// ==============================================
async function crearAdminPorDefecto() {
  try {
    console.log(' Verificando la existencia del usuario administrador...')

    // Verificamos si el usuario administrador ya existe
    const existingAdmin = await User.findOne({ role: 'admin' })
    if (!existingAdmin) {
      console.log(' Creando usuario administrador...')

      // Verificamos si las variables de entorno están bien cargadas
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

      const hashedPassword = await bcrypt.hash(process.env.ADMIN_PASSWORD, 10) // Encriptación de la contraseña

      const admin = new User({
        username: process.env.ADMIN_USERNAME,
        email: process.env.ADMIN_EMAIL,
        password: hashedPassword, // La contraseña del admin se guarda cifrada para que no se pueda ver con las herramientas de desarrollador del browser.
        role: 'admin',
      })

      await admin.save() // Guardamos el admin en la base de datos
      console.log('✅ Usuario administrador creado con éxito')
    } else {
      console.log(
        '⚠️ Admin ya existe en la base de datos, no se ha creado uno nuevo'
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
  res.send('Hello World') // Respuesta simple para verificar que el servidor funciona
})

// =====================================
// Middleware Global de Manejo de Errores
// =====================================
app.use(errorHandler) // Middleware para manejar errores globalmente

// Middleware para manejar rutas no encontradas (404)
app.use((req, res) => {
  res.status(404).json({ message: 'Ruta no encontrada' }) // Respuesta si la ruta no existe
})

// =====================================
// Inicio del Servidor
// =====================================
app.listen(port, () => {
  console.log(`🚀 Servidor iniciado en http://localhost:${port}`) // Mensaje de confirmación en la consola
})
