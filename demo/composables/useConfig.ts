import { ref, computed } from 'vue'

interface ConfigResponse {
  config_items?: Array<Record<string, unknown>>
  versions?: Array<Record<string, unknown>>
  enumerators?: Array<Record<string, unknown>>
  token?: Record<string, unknown>
}

const config = ref<ConfigResponse | null>(null)
const isLoading = ref(false)
const error = ref<Error | null>(null)

export function useConfig() {
  async function loadConfig() {
    isLoading.value = true
    error.value = null
    try {
      const token = localStorage.getItem('access_token')
      const response = await fetch('/api/config', {
        headers: {
          'Authorization': `Bearer ${token}`,
        },
      })

      if (!response.ok) {
        throw new Error(`Failed to load config: ${response.statusText}`)
      }

      const result = await response.json()
      config.value = result
      return result
    } catch (err) {
      error.value = err as Error
      throw err
    } finally {
      isLoading.value = false
    }
  }

  return {
    config: computed(() => config.value),
    isLoading: computed(() => isLoading.value),
    error: computed(() => error.value),
    loadConfig,
  }
}
