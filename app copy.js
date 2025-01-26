require('dotenv').config() // Cargar las variables de entorno
const express = require('express') // Framework para crear servidores HTTP
const mongoose = require('mongoose') // Configuración de la base de datos
const authRoutes = require('./task-management/routes/authRoutes') // Rutas para autenticación
const errorHandler = require('./task-management/middlewares/errorHandler') // Middleware de manejo de errores
const bcrypt = require('bcrypt')
const jwt = require('jsonwebtoken')
const User = require('./models/user')

const app = express() // Inicializa la aplicación Express
const port = process.env.PORT || 3000 // Define el puerto

// ========================
// Conexión a la base de datos
// ========================
// Conecta la aplicación con la base de datos MongoDB
const dbConectar = process.env.MONGO_URI
mongoose
  .connect(dbConectar, {})
  .then(() => console.log('Conexión a MongoDB establecida'))
  .catch((error) => {
    console.error('Error de conexión a MongoDB:', error)
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
// Respuesta por defecto
app.get('/', (req, res) => {
  res.send('Hello World!')
})

//Endpoind de logueo
app.post('/login', (req, res) => {
  console.log('body', req.body)

  const email = req.body.email
  const password = req.body.password
  if (!email || !password) {
    return res.status(400).send('Email and password required')
  }

  const user = users.find((user) => {
    if (user.email === email && user.password === password) return user
  })
})

//Endpoint para traer todos los usuarios de la BD
app.get('/api/users', async (req, res) => {
  // Corregimos la forma de obtener el token
  const authHeader = req.headers.authorization
  if (!authHeader) {
    return res.status(401).send('No se proporcionó token')
  }
  const token = authHeader.split(' ')[1]

  try {
    const loggedUser = jwt.verify(token, process.env.JWT_SECRET)
    // Agregamos la consulta a la BD que faltaba
    const users = await User.find({})
    res.json(users)
  } catch (error) {
    return res.status(401).send('No Autorizado')
  }
})
//Endpoint para traer un usuario especifico de la BD
app.get('/api/user/:id', async (req, res) => {
  const authHeader = req.headers.authorization
  if (!authHeader) {
    return res.status(401).send('No se proporcionó token')
  }

  const token = authHeader.split(' ')[1]

  try {
    const loggedUser = jwt.verify(token, process.env.JWT_SECRET)
    const user = await User.findById(req.params.id)
    if (!user) {
      return res.status(404).send('Usuario no encontrado')
    }
    res.json(user)
  } catch (error) {
    return res.status(401).send('No Autorizado')
  }
})

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
