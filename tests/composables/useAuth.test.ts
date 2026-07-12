import { describe, it, expect, beforeEach, vi } from 'vitest'

describe('useAuth', () => {
  beforeEach(() => {
    localStorage.clear()
    vi.resetModules()
  })

  describe('isAuthenticated', () => {
    it('should return false when no token is stored', async () => {
      const { useAuth } = await import('../../src/composables/useAuth')
      const { isAuthenticated } = useAuth()
      expect(isAuthenticated.value).toBe(false)
    })

    it('should return false when token is expired', async () => {
      const pastDate = new Date(Date.now() - 1000).toISOString()
      localStorage.setItem('access_token', 'test-token')
      localStorage.setItem('token_expires_at', pastDate)
      const { useAuth } = await import('../../src/composables/useAuth')
      const { isAuthenticated } = useAuth()
      expect(isAuthenticated.value).toBe(false)
    })

    it('should return true when token is valid and not expired', async () => {
      const futureDate = new Date(Date.now() + 100000).toISOString()
      localStorage.setItem('access_token', 'test-token')
      localStorage.setItem('token_expires_at', futureDate)
      localStorage.setItem('user_roles', JSON.stringify(['developer']))
      const { useAuth, syncAuthFromStorage } = await import('../../src/composables/useAuth')
      syncAuthFromStorage()
      const { isAuthenticated, roles } = useAuth()
      expect(isAuthenticated.value).toBe(true)
      expect(roles.value).toEqual(['developer'])
    })
  })

  describe('syncAuthFromStorage', () => {
    it('should hydrate reactive auth state from localStorage after bootstrap', async () => {
      const { useAuth, syncAuthFromStorage } = await import('../../src/composables/useAuth')
      const { isAuthenticated } = useAuth()
      expect(isAuthenticated.value).toBe(false)

      const futureDate = new Date(Date.now() + 100000).toISOString()
      localStorage.setItem('access_token', 'bootstrapped-token')
      localStorage.setItem('token_expires_at', futureDate)
      localStorage.setItem('user_roles', JSON.stringify(['admin']))
      syncAuthFromStorage()

      expect(isAuthenticated.value).toBe(true)
    })
  })

  describe('logout', () => {
    it('should clear token and auth state', async () => {
      localStorage.setItem('access_token', 'test-token')
      localStorage.setItem('token_expires_at', '2026-12-31T23:59:59Z')
      localStorage.setItem('user_roles', JSON.stringify(['admin']))

      const { useAuth, syncAuthFromStorage } = await import('../../src/composables/useAuth')
      syncAuthFromStorage()
      const { logout, isAuthenticated } = useAuth()
      logout()

      expect(localStorage.getItem('access_token')).toBeNull()
      expect(localStorage.getItem('token_expires_at')).toBeNull()
      expect(localStorage.getItem('user_roles')).toBeNull()
      expect(isAuthenticated.value).toBe(false)
    })
  })
})

describe('getStoredRoles', () => {
  beforeEach(() => {
    localStorage.clear()
    vi.resetModules()
  })

  it('should return empty array when no roles stored', async () => {
    const { getStoredRoles } = await import('../../src/composables/useAuth')
    expect(getStoredRoles()).toEqual([])
  })

  it('should return stored roles', async () => {
    localStorage.setItem('user_roles', JSON.stringify(['admin', 'user']))
    const { getStoredRoles } = await import('../../src/composables/useAuth')
    expect(getStoredRoles()).toEqual(['admin', 'user'])
  })
})

describe('hasStoredRole', () => {
  beforeEach(() => {
    localStorage.clear()
    vi.resetModules()
  })

  it('should return true when user has role', async () => {
    localStorage.setItem('user_roles', JSON.stringify(['admin', 'user']))
    const { hasStoredRole } = await import('../../src/composables/useAuth')
    expect(hasStoredRole('admin')).toBe(true)
    expect(hasStoredRole('user')).toBe(true)
  })

  it('should return false when user does not have role', async () => {
    localStorage.setItem('user_roles', JSON.stringify(['user']))
    const { hasStoredRole } = await import('../../src/composables/useAuth')
    expect(hasStoredRole('admin')).toBe(false)
  })

  it('should return false when no roles stored', async () => {
    const { hasStoredRole } = await import('../../src/composables/useAuth')
    expect(hasStoredRole('admin')).toBe(false)
  })
})
