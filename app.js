const express = require('express') // Framework para crear servidores HTTP
const mongoose = require('mongoose') // Configuración de la base de datos
const authRoutes = require('./task-management/routes/authRoutes') // Rutas para autenticación
const errorHandler = require('./task-management/middlewares/errorHandler') // Middleware de manejo de errores
const bcrypt = require('bcrypt')
const jwt = require('jsonwebtoken')
const User = require('./models/user')
require('dotenv').config() // Cargar las variables de entorno

const app = express() // Inicializa la aplicación Express
const port = process.env.PORT || 3000 // Define el puerto
const cors = require('cors')
const multer = require('multer') //Para cargar y almacenar la imagen del usuario
const cookieParser = require('cookie-parser')

app.use(cookieParser()) // Middleware para el manejo de las cookies
app.use(express.json())


app.use(cors({
  origin: 'http://localhost:5173', // Permite el acceso desde el frontend en localhost:5173
  credentials: true, // Habilita credenciales
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization']
}))


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

//Endpoint de logueo

app.post('/login', async (req, res) => {
  const { email, password } = req.body

  console.log('Login attempt:', {
    email,
    password: password ? '[HIDDEN]' : 'No password',
    body: req.body,
  })

  try {
    // Find user by email
    const user = await User.findOne({ email })
    console.log('User found:', !!user)

    if (!user) {
      console.log('No user found with email:', email)
      return res.status(401).json({ message: 'Usuario no encontrado' })
    }

    // Check existing users in DB
    const allUsers = await User.find({})
    console.log(
      'Existing users:',
      allUsers.map((u) => ({
        email: u.email,
        username: u.username,
      }))
    )

    // Direct password comparison (temporarily)
    if (user.password !== password) {
      console.log('Password mismatch', {
        storedPassword: user.password,
        inputPassword: password,
      })
      return res.status(401).json({ message: 'Contraseña incorrecta' })
    }

    const token = jwt.sign(
      { userId: user._id, email: user.email },
      process.env.JWT_SECRET,
      { expiresIn: '7d' }
    )

    res.cookie('token', token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax', // Changed from 'strict' to 'lax'
      maxAge: 7 * 24 * 60 * 60 * 1000,
    })

    console.log('Login successful for:', email)
    res.status(200).json({
      message: 'Inicio de sesión exitoso',
      username: user.username,
      email: user.email,
      role: user.role,
      token: token, // Include token in response
    })
  } catch (error) {
    console.error('Login error:', error)
    res.status(500).json({ message: 'Error interno del servidor' })
  }
})

//Endopoint de registro
app.post('/register', async (req, res) => {
  const { username, email, password, role } = req.body
  try {
    // Check if user already exists
    const existingUser = await User.findOne({ email })
    if (existingUser) {
      console.log('Usuario ya existe:', email)
      return res.status(400).json({ message: 'Este email ya está registrado' })
    }

    // Crear un nuevo usuario
    const newUser = new User({
      username,
      email,
      password, // En production, encriptarla
      role: role || 'user'
    })

    await newUser.save()

    // Create token
    const token = jwt.sign(
      { userId: newUser._id, email: newUser.email },
      process.env.JWT_SECRET,
      { expiresIn: '7d' }
    )

    // Set cookie
    res.cookie('token', token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
      maxAge: 7 * 24 * 60 * 60 * 1000,
    })

    res.status(201).json({
      message: 'Usuario registrado exitosamente',
      username: newUser.username,
      email: newUser.email,
      role: newUser.role,
      token: token,
    })
  } catch (error) {
    console.error('Registration error:', error)
    res.status(500).json({ message: 'Error interno del servidor' })
  }
})

//Endpoint para traer todos los usuarios de la BD
app.get('/users', async (req, res) => {
  // Verificar si existe el header de autorización
  const authHeader = req.headers.authorization
  if (!authHeader) {
    return res
      .status(401)
      .json({ message: 'No se proporcionó token de autorización' })
  }

  // Obtener el token
  const token = req.headers.authorization.split(' ')[1]

  try {
    // Verificar el token y decodificar la información del usuario
    const loggedUser = jwt.verify(token, process.env.JWT_SECRET)

    // Verificar si el usuario aún existe en la base de datos
    const userExists = await User.findById(loggedUser.userId)
    if (!userExists) {
      return res.status(401).json({ message: 'Usuario no encontrado' })
    }

    // Verificar si el usuario tiene permisos (por ejemplo, si es admin)
    if (userExists.role !== 'admin') {
      return res
        .status(403)
        .json({ message: 'No tienes permisos para ver la lista de usuarios' })
    }

    // Si todas las verificaciones pasan, obtener la lista de usuarios
    const users = await User.find({}, '-password') // Excluimos el campo password
    res.json(users)
  } catch (error) {
    console.error('Error al verificar token o obtener usuarios:', error)
    if (error.name === 'JsonWebTokenError') {
      return res.status(401).json({ message: 'Token inválido' })
    }
    if (error.name === 'TokenExpiredError') {
      return res.status(401).json({ message: 'Token expirado' })
    }
    return res.status(500).json({ message: 'Error interno del servidor' })
  }
})

// Endpoint para validar el token
app.get('/validate-token', async (req, res) => {
  // Log the incoming request to debug

  const token = req.cookies.token

  if (!token) {
    console.log('No se encontro el token')
    return res.status(401).json({ message: 'No se encontro el token' })
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET)
    const user = await User.findById(decoded.userId)

    if (!user) {
      console.log('Usuario no encontrado')
      return res.status(401).json({ message: ' token invalido ' })
    }

    res.json({
      id: user._id,
      username: user.username,
      email: user.email,
      role: user.role,
    })
  } catch (error) {
    return res.status(401).json({ message: 'Token invalido o expirado' })
  }
})
// Logout
app.post('/logout', (req, res) => {
  res.clearCookie('token')
  res.json({ message: 'Deslogueado correctamente' })
})

//Endpoint para traer un usuario especifico de la BD
app.get('/api/user/:id', async (req, res) => {
  const authHeader = req.headers.authorization
  if (!authHeader) {
    return res.status(401).json({ message: 'No se proporcionó token' })
  }

  const token = authHeader.split(' ')[1]

  try {
    const loggedUser = jwt.verify(token, process.env.JWT_SECRET)
    const user = await User.findById(req.params.id)
    if (!user) {
      return res.status(404).json({ message: 'Usuario no encontrado' })
    }
    res.json(user)
  } catch (error) {
    return res.status(401).json({ message: 'No Autorizado' })
  }
})
//--------------------------------------------------
// Configuración de multer para la carga de imágenes
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, path.join(__dirname, 'src/images'))
  },
  filename: (req, file, cb) => {
    const userId = req.body.id
    cb(null, `${userId}.jpg`)
  },
})

const upload = multer({
  storage,
  fileFilter: (req, file, cb) => {
    // Verificar que el archivo sea una imagen JPG o JPEG
    const filetypes = /jpeg|jpg/
    const mimetype = filetypes.test(file.mimetype)
    const extname = filetypes.test(
      path.extname(file.originalname).toLowerCase()
    )

    if (mimetype && extname) {
      return cb(null, true)
    } else {
      cb(new Error('Solo se permiten archivos JPG o JPEG'))
    }
  },
})

// Endpoint para la carga de la imagen
app.post('/upload-image', upload.single('image'), (req, res) => {
  try {
    if (!req.file) {
      return res
        .status(400)
        .json({ message: 'No se ha proporcionado una imagen' })
    }

    res.status(200).json({
      message: 'Imagen subida con éxito',
      filePath: `/src/images/${req.file.filename}`,
    })
  } catch (error) {
    console.error('Error al subir la imagen:', error)
    res.status(500).json({ message: 'Error interno del servidor' })
  }
})

// ========================
// Inicio del servidor
// ========================
// Inicia el servidor y muestra un mensaje en la consola
app.listen(port, () =>
  console.log(`✅ Servidor ejecutándose en http://localhost:${port}`)
)
// ========================
// Manejo de errores
// ========================
// Middleware global para manejar errores
app.use(errorHandler)

//Manejo de rutas no encontradas
app.use((req, res) => {
  res.status(404).json({ error: 'Route not found.' })
})
