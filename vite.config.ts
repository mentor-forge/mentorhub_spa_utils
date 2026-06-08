import { readFileSync, writeFileSync } from 'node:fs'
import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'
import { resolve } from 'path'
import type { Plugin } from 'rollup'

/** Keep import.meta.env dynamic in library dist so consuming SPAs inline VITE_* at their build. */
function preserveImportMetaEnv(): Plugin {
  return {
    name: 'preserve-import-meta-env',
    closeBundle() {
      const file = resolve(__dirname, 'dist/index.js')
      const code = readFileSync(file, 'utf8')
      const replaced = code.replace(
        /const (\w+) = \{ BASE_URL: [^}]+\};/g,
        (match, name, offset) => {
          const next = code.slice(offset + match.length, offset + match.length + 120)
          if (next.includes(`${name}?.VITE_IDP_LOGIN_URI`)) {
            return `const ${name} = import.meta.env;`
          }
          return match
        }
      )
      if (replaced !== code) writeFileSync(file, replaced)
    },
  }
}

export default defineConfig({
  plugins: [vue(), preserveImportMetaEnv()],
  build: {
    lib: {
      entry: resolve(__dirname, 'src/index.ts'),
      name: 'SpaUtils',
      formats: ['es'],
      fileName: 'index'
    },
    rollupOptions: {
      external: ['vue', 'vue-router', '@tanstack/vue-query', 'vuetify'],
      output: {
        globals: {
          vue: 'Vue',
          'vue-router': 'VueRouter',
          '@tanstack/vue-query': 'VueQuery',
          vuetify: 'Vuetify'
        }
      }
    }
  }
})
