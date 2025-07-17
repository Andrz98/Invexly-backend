# Invexly Backend

Este repositorio implementa el backend de Invexly, una API REST desarrollada en Node.js y Express que gestiona la autenticación, el registro y la administración de usuarios. Se integra de forma directa y segura con el frontend de Invexly.

## Descripción general

- **Registro y autenticación:**  
  Permite el registro de nuevos usuarios, la autenticación con credenciales y la gestión de tokens de acceso. Las contraseñas se validan bajo criterios estrictos y se almacenan cifradas con bcrypt. El sistema utiliza JWT y cookies seguras (`httpOnly`, `secure`, `sameSite`) para manejar la sesión y la protección de la información.

- **Gestión de perfiles:**  
  Los usuarios pueden actualizar su nombre, correo electrónico, contraseña y avatar. Las imágenes de perfil se almacenan y gestionan a través de Cloudinary.

- **Middleware y seguridad:**  
  Se emplean middlewares como helmet para fortalecer las cabeceras HTTP, cors para restringir orígenes y morgan para registrar accesos. El control de CORS se realiza mediante dominios definidos en variables de entorno, asegurando que solo los orígenes autorizados puedan comunicarse con la API.

- **Notificaciones por correo:**  
  Brevo (Sendinblue) se utiliza para enviar correos transaccionales y de bienvenida tras el registro.

- **Pruebas automatizadas:**  
  El proyecto incluye pruebas con Vitest y Supertest que validan los principales flujos de autenticación, gestión de perfil y cierre de sesión.

## Arquitectura y prácticas

- **Arquitectura MVC:**  
  El código está organizado bajo el patrón Modelo-Vista-Controlador, facilitando el mantenimiento y la escalabilidad.

- **Validación y protección:**  
  Todas las entradas de usuario se validan antes de procesarse. Las contraseñas nunca se almacenan en texto plano y los tokens solo se exponen en cookies protegidas.

- **Control de calidad:**  
  Se emplean ESLint y Prettier para asegurar la consistencia y calidad del código. Los scripts definidos en `package.json` permiten analizar, corregir y formatear automáticamente el código.

- **Integración y despliegue:**  
  El backend está preparado para desplegarse en Render y se integra de forma segura con el frontend desplegado en Netlify. El control de CORS y la gestión de orígenes se realiza mediante la variable de entorno `ALLOWED_ORIGINS`.

## Pruebas y documentación de peticiones HTTP

- **Postman:**  
  Colecciones para validar y documentar flujos de autenticación, gestión de usuario y subida de avatar.

- **RapidAPI Client:**  
  Pruebas y validación de endpoints en tiempo real durante el desarrollo, facilitando la iteración y el debugging.

## Estructura del Proyecto

```
src/
├── config/
│ ├── brevo.js
│ ├── cloudinary.js
│ └── db.js
├── controllers/
│ ├── authController.js
│ └── userController.js
├── middlewares/
│ ├── authMiddleware.js
│ ├── errorHandler.js
│ └── corsHandle.js
├── models/
│ └── User.js
├── routes/
│ ├── authRoutes.js
│ └── userRoutes.js
├── test/
│ ├── login.test.js
│ └── profile.test.js
└── app.js

```
---


Además, existe un directorio `utils/` para scripts de verificación y utilidades (conexión a MongoDB, Brevo, Cloudinary, etc).

## Mantenimiento del formato y control de calidad

El proyecto utiliza ESLint y Prettier para asegurar la consistencia del código y el cumplimiento de estándares definidos:

- `"lint": "eslint ."` analiza el código y detecta incumplimientos de las reglas configuradas.
- `"lint:fix": "eslint . --fix"` corrige automáticamente los errores identificados por ESLint.
- `"format": "prettier --write ."` aplica el formato definido en las reglas de Prettier a todos los archivos.

## Scripts principales

- `"start"`: ejecuta el servidor principal (`node app.js`)
- `"dev"`: inicia el entorno de desarrollo con Nodemon
- `"test"`: ejecuta la suite de pruebas con Vitest
- `"test:coverage"`: muestra el reporte de cobertura de pruebas con Vitest

## Dependencias destacadas

- Express
- Mongoose
- bcrypt
- jsonwebtoken (JWT)
- Cloudinary
- Brevo
- ESLint
- Prettier
- Vitest
- Supertest
- Morgan
- Helmet
- CORS
- Nodemon

## Despliegue y configuración

El backend se despliega en Render y acepta conexiones solo de dominios definidos en la variable de entorno `ALLOWED_ORIGINS`.  
Variables obligatorias: `MONGO_URI`, `JWT_SECRET`, `REFRESH_TOKEN_SECRET`, `BREVO_API_KEY` y credenciales de Cloudinary.

## Consideraciones

Este backend proporciona una solución robusta para la autenticación y gestión de usuarios, con especial énfasis en la seguridad, el mantenimiento y la integración efectiva con el frontend de Invexly.  
La estructura modular, las prácticas de calidad y la cobertura de pruebas aseguran que el proyecto sea confiable, escalable y fácil de mantener.

