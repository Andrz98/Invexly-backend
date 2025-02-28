import cloudinary from './task-management/config/cloudinary.js'

const testCloudinary = async () => {
  try {
    const result = await cloudinary.uploader.upload(
      'https://res.cloudinary.com/demo/image/upload/sample.jpg',
      {
        folder: 'test_uploads',
      }
    )
    console.log('✅ Cloudinary conectado correctamente:')
    console.log(result)
  } catch (error) {
    console.error('❌ Error en la conexión con Cloudinary:', error)
  }
}

testCloudinary()
