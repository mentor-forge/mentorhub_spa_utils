import { defineConfig } from 'vitest/config'
import vue from '@vitejs/plugin-vue'

export default defineConfig({
  plugins: [vue()],
  test: {
    globals: true,
    environment: 'jsdom',
    setupFiles: ['./tests/setup.ts'],
    env: {
      VITE_IDP_LOGIN_URI: 'http://127.0.0.1:8080/login.html',
    },
    css: {
      modules: {
        classNameStrategy: 'non-scoped'
      }
    },
    coverage: {
      provider: 'v8',
      reporter: ['text', 'json', 'html'],
      include: ['src/**/*.{ts,vue}'],
      exclude: ['**/index.ts', '**/*.d.ts', '**/*.{spec,test}.ts'],
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
          lines: 90,
          functions: 90,
          branches: 90,
          statements: 90,
        },
      },
    },
  },
})
