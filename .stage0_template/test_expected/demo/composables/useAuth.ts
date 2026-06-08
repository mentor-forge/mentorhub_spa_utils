import { ref, computed } from 'vue'

const accessToken = ref<string | null>(localStorage.getItem('access_token'))
const tokenExpiresAt = ref<string | null>(localStorage.getItem('token_expires_at'))
const storedRoles = localStorage.getItem('user_roles')
const roles = ref<string[]>(storedRoles ? JSON.parse(storedRoles) : [])

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
