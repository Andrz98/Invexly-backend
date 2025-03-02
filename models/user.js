import mongoose from 'mongoose'

// =========================================
// Definición del esquema para los usuarios
// =========================================
const userSchema = new mongoose.Schema({
  username: {
    type: String,
    required: true
  },
  email: {
    type: String,
    required: true,
    unique: true
  },
  password: {
    type: String,
    required: true
  },
  role: {
    type: String,
    default: 'user'
  },
  image: {
    type: String,
    default: ''
  }
})

// =========================================
// Exportación del modelo de usuario
// =========================================
export default mongoose.model('User', userSchema)
