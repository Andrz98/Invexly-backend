# Backend de Invexly

Este repositorio implementa un servidor **Node.js** basado en **Express** para la gestión de usuarios y comunicación en tiempo real. El código se organiza en controladores y middlewares dentro de la carpeta `task-management` y utiliza **MongoDB** como base de datos.

## Características principales

- **Autenticación con JWT.** Rutas para registro, inicio de sesión y validación de tokens. Las rutas se definen en `authRoutes.js` y utilizan middlewares de seguridad.
- **Gestión de perfiles.** Operaciones para actualizar nombre de usuario, correo, contraseña e imagen de perfil.
- **Envío de correos con Brevo.** Configuración de la API en `brevo.js` para mandar correos transaccionales.
- **Almacenamiento de imágenes en Cloudinary.** Integración mediante `cloudinary.js`.
- **Middleware de seguridad y registro.** Uso de CORS, Helmet y Morgan.
- **Pruebas de integración.** Suite de pruebas con Vitest y Supertest.

## Scripts disponibles

Los scripts se encuentran en `package.json`:

```json
"start": "node app.js",
"lint": "eslint .",
"test": "vitest"
```

Para ejecutar el servidor de desarrollo se utiliza `npm start`; las pruebas se ejecutan con `npm test`.

## Estructura de carpetas

- `app.js` – punto de entrada de la aplicación y conexión a base de datos.
- `task-management/` – controladores, middlewares, rutas y configuraciones.
- `models/` – definición del esquema `User` de Mongoose.
- `socket/` – inicialización de Socket.io.
- `test/` – pruebas de integración.

## Dependencias principales

El proyecto emplea Express, Mongoose, JWT, Socket.io y otras librerías incluidas en `package.json`.

## Variables de entorno

Se requieren variables como `MONGO_URI`, `JWT_SECRET`, `REFRESH_TOKEN_SECRET`, `BREVO_API_KEY` y credenciales de Cloudinary. Estos valores no están en el repositorio y deben configurarse antes de iniciar el servidor.

