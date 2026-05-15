import { describe, it, expect, vi, beforeEach } from 'vitest'
import { shallowMount } from '@vue/test-utils'
import AutoSaveField from '../../src/components/AutoSaveField.vue'

describe('AutoSaveField', () => {
  beforeEach(() => {
    vi.clearAllMocks()
  })

  it('should have correct initial props', () => {
    const onSave = vi.fn()
    const wrapper = shallowMount(AutoSaveField, {
      props: {
        modelValue: 'test value',
        label: 'Test Field',
        onSave
      }
    })

    expect(wrapper.props('modelValue')).toBe('test value')
    expect(wrapper.props('label')).toBe('Test Field')
  })

  it('should call onSave with new value', async () => {
    const onSave = vi.fn().mockResolvedValue(undefined)
    const wrapper = shallowMount(AutoSaveField, {
      props: {
        modelValue: 'initial',
        label: 'Test Field',
        onSave
      }
    })

    const vm = wrapper.vm as any
    vm.handleInput('updated')
    await vm.handleBlur()

    expect(onSave).toHaveBeenCalledWith('updated')
  })

  it('should not call onSave when value unchanged', async () => {
    const onSave = vi.fn()
    const wrapper = shallowMount(AutoSaveField, {
      props: {
        modelValue: 'initial',
        label: 'Test Field',
        onSave
      }
    })

    const vm = wrapper.vm as any
    await vm.handleBlur()

    expect(onSave).not.toHaveBeenCalled()
  })

  it('should handle save errors', async () => {
    const onSave = vi.fn().mockRejectedValue(new Error('Save failed'))
    const wrapper = shallowMount(AutoSaveField, {
      props: {
        modelValue: 'initial',
        label: 'Test Field',
        onSave
      }
    })

    const vm = wrapper.vm as any
    vm.handleInput('updated')
    await vm.handleBlur()

    expect(vm.error).toBe('Save failed')
  })

  it('should accept textarea prop', () => {
    const wrapper = shallowMount(AutoSaveField, {
      props: {
        modelValue: 'test',
        label: 'Test',
        onSave: vi.fn(),
        textarea: true,
        rows: 3
      }
    })

    expect(wrapper.props('textarea')).toBe(true)
    expect(wrapper.props('rows')).toBe(3)
  })

  it('should update currentValue when modelValue prop changes', async () => {
    const onSave = vi.fn()
    const wrapper = shallowMount(AutoSaveField, {
      props: {
        modelValue: 'initial',
        label: 'Test Field',
        onSave
      }
    })

    const vm = wrapper.vm as any
    expect(vm.currentValue).toBe('initial')

    await wrapper.setProps({ modelValue: 'updated' })
    expect(vm.currentValue).toBe('updated')
  })

  it('should show saving state during save', async () => {
    const onSave = vi.fn().mockImplementation(() => new Promise(resolve => setTimeout(resolve, 100)))
    const wrapper = shallowMount(AutoSaveField, {
      props: {
        modelValue: 'initial',
        label: 'Test Field',
        onSave
      }
    })

    const vm = wrapper.vm as any
    vm.handleInput('updated')
    
    const blurPromise = vm.handleBlur()
    expect(vm.saving).toBe(true)
    
    await blurPromise
    expect(vm.saving).toBe(false)
  })

  it('should show saved state after successful save', async () => {
    vi.useFakeTimers()
    const onSave = vi.fn().mockResolvedValue(undefined)
    const wrapper = shallowMount(AutoSaveField, {
      props: {
        modelValue: 'initial',
        label: 'Test Field',
        onSave
      }
    })

    const vm = wrapper.vm as any
    vm.handleInput('updated')
    await vm.handleBlur()

    expect(vm.saved).toBe(true)
    
    // Advance timer to clear saved state
    vi.advanceTimersByTime(2000)
    expect(vm.saved).toBe(false)
    
    vi.useRealTimers()
  })

  it('should clear error and saved state on input', () => {
    const onSave = vi.fn()
    const wrapper = shallowMount(AutoSaveField, {
      props: {
        modelValue: 'initial',
        label: 'Test Field',
        onSave
      }
    })

    const vm = wrapper.vm as any
    vm.error = 'previous error'
    vm.saved = true
    
    vm.handleInput('new value')
    
    expect(vm.error).toBe(null)
    expect(vm.saved).toBe(false)
  })

  it('should handle error without message', async () => {
    const onSave = vi.fn().mockRejectedValue({}) // Error without message
    const wrapper = shallowMount(AutoSaveField, {
      props: {
        modelValue: 'initial',
        label: 'Test Field',
        onSave
      }
    })

    const vm = wrapper.vm as any
    vm.handleInput('updated')
    await vm.handleBlur()

    expect(vm.error).toBe('Failed to save')
  })

  it('should show saving state in textarea mode', async () => {
    const onSave = vi.fn().mockImplementation(() => new Promise(resolve => setTimeout(resolve, 100)))
    const wrapper = shallowMount(AutoSaveField, {
      props: {
        modelValue: 'initial',
        label: 'Test Field',
        onSave,
        textarea: true
      }
    })

    const vm = wrapper.vm as any
    vm.handleInput('updated')
    
    const blurPromise = vm.handleBlur()
    expect(vm.saving).toBe(true)
    
    await blurPromise
    expect(vm.saving).toBe(false)
  })

  it('should show saved state in textarea mode', async () => {
    vi.useFakeTimers()
    const onSave = vi.fn().mockResolvedValue(undefined)
    const wrapper = shallowMount(AutoSaveField, {
      props: {
        modelValue: 'initial',
        label: 'Test Field',
        onSave,
        textarea: true
      }
    })

    const vm = wrapper.vm as any
    vm.handleInput('updated')
    await vm.handleBlur()

    expect(vm.saved).toBe(true)
    
    // Advance timer to clear saved state
    vi.advanceTimersByTime(2000)
    expect(vm.saved).toBe(false)
    
    vi.useRealTimers()
  })
})
