import { beforeEach, describe, expect, it } from 'vitest'
import { bootstrapAuthFromUrl } from '../../src/utils/urlAuthBootstrap'

describe('URL auth bootstrap', () => {
  beforeEach(() => {
    localStorage.clear()
    window.history.replaceState(null, '', '/')
  })

  it('stores credentials, normalizes roles, and removes the token fragment', () => {
    window.history.replaceState(null, '', '/mentor/?keep=1#access_token=demo&expires_at=123&roles=mentor,%20admin,,')
    bootstrapAuthFromUrl()

    expect(localStorage.getItem('access_token')).toBe('demo')
    expect(localStorage.getItem('token_expires_at')).toBe('123')
    expect(localStorage.getItem('user_roles')).toBe('["mentor","admin"]')
    expect(window.location.pathname + window.location.search + window.location.hash).toBe('/mentor/?keep=1')
  })

  it('accepts a complete token without roles and ignores an incomplete token', () => {
    window.history.replaceState(null, '', '/#access_token=incomplete')
    bootstrapAuthFromUrl()
    expect(localStorage.getItem('access_token')).toBeNull()
    expect(window.location.hash).toBe('#access_token=incomplete')

    window.history.replaceState(null, '', '/#access_token=demo&expires_at=123')
    bootstrapAuthFromUrl()
    expect(localStorage.getItem('access_token')).toBe('demo')
    expect(localStorage.getItem('user_roles')).toBeNull()
  })

  it('clears auth keys and preserves unrelated URL and storage values', () => {
    localStorage.setItem('access_token', 'old')
    localStorage.setItem('token_expires_at', '123')
    localStorage.setItem('user_roles', '["admin"]')
    localStorage.setItem('theme', 'dark')
    window.history.replaceState(null, '', '/mentor/?clear_stored_auth=1&keep=1#section')

    bootstrapAuthFromUrl()

    for (const key of ['access_token', 'token_expires_at', 'user_roles']) {
      expect(localStorage.getItem(key)).toBeNull()
    }
    expect(localStorage.getItem('theme')).toBe('dark')
    expect(window.location.pathname + window.location.search + window.location.hash).toBe('/mentor/?keep=1#section')
  })
})
