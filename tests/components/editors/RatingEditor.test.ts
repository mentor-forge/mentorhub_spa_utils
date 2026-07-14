import { describe, it, expect, vi, beforeEach } from 'vitest'
import { mount } from '@vue/test-utils'
import { ref } from 'vue'
import RatingEditor from '../../../src/components/editors/RatingEditor.vue'
import { dataCardContextKey } from '../../../src/composables/useDataCardContext'

describe('RatingEditor', () => {
  beforeEach(() => {
    vi.clearAllMocks()
  })

  describe('standalone modelValue + onSave', () => {
    it('should default to editable=true and render the rating control', () => {
      const wrapper = mount(RatingEditor, {
        props: { modelValue: 2, onSave: vi.fn() },
      })

      expect(wrapper.find('.v-rating-stub').exists()).toBe(true)
    })

    it('should save immediately on change (not blur)', async () => {
      const onSave = vi.fn().mockResolvedValue(undefined)
      const wrapper = mount(RatingEditor, {
        props: { modelValue: 1, onSave },
      })

      const vm = wrapper.vm as any
      await vm.handleChange(3)

      expect(onSave).toHaveBeenCalledWith(3)
      expect(vm.saved).toBe(true)
    })

    it('should save via real DOM interaction with the rating control', async () => {
      const onSave = vi.fn().mockResolvedValue(undefined)
      const wrapper = mount(RatingEditor, {
        props: { modelValue: 1, onSave },
      })

      await wrapper.find('.v-rating-stub').trigger('click')
      await vi.waitFor(() => expect(onSave).toHaveBeenCalledWith(3))
    })

    it('should treat a cleared (0) value as undefined on the wire', async () => {
      const onSave = vi.fn().mockResolvedValue(undefined)
      const wrapper = mount(RatingEditor, {
        props: { modelValue: 3, onSave },
      })

      const vm = wrapper.vm as any
      await vm.handleChange(0)

      expect(onSave).toHaveBeenCalledWith(undefined)
      expect(vm.currentValue).toBeUndefined()
    })

    it('should not save when the value is unchanged', async () => {
      const onSave = vi.fn()
      const wrapper = mount(RatingEditor, {
        props: { modelValue: 2, onSave },
      })

      const vm = wrapper.vm as any
      await vm.handleChange(2)

      expect(onSave).not.toHaveBeenCalled()
    })

    it('should handle save errors', async () => {
      const onSave = vi.fn().mockRejectedValue(new Error('Save failed'))
      const wrapper = mount(RatingEditor, {
        props: { modelValue: 1, onSave },
      })

      const vm = wrapper.vm as any
      await vm.handleChange(4)

      expect(vm.error).toBe('Save failed')
    })

    it('should show saved state then clear it after a timeout', async () => {
      vi.useFakeTimers()
      const onSave = vi.fn().mockResolvedValue(undefined)
      const wrapper = mount(RatingEditor, {
        props: { modelValue: 1, onSave },
      })

      const vm = wrapper.vm as any
      await vm.handleChange(4)
      expect(vm.saved).toBe(true)

      vi.advanceTimersByTime(2000)
      expect(vm.saved).toBe(false)
      vi.useRealTimers()
    })

    it('should update currentValue when modelValue prop changes', async () => {
      const wrapper = mount(RatingEditor, {
        props: { modelValue: 1, onSave: vi.fn() },
      })

      const vm = wrapper.vm as any
      expect(vm.currentValue).toBe(1)

      await wrapper.setProps({ modelValue: 4 })
      expect(vm.currentValue).toBe(4)
    })
  })

  describe('editable / visible contract', () => {
    it('should render a plain display when editable is false', () => {
      const wrapper = mount(RatingEditor, {
        props: { modelValue: 3, editable: false, automationId: 'thing-edit-rating' },
      })

      expect(wrapper.find('.v-rating-stub').exists()).toBe(false)
      expect(wrapper.text()).toContain('3 / 4')
      expect(wrapper.find('[data-automation-id="thing-edit-rating-display"]').exists()).toBe(true)
    })

    it('should render an em-dash placeholder when unrated', () => {
      const wrapper = mount(RatingEditor, {
        props: { modelValue: undefined, editable: false },
      })

      expect(wrapper.text()).toContain('—')
    })

    it('should render nothing when visible is false', () => {
      const wrapper = mount(RatingEditor, {
        props: { modelValue: 2, visible: false },
      })

      expect(wrapper.html()).toBe('<!--v-if-->')
    })
  })

  describe('DataCard context (provide/inject)', () => {
    it('should prefer the injected DataCard model value over modelValue when field is set', () => {
      const model = ref({ rating: 4 })
      const wrapper = mount(RatingEditor, {
        props: { field: 'rating', modelValue: 1 },
        global: {
          provide: { [dataCardContextKey as symbol]: { model, onSave: vi.fn() } },
        },
      })

      const vm = wrapper.vm as any
      expect(vm.currentValue).toBe(4)
    })

    it('should call context.onSave(field, value) instead of the standalone onSave when field is set', async () => {
      const model = ref({ rating: 1 })
      const contextOnSave = vi.fn().mockResolvedValue(undefined)
      const standaloneOnSave = vi.fn()
      const wrapper = mount(RatingEditor, {
        props: { field: 'rating', onSave: standaloneOnSave },
        global: {
          provide: { [dataCardContextKey as symbol]: { model, onSave: contextOnSave } },
        },
      })

      const vm = wrapper.vm as any
      await vm.handleChange(3)

      expect(contextOnSave).toHaveBeenCalledWith('rating', 3)
      expect(standaloneOnSave).not.toHaveBeenCalled()
    })
  })
})
