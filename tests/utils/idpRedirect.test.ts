/**
 * @vitest-environment node
 */
import { describe, it, expect, beforeEach, afterEach, vi } from 'vitest'
import {
  DEVELOPER_EDITION_IDP_LOGIN_URI,
  getIdpLoginBaseUrl,
  buildIdpLoginRedirectUrl,
  redirectToIdpLogin,
} from '../../src/utils/idpRedirect'

function installWindowLocation(location: Record<string, unknown>) {
  Object.defineProperty(globalThis, 'window', {
    configurable: true,
    writable: true,
    value: { location },
  })
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

    it('rewrites loopback IdP host to the current MagicDNS hostname', () => {
      installWindowLocation({
        hostname: 'm5max.tailb0d293.ts.net',
        origin: 'http://m5max.tailb0d293.ts.net:8392',
        pathname: '/',
        search: '',
      })

      expect(getIdpLoginBaseUrl('http://127.0.0.1:8080/login.html')).toBe(
        'http://m5max.tailb0d293.ts.net:8080/login.html'
      )
      expect(getIdpLoginBaseUrl()).toBe('http://m5max.tailb0d293.ts.net:8080/login.html')
    })

    it('rewrites localhost IdP host to the current hostname', () => {
      installWindowLocation({
        hostname: 'curttuff.tailb0d293.ts.net',
        origin: 'http://curttuff.tailb0d293.ts.net:8392',
        pathname: '/',
        search: '',
      })

      expect(getIdpLoginBaseUrl('http://localhost:8080/login.html')).toBe(
        'http://curttuff.tailb0d293.ts.net:8080/login.html'
      )
    })

    it('leaves non-loopback (production) IdP URLs unchanged', () => {
      installWindowLocation({
        hostname: 'm5max.tailb0d293.ts.net',
        origin: 'http://m5max.tailb0d293.ts.net:8392',
        pathname: '/',
        search: '',
      })

      const cognito =
        'https://auth.example.com/oauth2/authorize?client_id=abc&response_type=code'
      expect(getIdpLoginBaseUrl(cognito)).toBe(cognito)
    })

    it('does not rewrite when already on loopback', () => {
      installWindowLocation({
        hostname: '127.0.0.1',
        origin: 'http://127.0.0.1:8392',
        pathname: '/',
        search: '',
      })

      expect(getIdpLoginBaseUrl('http://127.0.0.1:8080/login.html')).toBe(
        'http://127.0.0.1:8080/login.html'
      )
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

    it('builds MagicDNS IdP URL with matching return_to host', () => {
      installWindowLocation({
        hostname: 'm5max.tailb0d293.ts.net',
        origin: 'http://m5max.tailb0d293.ts.net:8392',
        pathname: '/profiles',
        search: '',
      })

      const url = buildIdpLoginRedirectUrl()
      expect(url).toBe(
        'http://m5max.tailb0d293.ts.net:8080/login.html?return_to=http%3A%2F%2Fm5max.tailb0d293.ts.net%3A8392%2Fprofiles'
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

    it('redirects to MagicDNS IdP when SPA is opened via Tailscale hostname', () => {
      replaceTarget = ''
      installWindowLocation({
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
        'http://m5max.tailb0d293.ts.net:8080/login.html?return_to=http%3A%2F%2Fm5max.tailb0d293.ts.net%3A8392%2F'
      )
    })
  })
})
