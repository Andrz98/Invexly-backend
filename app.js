require('dotenv').config() // Cargar las variables de entorno
const express = require('express')
const cors = require('cors')
const connectDB = require('./task-management/config/db')

const app = express()
const port = process.env.PORT || 3000

// ========================
// Conexión a MongoDB
// ========================
connectDB()

// ========================
// Middlewares globales
// ========================
app.use(cors())
app.use(express.json())

// ========================
// Inicio del servidor
// ========================
app.listen(port, () => {
  console.log(`✅ Servidor ejecutándose en http://localhost:${port}`)
})
