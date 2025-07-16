# Invexly Backend

Este repositorio implementa el backend de Invexly, un servidor Node.js construido con Express, orientado a la gestión de usuarios y comunicación en tiempo real. El proyecto utiliza MongoDB como base de datos principal y sigue una arquitectura MVC (Modelo-Vista-Controlador) para maximizar la claridad y separación de responsabilidades. El código está organizado en carpetas funcionales, priorizando la legibilidad y el mantenimiento.

## Descripción general

- Autenticación y autorización mediante JWT. Las rutas principales de registro, inicio de sesión y validación de tokens se gestionan en `authRoutes.js` y emplean middlewares de seguridad.
- Gestión de perfiles de usuario, incluyendo actualización de nombre, correo, contraseña e imagen de perfil.
- Envío de correos electrónicos transaccionales a través de la API de Brevo (configurada en `brevo.js`).
- Almacenamiento y gestión de imágenes de perfil mediante integración con Cloudinary (`cloudinary.js`).
- Middleware de seguridad y registro de actividad a través de CORS, Helmet y Morgan.
- Pruebas de integración que cubren rutas principales utilizando Vitest y Supertest.

## Organización del proyecto

El repositorio adopta una estructura orientada a la arquitectura MVC, distribuyendo la lógica en capas claras y separadas para facilitar la escalabilidad y la colaboración:

- `app.js`: Punto de entrada de la aplicación y conexión a la base de datos.
- `task-management/`: Controladores, middlewares, rutas y configuraciones relacionadas.
- `models/`: Definición de esquemas de usuario (Mongoose).
- `socket/`: Inicialización y gestión de la comunicación en tiempo real vía Socket.io.
- `test/`: Pruebas de integración.

## Prácticas de desarrollo responsables

El desarrollo del repositorio prioriza la legibilidad, la organización modular y la coherencia en la estructura de carpetas, siguiendo estándares profesionales para facilitar la colaboración y el mantenimiento a largo plazo.

## Dependencias principales

- Express
- Mongoose
- JSON Web Token (JWT)
- Socket.io
- Brevo SDK (correo)
- Cloudinary SDK (imágenes)
- Helmet, CORS y Morgan (seguridad y logging)
- Vitest y Supertest (pruebas)

## Mantenimiento del formato y control de calidad

El proyecto utiliza ESLint y Prettier para asegurar la consistencia del código y el cumplimiento de estándares definidos:

- `"lint": "eslint ."` analiza el código y detecta incumplimientos de las reglas configuradas.
- `"lint:fix": "eslint . --fix"` corrige automáticamente los errores identificados por ESLint.
- `"format": "prettier --write ."` aplica el formato definido en las reglas de Prettier a todos los archivos.

Estos scripts, definidos en `package.json`, permiten mantener la calidad y legibilidad del código a lo largo del ciclo de desarrollo, minimizando errores comunes y facilitando la colaboración.

## Scripts principales

- `"start": "node app.js"`
- `"lint": "eslint ."`
- `"lint:fix": "eslint . --fix"`
- `"format": "prettier --write ."`
- `"test": "vitest"`

## Consideraciones

Este backend constituye una base profesional para aplicaciones que requieren autenticación, gestión de usuarios y comunicación en tiempo real, demostrando integración con servicios externos, pruebas automatizadas y un compromiso con prácticas responsables de desarrollo y organización del código.
