/**
 * @vitest-environment node
 */
import { describe, it, expect, beforeEach, afterEach, vi } from 'vitest'
import {
  DEVELOPER_EDITION_IDP_LOGIN_URI,
  MENTORHUB_RUNTIME_CONFIG_KEY,
  getIdpLoginBaseUrl,
  buildIdpLoginRedirectUrl,
  redirectToIdpLogin,
} from '../../src/utils/idpRedirect'

const MAGIC_IDP = 'http://m5max.tailb0d293.ts.net:8080/login.html'

function installWindowLocation(location: Record<string, unknown>) {
  Object.defineProperty(globalThis, 'window', {
    configurable: true,
    writable: true,
    value: { location },
  })
}

function installRuntimeIdpLoginUri(idpLoginUri: string, location: Record<string, unknown> = {}) {
  installWindowLocation(location)
  ;(globalThis.window as Record<string, unknown>)[MENTORHUB_RUNTIME_CONFIG_KEY] = {
    IDP_LOGIN_URI: idpLoginUri,
  }
}

describe('idpRedirect', () => {
  afterEach(() => {
    // @ts-expect-error test cleanup
    delete globalThis.window
  })

  describe('getIdpLoginBaseUrl', () => {
    it('returns override when provided', () => {
      expect(getIdpLoginBaseUrl('http://127.0.0.1:8080/login.html')).toBe(
        'http://127.0.0.1:8080/login.html'
      )
    })

    it('returns Developer Edition fallback when no override and env unset', () => {
      expect(getIdpLoginBaseUrl()).toBe(DEVELOPER_EDITION_IDP_LOGIN_URI)
    })

    it('uses runtime IDP_LOGIN_URI when injected on window', () => {
      installRuntimeIdpLoginUri(MAGIC_IDP)

      expect(getIdpLoginBaseUrl()).toBe(MAGIC_IDP)
    })

    it('prefers runtime IDP_LOGIN_URI over build-time VITE_IDP_LOGIN_URI', () => {
      installRuntimeIdpLoginUri(MAGIC_IDP)

      expect(getIdpLoginBaseUrl()).toBe(MAGIC_IDP)
      expect(getIdpLoginBaseUrl()).not.toBe(DEVELOPER_EDITION_IDP_LOGIN_URI)
    })

    it('prefers explicit override over runtime config', () => {
      installRuntimeIdpLoginUri(MAGIC_IDP)

      expect(getIdpLoginBaseUrl('https://auth.example.com/login')).toBe(
        'https://auth.example.com/login'
      )
    })

    it('leaves production IdP URLs unchanged when passed as override', () => {
      const cognito =
        'https://auth.example.com/oauth2/authorize?client_id=abc&response_type=code'
      expect(getIdpLoginBaseUrl(cognito)).toBe(cognito)
    })

    it('ignores empty runtime IDP_LOGIN_URI', () => {
      installWindowLocation({ hostname: '127.0.0.1' })
      ;(globalThis.window as Record<string, unknown>)[MENTORHUB_RUNTIME_CONFIG_KEY] = {
        IDP_LOGIN_URI: '   ',
      }

      expect(getIdpLoginBaseUrl()).toBe(DEVELOPER_EDITION_IDP_LOGIN_URI)
    })
  })

  describe('buildIdpLoginRedirectUrl', () => {
    it('appends return_to query param', () => {
      const url = buildIdpLoginRedirectUrl(
        'http://127.0.0.1:8388/subscriptions',
        'http://127.0.0.1:8080/login.html'
      )
      expect(url).toBe(
        'http://127.0.0.1:8080/login.html?return_to=http%3A%2F%2F127.0.0.1%3A8388%2Fsubscriptions'
      )
    })

    it('uses window location when return_to omitted', () => {
      installWindowLocation({
        hostname: '127.0.0.1',
        origin: 'http://127.0.0.1:8388',
        pathname: '/subscriptions',
        search: '?tab=1',
      })

      const url = buildIdpLoginRedirectUrl(undefined, 'http://127.0.0.1:8080/login.html')
      expect(url).toBe(
        'http://127.0.0.1:8080/login.html?return_to=http%3A%2F%2F127.0.0.1%3A8388%2Fsubscriptions%3Ftab%3D1'
      )
    })

    it('uses Developer Edition fallback when IdP URI is not configured', () => {
      const url = buildIdpLoginRedirectUrl('http://127.0.0.1:8388/')
      expect(url).toBe(
        `${DEVELOPER_EDITION_IDP_LOGIN_URI}?return_to=http%3A%2F%2F127.0.0.1%3A8388%2F`
      )
    })

    it('uses runtime IDP_LOGIN_URI for redirect URL', () => {
      installRuntimeIdpLoginUri(MAGIC_IDP, {
        hostname: 'm5max.tailb0d293.ts.net',
        origin: 'http://m5max.tailb0d293.ts.net:8392',
        pathname: '/profiles',
        search: '',
      })

      const url = buildIdpLoginRedirectUrl()
      expect(url).toBe(
        `${MAGIC_IDP}?return_to=http%3A%2F%2Fm5max.tailb0d293.ts.net%3A8392%2Fprofiles`
      )
    })
  })

  describe('redirectToIdpLogin', () => {
    let replaceTarget = ''

    beforeEach(() => {
      replaceTarget = ''
      installWindowLocation({
        hostname: '127.0.0.1',
        pathname: '/subscriptions',
        search: '',
        replace(value: string) {
          replaceTarget = value
        },
      })
    })

    afterEach(() => {
      vi.restoreAllMocks()
    })

    it('redirects to IdP login when configured', () => {
      redirectToIdpLogin('http://127.0.0.1:8388/', 'http://127.0.0.1:8080/login.html')
      expect(replaceTarget).toBe(
        'http://127.0.0.1:8080/login.html?return_to=http%3A%2F%2F127.0.0.1%3A8388%2F'
      )
    })

    it('uses Developer Edition fallback when IdP is not configured', () => {
      redirectToIdpLogin('/subscriptions')
      expect(replaceTarget).toBe(
        `${DEVELOPER_EDITION_IDP_LOGIN_URI}?return_to=%2Fsubscriptions`
      )
    })

    it('redirects to runtime IdP when container injects IDP_LOGIN_URI', () => {
      replaceTarget = ''
      installRuntimeIdpLoginUri(MAGIC_IDP, {
        hostname: 'm5max.tailb0d293.ts.net',
        origin: 'http://m5max.tailb0d293.ts.net:8392',
        pathname: '/',
        search: '',
        replace(value: string) {
          replaceTarget = value
        },
      })

      redirectToIdpLogin('http://m5max.tailb0d293.ts.net:8392/')
      expect(replaceTarget).toBe(
        `${MAGIC_IDP}?return_to=http%3A%2F%2Fm5max.tailb0d293.ts.net%3A8392%2F`
      )
    })
  })
})
