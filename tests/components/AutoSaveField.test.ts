import { describe, it, expect, vi, beforeEach } from 'vitest'
import { mount } from '@vue/test-utils'
import AutoSaveField from '../../src/components/AutoSaveField.vue'
import StringEditor from '../../src/components/editors/StringEditor.vue'

// F017: AutoSaveField is now a thin compatibility wrapper around StringEditor.
// These tests verify the wrapper forwards its (unchanged) public prop surface
// and that save-on-blur behavior still works end-to-end through the delegate.
// StringEditor's own behavior (display mode, field/context injection, visible
// toggling, etc.) is covered in editors/StringEditor.test.ts.
describe('AutoSaveField', () => {
  beforeEach(() => {
    vi.clearAllMocks()
  })

  it('should have correct initial props', () => {
    const onSave = vi.fn()
    const wrapper = mount(AutoSaveField, {
      props: {
        modelValue: 'test value',
        label: 'Test Field',
        onSave
      }
    })

    expect(wrapper.props('modelValue')).toBe('test value')
    expect(wrapper.props('label')).toBe('Test Field')
  })

  it('should forward its full prop surface to StringEditor unchanged', () => {
    const onSave = vi.fn()
    const rules = [(v: string | number) => !!v || 'required']
    const wrapper = mount(AutoSaveField, {
      props: {
        modelValue: 'initial',
        label: 'Test Field',
        onSave,
        hint: 'a hint',
        rules,
        textarea: true,
        rows: 4,
        automationId: 'demo-autosave-field'
      }
    })

    const editor = wrapper.findComponent(StringEditor)
    expect(editor.exists()).toBe(true)
    expect(editor.props()).toMatchObject({
      modelValue: 'initial',
      label: 'Test Field',
      onSave,
      hint: 'a hint',
      rules,
      textarea: true,
      rows: 4,
      automationId: 'demo-autosave-field'
    })
  })

  it('should call onSave with new value', async () => {
    const onSave = vi.fn().mockResolvedValue(undefined)
    const wrapper = mount(AutoSaveField, {
      props: {
        modelValue: 'initial',
        label: 'Test Field',
        onSave
      }
    })

    const vm = wrapper.findComponent(StringEditor).vm as any
    vm.handleInput('updated')
    await vm.handleBlur()

    expect(onSave).toHaveBeenCalledWith('updated')
  })

  it('should not call onSave when value unchanged', async () => {
    const onSave = vi.fn()
    const wrapper = mount(AutoSaveField, {
      props: {
        modelValue: 'initial',
        label: 'Test Field',
        onSave
      }
    })

    const vm = wrapper.findComponent(StringEditor).vm as any
    await vm.handleBlur()

    expect(onSave).not.toHaveBeenCalled()
  })

  it('should handle save errors', async () => {
    const onSave = vi.fn().mockRejectedValue(new Error('Save failed'))
    const wrapper = mount(AutoSaveField, {
      props: {
        modelValue: 'initial',
        label: 'Test Field',
        onSave
      }
    })

    const vm = wrapper.findComponent(StringEditor).vm as any
    vm.handleInput('updated')
    await vm.handleBlur()

    expect(vm.error).toBe('Save failed')
  })

  it('should accept textarea prop', () => {
    const wrapper = mount(AutoSaveField, {
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
    expect(wrapper.find('textarea').exists()).toBe(true)
  })

  it('should update currentValue when modelValue prop changes', async () => {
    const onSave = vi.fn()
    const wrapper = mount(AutoSaveField, {
      props: {
        modelValue: 'initial',
        label: 'Test Field',
        onSave
      }
    })

    const vm = wrapper.findComponent(StringEditor).vm as any
    expect(vm.currentValue).toBe('initial')

    await wrapper.setProps({ modelValue: 'updated' })
    expect(vm.currentValue).toBe('updated')
  })

  it('should show saving state during save', async () => {
    const onSave = vi.fn().mockImplementation(() => new Promise(resolve => setTimeout(resolve, 100)))
    const wrapper = mount(AutoSaveField, {
      props: {
        modelValue: 'initial',
        label: 'Test Field',
        onSave
      }
    })

    const vm = wrapper.findComponent(StringEditor).vm as any
    vm.handleInput('updated')

    const blurPromise = vm.handleBlur()
    expect(vm.saving).toBe(true)

    await blurPromise
    expect(vm.saving).toBe(false)
  })

  it('should show saved state after successful save', async () => {
    vi.useFakeTimers()
    const onSave = vi.fn().mockResolvedValue(undefined)
    const wrapper = mount(AutoSaveField, {
      props: {
        modelValue: 'initial',
        label: 'Test Field',
        onSave
      }
    })

    const vm = wrapper.findComponent(StringEditor).vm as any
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
    const wrapper = mount(AutoSaveField, {
      props: {
        modelValue: 'initial',
        label: 'Test Field',
        onSave
      }
    })

    const vm = wrapper.findComponent(StringEditor).vm as any
    vm.error = 'previous error'
    vm.saved = true

    vm.handleInput('new value')

    expect(vm.error).toBe(null)
    expect(vm.saved).toBe(false)
  })

  it('should handle error without message', async () => {
    const onSave = vi.fn().mockRejectedValue({}) // Error without message
    const wrapper = mount(AutoSaveField, {
      props: {
        modelValue: 'initial',
        label: 'Test Field',
        onSave
      }
    })

    const vm = wrapper.findComponent(StringEditor).vm as any
    vm.handleInput('updated')
    await vm.handleBlur()

    expect(vm.error).toBe('Failed to save')
  })

  it('should show saving state in textarea mode', async () => {
    const onSave = vi.fn().mockImplementation(() => new Promise(resolve => setTimeout(resolve, 100)))
    const wrapper = mount(AutoSaveField, {
      props: {
        modelValue: 'initial',
        label: 'Test Field',
        onSave,
        textarea: true
      }
    })

    const vm = wrapper.findComponent(StringEditor).vm as any
    vm.handleInput('updated')

    const blurPromise = vm.handleBlur()
    expect(vm.saving).toBe(true)

    await blurPromise
    expect(vm.saving).toBe(false)
  })

  it('should show saved state in textarea mode', async () => {
    vi.useFakeTimers()
    const onSave = vi.fn().mockResolvedValue(undefined)
    const wrapper = mount(AutoSaveField, {
      props: {
        modelValue: 'initial',
        label: 'Test Field',
        onSave,
        textarea: true
      }
    })

    const vm = wrapper.findComponent(StringEditor).vm as any
    vm.handleInput('updated')
    await vm.handleBlur()

    expect(vm.saved).toBe(true)

    // Advance timer to clear saved state
    vi.advanceTimersByTime(2000)
    expect(vm.saved).toBe(false)

    vi.useRealTimers()
  })
})
