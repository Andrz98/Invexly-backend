require('dotenv').config()
const express = require('express')
// const mongoose = require('mongoose')
// const authRoutes = require('./task-management/routes/authRoutes')
const errorHandler = require('./task-management/middlewares/errorHandler')

const app = express()
const port = process.env.PORT || 3000

// ========================
// Conexión a la base de datos
// ========================
app.get('/', (req, res) => {
  res.send('Hello, world!')
})

// mongoose
//  .connect(
//    process.env.MONGODB_URI || 'mongodb://localhost:27017/your-database-name'
//  )
//  .then(() => console.log('✅ Conectado a MongoDB'))
//  .catch((err) => console.error('❌ Error conectando a MongoDB:', err))

// Importar modelos

// ========================
// Middlewares globales
// ========================

// ========================
// Rutas
// ========================

// ========================
// Manejo de errores
// ========================
app.use(errorHandler)

app.use((req, res) => {
  res.status(404).json({ error: 'Route not found.' })
})

// ========================
// Inicio del servidor
// ========================
app.listen(port, () =>
  console.log(`✅ Servidor ejecutándose en http://localhost:${port}`)
)
