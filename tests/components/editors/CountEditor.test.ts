import { describe, it, expect, vi, beforeEach } from 'vitest'
import { mount } from '@vue/test-utils'
import { ref } from 'vue'
import CountEditor from '../../../src/components/editors/CountEditor.vue'
import { validationRules } from '../../../src/utils/validation'
import { dataCardContextKey } from '../../../src/composables/useDataCardContext'

describe('CountEditor', () => {
  beforeEach(() => {
    vi.clearAllMocks()
  })

  describe('standalone modelValue + onSave', () => {
    it('should default to editable=true and render a numeric input', () => {
      const wrapper = mount(CountEditor, {
        props: { modelValue: 3, onSave: vi.fn() },
      })

      expect(wrapper.find('input').exists()).toBe(true)
    })

    it('should save an integer value on blur', async () => {
      const onSave = vi.fn().mockResolvedValue(undefined)
      const wrapper = mount(CountEditor, {
        props: { modelValue: 1, onSave },
      })

      const vm = wrapper.vm as any
      vm.handleInput('5')
      await vm.handleBlur()

      expect(onSave).toHaveBeenCalledWith(5)
    })

    it('should not save when the value is unchanged', async () => {
      const onSave = vi.fn()
      const wrapper = mount(CountEditor, {
        props: { modelValue: 2, onSave },
      })

      const vm = wrapper.vm as any
      await vm.handleBlur()

      expect(onSave).not.toHaveBeenCalled()
    })

    it('should treat an emptied input as undefined', async () => {
      const onSave = vi.fn().mockResolvedValue(undefined)
      const wrapper = mount(CountEditor, {
        props: { modelValue: 2, onSave },
      })

      const vm = wrapper.vm as any
      vm.handleInput('')
      await vm.handleBlur()

      expect(onSave).toHaveBeenCalledWith(undefined)
    })

    it('should handle save errors', async () => {
      const onSave = vi.fn().mockRejectedValue(new Error('Save failed'))
      const wrapper = mount(CountEditor, {
        props: { modelValue: 1, onSave },
      })

      const vm = wrapper.vm as any
      vm.handleInput('9')
      await vm.handleBlur()

      expect(vm.error).toBe('Save failed')
    })

    it('should show saved state then clear it after a timeout', async () => {
      vi.useFakeTimers()
      const onSave = vi.fn().mockResolvedValue(undefined)
      const wrapper = mount(CountEditor, {
        props: { modelValue: 1, onSave },
      })

      const vm = wrapper.vm as any
      vm.handleInput('9')
      await vm.handleBlur()
      expect(vm.saved).toBe(true)

      vi.advanceTimersByTime(2000)
      expect(vm.saved).toBe(false)
      vi.useRealTimers()
    })

    it('should default rules to nonNegativeInteger', () => {
      const wrapper = mount(CountEditor, {
        props: { modelValue: 1, onSave: vi.fn() },
      })

      const vm = wrapper.vm as any
      expect(vm.resolvedRules).toEqual([validationRules.nonNegativeInteger])
    })

    it('should honor a custom rules override', () => {
      const customRules = [(v: number) => !!v || 'required']
      const wrapper = mount(CountEditor, {
        props: { modelValue: 1, onSave: vi.fn(), rules: customRules },
      })

      const vm = wrapper.vm as any
      expect(vm.resolvedRules).toEqual(customRules)
    })
  })

  describe('editable / visible contract', () => {
    it('should render a plain display when editable is false', () => {
      const wrapper = mount(CountEditor, {
        props: { modelValue: 7, editable: false, automationId: 'thing-edit-count' },
      })

      expect(wrapper.find('input').exists()).toBe(false)
      expect(wrapper.text()).toContain('7')
      expect(wrapper.find('[data-automation-id="thing-edit-count-display"]').exists()).toBe(true)
    })

    it('should render an em-dash placeholder when the display value is empty', () => {
      const wrapper = mount(CountEditor, {
        props: { modelValue: undefined, editable: false },
      })

      expect(wrapper.text()).toContain('—')
    })

    it('should render nothing when visible is false', () => {
      const wrapper = mount(CountEditor, {
        props: { modelValue: 1, visible: false },
      })

      expect(wrapper.html()).toBe('<!--v-if-->')
    })
  })

  describe('DataCard context (provide/inject)', () => {
    it('should prefer the injected DataCard model value over modelValue when field is set', () => {
      const model = ref({ count: 12 })
      const wrapper = mount(CountEditor, {
        props: { field: 'count', modelValue: 1 },
        global: {
          provide: { [dataCardContextKey as symbol]: { model, onSave: vi.fn() } },
        },
      })

      const vm = wrapper.vm as any
      expect(vm.currentValue).toBe(12)
    })

    it('should call context.onSave(field, value) instead of the standalone onSave when field is set', async () => {
      const model = ref({ count: 1 })
      const contextOnSave = vi.fn().mockResolvedValue(undefined)
      const standaloneOnSave = vi.fn()
      const wrapper = mount(CountEditor, {
        props: { field: 'count', onSave: standaloneOnSave },
        global: {
          provide: { [dataCardContextKey as symbol]: { model, onSave: contextOnSave } },
        },
      })

      const vm = wrapper.vm as any
      vm.handleInput('8')
      await vm.handleBlur()

      expect(contextOnSave).toHaveBeenCalledWith('count', 8)
      expect(standaloneOnSave).not.toHaveBeenCalled()
    })
  })
})
