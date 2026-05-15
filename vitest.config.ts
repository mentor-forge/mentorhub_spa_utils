import { defineConfig } from 'vitest/config'
import vue from '@vitejs/plugin-vue'

export default defineConfig({
  plugins: [vue()],
  test: {
    globals: true,
    environment: 'jsdom',
    setupFiles: ['./tests/setup.ts'],
    css: {
      modules: {
        classNameStrategy: 'non-scoped'
      }
    },
    coverage: {
      provider: 'v8',
      reporter: ['text', 'json', 'html'],
      exclude: [
        'node_modules/',
        '**/*.config.ts',
        '**/vite.config*.ts',
        '**/dist/**',
        '**/*.spec.ts',
        '**/*.test.ts',
        '**/index.ts', // Exclude re-export index files
        'cypress/**', // E2E tests - covered by Cypress
        'demo/**', // Demo app - not unit tested
        '**/vite-env.d.ts'
      ],
      thresholds: {
        'src/composables/**': {
          lines: 90,
          functions: 90,
          branches: 60,
          statements: 90,
        },
        'src/components/**': {
          // Focus on script logic, template rendering tested in Cypress
          lines: 85,
          functions: 85,
          branches: 80,
          statements: 85,
        },
        'src/utils/**': {
          lines: 100,
          functions: 100,
          branches: 100,
          statements: 100,
        },
      },
    },
  },
})
