import mongoose from 'mongoose';

// Definimos el esquema para la acción
const accionSchema = new mongoose.Schema({
  id: {
    type: String,
    required: true,
  },
  ticker: {
    type: String,
    required: true,
    unique: true,
  },
  title: {
    type: String,
    required: true,
  },
  price: {
    type: String,
  },
  change: {
    type: String,
  },
});

// Exportamos el modelo para interactuar con MongoDB
const Accion = mongoose.model('Accion', accionSchema);

export default Accion;