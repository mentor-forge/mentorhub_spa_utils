import { ref, computed } from 'vue'
import type { RuntimeEditorConfig, EnumeratorVersionPayload } from '../../src/components/editors/types'

/**
 * Demo `/api/config` response. Extends the F026 runtime editor config shape so
 * enum editors can resolve enumerators from the same startup payload.
 */
export interface ConfigResponse extends RuntimeEditorConfig {
  config_items?: Array<Record<string, unknown>>
  versions?: Array<Record<string, unknown>>
  enumerators?: EnumeratorVersionPayload[]
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

      const result = (await response.json()) as ConfigResponse
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
