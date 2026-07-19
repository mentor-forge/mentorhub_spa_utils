import { describe, it, expect, vi, beforeEach } from 'vitest'
import { mount } from '@vue/test-utils'
import { nextTick, ref } from 'vue'
import EnumArrayEditor from '../../../src/components/editors/EnumArrayEditor.vue'
import { dataCardContextKey } from '../../../src/composables/useDataCardContext'
import { editorConfigKey } from '../../../src/composables/useEditorConfig'
import type { RuntimeEditorConfig } from '../../../src/components/editors/types'

const tagsConfig: RuntimeEditorConfig = {
  enumerators: [
    {
      version: 1,
      enumerators: [
        {
          name: 'tags',
          values: [
            { value: 'alpha', description: 'Alpha tag' },
            { value: 'beta', description: 'Beta tag' },
            { value: 'gamma', description: 'Gamma tag' },
          ],
        },
      ],
    },
  ],
}

describe('EnumArrayEditor', () => {
  beforeEach(() => {
    vi.clearAllMocks()
  })

  describe('standalone modelValue + onSave', () => {
    it('renders autocomplete with multiple chips from config options', () => {
      const wrapper = mount(EnumArrayEditor, {
        props: {
          enums: 'tags',
          modelValue: ['alpha'],
          onSave: vi.fn(),
          config: tagsConfig,
          automationId: 'profile-tags',
          label: 'Tags',
        },
      })

      expect(wrapper.find('.v-autocomplete-stub').exists()).toBe(true)
      expect(wrapper.find('[data-automation-id="profile-tags"]').exists()).toBe(true)
      const vm = wrapper.vm as any
      expect(vm.options).toHaveLength(3)
      expect(vm.currentValue).toEqual(['alpha'])
    })

    it('filters autocomplete items by value and description', async () => {
      const wrapper = mount(EnumArrayEditor, {
        props: {
          enums: 'tags',
          modelValue: [],
          onSave: vi.fn(),
          config: tagsConfig,
        },
      })

      const stub = wrapper.findComponent({ name: 'VAutocompleteStub' })
      await stub.vm.onSearch({ target: { value: 'Beta' } })
      expect(stub.vm.filteredItems).toEqual([{ value: 'beta', title: 'Beta tag' }])

      await stub.vm.onSearch({ target: { value: 'gamma' } })
      expect(stub.vm.filteredItems).toEqual([{ value: 'gamma', title: 'Gamma tag' }])
    })

    it('adds and removes pills while cloning arrays', async () => {
      const original = ['alpha']
      const onSave = vi.fn().mockResolvedValue(undefined)
      const wrapper = mount(EnumArrayEditor, {
        props: {
          enums: 'tags',
          modelValue: original,
          onSave,
          config: tagsConfig,
        },
      })

      const vm = wrapper.vm as any
      vm.handleInput(['alpha', 'beta'])
      expect(vm.currentValue).toEqual(['alpha', 'beta'])
      expect(vm.currentValue).not.toBe(original)

      vm.handleInput(['alpha'])
      expect(vm.currentValue).toEqual(['alpha'])
      expect(original).toEqual(['alpha'])
    })

    it('rejects values outside the named enumerator', () => {
      const wrapper = mount(EnumArrayEditor, {
        props: {
          enums: 'tags',
          modelValue: ['alpha'],
          onSave: vi.fn(),
          config: tagsConfig,
        },
      })

      const vm = wrapper.vm as any
      vm.handleInput(['alpha', 'invented', 'beta'])
      expect(vm.currentValue).toEqual(['alpha', 'beta'])
    })

    it('treats equal ordered arrays as unchanged even when references differ', async () => {
      const onSave = vi.fn()
      const wrapper = mount(EnumArrayEditor, {
        props: {
          enums: 'tags',
          modelValue: ['alpha', 'beta'],
          onSave,
          config: tagsConfig,
        },
      })

      const vm = wrapper.vm as any
      vm.handleInput(['alpha', 'beta'])
      await vm.handleBlur()
      expect(onSave).not.toHaveBeenCalled()
      expect(vm.arraysEqualOrdered(['a', 'b'], ['a', 'b'])).toBe(true)
      expect(vm.arraysEqualOrdered(['a', 'b'], ['b', 'a'])).toBe(false)
    })

    it('saves once focus leaves the whole control', async () => {
      const onSave = vi.fn().mockResolvedValue(undefined)
      const wrapper = mount(EnumArrayEditor, {
        props: {
          enums: 'tags',
          modelValue: ['alpha'],
          onSave,
          config: tagsConfig,
        },
      })

      const vm = wrapper.vm as any
      vm.handleInput(['alpha', 'beta'])
      const container = wrapper.find('.enum-array-editor').element as HTMLElement
      const inner = wrapper.find('.v-autocomplete-stub__input').element

      await vm.handleContainerBlur({
        currentTarget: container,
        relatedTarget: inner,
      } as unknown as FocusEvent)
      expect(onSave).not.toHaveBeenCalled()

      await vm.handleContainerBlur({
        currentTarget: container,
        relatedTarget: null,
      } as unknown as FocusEvent)
      expect(onSave).toHaveBeenCalledTimes(1)
      expect(onSave).toHaveBeenCalledWith(['alpha', 'beta'])
    })

    it('handles save errors and clears saved after timeout', async () => {
      vi.useFakeTimers()
      const onSave = vi.fn()
      const wrapper = mount(EnumArrayEditor, {
        props: {
          enums: 'tags',
          modelValue: ['alpha'],
          onSave,
          config: tagsConfig,
        },
      })

      const vm = wrapper.vm as any

      onSave.mockRejectedValueOnce(new Error('Save failed'))
      vm.handleInput(['alpha', 'beta'])
      await vm.handleBlur()
      expect(vm.error).toBe('Save failed')

      onSave.mockRejectedValueOnce({})
      vm.handleInput(['gamma'])
      await vm.handleBlur()
      expect(vm.error).toBe('Failed to save')

      onSave.mockResolvedValueOnce(undefined)
      vm.handleInput(['alpha', 'gamma'])
      await vm.handleBlur()
      expect(vm.saved).toBe(true)
      vi.advanceTimersByTime(2000)
      expect(vm.saved).toBe(false)
      vi.useRealTimers()
    })

    it('updates when modelValue prop changes', async () => {
      const wrapper = mount(EnumArrayEditor, {
        props: {
          enums: 'tags',
          modelValue: ['alpha'],
          onSave: vi.fn(),
          config: tagsConfig,
        },
      })

      const vm = wrapper.vm as any
      await wrapper.setProps({ modelValue: ['beta', 'gamma'] })
      expect(vm.currentValue).toEqual(['beta', 'gamma'])
    })
  })

  describe('runtime config context', () => {
    it('updates options when delayed startup config arrives without wiping selection', async () => {
      const config = ref<RuntimeEditorConfig | null>(null)
      const wrapper = mount(EnumArrayEditor, {
        props: {
          enums: 'tags',
          modelValue: ['alpha'],
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
      expect(vm.currentValue).toEqual(['alpha'])

      config.value = tagsConfig
      await nextTick()
      expect(vm.options).toHaveLength(3)
      expect(vm.currentValue).toEqual(['alpha'])
    })

    it('returns empty options for an unknown enumerator', () => {
      const wrapper = mount(EnumArrayEditor, {
        props: {
          enums: 'missing',
          modelValue: [],
          onSave: vi.fn(),
          config: tagsConfig,
        },
      })

      expect((wrapper.vm as any).options).toEqual([])
    })
  })

  describe('editable / visible contract', () => {
    it('renders labeled pills in display mode with stable per-pill automation ids', () => {
      const wrapper = mount(EnumArrayEditor, {
        props: {
          enums: 'tags',
          modelValue: ['alpha', 'beta'],
          editable: false,
          config: tagsConfig,
          automationId: 'profile-tags',
          label: 'Tags',
        },
      })

      expect(wrapper.find('.v-autocomplete-stub').exists()).toBe(false)
      expect(wrapper.find('[data-automation-id="profile-tags-display"]').exists()).toBe(true)
      expect(wrapper.find('[data-automation-id="profile-tags-pill-alpha"]').exists()).toBe(true)
      expect(wrapper.find('[data-automation-id="profile-tags-pill-beta"]').exists()).toBe(true)
      expect(wrapper.text()).toContain('Alpha tag')
      expect(wrapper.text()).toContain('Beta tag')
      expect(wrapper.text()).toContain('Tags')
    })

    it('derives pill automation ids from a pre-suffixed automationId', () => {
      const wrapper = mount(EnumArrayEditor, {
        props: {
          enums: 'tags',
          modelValue: ['alpha'],
          editable: false,
          config: tagsConfig,
          automationId: 'profile-tags-display',
        },
      })

      expect(wrapper.find('[data-automation-id="profile-tags-pill-alpha"]').exists()).toBe(true)
    })

    it('clears selections on input when the enumerator has no options', () => {
      const wrapper = mount(EnumArrayEditor, {
        props: {
          enums: 'missing',
          modelValue: ['alpha'],
          onSave: vi.fn(),
          config: tagsConfig,
        },
      })

      const vm = wrapper.vm as any
      vm.handleInput(['alpha', 'beta'])
      expect(vm.currentValue).toEqual([])
    })

    it('handles empty and unknown values safely in display mode', () => {
      const empty = mount(EnumArrayEditor, {
        props: {
          enums: 'tags',
          modelValue: [],
          editable: false,
          config: tagsConfig,
        },
      })
      expect(empty.text()).toContain('—')

      const unknown = mount(EnumArrayEditor, {
        props: {
          enums: 'tags',
          modelValue: ['not-in-enum'],
          editable: false,
          config: tagsConfig,
        },
      })
      expect(unknown.text()).toContain('not-in-enum')
    })

    it('renders nothing when visible is false', () => {
      const wrapper = mount(EnumArrayEditor, {
        props: {
          enums: 'tags',
          modelValue: ['alpha'],
          visible: false,
          config: tagsConfig,
          automationId: 'hidden',
        },
      })

      expect(wrapper.find('.v-autocomplete-stub').exists()).toBe(false)
      expect(wrapper.find('[data-automation-id="hidden"]').exists()).toBe(false)
    })
  })

  describe('DataCard context', () => {
    it('reads from and saves through the injected DataCard context', async () => {
      const onSave = vi.fn().mockResolvedValue(undefined)
      const model = { tags: ['alpha'] }
      const wrapper = mount(EnumArrayEditor, {
        props: {
          field: 'tags',
          enums: 'tags',
          config: tagsConfig,
        },
        global: {
          provide: {
            [dataCardContextKey as symbol]: { model, onSave },
          },
        },
      })

      const vm = wrapper.vm as any
      expect(vm.currentValue).toEqual(['alpha'])
      vm.handleInput(['alpha', 'gamma'])
      await vm.handleBlur()
      expect(onSave).toHaveBeenCalledWith('tags', ['alpha', 'gamma'])
    })

    it('does not mutate the DataCard model array in place', () => {
      const tags = ['alpha']
      const model = { tags }
      const wrapper = mount(EnumArrayEditor, {
        props: {
          field: 'tags',
          enums: 'tags',
          config: tagsConfig,
        },
        global: {
          provide: {
            [dataCardContextKey as symbol]: { model, onSave: vi.fn() },
          },
        },
      })

      const vm = wrapper.vm as any
      vm.handleInput(['alpha', 'beta'])
      expect(tags).toEqual(['alpha'])
      expect(vm.currentValue).not.toBe(tags)
    })
  })

  it('supports selecting a chip via the autocomplete stub UI', async () => {
    const wrapper = mount(EnumArrayEditor, {
      props: {
        enums: 'tags',
        modelValue: [],
        onSave: vi.fn(),
        config: tagsConfig,
      },
    })

    const stub = wrapper.findComponent({ name: 'VAutocompleteStub' })
    stub.vm.selectItem({ value: 'beta', title: 'Beta tag' })
    await nextTick()
    expect((wrapper.vm as any).currentValue).toEqual(['beta'])

    stub.vm.removeChip(0)
    await nextTick()
    expect((wrapper.vm as any).currentValue).toEqual([])
  })
})
