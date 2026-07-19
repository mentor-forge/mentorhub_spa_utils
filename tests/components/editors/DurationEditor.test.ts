import { describe, it, expect, vi, beforeEach } from 'vitest'
import { mount } from '@vue/test-utils'
import { ref } from 'vue'
import DurationEditor from '../../../src/components/editors/DurationEditor.vue'
import { dataCardContextKey } from '../../../src/composables/useDataCardContext'

describe('DurationEditor', () => {
  beforeEach(() => {
    vi.clearAllMocks()
  })

  describe('standalone modelValue + onSave', () => {
    it('should render day/hour/minute fields without a seconds or raw ISO input', () => {
      const wrapper = mount(DurationEditor, {
        props: { modelValue: 'P3DT4H30M', onSave: vi.fn() },
      })

      const inputs = wrapper.findAll('input')
      expect(inputs.length).toBe(3)
      expect(wrapper.text()).not.toContain('Seconds')
      expect(wrapper.text()).not.toContain('P3DT4H30M')
    })

    it('should parse seconds internally so existing wire precision is preserved', () => {
      const wrapper = mount(DurationEditor, {
        props: { modelValue: 'P3DT4H30M15S', onSave: vi.fn() },
      })

      const vm = wrapper.vm as any
      expect(vm.daysInput).toBe(3)
      expect(vm.hoursInput).toBe(4)
      expect(vm.minutesInput).toBe(30)
      expect(vm.secondsInput).toBe(15)
    })

    it('should preserve existing seconds when an editable unit changes', async () => {
      const onSave = vi.fn().mockResolvedValue(undefined)
      const wrapper = mount(DurationEditor, {
        props: { modelValue: 'PT4H30M15S', onSave },
      })

      const vm = wrapper.vm as any
      vm.minutesInput = 45
      await vm.handleBlur()

      expect(onSave).toHaveBeenCalledWith('PT4H45M15S')
    })

    it('should serialize edited units into an ISO duration string and save on composite blur', async () => {
      const onSave = vi.fn().mockResolvedValue(undefined)
      const wrapper = mount(DurationEditor, {
        props: { modelValue: 'PT0S', onSave },
      })

      const vm = wrapper.vm as any
      vm.daysInput = 1
      vm.hoursInput = 2
      vm.minutesInput = 0
      await vm.handleBlur()

      expect(onSave).toHaveBeenCalledWith('P1DT2H')
    })

    it('should not save when the composite value is unchanged', async () => {
      const onSave = vi.fn()
      const wrapper = mount(DurationEditor, {
        props: { modelValue: 'P3D', onSave },
      })

      const vm = wrapper.vm as any
      await vm.handleBlur()

      expect(onSave).not.toHaveBeenCalled()
    })

    it('should treat an unset modelValue the same as an explicit zero duration', async () => {
      const onSave = vi.fn()
      const wrapper = mount(DurationEditor, {
        props: { modelValue: undefined, onSave },
      })

      const vm = wrapper.vm as any
      await vm.handleBlur()

      expect(onSave).not.toHaveBeenCalled()
    })

    it('should only save once focus leaves the whole composite control, not per sub-field', async () => {
      const onSave = vi.fn().mockResolvedValue(undefined)
      const wrapper = mount(DurationEditor, {
        props: { modelValue: 'P1D', onSave },
      })

      const vm = wrapper.vm as any
      vm.hoursInput = 5
      const container = wrapper.find('.duration-editor__controls').element as HTMLElement
      const innerInput = wrapper.findAll('input')[1].element

      // Focus moving between the day/hour/minute sub-fields (still inside the
      // composite) must not save yet.
      await vm.handleContainerBlur({ currentTarget: container, relatedTarget: innerInput } as unknown as FocusEvent)
      expect(onSave).not.toHaveBeenCalled()

      // Focus leaving the composite entirely triggers the single save.
      await vm.handleContainerBlur({ currentTarget: container, relatedTarget: null } as unknown as FocusEvent)
      expect(onSave).toHaveBeenCalledTimes(1)
    })

    it('should handle save errors', async () => {
      const onSave = vi.fn().mockRejectedValue(new Error('Save failed'))
      const wrapper = mount(DurationEditor, {
        props: { modelValue: 'PT0S', onSave },
      })

      const vm = wrapper.vm as any
      vm.minutesInput = 5
      await vm.handleBlur()

      expect(vm.error).toBe('Save failed')
    })

    it('should show saved state then clear it after a timeout', async () => {
      vi.useFakeTimers()
      const onSave = vi.fn().mockResolvedValue(undefined)
      const wrapper = mount(DurationEditor, {
        props: { modelValue: 'PT0S', onSave },
      })

      const vm = wrapper.vm as any
      vm.minutesInput = 5
      await vm.handleBlur()
      expect(vm.saved).toBe(true)

      vi.advanceTimersByTime(2000)
      expect(vm.saved).toBe(false)
      vi.useRealTimers()
    })

    it('should update the structured parts when modelValue prop changes', async () => {
      const wrapper = mount(DurationEditor, {
        props: { modelValue: 'P1D', onSave: vi.fn() },
      })

      const vm = wrapper.vm as any
      await wrapper.setProps({ modelValue: 'PT45M' })

      expect(vm.daysInput).toBe(0)
      expect(vm.minutesInput).toBe(45)
    })
  })

  describe('editable / visible contract', () => {
    it('should render a readable human summary when editable is false', () => {
      const wrapper = mount(DurationEditor, {
        props: { modelValue: 'P3DT4H30M', editable: false, automationId: 'thing-edit-duration' },
      })

      expect(wrapper.find('input').exists()).toBe(false)
      expect(wrapper.text()).toContain('3 days, 4 hours, 30 minutes')
      expect(wrapper.find('[data-automation-id="thing-edit-duration-display"]').exists()).toBe(true)
    })

    it('should render an em-dash placeholder when empty', () => {
      const wrapper = mount(DurationEditor, {
        props: { modelValue: undefined, editable: false },
      })

      expect(wrapper.text()).toContain('—')
    })

    it('should render nothing when visible is false', () => {
      const wrapper = mount(DurationEditor, {
        props: { modelValue: 'P1D', visible: false },
      })

      expect(wrapper.html()).toBe('<!--v-if-->')
    })
  })

  describe('DataCard context (provide/inject)', () => {
    it('should prefer the injected DataCard model value over modelValue when field is set', () => {
      const model = ref({ ttl: 'P7D' })
      const wrapper = mount(DurationEditor, {
        props: { field: 'ttl', modelValue: 'P1D' },
        global: {
          provide: { [dataCardContextKey as symbol]: { model, onSave: vi.fn() } },
        },
      })

      const vm = wrapper.vm as any
      expect(vm.daysInput).toBe(7)
    })

    it('should call context.onSave(field, value) instead of the standalone onSave when field is set', async () => {
      const model = ref({ ttl: 'PT0S' })
      const contextOnSave = vi.fn().mockResolvedValue(undefined)
      const standaloneOnSave = vi.fn()
      const wrapper = mount(DurationEditor, {
        props: { field: 'ttl', onSave: standaloneOnSave },
        global: {
          provide: { [dataCardContextKey as symbol]: { model, onSave: contextOnSave } },
        },
      })

      const vm = wrapper.vm as any
      vm.hoursInput = 6
      await vm.handleBlur()

      expect(contextOnSave).toHaveBeenCalledWith('ttl', 'PT6H')
      expect(standaloneOnSave).not.toHaveBeenCalled()
    })
  })
})
