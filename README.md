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

- **validateAuth.js:** Validación de datos de autenticación para asegurar que usuario y contraseña están presentes.
- **corsMiddleware.js:** Configuración avanzada de CORS para permitir solicitudes desde `localhost:5174` y `localhost:3000`.
- **handlePreflight.js:** Gestión de solicitudes preflight para mejorar la compatibilidad con CORS.
- **errorHandler.js:** Manejo global de errores con respuestas personalizadas según el entorno.

## 5. Manejo de Errores y Debugging

- **Modo Desarrollo:** Registro detallado de errores para facilitar la depuración.
- **Respuestas de Error:** Mensajes consistentes y claros para el frontend.

## 6. Gestión de Dependencias y Versionado

- **Limpieza de Dependencias:** Eliminación de Husky y otros paquetes innecesarios.
- **Resolución de Conflictos:** Manejo de conflictos en archivos críticos (`package.json`, `app.js`).
- **Actualización de Dependencias:** Sincronización de `package-lock.json` para garantizar compatibilidad.

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
