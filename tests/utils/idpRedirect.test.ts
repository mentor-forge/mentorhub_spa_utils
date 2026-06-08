/**
 * @vitest-environment node
 */
import { describe, it, expect, beforeEach, afterEach, vi } from 'vitest'
import {
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
  describe('getIdpLoginBaseUrl', () => {
    it('returns override when provided', () => {
      expect(getIdpLoginBaseUrl('http://127.0.0.1:8080/login.html')).toBe(
        'http://127.0.0.1:8080/login.html'
      )
    })

    it('returns undefined when no override and env unset', () => {
      expect(getIdpLoginBaseUrl()).toBeUndefined()
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
        origin: 'http://127.0.0.1:8388',
        pathname: '/subscriptions',
        search: '?tab=1',
      })

      const url = buildIdpLoginRedirectUrl(undefined, 'http://127.0.0.1:8080/login.html')
      expect(url).toBe(
        'http://127.0.0.1:8080/login.html?return_to=http%3A%2F%2F127.0.0.1%3A8388%2Fsubscriptions%3Ftab%3D1'
      )

      // @ts-expect-error test cleanup
      delete globalThis.window
    })

    it('throws when IdP URI is not configured', () => {
      expect(() => buildIdpLoginRedirectUrl('http://127.0.0.1:8388/')).toThrow(
        'VITE_IDP_LOGIN_URI is not configured'
      )
    })
  })

  describe('redirectToIdpLogin', () => {
    let href = ''

    beforeEach(() => {
      href = ''
      installWindowLocation({
        pathname: '/subscriptions',
        search: '',
        set href(value: string) {
          href = value
        },
        get href() {
          return href
        },
      })
    })

    afterEach(() => {
      vi.restoreAllMocks()
      // @ts-expect-error test cleanup
      delete globalThis.window
    })

    it('redirects to IdP login when configured', () => {
      redirectToIdpLogin('http://127.0.0.1:8388/', 'http://127.0.0.1:8080/login.html')
      expect(href).toBe(
        'http://127.0.0.1:8080/login.html?return_to=http%3A%2F%2F127.0.0.1%3A8388%2F'
      )
    })

    it('does not navigate when IdP is not configured', () => {
      redirectToIdpLogin('/subscriptions')
      expect(href).toBe('')
    })
  })
})
