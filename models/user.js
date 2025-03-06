import mongoose from 'mongoose'

const userSchema = new mongoose.Schema(
  {
    username: {
      type: String,
      required: true,
      minlength: 3,
      maxlength: 50,
      trim: true,
      lowercase: true
    },
    email: {
      type: String,
      required: true,
      unique: true,
      match: [/^\S+@\S+\.\S+$/, 'El email no es válido'],
      trim: true
    },
    password: {
      type: String,
      required: true,
      minlength: 8,
      validate: {
        validator: function (password) {
          // Solo validar si la contraseña no está hasheada
          return (
            password.startsWith('$2b$') ||
            /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/.test(
              password
            )
          )
        },
        message:
          'La contraseña debe tener al menos 8 caracteres, una mayúscula, una minúscula, un número y un carácter especial.'
      }
    },
    role: {
      type: String,
      default: 'user',
      enum: ['user', 'admin']
    },
    avatar: {
      type: String,
      default: ''
    },
    profileImage: {
      type: String,
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
