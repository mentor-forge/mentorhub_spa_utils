import { describe, it, expect, vi, beforeEach } from 'vitest'
import { mount } from '@vue/test-utils'
import { ref } from 'vue'
import DateTimeEditor from '../../../src/components/editors/DateTimeEditor.vue'
import { dataCardContextKey } from '../../../src/composables/useDataCardContext'

describe('DateTimeEditor', () => {
  beforeEach(() => {
    vi.clearAllMocks()
  })

  describe('standalone modelValue + onSave', () => {
    it('should default to editable=true and render separate date and time inputs', () => {
      const wrapper = mount(DateTimeEditor, {
        props: { modelValue: '2024-01-15T10:30:00.000Z', onSave: vi.fn() },
      })

      const inputs = wrapper.findAll('input')
      expect(inputs.length).toBe(2)
    })

    it('should split an ISO date-time into date/time parts users edit', () => {
      // Unzoned ISO string so the assertion is independent of the test runner's local timezone.
      const wrapper = mount(DateTimeEditor, {
        props: { modelValue: '2024-01-15T10:30:45', onSave: vi.fn() },
      })

      const vm = wrapper.vm as any
      expect(vm.dateInput).toBe('2024-01-15')
      expect(vm.timeInput).toBe('10:30:45')
    })

    it('should not present a raw ISO text field as the primary edit UX', () => {
      const wrapper = mount(DateTimeEditor, {
        props: { modelValue: '2024-01-15T10:30:00.000Z', onSave: vi.fn() },
      })

      expect(wrapper.text()).not.toContain('2024-01-15T10:30:00')
    })

    it('should recombine date + time into an ISO string and save on composite blur', async () => {
      const onSave = vi.fn().mockResolvedValue(undefined)
      const wrapper = mount(DateTimeEditor, {
        props: { modelValue: '2024-01-15T10:30:00.000Z', onSave },
      })

      const vm = wrapper.vm as any
      vm.dateInput = '2024-02-20'
      vm.timeInput = '14:45:00'
      await vm.handleBlur()

      expect(onSave).toHaveBeenCalledTimes(1)
      const [savedIso] = onSave.mock.calls[0]
      const savedDate = new Date(savedIso)
      expect(savedDate.getFullYear()).toBe(2024)
      expect(savedDate.getMonth()).toBe(1)
      expect(savedDate.getDate()).toBe(20)
      expect(savedDate.getHours()).toBe(14)
      expect(savedDate.getMinutes()).toBe(45)
    })

    it('should not save when neither date nor time part changed', async () => {
      const onSave = vi.fn()
      const wrapper = mount(DateTimeEditor, {
        props: { modelValue: '2024-01-15T10:30:00.000Z', onSave },
      })

      const vm = wrapper.vm as any
      await vm.handleBlur()

      expect(onSave).not.toHaveBeenCalled()
    })

    it('should only save once focus leaves the whole composite control, not per sub-field', async () => {
      const onSave = vi.fn().mockResolvedValue(undefined)
      const wrapper = mount(DateTimeEditor, {
        props: { modelValue: '2024-01-15T10:30:00', onSave },
      })

      const vm = wrapper.vm as any
      vm.dateInput = '2024-02-20'
      const container = wrapper.find('.date-time-editor__controls').element as HTMLElement
      const innerInput = wrapper.findAll('input')[0].element

      // Focus moving between the date/time sub-fields (still inside the composite) must not save yet.
      await vm.handleContainerBlur({ currentTarget: container, relatedTarget: innerInput } as unknown as FocusEvent)
      expect(onSave).not.toHaveBeenCalled()

      // Focus leaving the composite entirely triggers the single save.
      await vm.handleContainerBlur({ currentTarget: container, relatedTarget: null } as unknown as FocusEvent)
      expect(onSave).toHaveBeenCalledTimes(1)
    })

    it('should handle save errors', async () => {
      const onSave = vi.fn().mockRejectedValue(new Error('Save failed'))
      const wrapper = mount(DateTimeEditor, {
        props: { modelValue: '2024-01-15T10:30:00.000Z', onSave },
      })

      const vm = wrapper.vm as any
      vm.dateInput = '2024-03-01'
      await vm.handleBlur()

      expect(vm.error).toBe('Save failed')
    })

    it('should show saved state then clear it after a timeout', async () => {
      vi.useFakeTimers()
      const onSave = vi.fn().mockResolvedValue(undefined)
      const wrapper = mount(DateTimeEditor, {
        props: { modelValue: '2024-01-15T10:30:00', onSave },
      })

      const vm = wrapper.vm as any
      vm.dateInput = '2024-03-01'
      await vm.handleBlur()
      expect(vm.saved).toBe(true)

      vi.advanceTimersByTime(2000)
      expect(vm.saved).toBe(false)
      vi.useRealTimers()
    })

    it('should update date/time inputs when modelValue prop changes', async () => {
      const wrapper = mount(DateTimeEditor, {
        props: { modelValue: '2024-01-15T10:30:00', onSave: vi.fn() },
      })

      const vm = wrapper.vm as any
      await wrapper.setProps({ modelValue: '2025-06-01T00:00:00' })

      expect(vm.dateInput).toBe('2025-06-01')
    })
  })

  describe('editable / visible contract', () => {
    it('should render a formatted display when editable is false', () => {
      const wrapper = mount(DateTimeEditor, {
        props: { modelValue: '2024-01-15T10:30:00.000Z', editable: false, automationId: 'thing-edit-when' },
      })

      expect(wrapper.find('input').exists()).toBe(false)
      expect(wrapper.find('[data-automation-id="thing-edit-when-display"]').exists()).toBe(true)
    })

    it('should render an em-dash placeholder when empty', () => {
      const wrapper = mount(DateTimeEditor, {
        props: { modelValue: undefined, editable: false },
      })

      expect(wrapper.text()).toContain('—')
    })

    it('should render nothing when visible is false', () => {
      const wrapper = mount(DateTimeEditor, {
        props: { modelValue: '2024-01-15T10:30:00.000Z', visible: false },
      })

      expect(wrapper.html()).toBe('<!--v-if-->')
    })
  })

  describe('DataCard context (provide/inject)', () => {
    it('should prefer the injected DataCard model value over modelValue when field is set', () => {
      const model = ref({ scheduledAt: '2024-05-05T05:05:00.000Z' })
      const wrapper = mount(DateTimeEditor, {
        props: { field: 'scheduledAt', modelValue: '2024-01-01T00:00:00.000Z' },
        global: {
          provide: { [dataCardContextKey as symbol]: { model, onSave: vi.fn() } },
        },
      })

      const vm = wrapper.vm as any
      expect(vm.dateInput).toBe('2024-05-05')
    })

    it('should call context.onSave(field, value) instead of the standalone onSave when field is set', async () => {
      const model = ref({ scheduledAt: '2024-01-01T00:00:00.000Z' })
      const contextOnSave = vi.fn().mockResolvedValue(undefined)
      const standaloneOnSave = vi.fn()
      const wrapper = mount(DateTimeEditor, {
        props: { field: 'scheduledAt', onSave: standaloneOnSave },
        global: {
          provide: { [dataCardContextKey as symbol]: { model, onSave: contextOnSave } },
        },
      })

      const vm = wrapper.vm as any
      vm.dateInput = '2024-07-04'
      await vm.handleBlur()

      expect(contextOnSave).toHaveBeenCalled()
      expect(standaloneOnSave).not.toHaveBeenCalled()
    })
  })
})
