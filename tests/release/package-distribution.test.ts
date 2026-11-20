// @vitest-environment node
import { afterEach, describe, expect, it } from 'vitest'
import { spawnSync } from 'node:child_process'
import { copyFileSync, mkdirSync, mkdtempSync, readFileSync, rmSync, writeFileSync } from 'node:fs'
import { tmpdir } from 'node:os'
import { join } from 'node:path'
import { fileURLToPath } from 'node:url'

const root = fileURLToPath(new URL('../../', import.meta.url))
const fixtures: string[] = []

afterEach(() => {
  for (const fixture of fixtures.splice(0)) rmSync(fixture, { recursive: true, force: true })
})

function fixture() {
  const path = mkdtempSync(join(tmpdir(), 'spa-utils-release-'))
  fixtures.push(path)
  mkdirSync(join(path, 'scripts'))
  mkdirSync(join(path, 'bin'))
  for (const file of ['package.json', 'package-lock.json', '.npmrc.example', 'scripts/publish-package.sh', 'scripts/tag-release.sh']) {
    copyFileSync(join(root, file), join(path, file))
  }
  return path
}

function publish(path: string, registryResponse: string, token = '') {
  writeFileSync(join(path, 'bin', 'npm'), `#!/bin/sh
printf '%s\\n' "$1" >> "$NPM_LOG"
case "$1" in
  view)
    case "$REGISTRY_RESPONSE" in
      duplicate) echo '"1.0.6"' ;;
      missing) echo '{"error":{"code":"E404"}}'; exit 1 ;;
      denied) echo '{"error":{"code":"E401"}}'; exit 1 ;;
    esac
    ;;
  pack) touch "$4/package.tgz" ;;
  publish) test -f "$2" && test "$3" = --ignore-scripts ;;
esac
`, { mode: 0o755 })
  return spawnSync('sh', ['scripts/publish-package.sh'], {
    cwd: path,
    encoding: 'utf8',
    env: {
      ...process.env,
      GITHUB_TOKEN: token,
      NODE_AUTH_TOKEN: '',
      NPM_LOG: join(path, 'npm.log'),
      PATH: `${join(path, 'bin')}:${process.env.PATH}`,
      REGISTRY_RESPONSE: registryResponse,
    },
  })
}

describe('GitHub Packages release helper', () => {
  it('requires a token before invoking npm', () => {
    const result = publish(fixture(), 'missing')
    expect(result.status).toBe(1)
    expect(result.stderr).toContain('Set NODE_AUTH_TOKEN or GITHUB_TOKEN')
  })

  it.each(['duplicate', 'denied'])('refuses to build or publish on a %s registry response', (response) => {
    const path = fixture()
    const result = publish(path, response, 'fixture-token')
    expect(result.status).toBe(1)
    expect(readFileSync(join(path, 'npm.log'), 'utf8')).toBe('view\n')
    expect(result.stderr).not.toContain('fixture-token')
  })

  it('packs once after a clean install and publishes the tarball', () => {
    const path = fixture()
    const result = publish(path, 'missing', 'fixture-token')
    expect(result.status, result.stderr).toBe(0)
    expect(readFileSync(join(path, 'npm.log'), 'utf8')).toBe('view\nci\npack\npublish\n')
  })
})

describe('release tag helper', () => {
  it('rejects a package and lockfile version mismatch', () => {
    const path = fixture()
    const packageFile = join(path, 'package.json')
    const config = JSON.parse(readFileSync(packageFile, 'utf8'))
    config.version = '9.0.0'
    writeFileSync(packageFile, JSON.stringify(config))
    const result = spawnSync('sh', ['scripts/tag-release.sh'], { cwd: path, encoding: 'utf8' })
    expect(result.status).toBe(1)
    expect(result.stderr).toContain('versions must agree')
  })
})
