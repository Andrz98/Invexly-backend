// Middleware para añadir una noticia
import { Noticia } from '../../models/noticia.js' // Asegúrate de que la ruta sea correcta

const addNoticias = async (req, res) => {
  console.log('Recibida petición POST a /noticias')
  console.log('Datos recibidos:', req.body)
  try {
    const noticia = new Noticia(req.body)
    await noticia.save()
    res.status(201).json(noticia)
  } catch (error) {
    res.status(500).json({ message: error.message })
  }
}

export { addNoticias }
