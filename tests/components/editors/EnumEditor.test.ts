import { describe, it, expect, vi, beforeEach } from 'vitest'
import { mount } from '@vue/test-utils'
import { nextTick, ref } from 'vue'
import EnumEditor from '../../../src/components/editors/EnumEditor.vue'
import { dataCardContextKey } from '../../../src/composables/useDataCardContext'
import { editorConfigKey } from '../../../src/composables/useEditorConfig'
import type { RuntimeEditorConfig } from '../../../src/components/editors/types'

const statusConfig: RuntimeEditorConfig = {
  enumerators: [
    {
      version: 1,
      enumerators: [
        {
          name: 'status',
          values: [
            { value: 'active', description: 'Active' },
            { value: 'archived', description: 'Archived' },
            { value: 'draft' },
          ],
        },
      ],
    },
  ],
}

describe('EnumEditor', () => {
  beforeEach(() => {
    vi.clearAllMocks()
  })

  describe('standalone modelValue + onSave', () => {
    it('renders a select with config-derived options', () => {
      const wrapper = mount(EnumEditor, {
        props: {
          enums: 'status',
          modelValue: 'active',
          onSave: vi.fn(),
          config: statusConfig,
          label: 'Status',
          automationId: 'profile-status',
        },
      })

      expect(wrapper.find('select').exists()).toBe(true)
      expect(wrapper.find('[data-automation-id="profile-status"]').exists()).toBe(true)
      const vm = wrapper.vm as any
      expect(vm.options).toEqual([
        { value: 'active', title: 'Active' },
        { value: 'archived', title: 'Archived' },
        { value: 'draft', title: 'draft' },
      ])
    })

    it('saves on blur when the value changed', async () => {
      const onSave = vi.fn().mockResolvedValue(undefined)
      const wrapper = mount(EnumEditor, {
        props: {
          enums: 'status',
          modelValue: 'active',
          onSave,
          config: statusConfig,
        },
      })

      const vm = wrapper.vm as any
      vm.handleInput('archived')
      await vm.handleBlur()

      expect(onSave).toHaveBeenCalledWith('archived')
      expect(vm.saved).toBe(true)
    })

    it('does not save on blur when the value is unchanged', async () => {
      const onSave = vi.fn()
      const wrapper = mount(EnumEditor, {
        props: {
          enums: 'status',
          modelValue: 'active',
          onSave,
          config: statusConfig,
        },
      })

      const vm = wrapper.vm as any
      await vm.handleBlur()
      expect(onSave).not.toHaveBeenCalled()
    })

    it('handles save errors and errors without a message', async () => {
      const onSave = vi.fn().mockRejectedValue(new Error('Save failed'))
      const wrapper = mount(EnumEditor, {
        props: {
          enums: 'status',
          modelValue: 'active',
          onSave,
          config: statusConfig,
        },
      })

      const vm = wrapper.vm as any
      vm.handleInput('archived')
      await vm.handleBlur()
      expect(vm.error).toBe('Save failed')

      onSave.mockRejectedValueOnce({})
      vm.handleInput('draft')
      await vm.handleBlur()
      expect(vm.error).toBe('Failed to save')
    })

    it('clears the saved state after a timeout', async () => {
      vi.useFakeTimers()
      const onSave = vi.fn().mockResolvedValue(undefined)
      const wrapper = mount(EnumEditor, {
        props: {
          enums: 'status',
          modelValue: 'active',
          onSave,
          config: statusConfig,
        },
      })

      const vm = wrapper.vm as any
      vm.handleInput('archived')
      await vm.handleBlur()
      expect(vm.saved).toBe(true)

      vi.advanceTimersByTime(2000)
      expect(vm.saved).toBe(false)
      vi.useRealTimers()
    })

    it('updates currentValue when modelValue prop changes', async () => {
      const wrapper = mount(EnumEditor, {
        props: {
          enums: 'status',
          modelValue: 'active',
          onSave: vi.fn(),
          config: statusConfig,
        },
      })

      const vm = wrapper.vm as any
      expect(vm.currentValue).toBe('active')
      await wrapper.setProps({ modelValue: 'archived' })
      expect(vm.currentValue).toBe('archived')
    })

    it('accepts validation rules and hint props', () => {
      const rules = [(v: string | undefined) => !!v || 'Required']
      const wrapper = mount(EnumEditor, {
        props: {
          enums: 'status',
          modelValue: 'active',
          onSave: vi.fn(),
          config: statusConfig,
          hint: 'Pick one',
          rules,
        },
      })

      expect(wrapper.props('hint')).toBe('Pick one')
      expect(wrapper.props('rules')).toEqual(rules)
    })
  })

  describe('runtime config context', () => {
    it('resolves options from provided editor config', () => {
      const wrapper = mount(EnumEditor, {
        props: {
          enums: 'status',
          modelValue: 'active',
          onSave: vi.fn(),
        },
        global: {
          provide: {
            [editorConfigKey as symbol]: statusConfig,
          },
        },
      })

      const vm = wrapper.vm as any
      expect(vm.options.map((o: { value: string }) => o.value)).toEqual([
        'active',
        'archived',
        'draft',
      ])
    })

    it('returns empty options for unknown enumerators without throwing', () => {
      const wrapper = mount(EnumEditor, {
        props: {
          enums: 'missing',
          modelValue: undefined,
          onSave: vi.fn(),
          config: statusConfig,
        },
      })

      const vm = wrapper.vm as any
      expect(vm.options).toEqual([])
    })

    it('updates options when delayed startup config arrives', async () => {
      const config = ref<RuntimeEditorConfig | null>(null)
      const wrapper = mount(EnumEditor, {
        props: {
          enums: 'status',
          modelValue: 'active',
          onSave: vi.fn(),
        },
        global: {
          provide: {
            [editorConfigKey as symbol]: config,
          },
        },
      })

      const vm = wrapper.vm as any
      expect(vm.options).toEqual([])

      config.value = statusConfig
      await nextTick()
      expect(vm.options.length).toBe(3)
    })
  })

  describe('editable / visible contract', () => {
    it('renders the selected description in display mode with -display automation id', () => {
      const wrapper = mount(EnumEditor, {
        props: {
          enums: 'status',
          modelValue: 'active',
          editable: false,
          config: statusConfig,
          automationId: 'profile-status',
          label: 'Status',
        },
      })

      expect(wrapper.find('select').exists()).toBe(false)
      expect(wrapper.text()).toContain('Active')
      expect(wrapper.find('[data-automation-id="profile-status-display"]').exists()).toBe(true)
      expect(wrapper.text()).toContain('Status')
    })

    it('falls back to the wire value when description is missing', () => {
      const wrapper = mount(EnumEditor, {
        props: {
          enums: 'status',
          modelValue: 'draft',
          editable: false,
          config: statusConfig,
        },
      })

      expect(wrapper.text()).toContain('draft')
    })

    it('shows an em-dash for empty values in display mode', () => {
      const wrapper = mount(EnumEditor, {
        props: {
          enums: 'status',
          modelValue: undefined,
          editable: false,
          config: statusConfig,
        },
      })

      expect(wrapper.text()).toContain('—')
    })

    it('renders nothing when visible is false', () => {
      const wrapper = mount(EnumEditor, {
        props: {
          enums: 'status',
          modelValue: 'active',
          visible: false,
          config: statusConfig,
          automationId: 'hidden',
        },
      })

      expect(wrapper.find('select').exists()).toBe(false)
      expect(wrapper.find('[data-automation-id="hidden"]').exists()).toBe(false)
    })
  })

  describe('DataCard context', () => {
    it('reads from and saves through the injected DataCard context', async () => {
      const onSave = vi.fn().mockResolvedValue(undefined)
      const model = { status: 'active' }
      const wrapper = mount(EnumEditor, {
        props: {
          field: 'status',
          enums: 'status',
          config: statusConfig,
        },
        global: {
          provide: {
            [dataCardContextKey as symbol]: { model, onSave },
          },
        },
      })

      const vm = wrapper.vm as any
      expect(vm.currentValue).toBe('active')
      vm.handleInput('archived')
      await vm.handleBlur()
      expect(onSave).toHaveBeenCalledWith('status', 'archived')
    })

    it('syncs when the DataCard model field changes', async () => {
      const model = ref({ status: 'active' })
      const wrapper = mount(EnumEditor, {
        props: {
          field: 'status',
          enums: 'status',
          config: statusConfig,
        },
        global: {
          provide: {
            [dataCardContextKey as symbol]: {
              model,
              onSave: vi.fn(),
            },
          },
        },
      })

      const vm = wrapper.vm as any
      expect(vm.currentValue).toBe('active')
      model.value = { status: 'draft' }
      await nextTick()
      expect(vm.currentValue).toBe('draft')
    })
  })
})
