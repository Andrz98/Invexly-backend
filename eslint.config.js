import eslint from '@eslint/js'
import prettierPlugin from 'eslint-plugin-prettier'
import nodePlugin from 'eslint-plugin-node'
import globals from 'globals'

export default [
  {
    files: ['**/*.js'], // Analiza todos los archivos JS
    ignores: ['node_modules/**', 'dist/**'], // Ignora estas carpetas

    languageOptions: {
      ecmaVersion: 'latest', // Última versión de ECMAScript
      sourceType: 'module', // Soporte para ESM
      globals: {
        ...globals.node, // Variables globales para Node.js
      },
    },

    plugins: {
      node: nodePlugin, // Reglas específicas para Node.js
      prettier: prettierPlugin, // Integración con Prettier
    },

    rules: {
      'prettier/prettier': 'error', // Errores si no se sigue el formato de Prettier
      'no-unused-vars': 'error', // Errores para variables no utilizadas
      'no-console': 'warn', // Advertencias para el uso de console.log
      'consistent-return': 'error', // Obliga a que las funciones devuelvan un valor de forma coherente
      'node/no-unsupported-features/es-syntax': 'off', // Permitir ESM sin advertencias
      quotes: ['error', 'single'], // Forzar comillas simples
      semi: ['error', 'never'], // No permitir punto y coma al final de las líneas
    },
  },
]
