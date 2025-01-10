const prettierConfig = require('eslint-config-prettier')
const prettierPlugin = require('eslint-plugin-prettier')

module.exports = [
  {
    files: ['**/*.js'], // Archivos que serán analizados
    ignores: ['node_modules/**', 'dist/**'], // Directorios a ignorar
    plugins: {
      prettier: prettierPlugin, // Registrar el plugin de Prettier
    },
    rules: {
      ...prettierConfig.rules, // Reglas de Prettier
      'prettier/prettier': 'error', // Lanza errores si no se sigue el formato de Prettier
      'no-unused-vars': 'error', // Lanza error si hay variables no usadas
      quotes: ['error', 'single'], // Forzar comillas simples
      semi: ['error', 'never'], // Forzar no usar punto y coma
    },
  },
]
