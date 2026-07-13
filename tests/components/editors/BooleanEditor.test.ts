import { describe, it, expect, vi, beforeEach } from 'vitest'
import { mount } from '@vue/test-utils'
import { ref } from 'vue'
import BooleanEditor from '../../../src/components/editors/BooleanEditor.vue'
import { dataCardContextKey } from '../../../src/composables/useDataCardContext'

describe('BooleanEditor', () => {
  beforeEach(() => {
    vi.clearAllMocks()
  })

  describe('standalone modelValue + onSave', () => {
    it('should default to editable=true and render a switch input', () => {
      const wrapper = mount(BooleanEditor, {
        props: { modelValue: false, onSave: vi.fn() },
      })

      expect(wrapper.find('input[type="checkbox"]').exists()).toBe(true)
    })

    it('should save immediately on change (not blur)', async () => {
      const onSave = vi.fn().mockResolvedValue(undefined)
      const wrapper = mount(BooleanEditor, {
        props: { modelValue: false, onSave, label: 'Active' },
      })

      const vm = wrapper.vm as any
      await vm.handleChange(true)

      expect(onSave).toHaveBeenCalledWith(true)
      expect(vm.saved).toBe(true)
    })

    it('should not save when the value is unchanged', async () => {
      const onSave = vi.fn()
      const wrapper = mount(BooleanEditor, {
        props: { modelValue: true, onSave },
      })

      const vm = wrapper.vm as any
      await vm.handleChange(true)

      expect(onSave).not.toHaveBeenCalled()
    })

    it('should handle save errors', async () => {
      const onSave = vi.fn().mockRejectedValue(new Error('Save failed'))
      const wrapper = mount(BooleanEditor, {
        props: { modelValue: false, onSave },
      })

      const vm = wrapper.vm as any
      await vm.handleChange(true)

      expect(vm.error).toBe('Save failed')
    })

    it('should handle save errors without a message', async () => {
      const onSave = vi.fn().mockRejectedValue({})
      const wrapper = mount(BooleanEditor, {
        props: { modelValue: false, onSave },
      })

      const vm = wrapper.vm as any
      await vm.handleChange(true)

      expect(vm.error).toBe('Failed to save')
    })

    it('should clear the saved state after a timeout', async () => {
      vi.useFakeTimers()
      const onSave = vi.fn().mockResolvedValue(undefined)
      const wrapper = mount(BooleanEditor, {
        props: { modelValue: false, onSave },
      })

      const vm = wrapper.vm as any
      const changePromise = vm.handleChange(true)
      await changePromise
      expect(vm.saved).toBe(true)

      vi.advanceTimersByTime(2000)
      expect(vm.saved).toBe(false)
      vi.useRealTimers()
    })

    it('should update currentValue when modelValue prop changes', async () => {
      const wrapper = mount(BooleanEditor, {
        props: { modelValue: false, onSave: vi.fn() },
      })

      const vm = wrapper.vm as any
      expect(vm.currentValue).toBe(false)

      await wrapper.setProps({ modelValue: true })
      expect(vm.currentValue).toBe(true)
    })
  })

  describe('editable / visible contract', () => {
    it('should render a plain Yes/No display when editable is false', () => {
      const wrapper = mount(BooleanEditor, {
        props: { modelValue: true, editable: false, automationId: 'thing-edit-active' },
      })

      expect(wrapper.find('input').exists()).toBe(false)
      expect(wrapper.text()).toContain('Yes')
      expect(wrapper.find('[data-automation-id="thing-edit-active-display"]').exists()).toBe(true)
    })

    it('should render "No" for a false value in display mode', () => {
      const wrapper = mount(BooleanEditor, {
        props: { modelValue: false, editable: false },
      })

      expect(wrapper.text()).toContain('No')
    })

    it('should render the label in display mode when provided', () => {
      const wrapper = mount(BooleanEditor, {
        props: { modelValue: true, editable: false, label: 'Active' },
      })

      expect(wrapper.text()).toContain('Active')
    })

    it('should render an em-dash placeholder when the display value is empty', () => {
      const wrapper = mount(BooleanEditor, {
        props: { modelValue: undefined, editable: false },
      })

      expect(wrapper.text()).toContain('—')
    })

    it('should not double-suffix an automationId that already ends with -display', () => {
      const wrapper = mount(BooleanEditor, {
        props: { modelValue: true, editable: false, automationId: 'thing-edit-active-display' },
      })

      expect(wrapper.find('[data-automation-id="thing-edit-active-display"]').exists()).toBe(true)
    })

    it('should render nothing when visible is false', () => {
      const wrapper = mount(BooleanEditor, {
        props: { modelValue: true, onSave: vi.fn(), visible: false },
      })

      expect(wrapper.html()).toBe('<!--v-if-->')
    })
  })

  describe('DataCard context (provide/inject)', () => {
    it('should prefer the injected DataCard model value over modelValue when field is set', () => {
      const model = ref({ active: true })
      const wrapper = mount(BooleanEditor, {
        props: { field: 'active', modelValue: false },
        global: {
          provide: { [dataCardContextKey as symbol]: { model, onSave: vi.fn() } },
        },
      })

      const vm = wrapper.vm as any
      expect(vm.currentValue).toBe(true)
    })

    it('should call context.onSave(field, value) instead of the standalone onSave when field is set', async () => {
      const model = ref({ active: false })
      const contextOnSave = vi.fn().mockResolvedValue(undefined)
      const standaloneOnSave = vi.fn()
      const wrapper = mount(BooleanEditor, {
        props: { field: 'active', onSave: standaloneOnSave },
        global: {
          provide: { [dataCardContextKey as symbol]: { model, onSave: contextOnSave } },
        },
      })

      const vm = wrapper.vm as any
      await vm.handleChange(true)

      expect(contextOnSave).toHaveBeenCalledWith('active', true)
      expect(standaloneOnSave).not.toHaveBeenCalled()
    })
  })
})
