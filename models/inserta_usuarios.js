const mongoose = require('mongoose')
const User = require('./user') // Ajusta la ruta según tu estructura de archivos

// URL de conexión a MongoDB - ajusta según tu configuración
const MONGODB_URI =
  'mongodb+srv://jmontanari:Contra99$@cluster0.kebgz.mongodb.net/finanzas'

// Array con los datos de los usuarios de prueba
const usuarios = [
  {
    username: 'usuario1',
    email: 'user1@ejemplo.com',
    password: '111111',
    role: 'user',
    image: 'image1',
  },
  {
    username: 'admin',
    email: 'admin@ejemplo.com',
    password: 'administrador',
    role: 'admin',
    image: 'image2',
  },
  {
    username: 'usuario2',
    email: 'usuario2@ejemplo.com',
    password: '222222',
    role: 'user',
    image: 'image3',
  },
  {
    username: 'usuario3',
    email: 'usuario3@ejemplo.com',
    password: '333333',
    role: 'user',
    image: 'image4',
  },
  {
    username: 'usuario4',
    email: 'usuario4@ejemplo.com',
    password: '444444',
    role: 'user',
    image: 'image5',
  },
  {
    username: 'usuario5',
    email: 'usuario5@ejemplo.com',
    password: '555555',
    role: 'user',
    image: 'image6',
  },
]

// Función para insertar los usuarios
async function insertarUsuarios() {
  try {
    // Conectar a MongoDB
    await mongoose.connect(MONGODB_URI)
    const db = mongoose.connection.useDb('finanzas')
    console.log('Conexión a MongoDB establecida')

    // Eliminar usuarios existentes (opcional)
    await User.deleteMany({})
    console.log('Usuarios existentes eliminados')

    // Insertar los nuevos usuarios
    const usuariosCreados = await User.create(usuarios)
    console.log(
      'Usuarios creados exitosamente:',
      usuariosCreados.map((u) => u.username)
    )

    // Cerrar la conexión
    await mongoose.connection.close()
    console.log('Conexión a MongoDB cerrada')
  } catch (error) {
    console.error('Error al insertar usuarios:', error)
    await mongoose.connection.close()
  }
}

// Ejecutar la función
insertarUsuarios()
