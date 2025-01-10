import prettierConfig from 'eslint-config-prettier'
import prettierPlugin from 'eslint-plugin-prettier'

export default {
  overrides: [
    {
      files: ['**/*.js'], // Archivos a analizar
      excludedFiles: ['node_modules/**', 'dist/**'], // Ignorar directorios
      plugins: { prettier: prettierPlugin },
      rules: {
        ...prettierConfig.rules, // Configuración de Prettier
        'prettier/prettier': 'error', // Lanza errores si no se sigue el formato
        'no-unused-vars': 'error', // Lanza error si hay variables no usadas
        quotes: ['error', 'single'], // Forzar comillas simples
        semi: ['error', 'never'], // Forzar no usar punto y coma
      },
    },
  ],
}
