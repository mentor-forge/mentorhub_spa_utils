import { computed, type Ref } from 'vue'

/**
 * Provider interfaces for dependency injection
 */
export interface AuthProvider {
  roles: Ref<string[]>
}

export interface ConfigProvider {
  token: Ref<Record<string, unknown> | null>
}

/**
 * Composable for role-based access control
 * 
 * Uses dependency injection to work with any auth/config implementation.
 * Reads roles from the auth provider when non-empty; otherwise from ``token.roles`` on the config payload.
 * 
 * @param authProvider - Optional provider for authentication roles
 * @param configProvider - Optional provider for config token roles
 * @returns Role checking functions and current roles
 */
export function useRoles(
  authProvider?: AuthProvider,
  configProvider?: ConfigProvider
) {
  const roles = computed(() => {
    if (authProvider?.roles.value && authProvider.roles.value.length > 0) {
      return authProvider.roles.value
    }

    if (!configProvider?.token.value || typeof configProvider.token.value !== 'object') {
      return []
    }
    const token = configProvider.token.value as Record<string, unknown>
    if (Array.isArray(token.roles)) {
      return token.roles.map(r => String(r))
    }
    return []
  })

  const hasRole = (role: string) => computed(() => roles.value.includes(role))
  
  const hasAnyRole = (requiredRoles: string[]) => computed(() => 
    requiredRoles.some(role => roles.value.includes(role))
  )

  return { 
    roles, 
    hasRole, 
    hasAnyRole 
  }
}
