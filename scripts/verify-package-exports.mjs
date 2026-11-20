import { readFileSync } from 'node:fs'

const manifest = JSON.parse(readFileSync(new URL('../package.json', import.meta.url), 'utf8'))
const [packed] = JSON.parse(readFileSync(0, 'utf8'))
if (packed?.name !== manifest.name || packed.version !== manifest.version) {
  throw new Error('Packed package name or version does not match package.json')
}

const files = new Set(packed.files.map(({ path }) => path))
for (const [subpath, entry] of Object.entries(manifest.exports)) {
  const targets = typeof entry === 'string' ? [entry] : Object.values(entry)
  for (const target of targets) {
    if (!files.has(target.replace(/^\.\//, ''))) {
      throw new Error(`Missing packed export ${subpath}: ${target}`)
    }
  }
}

console.log(`Verified export files in ${packed.filename}`)
