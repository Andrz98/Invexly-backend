import mongoose from 'mongoose'

/**
 * Script de utilidad para comprobar la conexión con MongoDB.
 * Permite verificar de manera aislada que las credenciales y la
 * red son correctas antes de ejecutar las pruebas o levantar el
 * servidor de desarrollo.
 */

/**
 * Obtiene la URI de MongoDB desde la variable de entorno MONGO_TEST_URI.
 * Si la variable no está definida, se informa del error y se detiene la ejecución.
 */
const uri = process.env.MONGO_TEST_URI

if (!uri) {
  console.error('❌ La variable de entorno MONGO_TEST_URI no está definida')
  process.exit(1)
}

const testConnection = async () => {
  try {
    await mongoose.connect(uri)
    console.log('✅ Conexión exitosa a MongoDB ✅')
  } catch (error) {
    console.error('❌ Error de conexión a MongoDB:', error.message)
  } finally {
    await mongoose.disconnect()
  }
}

testConnection()
