# Utilidades de desarrollo

Este directorio agrupa scripts independientes utilizados para verificar la
configuración de servicios externos durante el desarrollo.

- **setup.js**: Comprueba la conexión con MongoDB ejecutando una conexión simple
  y cerrándola inmediatamente.
- **testBrevo.js**: Muestra la estructura del SDK de Brevo para confirmar que la
  instalación es correcta.
- **testCloudinary.js**: Sube una imagen de prueba a Cloudinary y reporta el
  resultado en consola.

Estos archivos no forman parte de la lógica de la aplicación, pero pueden ser de
ayuda para diagnosticar problemas de dependencias o credenciales.
