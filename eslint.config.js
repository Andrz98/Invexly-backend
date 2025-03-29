// Importamos los módulos necesarios para la configuración de ESLint

import js from '@eslint/js' // Configuración base de ESLint

import prettierPlugin from 'eslint-plugin-prettier' // Integración con Prettier

import nodePlugin from 'eslint-plugin-node' // Plugin específico para Node.js

import globals from 'globals' // Definición de variables globales para Node.js

export default [
  // ✅ Configuración base recomendada de ESLint

  js.configs.recommended,

  {
    // 🔹 Archivos a analizar

    files: ['**/*.js'], // Se aplicará ESLint a todos los archivos .js

    // 🔹 Archivos o carpetas a ignorar

    ignores: ['node_modules/**', 'dist/**', 'coverage/**'], // Evitamos analizar dependencias y archivos generados

    // 🔹 Opciones de lenguaje para ESLint

    languageOptions: {
      ecmaVersion: 'latest', // Usar la última versión de ECMAScript

      sourceType: 'module', // Configurar para trabajar con ECMAScript Modules (ESM)

      globals: {
        ...globals.node // Incluir variables globales de Node.js para evitar errores en ESLint
      }
    },

    // 🔹 Plugins utilizados

    plugins: {
      node: nodePlugin, // Reglas específicas para Node.js

      prettier: prettierPlugin // Integración con Prettier para formateo automático
    },

    // 🔹 Reglas personalizadas de ESLint

    rules: {
      // ✅ Integración con Prettier para mantener formato de código unificado

      'prettier/prettier': [
        'error', // Marcar como error si no se respeta el formato

        {
          semi: false, // No usar punto y coma al final de líneas

          singleQuote: true, // Usar comillas simples

          tabWidth: 2, // Indentación de 2 espacios

          printWidth: 80, // Longitud máxima de línea antes de hacer un salto

          trailingComma: 'none', // No usar comas finales en objetos o arrays

          arrowParens: 'always', // Siempre usar paréntesis en funciones flecha

          bracketSpacing: true, // Espaciado dentro de llaves en objetos `{ foo: bar }`

          endOfLine: 'crlf' // Forzar líneas finales con `CRLF` en vez de `LF`
        }
      ],

      // ✅ Reglas para mejorar la calidad del código en Node.js

      'node/no-missing-import': 'off',

      'node/no-unpublished-import': 'off', // 🚀 Permitir importar devDependencies (para herramientas como Jest)

      'node/no-deprecated-api': 'off', // 🔧 Desactivamos esta regla para evitar errores con ESLint 9

      'node/no-unsupported-features/es-syntax': 'off', // ✅ Permitir la sintaxis de ES Modules sin advertencias

      // ✅ Estándares de calidad de código

      'no-unused-vars': [
        'error', // ❌ Marcar como error si hay variables sin usar

        { vars: 'all', args: 'after-used', ignoreRestSiblings: false }
      ],

      'no-console': 'off', // 🚀 Permitir `console.log` para debugging en backend

      'consistent-return': 'off', // 🔧 No forzar returns en todas las funciones

      eqeqeq: 'warn', // ⚠️ Advertencia si se usa `==` en lugar de `===`

      curly: 'error', // ✅ Exigir llaves `{}` en todas las estructuras de control

      'no-undef': 'error', // ❌ Evitar variables no declaradas

      'no-var': 'error', // ❌ No permitir `var`, solo `let` y `const`

      'prefer-const': 'warn', // ⚠️ Sugerir `const` en vez de `let` si es posible

      'no-multiple-empty-lines': ['warn', { max: 1 }], // ⚠️ Evitar múltiples líneas vacías

      'comma-dangle': ['error', 'never'], // ❌ No permitir comas finales en objetos o arrays

      // ✅ Reglas de estilo alineadas con Prettier

      quotes: ['error', 'single'], // ✅ Forzar comillas simples

      semi: ['error', 'never'], // ❌ No permitir punto y coma al final de líneas

      'arrow-parens': ['error', 'always'], // ✅ Siempre usar paréntesis en funciones flecha

      'brace-style': ['error', '1tbs', { allowSingleLine: true }] // ✅ Estilo de llaves uniforme
    }
  }
]
