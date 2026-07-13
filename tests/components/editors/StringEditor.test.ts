import { describe, it, expect, vi, beforeEach } from 'vitest'
import { mount } from '@vue/test-utils'
import { ref } from 'vue'
import StringEditor from '../../../src/components/editors/StringEditor.vue'
import { dataCardContextKey } from '../../../src/composables/useDataCardContext'

describe('StringEditor', () => {
  beforeEach(() => {
    vi.clearAllMocks()
  })

  describe('standalone modelValue + onSave', () => {
    it('should have correct initial props', () => {
      const onSave = vi.fn()
      const wrapper = mount(StringEditor, {
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
      const wrapper = mount(StringEditor, {
        props: { modelValue: 'initial', label: 'Test Field', onSave }
      })

      const vm = wrapper.vm as any
      vm.handleInput('updated')
      await vm.handleBlur()

      expect(onSave).toHaveBeenCalledWith('updated')
    })

    it('should not call onSave when value unchanged', async () => {
      const onSave = vi.fn()
      const wrapper = mount(StringEditor, {
        props: { modelValue: 'initial', label: 'Test Field', onSave }
      })

      const vm = wrapper.vm as any
      await vm.handleBlur()

      expect(onSave).not.toHaveBeenCalled()
    })

    it('should handle save errors', async () => {
      const onSave = vi.fn().mockRejectedValue(new Error('Save failed'))
      const wrapper = mount(StringEditor, {
        props: { modelValue: 'initial', label: 'Test Field', onSave }
      })

      const vm = wrapper.vm as any
      vm.handleInput('updated')
      await vm.handleBlur()

      expect(vm.error).toBe('Save failed')
    })

    it('should handle error without message', async () => {
      const onSave = vi.fn().mockRejectedValue({})
      const wrapper = mount(StringEditor, {
        props: { modelValue: 'initial', label: 'Test Field', onSave }
      })

      const vm = wrapper.vm as any
      vm.handleInput('updated')
      await vm.handleBlur()

      expect(vm.error).toBe('Failed to save')
    })

    it('should show saving then saved state, clearing saved after timeout', async () => {
      vi.useFakeTimers()
      const onSave = vi.fn().mockResolvedValue(undefined)
      const wrapper = mount(StringEditor, {
        props: { modelValue: 'initial', label: 'Test Field', onSave }
      })

      const vm = wrapper.vm as any
      vm.handleInput('updated')

      const blurPromise = vm.handleBlur()
      expect(vm.saving).toBe(true)
      await blurPromise
      expect(vm.saving).toBe(false)
      expect(vm.saved).toBe(true)

      vi.advanceTimersByTime(2000)
      expect(vm.saved).toBe(false)
      vi.useRealTimers()
    })

    it('should clear error and saved state on input', () => {
      const wrapper = mount(StringEditor, {
        props: { modelValue: 'initial', label: 'Test Field', onSave: vi.fn() }
      })

      const vm = wrapper.vm as any
      vm.error = 'previous error'
      vm.saved = true

      vm.handleInput('new value')

      expect(vm.error).toBe(null)
      expect(vm.saved).toBe(false)
    })

    it('should update currentValue when modelValue prop changes', async () => {
      const wrapper = mount(StringEditor, {
        props: { modelValue: 'initial', label: 'Test Field', onSave: vi.fn() }
      })

      const vm = wrapper.vm as any
      expect(vm.currentValue).toBe('initial')

      await wrapper.setProps({ modelValue: 'updated' })
      expect(vm.currentValue).toBe('updated')
    })

    it('should render a textarea when textarea prop is true', () => {
      const wrapper = mount(StringEditor, {
        props: { modelValue: 'test', label: 'Test', onSave: vi.fn(), textarea: true, rows: 3 }
      })

      expect(wrapper.find('textarea').exists()).toBe(true)
    })
  })

  describe('editable / visible contract', () => {
    it('should default to editable and visible', () => {
      const wrapper = mount(StringEditor, {
        props: { modelValue: 'value', label: 'Label', onSave: vi.fn() }
      })

      expect(wrapper.find('input').exists()).toBe(true)
    })

    it('should render a plain display (not an input) when editable is false', () => {
      const wrapper = mount(StringEditor, {
        props: { modelValue: 'read-only value', label: 'Label', editable: false, automationId: 'thing-edit-name' }
      })

      expect(wrapper.find('input').exists()).toBe(false)
      expect(wrapper.text()).toContain('read-only value')
      expect(wrapper.find('[data-automation-id="thing-edit-name-display"]').exists()).toBe(true)
    })

    it('should not double-suffix an automationId that already ends with -display', () => {
      const wrapper = mount(StringEditor, {
        props: { modelValue: 'value', editable: false, automationId: 'thing-edit-name-display' }
      })

      expect(wrapper.find('[data-automation-id="thing-edit-name-display"]').exists()).toBe(true)
    })

    it('should render an em-dash placeholder when the display value is empty', () => {
      const wrapper = mount(StringEditor, {
        props: { modelValue: undefined, editable: false }
      })

      expect(wrapper.text()).toContain('—')
    })

    it('should render nothing when visible is false', () => {
      const wrapper = mount(StringEditor, {
        props: { modelValue: 'value', label: 'Label', onSave: vi.fn(), visible: false }
      })

      expect(wrapper.find('input').exists()).toBe(false)
      expect(wrapper.html()).toBe('<!--v-if-->')
    })
  })

  describe('DataCard context (provide/inject)', () => {
    function mountWithContext(context: Record<string, unknown>, props: Record<string, unknown>) {
      return mount(StringEditor, {
        props,
        global: {
          provide: { [dataCardContextKey as symbol]: context }
        }
      })
    }

    it('should prefer the injected DataCard model value over modelValue when field is set', () => {
      const model = ref({ name: 'From Card' })
      const onSave = vi.fn().mockResolvedValue(undefined)
      const wrapper = mountWithContext({ model, onSave }, { field: 'name', modelValue: 'ignored', label: 'Name' })

      const vm = wrapper.vm as any
      expect(vm.currentValue).toBe('From Card')
    })

    it('should call context.onSave(field, value) instead of the standalone onSave when field is set', async () => {
      const model = ref({ name: 'From Card' })
      const contextOnSave = vi.fn().mockResolvedValue(undefined)
      const standaloneOnSave = vi.fn()
      const wrapper = mountWithContext(
        { model, onSave: contextOnSave },
        { field: 'name', onSave: standaloneOnSave, label: 'Name' }
      )

      const vm = wrapper.vm as any
      vm.handleInput('Updated Name')
      await vm.handleBlur()

      expect(contextOnSave).toHaveBeenCalledWith('name', 'Updated Name')
      expect(standaloneOnSave).not.toHaveBeenCalled()
    })

    it('should fall back to standalone modelValue/onSave when no field is provided, even with context present', async () => {
      const model = ref({ name: 'From Card' })
      const contextOnSave = vi.fn().mockResolvedValue(undefined)
      const standaloneOnSave = vi.fn().mockResolvedValue(undefined)
      const wrapper = mountWithContext(
        { model, onSave: contextOnSave },
        { modelValue: 'standalone value', onSave: standaloneOnSave, label: 'Name' }
      )

      const vm = wrapper.vm as any
      expect(vm.currentValue).toBe('standalone value')

      vm.handleInput('changed')
      await vm.handleBlur()

      expect(standaloneOnSave).toHaveBeenCalledWith('changed')
      expect(contextOnSave).not.toHaveBeenCalled()
    })
  })
})
