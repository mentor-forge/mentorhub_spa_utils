import { ref, watch, type Ref } from 'vue'

/**
 * Composable for handling errors from queries/mutations
 * Provides reactive error state and message
 */
export function useErrorHandler(error: Ref<Error | null>) {
  const showError = ref(false)
  const errorMessage = ref('')

  watch(error, (err) => {
    if (err) {
      showError.value = true
      errorMessage.value = err instanceof Error ? err.message : String(err)
    } else {
      showError.value = false
      errorMessage.value = ''
    }
  })

  function clearError() {
    showError.value = false
    errorMessage.value = ''
  }

  return {
    showError,
    errorMessage,
    clearError,
  }
}
