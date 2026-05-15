import { describe, it, expect, beforeEach } from 'vitest'
import { ref } from 'vue'
import { useRoles } from '../../src/composables/useRoles'
import type { AuthProvider, ConfigProvider } from '../../src/composables/useRoles'

describe('useRoles', () => {
  beforeEach(() => {
    // Clear any state
  })

  it('should return roles from auth provider when available', () => {
    const authProvider: AuthProvider = {
      roles: ref(['admin', 'developer'])
    }

    const { roles, hasRole } = useRoles(authProvider)

    expect(roles.value).toEqual(['admin', 'developer'])
    expect(hasRole('admin').value).toBe(true)
    expect(hasRole('developer').value).toBe(true)
    expect(hasRole('user').value).toBe(false)
  })

  it('should use config token roles when auth roles are not available', () => {
    const authProvider: AuthProvider = {
      roles: ref([])
    }
    const configProvider: ConfigProvider = {
      token: ref({
        roles: ['admin', 'user']
      })
    }

    const { roles, hasRole } = useRoles(authProvider, configProvider)

    expect(roles.value).toEqual(['admin', 'user'])
    expect(hasRole('admin').value).toBe(true)
    expect(hasRole('user').value).toBe(true)
  })

  it('should return empty array when no roles available', () => {
    const authProvider: AuthProvider = {
      roles: ref([])
    }
    const configProvider: ConfigProvider = {
      token: ref(null)
    }

    const { roles, hasRole } = useRoles(authProvider, configProvider)

    expect(roles.value).toEqual([])
    expect(hasRole('admin').value).toBe(false)
  })

  it('should check for any role with hasAnyRole', () => {
    const authProvider: AuthProvider = {
      roles: ref(['admin'])
    }

    const { hasAnyRole } = useRoles(authProvider)

    expect(hasAnyRole(['admin', 'user']).value).toBe(true)
    expect(hasAnyRole(['developer', 'user']).value).toBe(false)
  })

  it('should work without providers', () => {
    const { roles, hasRole } = useRoles()

    expect(roles.value).toEqual([])
    expect(hasRole('admin').value).toBe(false)
  })
})
