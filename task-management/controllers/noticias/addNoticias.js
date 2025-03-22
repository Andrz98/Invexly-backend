import { Noticia } from '../../../models/noticia.js'

const addNoticias = async (req, res) => {
  console.log('Recibida petición POST a /noticias')
  console.log('Datos recibidos:', req.body)
  console.log('userId recibido:', req.body.userId)
  console.log('Tipo de userId:', typeof req.body.userId)
  
  // Verifica que userId exista
  if (!req.body.userId) {
    console.error('Error: userId no proporcionado en la petición')
    return res.status(400).json({ message: 'userId es requerido' })
  }
  
  try {
    // Crea un objeto de datos verificado para asegurarnos que userId está presente
    const noticiaData = {
      ...req.body,
      userId: req.body.userId
    }
    
    const noticia = new Noticia(noticiaData)
    await noticia.save()
    console.log('Noticia guardada exitosamente con userId:', noticia.userId)
    res.status(201).json(noticia)
  } catch (error) {
    console.error('Error al guardar noticia:', error)
    res.status(500).json({ message: error.message })
  }
};

export { addNoticias }