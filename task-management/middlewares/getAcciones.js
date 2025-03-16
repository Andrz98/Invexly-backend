// Middleware para obtener todas las acciones disponibles para operar
import Accion from '../../models/accion.js'; // Asegúrate de que la ruta sea correcta

const getAcciones = async (req, res) => {
  try {
    // Buscar todas las acciones en la colección "accions"
    const accions = await Accion.find({});

    // Responder con la lista de acciones
    res.status(200).json({ message: "Acciones obtenidas correctamente", accions });
    // console.log('Mensaje luego de obtener las acciones:', accions); // Log de las acciones obtenidas
  } catch (error) {
    console.error("❌ Error al obtener las acciones:", error.message); // Usar error.message para ver el mensaje de error
    res.status(500).json({ message: "Error al obtener las acciones" }); // Enviar respuesta de error al cliente
  }
};

export { getAcciones };