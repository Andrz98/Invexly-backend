# TFM-backend-verde

# Guías disponibles en el README:

# Guía de Uso: Prettier, ESLint y Husky en el Backend

# Guía de uso: Estructura y creación de archivos

# Guía de Uso: Prettier, ESLint y Husky en el Backend

Este archivo explica los comandos básicos y su utilidad para trabajar con **Prettier**, **ESLint** y **Husky** en nuestro proyecto de backend. Consulta esta guía siempre que necesites recordar cómo usar estas herramientas durante el desarrollo.

---

## Índice

1. **Comandos ESLint**
   - Ejecutar ESLint en Todo el Proyecto
   - Corregir Errores de Forma Automática
   - Ejecutar ESLint en Archivos Específicos
   - Comprobar Ayuda de ESLint
2. **Comandos Prettier**
   - Formatear Todo el Código
   - Verificar el Formato sin Modificar el Código
   - Formatear Archivos Específicos
   - Comprobar Ayuda de Prettier
3. **Husky: Automatizando Buenas Prácticas**
   - Verificar Hooks Antes del Commit
   - Simular un Pre-commit Manualmente
4. **Buenas Prácticas**

---

## 1. Comandos ESLint

### **1.1 Ejecutar ESLint en Todo el Proyecto**

```bash
npx eslint .
```

- **Qué hace:** Verifica todos los archivos en busca de errores de estilo o problemas según las reglas configuradas en `eslint.config.js`.
- **Cuándo usarlo:** Al finalizar una funcionalidad o antes de realizar un commit.

---

### **1.2 Corregir Errores de Forma Automática**

```bash
npx eslint . --fix
```

- **Qué hace:** Soluciona automáticamente problemas comunes como la indentación o el uso de comillas.
- **Cuándo usarlo:** Antes de confirmar cambios, para asegurarte de que todo el código cumple con las reglas de estilo.

---

### **1.3 Ejecutar ESLint en Archivos Específicos**

```bash
npx eslint src/routes/api.js
```

- **Qué hace:** Verifica errores en un archivo o carpeta específica.
- **Cuándo usarlo:** Mientras trabajas en un archivo específico, para no procesar todo el proyecto.

---

### **1.4 Comprobar Ayuda de ESLint**

```bash
npx eslint --help
```

- **Qué hace:** Muestra opciones y comandos disponibles en ESLint.
- **Cuándo usarlo:** Si necesitas explorar funcionalidades adicionales o resolver dudas sobre un comando.

---

## 2. Comandos Prettier

### **2.1 Formatear Todo el Código**

```bash
npx prettier --write .
```

- **Qué hace:** Aplica el formato configurado en `.prettierrc` a todo el proyecto.
- **Cuándo usarlo:** Regularmente, para mantener el código limpio y consistente.

---

### **2.2 Verificar el Formato sin Modificar el Código**

```bash
npx prettier --check .
```

- **Qué hace:** Comprueba si el código está bien formateado sin realizar cambios.
- **Cuándo usarlo:** Antes de aplicar cambios, para revisar si ya cumple con las reglas de Prettier.

---

### **2.3 Formatear Archivos Específicos**

```bash
npx prettier --write src/routes/api.js
```

- **Qué hace:** Aplica el formato configurado solo al archivo especificado.
- **Cuándo usarlo:** Cuando trabajas en un archivo y deseas aplicar formato únicamente en él.

---

### **2.4 Comprobar Ayuda de Prettier**

```bash
npx prettier --help
```

- **Qué hace:** Muestra opciones y comandos disponibles en Prettier.
- **Cuándo usarlo:** Si necesitas explorar funcionalidades adicionales o resolver dudas sobre un comando.

---

## 3. Husky: Automatizando Buenas Prácticas

### **3.1 Verificar Hooks Antes del Commit**

Los hooks de Husky están configurados para ejecutar automáticamente los linters en los archivos afectados. Esto incluye:

1. **ESLint:** Verifica problemas de estilo.
2. **Prettier:** Aplica formato en los archivos modificados.

No necesitas ejecutar comandos manualmente; Husky lo hará cuando intentes hacer un commit. Si necesitas probar los linters manualmente, usa:

```bash
npx lint-staged
```

- **Qué hace:** Simula el comportamiento del hook `pre-commit`.
- **Cuándo usarlo:** Si quieres verificar cómo funcionarán los linters antes de hacer un commit.

---

### **3.2 ¿Qué sucede durante un Commit?**

1. **Husky ejecuta los linters configurados en `lint-staged`.**
2. Si los linters detectan errores, el commit se cancela.
3. Una vez corregidos los errores, intenta hacer el commit nuevamente.

---

## 4. Buenas Prácticas

1. **Antes de confirmar cambios, ejecuta:**

   - `npx eslint . --fix` para corregir errores de estilo automáticamente.
   - `npx prettier --write .` para aplicar formato consistente en todo el código.

2. **Mantén las configuraciones actualizadas:**

   - Revisa periódicamente las reglas en `eslint.config.js` y `.prettierrc` para adaptarlas al estilo del equipo.

3. **Confía en Husky:**

   - Deja que Husky automatice la verificación del código antes de confirmar cambios. Esto ahorra tiempo y asegura consistencia.

4. **Corrige errores reportados por Husky:**
   - Si Husky detiene un commit, corrige los problemas y vuelve a intentarlo.

---

---

---

# Guía de uso: Estructura y creación de archivos

# Guía de uso: Estructura y Creación de Archivos

Esta guía describe la estructura del proyecto backend, explica los archivos principales y detalla los pasos necesarios para mantener consistencia y evitar errores durante el desarrollo.

## Índice

1. **Estructura del Proyecto**
2. **Descripción de los Archivos**  
   2.1 authController.js  
   2.2 validateAuth.js  
   2.3 authRoutes.js  
   2.4 user.js  
   2.5 db.js  
   2.6 app.js
3. **Pasos para Crear Nuevos Archivos y Evitar Errores**  
   3.1 Comprender la Estructura  
   3.2 Definir la Funcionalidad  
   3.3 Crear Archivos Consistentes  
   3.4 Evitar Inconsistencias  
   3.5 Probar Cada Archivo  
   3.6 Mantener las Variables Sensibles  
   3.7 Revisar Dependencias
4. **Ejemplo: Crear un Middleware para Autorización**
5. **Conclusión**

---

## 1. Estructura del Proyecto

```plaintext
backend/
├── auth/                      # Funcionalidades de autenticación.
│   ├── controllers/
│   │   └── authController.js  # Lógica de inicio y cierre de sesión.
│   ├── middlewares/
│   │   └── validateAuth.js    # Validación de datos de autenticación.
│   ├── routes/
│   │   └── authRoutes.js      # Rutas para autenticación.
├── models/
│   └── user.js                # Modelo de usuario con Mongoose.
├── config/
│   └── db.js                  # Configuración de la base de datos.
├── app.js                     # Punto de entrada principal.
├── package.json               # Dependencias del proyecto.
├── .env                       # Variables sensibles.
└── README.md                  # Documentación del proyecto.
```

---

## 2. Descripción de los Archivos

### 2.1 authController.js

- **Ubicación**: `auth/controllers/`
- **Responsabilidad**: Gestionar la lógica de negocio para el inicio y cierre de sesión.
- **Principales Funciones**:
  - `signIn`: Busca al usuario, valida su contraseña y genera un token JWT.
  - `signOut`: Finaliza la sesión devolviendo un mensaje de confirmación.

### 2.2 validateAuth.js

- **Ubicación**: `auth/middlewares/`
- **Responsabilidad**: Validar los datos enviados en las solicitudes de autenticación.
- **Principales Tareas**:
  - Verifica que `username` y `password` estén presentes en la solicitud.
  - Devuelve un error 400 si faltan datos.

### 2.3 authRoutes.js

- **Ubicación**: `auth/routes/`
- **Responsabilidad**: Definir las rutas relacionadas con autenticación.
- **Rutas**:
  - `POST /auth/sign-in`: Llama a `signIn` tras validar los datos.
  - `POST /auth/sign-out`: Llama a `signOut`.

### 2.4 user.js

- **Ubicación**: `models/`
- **Responsabilidad**: Modelo de usuario para interactuar con MongoDB usando Mongoose.
- **Atributos**:
  - `username`: Nombre de usuario, único.
  - `password`: Contraseña almacenada de manera segura con hashing.

### 2.5 db.js

- **Ubicación**: `config/`
- **Responsabilidad**: Configurar y manejar la conexión con la base de datos MongoDB.
- **Tareas**:
  - Establece la conexión utilizando la URL en `process.env.MONGO_URI`.
  - Maneja errores de conexión.

### 2.6 app.js

- **Responsabilidad**: Punto de entrada principal de la aplicación.
- **Tareas**:
  - Configura los middlewares globales.
  - Conecta las rutas principales del backend.
  - Inicia el servidor.

---

## 3. Pasos para Crear Nuevos Archivos y Evitar Errores

### 3.1 Comprender la Estructura

- Revisa la estructura del proyecto antes de añadir un nuevo archivo.
- Asegúrate de que el archivo encaje en la carpeta adecuada (e.g., `middlewares`, `routes`, `controllers`).

### 3.2 Definir la Funcionalidad

- Piensa en el propósito del archivo antes de crearlo.
- Usa nombres claros y descriptivos.

### 3.3 Crear Archivos Consistentes

- Sigue las convenciones existentes en el proyecto:
  - Documenta cada archivo con comentarios claros.
  - Incluye descripciones generales y `@param` cuando sea necesario.

### 3.4 Evitar Inconsistencias

- Reutiliza componentes existentes (e.g., middlewares).
- No dupliques lógica. Por ejemplo, extiende o reutiliza `validateAuth.js`.

### 3.5 Probar Cada Archivo

- Asegúrate de probar manualmente o mediante pruebas automatizadas cada nuevo archivo antes de integrarlo.
- Usa herramientas como Postman para endpoints y Jest para pruebas unitarias.

### 3.6 Mantener las Variables Sensibles

- Almacena valores como `JWT_SECRET` y `MONGO_URI` en `.env`.
- Asegúrate de que `.env` esté en `.gitignore`.

### 3.7 Revisar Dependencias

- Verifica que las dependencias necesarias estén correctamente listadas en `package.json`.
- Usa versiones actualizadas y compatibles.

---

## 4. Ejemplo: Crear un Middleware para Autorización

### 4.1 Ubicación

- `auth/middlewares/`

### 4.2 Nombre del Archivo

- `authorize.js`

### 4.3 Propósito

- Verificar que el token JWT sea válido antes de permitir el acceso a rutas protegidas.

### 4.4 Código Base

```javascript
const jwt = require('jsonwebtoken')

/**
 * Middleware para verificar el token JWT.
 *
 * @param {Object} req - Solicitud HTTP.
 * @param {Object} res - Respuesta HTTP.
 * @param {Function} next - Siguiente middleware.
 */
module.exports = (req, res, next) => {
  const token = req.headers['authorization']
  if (!token) {
    return res.status(403).json({ error: 'Acceso denegado' })
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET)
    req.user = decoded // Añade los datos decodificados a la solicitud
    next()
  } catch (err) {
    return res.status(401).json({ error: 'Token inválido' })
  }
}
```

---

## 5. Conclusión

Siguiendo esta guía, los desarrolladores podrán:

1. Mantener la consistencia del proyecto.
2. Evitar errores comunes en la creación de archivos.
3. Facilitar la escalabilidad del backend.

Si surgen dudas, consulta al equipo o revisa ejemplos en el proyecto para asegurarte de que tu implementación se alinea con las mejores prácticas.
