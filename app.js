// =============================================================
// Importaciones de las dependencias necesarias para el proyecto
// =============================================================
const express = require('express')
const mongoose = require('mongoose')
const authRoutes = require('./task-management/routes/authRoutes')
const errorHandler = require('./task-management/middlewares/errorHandler')
const corsMiddleware = require('./task-management/middlewares/corsMiddleware')
const handlePreflight = require('./task-management/middlewares/handlePreflight')
const jwt = require('jsonwebtoken')
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
app.use(corsMiddleware)
app.use(handlePreflight)
app.use(cookieParser())
app.use(express.json())
// Este es el orden correcto de los middlewares

// =====================================
// Conexión a la base de datos MongoDB
// =====================================

const dbConectar = process.env.MONGO_URI

mongoose
  .connect(dbConectar, {})
  .then(() => {
    console.log('✅ Conexión a MongoDB establecida')
    crearAdminPorDefecto() // ✅ Llamamos la función después de la conexión exitosa
  })
  .catch((error) => {
    if (process.env.NODE_ENV === 'development') {
      console.error('❌ Error de conexión a MongoDB:', error) // Solo lo mostramos en modo desarrollo
    }
    process.exit(1) // Finaliza la aplicación si la conexión falla
  })

// ==============================================
// Función para crear el admistrador si no existe
// ==============================================
async function crearAdminPorDefecto() {
  try {
    // Buscamos el usuario admin en la base de datos
    const existingAdmin = await User.findOne({ role: 'admin' }) // Verificamos si ya hay un admin
    if (!existingAdmin) {
      const admin = new User({
        username: process.env.ADMIN_USERNAME || 'Admin',
        email: process.env.ADMIN_EMAIL,
        password: process.env.ADMIN_PASSWORD,
        role: 'admin', // Asignamos el rol de administrador de forma automática
      })
      await admin.save() // Guardamos el admin en la base de datos
      console.log('✅ Admin creado con éxito')
    } else {
      console.log(
        '✅ Admin ya existe en la base de datos, no se ha creado uno nuevo'
      )
    }
  } catch (error) {
    if (process.env.NODE_ENV === 'development') {
      console.error('❌ Error al crear el administrador:', error) // ✅ Solo mostramos el error en modo desarrollo
    }
  }
}

crearAdminPorDefecto()

// =====================================
// Rutas de la aplicación
// =====================================
app.use('/auth', authRoutes) // Rutas de autenticación

// Ruta para comprobar que el sistema funciona correctamente
app.get('/', (req, res) => {
  res.send('Hello World') // Corregido: era res.setDefaultEncoding
})

// =====================================
// Endpoints de Logueo
// =====================================

app.post('/login', async (req, res) => {
  const { email, password } = req.body

  try {
    const user = await User.findOne({ email }) // Corregido: 'user' a 'User' con mayúscula
    if (!user) {
      return res.status(401).json({ message: 'Usuario no encontrado' }) //retornamos un error si el usuario no existe
    }

    if (user.password !== password) {
      return res.status(401).json({ message: 'Contraseña incorrecta' }) //retornamos un error si la contraseña es incorrecta
    }

    const token = jwt.sign(
      { userId: user._id, email: user.email },
      process.env.JWT_SECRET, // Clave secreta para firmar el token
      { expiresIn: '7d' } // Tiempo de expiración del token
    )

    // Ahora debemos configurar la cookie para almacenar el token JWT de forma segura
    res.cookie('token', token, {
      httpOnly: true, // solo es accesible desde el servidor
      secure: process.env.NODE_ENV === 'production', // solo es accesible en entornos de producción
      sameSite: 'lax', // previene los ataques CSFR (Cross-Site Request Forgery), también conocidos como "Falsificaciín de solicitudes entre sitios", siendo este un tipo de vulnerabilidad de seguridad en las applicaciones web
      maxAge: 7 * 24 * 60 * 60 * 1000, // Tiempo de expiración de la cookie en milisegundos (7 dias)
    })

    // Respuesta exitosa de la solicitud del usuario
    res.status(200).json({
      message: 'Inicio de sesión exitoso',
      username: user.username,
      email: user.email,
      role: user.role,
      token: token,
    })
  } catch (error) {
    if (process.env.NODE_ENV === 'development') {
      console.error('Error en el servidor:', error) // Solo lo mostramos en modo desarrollo
    }
    res.status(500).json({ message: 'Error interno del servidor' })
  }
})

// =====================================
// Endpoints de Registro
// =====================================

app.post('/register', async (req, res) => {
  const { username, email, password } = req.body // Se extraen los datos del cuerpo de la solicitud

  try {
    const existingUser = await User.findOne({ email }) // Corregido: 'user' a 'User' con mayúscula
    if (existingUser) {
      return res.status(400).json({ message: 'El usuario ya existe' })
      // retornamos un error si el usuario ya existe
    }

    const newUser = new User({
      username,
      email,
      password,
      role: 'user', // De esta manera dejamos el role de 'user' por defecto
    })
    await newUser.save() // Guarda el nuevo usuario en la base de datos

    const token = jwt.sign(
      { userId: newUser._id, email: newUser.email },
      process.env.JWT_SECRET, // Clave secreta para firmar el token
      { expiresIn: '7d' } // Tiempo de expiración del token
    )

    // Ahora debemos configurar la cookie para almacenar el token JWT de forma segura
    res.cookie('token', token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax', // previene los ataques CSFR (Cross-Site Request Forgery), tambien conocidos como "Falsificacion de solicitudes entre sitios", siendo este un tipo de vulnerabilidad de seguridad en las aplicaciones web.
      maxAge: 7 * 24 * 60 * 60 * 1000,
    })

    // Respuesta exitosa de la solicitud del usuario
    res.status(201).json({
      message: 'Usuario registrado exitosamente',
      username: newUser.username,
      email: newUser.email,
      role: newUser.role, // Siempre será 'user'
      token: token,
    })
  } catch (error) {
    if (process.env.NODE_ENV === 'development') {
      console.error('Error en el servidor:', error) // Solo lo mostramos en modo desarrollo
    }
    res.status(500).json({ message: 'Error interno del servidor' })
  }
})

// =====================================
// Inicio del Servidor
// =====================================

app.listen(port, () => {
  console.log(`Servidor iniciado en http://localhost:${port}`)
})

// =====================================
// Middleware Global de Manejo de Errores
// =====================================
app.use(errorHandler) // Corregido: era 'app.users', ahora es 'app.use'

// Añadimos también el middleware para manejar rutas no encontradas (404)
app.use((req, res) => {
  res.status(404).json({ message: 'Ruta no encontrada' }) // Corregido: faltaban paréntesis en la función
})
