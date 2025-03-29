import { defineConfig } from 'vitest/config'

export default defineConfig({
  test: {
    globals: true,
    environment: 'node',
    clearMocks: true,
    // setupFiles: './tests/setup.js',
    coverage: {
      reporter: ['text', 'json', 'html'], // Formatos de reporte
      exclude: ['node_modules/', 'tests/', 'config/'] // Excluye archivos irrelevantes
    }
  }
})
