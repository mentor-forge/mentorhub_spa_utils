import { ref, computed } from 'vue'

const accessToken = ref<string | null>(null)
const tokenExpiresAt = ref<string | null>(null)
const roles = ref<string[]>([])

/** Re-read auth keys from localStorage into reactive state (call after bootstrapAuthFromUrl). */
export function syncAuthFromStorage(): void {
  accessToken.value = localStorage.getItem('access_token')
  tokenExpiresAt.value = localStorage.getItem('token_expires_at')
  const storedRoles = localStorage.getItem('user_roles')
  roles.value = storedRoles ? JSON.parse(storedRoles) : []
}

syncAuthFromStorage()

export function useAuth() {
  const isAuthenticated = computed(() => {
    if (!accessToken.value || !tokenExpiresAt.value) {
      return false
    }
    const expiresAt = new Date(tokenExpiresAt.value)
    return expiresAt > new Date()
  })

  function logout() {
    accessToken.value = null
    tokenExpiresAt.value = null
    roles.value = []
    localStorage.removeItem('access_token')
    localStorage.removeItem('token_expires_at')
    localStorage.removeItem('user_roles')
  }

  return {
    isAuthenticated,
    roles: computed(() => roles.value),
    logout,
  }
}

export function getStoredRoles(): string[] {
  const stored = localStorage.getItem('user_roles')
  return stored ? JSON.parse(stored) : []
}

export function hasStoredRole(role: string): boolean {
  return getStoredRoles().includes(role)
}
