import mongoose from 'mongoose'

/**
 * Script de utilidad para comprobar la conexión con MongoDB.
 * Permite verificar de manera aislada que las credenciales y la
 * red son correctas antes de ejecutar las pruebas o levantar el
 * servidor de desarrollo.
 */

const uri =
  process.env.MONGO_TEST_URI ||
  'mongodb+srv://andresdavidgr2898:FBeXisVBdldRBlfw@finance.v4nq4j2.mongodb.net/?retryWrites=true&w=majority&appName=Finance'

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
