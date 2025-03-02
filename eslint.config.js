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
        ...globals.node // Variables globales para Node.js
      }
    },

    plugins: {
      node: nodePlugin, // Reglas específicas para Node.js
      prettier: prettierPlugin // Integración con Prettier
    },

    rules: {
      // ✅ Integración con Prettier (evita conflictos de formato)
      'prettier/prettier': ['error', { trailingComma: 'none' }],

      // ✅ Reglas de manejo de variables
      'no-unused-vars': [
        'error',
        { vars: 'all', args: 'after-used', ignoreRestSiblings: false }
      ],
      'no-console': 'off', // No marcar console.log como advertencia o error
      'consistent-return': 'off', // No forzar que todas las funciones devuelvan un valor

      // ✅ Reglas de calidad de código
      eqeqeq: 'warn', // Advertencia si se usa "==" en lugar de "==="
      curly: 'error', // Exigir llaves {} en estructuras de control
      'no-undef': 'error', // Evitar variables no declaradas
      'no-var': 'error', // No permitir "var", solo "let" y "const"
      'prefer-const': 'warn', // Sugerir "const" en vez de "let" si es posible
      'no-multiple-empty-lines': ['warn', { max: 1 }], // Evitar múltiples líneas vacías
      'comma-dangle': ['error', 'never'], // ❌ No permitir comas finales en objetos o arrays

      // ✅ Reglas de estilo
      quotes: ['error', 'single'], // Forzar comillas simples
      semi: ['error', 'never'], // No permitir punto y coma al final de líneas

      // ✅ Reglas específicas de Node.js
      'node/no-unsupported-features/es-syntax': 'off' // Permitir ESM sin advertencias
    }
  }
]
