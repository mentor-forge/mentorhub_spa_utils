import { describe, it, expect, vi, beforeEach } from 'vitest'
import { shallowMount } from '@vue/test-utils'
import AutoSaveSelect from '../../src/components/AutoSaveSelect.vue'

describe('AutoSaveSelect', () => {
  const items = ['active', 'archived']

  beforeEach(() => {
    vi.clearAllMocks()
  })

  it('should have correct initial props', () => {
    const onSave = vi.fn()
    const wrapper = shallowMount(AutoSaveSelect, {
      props: {
        modelValue: 'active',
        label: 'Status',
        items,
        onSave
      }
    })

    expect(wrapper.props('modelValue')).toBe('active')
    expect(wrapper.props('label')).toBe('Status')
  })

  it('should call onSave with new value', async () => {
    const onSave = vi.fn().mockResolvedValue(undefined)
    const wrapper = shallowMount(AutoSaveSelect, {
      props: {
        modelValue: 'active',
        label: 'Status',
        items,
        onSave
      }
    })

    const vm = wrapper.vm as any
    vm.handleInput('archived')
    await vm.handleBlur()

    expect(onSave).toHaveBeenCalledWith('archived')
  })

  it('should not call onSave when value unchanged', async () => {
    const onSave = vi.fn()
    const wrapper = shallowMount(AutoSaveSelect, {
      props: {
        modelValue: 'active',
        label: 'Status',
        items,
        onSave
      }
    })

    const vm = wrapper.vm as any
    await vm.handleBlur()

    expect(onSave).not.toHaveBeenCalled()
  })

  it('should handle save errors', async () => {
    const onSave = vi.fn().mockRejectedValue(new Error('Save failed'))
    const wrapper = shallowMount(AutoSaveSelect, {
      props: {
        modelValue: 'active',
        label: 'Status',
        items,
        onSave
      }
    })

    const vm = wrapper.vm as any
    vm.handleInput('archived')
    await vm.handleBlur()

    expect(vm.error).toBe('Save failed')
  })

  it('should accept items as array of objects', () => {
    const itemsAsObjects = [
      { title: 'Active', value: 'active' },
      { title: 'Archived', value: 'archived' }
    ]

    const wrapper = shallowMount(AutoSaveSelect, {
      props: {
        modelValue: 'active',
        label: 'Status',
        items: itemsAsObjects,
        onSave: vi.fn()
      }
    })

    expect(wrapper.props('items')).toEqual(itemsAsObjects)
  })

  it('should update currentValue when modelValue prop changes', async () => {
    const onSave = vi.fn()
    const wrapper = shallowMount(AutoSaveSelect, {
      props: {
        modelValue: 'active',
        label: 'Status',
        items,
        onSave
      }
    })

    const vm = wrapper.vm as any
    expect(vm.currentValue).toBe('active')

    await wrapper.setProps({ modelValue: 'archived' })
    expect(vm.currentValue).toBe('archived')
  })

  it('should show saved state after successful save', async () => {
    vi.useFakeTimers()
    const onSave = vi.fn().mockResolvedValue(undefined)
    const wrapper = shallowMount(AutoSaveSelect, {
      props: {
        modelValue: 'active',
        label: 'Status',
        items,
        onSave
      }
    })

    const vm = wrapper.vm as any
    vm.handleInput('archived')
    await vm.handleBlur()

    expect(vm.saved).toBe(true)
    
    // Advance timer to clear saved state
    vi.advanceTimersByTime(2000)
    expect(vm.saved).toBe(false)
    
    vi.useRealTimers()
  })

  it('should clear error and saved state on input', () => {
    const onSave = vi.fn()
    const wrapper = shallowMount(AutoSaveSelect, {
      props: {
        modelValue: 'active',
        label: 'Status',
        items,
        onSave
      }
    })

    const vm = wrapper.vm as any
    vm.error = 'previous error'
    vm.saved = true
    
    vm.handleInput('archived')
    
    expect(vm.error).toBe(null)
    expect(vm.saved).toBe(false)
  })

  it('should handle error without message', async () => {
    const onSave = vi.fn().mockRejectedValue({}) // Error without message
    const wrapper = shallowMount(AutoSaveSelect, {
      props: {
        modelValue: 'active',
        label: 'Status',
        items,
        onSave
      }
    })

    const vm = wrapper.vm as any
    vm.handleInput('archived')
    await vm.handleBlur()

    expect(vm.error).toBe('Failed to save')
  })
})
