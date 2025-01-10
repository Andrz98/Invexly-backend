# TFM-backend-verde

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
