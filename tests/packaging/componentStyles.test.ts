import { describe, it, expect, beforeAll } from 'vitest'
import { existsSync, readFileSync } from 'node:fs'
import { resolve } from 'node:path'
import { execSync } from 'node:child_process'

const root = resolve(__dirname, '../..')
const packageJsonPath = resolve(root, 'package.json')
const distJsPath = resolve(root, 'dist/index.js')
const distCssPath = resolve(root, 'dist/index.css')

describe('component style packaging', () => {
  beforeAll(() => {
    // Ensure dist reflects current packaging (prepare may be stale in some runs).
    execSync('npm run build', { cwd: root, stdio: 'pipe' })
  }, 120_000)

  it('exposes a resolvable style export and marks CSS as side-effectful', () => {
    const pkg = JSON.parse(readFileSync(packageJsonPath, 'utf8')) as {
      exports?: Record<string, unknown>
      sideEffects?: string[] | boolean
    }

    expect(pkg.exports?.['./style.css']).toBe('./dist/index.css')
    // CSS alone is not enough: dist/index.js must stay side-effectful (CSS import),
    // and Cypress support files register commands via bare side-effect imports.
    expect(pkg.sideEffects).toEqual(
      expect.arrayContaining([
        '**/*.css',
        './dist/index.js',
        './cypress/support/**/*.ts',
      ])
    )
  })

  it('links dist CSS from the package-root JS entry and keeps CardGrid layout rules', () => {
    expect(existsSync(distJsPath)).toBe(true)
    expect(existsSync(distCssPath)).toBe(true)

    const js = readFileSync(distJsPath, 'utf8')
    expect(js).toMatch(/import\s+['"]\.\/index\.css['"]/)

    const css = readFileSync(distCssPath, 'utf8')
    expect(css).toContain('.mh-card-grid')
    expect(css).toMatch(/grid-template-columns/)
    expect(css).toMatch(/repeat\(\s*8\s*,\s*minmax\(\s*0\s*,\s*1fr\s*\)\s*\)/)
    expect(css).toContain('.mh-card--collapsed')
    expect(css).toMatch(/align-self:\s*flex-start/)
  })
})
