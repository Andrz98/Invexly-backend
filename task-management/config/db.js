// Importamos mongoose de la librería para interactuar con MongoDB
const mongoose = require('mongoose')
// Función asincrona para conectar a la base de datos MongoDB, ya que la conexión a la base de datos suele tener un tiempo de espera y no deseamos bloquear el flujo de la aplicación mientras espera la conexión.
const connectDB = async () => {
  try {
    // Intenta conectar a la base de datos usando la URI de la variable de entorno MONGO_URI
    // Usamos await para esperar a que la conexión se establezca
    const conn = await mongoose.connect(process.env.MONGO_URI)
    // Si la conexión es exitosa, muestra un mensaje en la consola
    console.log(`MongoDB Connected: ${conn.connection.host}`)
    // En caso de error, muestra un mensaje de error en la consola
  } catch (error) {
    console.error(`Error: ${error.message}`)
    // Terminación del proceso con un código de salida 1
    process.exit(1)
  }
}

// Exportamos la función connectDB para que pueda ser utilizada en otros archivos
module.exports = connectDB
