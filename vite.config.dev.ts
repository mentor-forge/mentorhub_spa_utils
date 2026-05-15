import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'
import { fileURLToPath, URL } from 'node:url'

export default defineConfig({
  plugins: [vue()],
  resolve: {
    alias: {
      '@': fileURLToPath(new URL('./src', import.meta.url))
    }
  },
  server: {
    port: {{ spa_utils.port }},
    proxy: {
      '/api': {
        target: 'http://localhost:{{ api_utils.port }}',
        changeOrigin: true
      }
    }
  }
})
