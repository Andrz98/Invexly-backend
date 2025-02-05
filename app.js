/* eslint-disable no-unused-vars */
// =============================================================
// Importaciones de las dependencias necesarias para el proyecto
// =============================================================
const express = require('express')
const mongoose = require('mongoose')
const authRoutes = require('./task-management/routes/authRoutes') // ✅ Rutas de autenticación
const errorHandler = require('./task-management/middlewares/errorHandler')
const corsMiddleware = require('./task-management/middlewares/corsMiddleware')
const handlePreflight = require('./task-management/middlewares/handlePreflight')
const cookieParser = require('cookie-parser')
const jwt = require('jsonwebtoken') // Importación de JWT para la gestión de tokens
const User = require('./models/user')
require('dotenv').config()

// ===================================
// Instancia express y puerto definido
// ===================================
const app = express()
const port = process.env.PORT || 3000 // Puerto del servidor

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
const dbConectar = process.env.MONGO_URI

mongoose
  .connect(dbConectar, {})
  .then(() => {
    console.log('Conexión a MongoDB establecida')
    crearAdminPorDefecto() // Llamamos la función después de la conexión exitosa
  })
  .catch((error) => {
    if (process.env.NODE_ENV === 'development') {
      console.error('Error de conexión a MongoDB:', error) // Solo lo mostramos en modo desarrollo
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
      console.log('Admin creado con éxito')
    } else {
      console.log(
        'Admin ya existe en la base de datos, no se ha creado uno nuevo'
      )
    }
  } catch (error) {
    if (process.env.NODE_ENV === 'development') {
      console.error('Error al crear el administrador:', error) // Solo mostramos el error en modo desarrollo
    }
  }
}

// =====================================
// Rutas de la aplicación
// =====================================
app.use('/auth', authRoutes) // ✅ Rutas de autenticación

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
  console.log(`Servidor iniciado en http://localhost:${port}`) // Mensaje de confirmación en la consola
})
