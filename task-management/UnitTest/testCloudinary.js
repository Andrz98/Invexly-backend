import cloudinary from '../config/cloudinary.js'

/**
 * Script de utilidad para comprobar la configuración de Cloudinary.
 * Sube una imagen de prueba y muestra el resultado por consola para
 * confirmar que las credenciales y la red funcionan correctamente.
 */

const testCloudinary = async () => {
  try {
    const result = await cloudinary.uploader.upload(
      'https://res.cloudinary.com/demo/image/upload/sample.jpg',
      {
        folder: 'test_uploads'
      }
    )
    console.log('👾 Cloudinary conectado correctamente:')
    console.log(result)
  } catch (error) {
    console.error('❌ Error en la conexión con Cloudinary:', error)
  }
}

testCloudinary()
