import { describe, it, expect, vi, beforeEach } from 'vitest'
import { mount } from '@vue/test-utils'
import { ref } from 'vue'
import IndexEditor from '../../../src/components/editors/IndexEditor.vue'
import { validationRules } from '../../../src/utils/validation'
import { dataCardContextKey } from '../../../src/composables/useDataCardContext'

describe('IndexEditor', () => {
  beforeEach(() => {
    vi.clearAllMocks()
  })

  describe('standalone modelValue + onSave', () => {
    it('should default to editable=true and render a numeric input', () => {
      const wrapper = mount(IndexEditor, {
        props: { modelValue: 0, onSave: vi.fn() },
      })

      expect(wrapper.find('input').exists()).toBe(true)
    })

    it('should save an integer value on blur', async () => {
      const onSave = vi.fn().mockResolvedValue(undefined)
      const wrapper = mount(IndexEditor, {
        props: { modelValue: 0, onSave },
      })

      const vm = wrapper.vm as any
      vm.handleInput('2')
      await vm.handleBlur()

      expect(onSave).toHaveBeenCalledWith(2)
    })

    it('should not save when the value is unchanged', async () => {
      const onSave = vi.fn()
      const wrapper = mount(IndexEditor, {
        props: { modelValue: 0, onSave },
      })

      const vm = wrapper.vm as any
      await vm.handleBlur()

      expect(onSave).not.toHaveBeenCalled()
    })

    it('should handle save errors', async () => {
      const onSave = vi.fn().mockRejectedValue(new Error('Save failed'))
      const wrapper = mount(IndexEditor, {
        props: { modelValue: 0, onSave },
      })

      const vm = wrapper.vm as any
      vm.handleInput('3')
      await vm.handleBlur()

      expect(vm.error).toBe('Save failed')
    })

    it('should show saved state then clear it after a timeout', async () => {
      vi.useFakeTimers()
      const onSave = vi.fn().mockResolvedValue(undefined)
      const wrapper = mount(IndexEditor, {
        props: { modelValue: 0, onSave },
      })

      const vm = wrapper.vm as any
      vm.handleInput('2')
      await vm.handleBlur()
      expect(vm.saved).toBe(true)

      vi.advanceTimersByTime(2000)
      expect(vm.saved).toBe(false)
      vi.useRealTimers()
    })

    it('should default rules to nonNegativeInteger', () => {
      const wrapper = mount(IndexEditor, {
        props: { modelValue: 0, onSave: vi.fn() },
      })

      const vm = wrapper.vm as any
      expect(vm.resolvedRules).toEqual([validationRules.nonNegativeInteger])
    })

    it('should default the hint to a zero-based explanation', () => {
      const wrapper = mount(IndexEditor, {
        props: { modelValue: 0, onSave: vi.fn() },
      })

      const vm = wrapper.vm as any
      expect(vm.resolvedHint).toBe('Zero-based index')
    })

    it('should honor a custom hint override', () => {
      const wrapper = mount(IndexEditor, {
        props: { modelValue: 0, onSave: vi.fn(), hint: 'Position in list' },
      })

      const vm = wrapper.vm as any
      expect(vm.resolvedHint).toBe('Position in list')
    })
  })

  describe('editable / visible contract', () => {
    it('should render a plain display when editable is false', () => {
      const wrapper = mount(IndexEditor, {
        props: { modelValue: 0, editable: false, automationId: 'thing-edit-index' },
      })

      expect(wrapper.find('input').exists()).toBe(false)
      expect(wrapper.text()).toContain('0')
      expect(wrapper.find('[data-automation-id="thing-edit-index-display"]').exists()).toBe(true)
    })

    it('should render an em-dash placeholder when the display value is empty', () => {
      const wrapper = mount(IndexEditor, {
        props: { modelValue: undefined, editable: false },
      })

      expect(wrapper.text()).toContain('—')
    })

    it('should render nothing when visible is false', () => {
      const wrapper = mount(IndexEditor, {
        props: { modelValue: 0, visible: false },
      })

      expect(wrapper.html()).toBe('<!--v-if-->')
    })
  })

  describe('DataCard context (provide/inject)', () => {
    it('should prefer the injected DataCard model value over modelValue when field is set', () => {
      const model = ref({ position: 5 })
      const wrapper = mount(IndexEditor, {
        props: { field: 'position', modelValue: 0 },
        global: {
          provide: { [dataCardContextKey as symbol]: { model, onSave: vi.fn() } },
        },
      })

      const vm = wrapper.vm as any
      expect(vm.currentValue).toBe(5)
    })

    it('should call context.onSave(field, value) instead of the standalone onSave when field is set', async () => {
      const model = ref({ position: 0 })
      const contextOnSave = vi.fn().mockResolvedValue(undefined)
      const standaloneOnSave = vi.fn()
      const wrapper = mount(IndexEditor, {
        props: { field: 'position', onSave: standaloneOnSave },
        global: {
          provide: { [dataCardContextKey as symbol]: { model, onSave: contextOnSave } },
        },
      })

      const vm = wrapper.vm as any
      vm.handleInput('4')
      await vm.handleBlur()

      expect(contextOnSave).toHaveBeenCalledWith('position', 4)
      expect(standaloneOnSave).not.toHaveBeenCalled()
    })
  })
})
