const express = require('express')
const mongoose = require('mongoose')
const authRoutes = require('./task-management/routes/authRoutes')
const errorHandler = require('./task-management/middlewares/errorHandler')
const jwt = require('jsonwebtoken')
const User = require('./models/user')
require('dotenv').config()

const app = express()
const port = process.env.PORT || 3000
const cors = require('cors')
const cookieParser = require('cookie-parser')

// Middleware configuration
app.use(cookieParser())
app.use(express.json())

app.use(
  cors({
    origin: process.env.FRONTEND_URL || 'http://localhost:5173',
    credentials: true,
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Authorization'],
  })
)

// ========================
// Conexión a la base de datos
// ========================
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
app.use(express.json())

// ========================
// Rutas
// ========================
app.use('/auth', authRoutes)

app.get('/', (req, res) => {
  res.send('Hello World!')
})

// Endpoint de logueo
app.post('/login', async (req, res) => {
  const { email, password } = req.body

  console.log('Login attempt:', {
    email,
    password: password ? '[HIDDEN]' : 'No password',
    body: req.body,
  })

  try {
    const user = await User.findOne({ email })
    console.log('User found:', !!user)

    if (!user) {
      console.log('No user found with email:', email)
      return res.status(401).json({ message: 'Usuario no encontrado' })
    }

    const allUsers = await User.find({})
    console.log(
      'Existing users:',
      allUsers.map((u) => ({
        email: u.email,
        username: u.username,
      }))
    )

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
      sameSite: 'lax',
      maxAge: 7 * 24 * 60 * 60 * 1000,
    })

    console.log('Login successful for:', email)
    res.status(200).json({
      message: 'Inicio de sesión exitoso',
      username: user.username,
      email: user.email,
      role: user.role,
      token: token,
    })
  } catch (error) {
    console.error('Login error:', error)
    res.status(500).json({ message: 'Error interno del servidor' })
  }
})

// Endpoint de registro
app.post('/register', async (req, res) => {
  const { username, email, password, role } = req.body
  try {
    const existingUser = await User.findOne({ email })
    if (existingUser) {
      console.log('Usuario ya existe:', email)
      return res.status(400).json({ message: 'Este email ya está registrado' })
    }

    const newUser = new User({
      username,
      email,
      password,
      role: role || 'user',
    })

    await newUser.save()

    const token = jwt.sign(
      { userId: newUser._id, email: newUser.email },
      process.env.JWT_SECRET,
      { expiresIn: '7d' }
    )

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

// Endpoint para obtener usuarios
app.get('/users', async (req, res) => {
  const authHeader = req.headers.authorization
  if (!authHeader) {
    return res
      .status(401)
      .json({ message: 'No se proporcionó token de autorización' })
  }

  const token = authHeader.split(' ')[1]

  try {
    const loggedUser = jwt.verify(token, process.env.JWT_SECRET)
    const userExists = await User.findById(loggedUser.userId)
    if (!userExists) {
      return res.status(401).json({ message: 'Usuario no encontrado' })
    }

    if (userExists.role !== 'admin') {
      return res
        .status(403)
        .json({ message: 'No tienes permisos para ver la lista de usuarios' })
    }

    const users = await User.find({}, '-password')
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

// Validar token
app.get('/validate-token', async (req, res) => {
  const token = req.cookies.token

  if (!token) {
    console.log('No se encontró el token')
    return res.status(401).json({ message: 'No se encontró el token' })
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET)
    const user = await User.findById(decoded.userId)

    if (!user) {
      console.log('Usuario no encontrado')
      return res.status(401).json({ message: 'Token inválido' })
    }

    res.json({
      id: user._id,
      username: user.username,
      email: user.email,
      role: user.role,
    })
  } catch {
    return res.status(401).json({ message: 'Token inválido o expirado' })
  }
})

// Logout
app.post('/logout', (req, res) => {
  res.clearCookie('token')
  res.json({ message: 'Deslogueado correctamente' })
})

// Endpoint para usuario específico (corregido)
app.get('/api/user/:id', async (req, res) => {
  const authHeader = req.headers.authorization
  if (!authHeader) {
    return res.status(401).json({ message: 'No se proporcionó token' })
  }

  const token = authHeader.split(' ')[1]

  try {
    jwt.verify(token, process.env.JWT_SECRET) // Eliminamos _loggedUser
    const user = await User.findById(req.params.id)
    if (!user) {
      return res.status(404).json({ message: 'Usuario no encontrado' })
    }
    res.json(user)
  } catch {
    return res.status(401).json({ message: 'No Autorizado' })
  }
})

// ========================
// Inicio del servidor
// ========================
app.listen(port, () =>
  console.log(`✅ Servidor ejecutándose en http://localhost:${port}`)
)

// ========================
// Manejo de errores
// ========================
app.use(errorHandler)

app.use((req, res) => {
  res.status(404).json({ error: 'Route not found.' })
})
