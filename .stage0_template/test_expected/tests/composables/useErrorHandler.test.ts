import { describe, it, expect, beforeEach } from 'vitest'
import { ref } from 'vue'
import { useErrorHandler } from '../../src/composables/useErrorHandler'

describe('useErrorHandler', () => {
  let error: ReturnType<typeof ref<Error | null>>

  beforeEach(() => {
    error = ref<Error | null>(null)
  })

  it('should initialize with no error', () => {
    const { showError, errorMessage } = useErrorHandler(error)

    expect(showError.value).toBe(false)
    expect(errorMessage.value).toBe('')
  })

  it('should show error when error is set', async () => {
    const { showError, errorMessage } = useErrorHandler(error)

    error.value = new Error('Test error')

    // Wait for watcher to process
    await new Promise(resolve => setTimeout(resolve, 0))

    expect(showError.value).toBe(true)
    expect(errorMessage.value).toBe('Test error')
  })

  it('should handle string errors', async () => {
    const { showError, errorMessage } = useErrorHandler(error)

    error.value = 'String error' as any

    await new Promise(resolve => setTimeout(resolve, 0))

    expect(showError.value).toBe(true)
    expect(errorMessage.value).toBe('String error')
  })

  it('should clear error when error is cleared', async () => {
    const { showError, errorMessage, clearError } = useErrorHandler(error)

    error.value = new Error('Test error')
    await new Promise(resolve => setTimeout(resolve, 0))

    expect(showError.value).toBe(true)

    clearError()

    expect(showError.value).toBe(false)
    expect(errorMessage.value).toBe('')
  })

  it('should update when error changes', async () => {
    const { showError, errorMessage } = useErrorHandler(error)

    error.value = new Error('First error')
    await new Promise(resolve => setTimeout(resolve, 0))
    expect(errorMessage.value).toBe('First error')

    error.value = new Error('Second error')
    await new Promise(resolve => setTimeout(resolve, 0))
    expect(errorMessage.value).toBe('Second error')

    error.value = null
    await new Promise(resolve => setTimeout(resolve, 0))
    expect(showError.value).toBe(false)
  })
})
