import prettierConfig from 'eslint-config-prettier'
import prettierPlugin from 'eslint-plugin-prettier'
export default {
  files: ['**/*.js'],
  ignores: ['node_modules/', 'dist/'],
  plugins: { prettier: prettierPlugin },
  rules: { ...prettierConfig.rules, 'prettier/prettier': 'error' },
}
