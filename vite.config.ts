import { existsSync, readdirSync, readFileSync, writeFileSync } from 'node:fs'
import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'
import { resolve } from 'path'
import type { Plugin } from 'rollup'

/** Keep import.meta.env dynamic in library dist so consuming SPAs inline VITE_* at their build. */
function preserveImportMetaEnv(): Plugin {
  return {
    name: 'preserve-import-meta-env',
    closeBundle() {
      const dist = resolve(__dirname, 'dist')
      for (const entry of readdirSync(dist, { recursive: true })) {
        if (!entry.endsWith('.js')) continue
        const file = resolve(dist, entry)
        const code = readFileSync(file, 'utf8')
        const replaced = code.replace(
          /const (\w+) = \{ BASE_URL: [^}]+\}(?=[;,])/g,
          (match, name, offset) => {
            const next = code.slice(offset + match.length, offset + match.length + 500)
            if (next.includes(`${name}?.VITE_IDP_LOGIN_URI`)) {
              return `const ${name} = import.meta.env`
            }
            return match
          }
        )
        if (replaced !== code) writeFileSync(file, replaced)
      }
    },
  }
}

/**
 * Vite lib mode extracts SFC CSS to dist/index.css but does not link it from the JS entry.
 * Prepend a side-effect import so consumers get component styles with the package root import.
 */
function injectLibCssImport(): Plugin {
  return {
    name: 'inject-lib-css-import',
    closeBundle() {
      const jsFile = resolve(__dirname, 'dist/index.js')
      const cssFile = resolve(__dirname, 'dist/index.css')
      if (!existsSync(jsFile) || !existsSync(cssFile)) return
      const code = readFileSync(jsFile, 'utf8')
      if (/import\s+['"]\.\/index\.css['"]/.test(code)) return
      writeFileSync(jsFile, `import './index.css';\n${code}`)
    },
  }
}

export default defineConfig({
  plugins: [vue(), preserveImportMetaEnv(), injectLibCssImport()],
  build: {
    lib: {
      entry: {
        index: resolve(__dirname, 'src/index.ts'),
        'composables/index': resolve(__dirname, 'src/composables/index.ts'),
        'components/index': resolve(__dirname, 'src/components/index.ts'),
        'utils/index': resolve(__dirname, 'src/utils/index.ts')
      },
      formats: ['es'],
      cssFileName: 'index'
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
