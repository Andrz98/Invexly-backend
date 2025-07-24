import { body } from 'express-validator'

// Validación para el registro de usuario
export const registerValidation = [
  body('username')
    .trim()
    .notEmpty()
    .withMessage('El nombre de usuario es obligatorio')
    .isLength({ min: 3 })
    .withMessage('Debe tener al menos 3 caracteres'),

  body('email')
    .trim()
    .notEmpty()
    .withMessage('El correo electrónico es obligatorio')
    .isEmail()
    .withMessage('Formato de correo no válido'),

  body('password')
    .notEmpty()
    .withMessage('La contraseña es obligatoria')
    .matches(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&]).{8,}$/)
    .withMessage(
      'Debe tener al menos 8 caracteres, una mayúscula, una minúscula, un número y un símbolo'
    )
]

// Validación para el inicio de sesión
export const loginValidation = [
  body('email')
    .trim()
    .notEmpty()
    .withMessage('El correo electrónico es obligatorio')
    .isEmail()
    .withMessage('Formato de correo no válido'),

  body('password').notEmpty().withMessage('La contraseña es obligatoria')
]
