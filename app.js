require('dotenv').config() // Cargar las variables de entorno
const express = require('express') // Framework para crear servidores HTTP
const mongoose = require('./config/db') // Configuración de la base de datos
const authRoutes = require('./auth/routes/authRoutes') // Rutas para autenticación
const errorHandler = require('./auth/middlewares/errorHandler') // Middleware de manejo de errores

const app = express() // Inicializa la aplicación Express
const port = process.env.PORT || 3000 // Define el puerto

// ========================
// Conexión a la base de datos
// ========================
// Conecta la aplicación con la base de datos MongoDB
mongoose.connect(process.env.MONGO_URI, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
})

// ========================
// Middlewares globales
// ========================
// Habilitar parseo de JSON en las solicitudes
app.use(express.json())

// ========================
// Rutas
// ========================
// Define las rutas principales para autenticación
app.use('/auth', authRoutes)

// ========================
// Manejo de errores
// ========================
// Middleware global para manejar errores
app.use(errorHandler)

//Manejo de rutas no encontradas
app.use((req, res) => {
  res.status(404).json({ error: 'Route not found.' })
})
// ========================
// Inicio del servidor
// ========================
// Inicia el servidor y muestra un mensaje en la consola
app.listen(port, () =>
  console.log(`✅ Servidor ejecutándose en http://localhost:${port}`)
)
