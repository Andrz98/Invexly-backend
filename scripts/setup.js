// test/vitest.setup.js

// Importación del módulo de conexión a MongoDB
import mongoose from 'mongoose'

// beforeAll: Se ejecuta antes de cualquier test
// Se asegura de establecer una única conexión a la base de datos de pruebas
beforeAll(async () => {
  if (mongoose.connection.readyState === 0) {
    const uri =
      process.env.MONGO_TEST_URI || 'mongodb://127.0.0.1:27017/testdb-auth'
    await mongoose.connect(uri)
    console.log('MongoDB conectada desde vitest.setup.js')
  }
})

// afterAll: Se ejecuta después de todos los tests
// Se encarga de limpiar la base de datos de pruebas y cerrar la conexión
afterAll(async () => {
  await mongoose.connection?.dropDatabase?.()
  await mongoose.disconnect()
  console.log('MongoDB desconectada desde vitest.setup.js')
})
