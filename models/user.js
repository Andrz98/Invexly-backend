import mongoose from 'mongoose'

// =========================================
// Definición del esquema para los usuarios
// =========================================
const userSchema = new mongoose.Schema(
  {
    username: {
      type: String,
      required: true,
      minlength: 3,
      maxlength: 50,
      trim: true,
      lowercase: true // Normaliza a minúsculas para evitar duplicados
    },
    email: {
      type: String,
      required: true,
      unique: true,
      match: [/^\S+@\S+\.\S+$/, 'El email no es válido'],
      trim: true,
      lowercase: true // Normaliza el email a minúsculas
    },
    password: {
      type: String,
      required: true,
      minlength: 8,
      match: [
        /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/,
        'La contraseña debe tener al menos 8 caracteres, una mayúscula, una minúscula, un número y un carácter especial.'
      ]
    },
    role: {
      type: String,
      default: 'user',
      enum: ['user', 'admin']
    },
    avatar: {
      type: String, // URL del avatar predeterminado
      default: ''
    },
    profileImage: {
      type: String, // URL de la imagen personalizada subida por el usuario
      default: ''
    }
  },
  {
    timestamps: true
  }
)

// =========================================
// Exportación del modelo de usuario
// =========================================
export default mongoose.model('User', userSchema)
