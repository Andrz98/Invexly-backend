# Guardar el contenido corregido en un archivo Markdown

corrected_markdown = """
# Documentación del Backend - TFM Project

## 1. Configuración del Proyecto

- **Framework:** Express.js para la gestión de rutas y solicitudes HTTP.
- **Base de Datos:** Conexión con MongoDB utilizando Mongoose.
- **Variables de Entorno:** Configuración de entornos usando `.env` para la gestión de datos sensibles.

## 2. Autenticación y Autorización

- **JWT (JSON Web Tokens):** Generación y verificación de tokens para mantener la sesión del usuario.
- **Encriptación:** Uso de bcrypt para encriptar contraseñas antes de almacenarlas.
- **Usuario Administrador:** Creación automática de un usuario administrador si no existe al iniciar el servidor.

## 3. Estructura de Rutas y Controladores

- **authRoutes.js:** Definición de rutas para registro, inicio y cierre de sesión.
- **authController.js:** Lógica para manejar la autenticación de usuarios.
  - **register:** Registro de nuevos usuarios.
  - **login:** Inicio de sesión con validación de credenciales.
  - **signOut:** Cierre de sesión del usuario.

## 4. Middlewares Personalizados

- **validateAuth.js:** Validación de datos de autenticación para asegurar que el usuario y la contraseña estén presentes.
- **corsMiddleware.js:** Configuración avanzada de CORS para permitir solicitudes desde `localhost:5174` y `localhost:3000`.
- **handlePreflight.js:** Gestión de solicitudes preflight para mejorar la compatibilidad con CORS.
- **errorHandler.js:** Manejo global de errores con respuestas personalizadas según el entorno.

## 5. Manejo de Errores y Depuración

- **Modo Desarrollo:** Registro detallado de errores para facilitar la depuración.
- **Respuestas de Error:** Mensajes consistentes y claros para el frontend.

## 6. Gestión de Dependencias y Versionado

- **Limpieza de Dependencias:** Eliminación de Husky y otros paquetes innecesarios.
- **Resolución de Conflictos:** Manejo de conflictos en archivos críticos (`package.json`, `app.js`).
- **Actualización de Dependencias:** Sincronización de `package-lock.json` para garantizar la compatibilidad.

## 7. Parche de Seguridad y Optimización

- **CORS:** Corrección de problemas que bloqueaban solicitudes del frontend.
- **Middleware de Validación:** Optimización para manejar tanto el registro como el inicio de sesión.
- **Gestión de Errores:** Control de errores mejorado para solicitudes fallidas.

## 8. Control de Versiones (Git)

- **Commits Detallados:** Documentación de cada cambio significativo.
- **Gestión de Ramas:** Fusión de ramas secundarias en `main` tras resolver conflictos.
- **Historial de Cambios:** Seguimiento claro de la evolución del proyecto.

## Notas Finales

- Se han implementado mejoras de seguridad y rendimiento.
- La estructura modular facilita la escalabilidad y el mantenimiento del código.
- Se recomienda revisar los commits para entender la progresión del proyecto.

# Nuevas Notas de los Cambios Realizados

## Patch 1.2

# Documentación de Cambios: Backend

## Problema Inicial

El problema principal era que el usuario perdía la sesión activa después de recargar la página. Esto ocurría porque no existía una lógica en el backend que permitiera validar el token JWT guardado en el navegador del usuario.

---

# Completar el archivo Markdown incluyendo la segunda parte

# Nuevas Notas de los Cambios Realizados

## Patch 1.2

# Documentación de Cambios: Backend

## Problema Inicial

El problema principal era que el usuario perdía la sesión activa después de recargar la página. Esto ocurría porque no existía una lógica en el backend que permitiera validar el token JWT guardado en el navegador del usuario.

---

## Cambios Realizados en el Backend

### 1. Creación de la Ruta `/auth/validate-token`

Se añadió un nuevo endpoint en `authRoutes.js` para validar la autenticidad del token JWT:

\`\`\`
const express = require('express');
const { register, login, signOut, validateToken } = require('../controllers/authController');
const validateAuth = require('../middlewares/validateAuth');
const authenticateToken = require('../middlewares/authenticateToken');

const router = express.Router();

// ========================
// Ruta: Registro de Usuario
// ========================
router.post('/register', validateAuth, register);

// ========================
// Ruta: Inicio de Sesión
// ========================
router.post('/login', validateAuth, login);

// ========================
// Ruta: Validación del Token
// ========================
router.get('/validate-token', authenticateToken, validateToken);

// ========================
// Ruta: Cierre de Sesión
// ========================
router.post('/sign-out', signOut);

module.exports = router;
\`\`\`

### 2. Creación del Middleware `authenticateToken.js`

Este middleware verifica si el token enviado desde el cliente es válido:

\`\`\`
const jwt = require('jsonwebtoken');

const authenticateToken = (req, res, next) => {
  const token = req.cookies.token;

  if (!token) {
    return res.status(401).json({ message: 'Token no proporcionado' });
  }

  jwt.verify(token, process.env.JWT_SECRET, (err, user) => {
    if (err) {
      return res.status(403).json({ message: 'Token inválido o expirado' });
    }
    req.user = user; // Adjunta la información del usuario a la solicitud
    next();
  });
};

module.exports = authenticateToken;
\`\`\`

### 3. Actualización de `authController.js`

Se añadió la función `validateToken` para manejar la validación del token:

\`\`\`
exports.validateToken = (req, res) => {
  res.status(200).json({
    message: 'Token válido',
    user: req.user, // Devuelve la información del usuario si el token es válido
  });
};
\`\`\`

### 4. Configuración de Cookies en el Login

Se respeta la configuración inicial proporcionada por Javier. El único cambio es la adición de comentarios para mayor claridad:

\`\`\`javascript
res.cookie('token', token, {
  httpOnly: true, // Solo accesible desde el servidor
  secure: process.env.NODE_ENV === 'production', // Solo en HTTPS en producción
  sameSite: 'lax', // Previene ataques CSRF
  maxAge: 7 * 24 * 60 * 60 * 1000, // Token válido por 7 días
});
\`\`\`

### 5. Conclusiones de los Cambios

- **Antes:** No existía un mecanismo para validar la sesión de usuario en cada recarga.
- **Ahora:** La ruta `/auth/validate-token` y el middleware `authenticateToken` permiten verificar automáticamente si la sesión sigue activa de forma segura.
"""

# Guardar el archivo completo actualizado
file_path = '/mnt/data/Documentacion_Backend_TFM_Project_Completo.md'
with open(file_path, 'w') as file:
    file.write(corrected_markdown)

