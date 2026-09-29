import { describe, it, expect, vi, beforeEach } from 'vitest'
import { mount } from '@vue/test-utils'
import { ref } from 'vue'
import MarkdownEditor from '../../../src/components/editors/MarkdownEditor.vue'
import { dataCardContextKey } from '../../../src/composables/useDataCardContext'
import { validationRules } from '../../../src/utils/validation'

describe('MarkdownEditor', () => {
  beforeEach(() => {
    vi.clearAllMocks()
  })

  describe('standalone modelValue + onSave', () => {
    it('should call onSave on blur when the value changed', async () => {
      const onSave = vi.fn().mockResolvedValue(undefined)
      const wrapper = mount(MarkdownEditor, {
        props: { modelValue: 'initial', onSave, label: 'Notes' },
      })

      const vm = wrapper.vm as any
      vm.handleInput('updated')
      await vm.handleBlur()

      expect(onSave).toHaveBeenCalledWith('updated')
    })

    it('should not call onSave when the value is unchanged', async () => {
      const onSave = vi.fn()
      const wrapper = mount(MarkdownEditor, {
        props: { modelValue: 'initial', onSave },
      })

      const vm = wrapper.vm as any
      await vm.handleBlur()

      expect(onSave).not.toHaveBeenCalled()
    })
  })

  describe('display and click-to-edit', () => {
    it('should render a heading and start in display mode; click enters edit; blur saves', async () => {
      const onSave = vi.fn().mockResolvedValue(undefined)
      const wrapper = mount(MarkdownEditor, {
        props: {
          modelValue: '## Section Title\n\nBody text.',
          onSave,
          editable: true,
        },
      })

      const vm = wrapper.vm as any
      expect(vm.isEditing).toBe(false)
      expect(wrapper.find('[data-automation-id="markdown-field-display"]').html()).toContain(
        '<h2'
      )
      expect(wrapper.find('[data-automation-id="markdown-field-display"]').text()).toContain(
        'Section Title'
      )
      expect(wrapper.find('textarea').exists()).toBe(true)

      await wrapper.find('.markdown-editor__display').trigger('click')
      expect(vm.isEditing).toBe(true)

      vm.handleInput('## Section Title\n\nUpdated body.')
      await vm.handleBlur()

      expect(vm.isEditing).toBe(false)
      expect(onSave).toHaveBeenCalledWith('## Section Title\n\nUpdated body.')
    })

    it('should ignore click when editable is false, render no textarea or edit hint, and render strong', () => {
      const wrapper = mount(MarkdownEditor, {
        props: {
          modelValue: '**Note:** important',
          editable: false,
        },
      })

      const vm = wrapper.vm as any
      expect(wrapper.find('textarea').exists()).toBe(false)
      expect(wrapper.find('.markdown-editor__edit-hint').exists()).toBe(false)
      expect(wrapper.find('[data-automation-id="markdown-field-display"]').html()).toContain(
        '<strong>'
      )

      wrapper.find('.markdown-editor__display').trigger('click')
      expect(vm.isEditing).toBe(false)
    })

    it('should sanitize script tags while keeping surrounding text', () => {
      const wrapper = mount(MarkdownEditor, {
        props: {
          modelValue: 'Safe <script>alert(1)</script> text',
          editable: false,
        },
      })

      const html = wrapper.find('[data-automation-id="markdown-field-display"]').html()
      expect(html).not.toContain('<script>')
      expect(html).toContain('Safe')
      expect(html).toContain('text')
    })

    it('should show an empty editable placeholder and empty read-only em dash', () => {
      const editable = mount(MarkdownEditor, {
        props: { modelValue: '', editable: true, label: 'Summary' },
      })
      expect(editable.find('[data-automation-id="markdown-field-display"]').text()).toBe(
        'Click to add summary...'
      )

      const readOnly = mount(MarkdownEditor, {
        props: { modelValue: '', editable: false },
      })
      expect(readOnly.find('[data-automation-id="markdown-field-display"]').text()).toBe('—')
    })
  })

  describe('automation ids', () => {
    it('should set root, input, display container, and value automation ids', async () => {
      const wrapper = mount(MarkdownEditor, {
        props: {
          modelValue: 'hello',
          onSave: vi.fn(),
          automationId: 'profile-notes',
        },
      })

      expect(wrapper.find('[data-automation-id="profile-notes"]').exists()).toBe(true)
      expect(wrapper.find('[data-automation-id="profile-notes-display"]').exists()).toBe(true)
      expect(wrapper.find('[data-automation-id="markdown-field-display"]').exists()).toBe(true)

      const vm = wrapper.vm as any
      await vm.startEditing()
      expect(wrapper.find('[data-automation-id="profile-notes-input"]').exists()).toBe(true)
    })

    it('should not double-suffix an automationId that already ends in -display', () => {
      const wrapper = mount(MarkdownEditor, {
        props: {
          modelValue: 'hello',
          editable: false,
          automationId: 'notes-display',
        },
      })

      expect(wrapper.find('[data-automation-id="notes-display"]').exists()).toBe(true)
      expect(wrapper.find('[data-automation-id="notes-display-display"]').exists()).toBe(false)
    })
  })

  describe('visibility and props', () => {
    it('should render nothing when visible is false', () => {
      const wrapper = mount(MarkdownEditor, {
        props: { modelValue: 'hidden', visible: false },
      })

      expect(wrapper.find('.markdown-editor').exists()).toBe(false)
      expect(wrapper.html()).toBe('<!--v-if-->')
    })

    it('should default rules to markdownPattern', async () => {
      const wrapper = mount(MarkdownEditor, {
        props: { modelValue: 'text', onSave: vi.fn() },
      })

      const vm = wrapper.vm as any
      await vm.startEditing()

      const textarea = wrapper.findAllComponents({ name: 'v-textarea' })[0]
        ?? wrapper.findAllComponents('*').find((c) => 'rows' in c.props())
      expect(textarea?.props('rules')).toEqual([validationRules.markdownPattern])
      expect(validationRules.markdownPattern('x'.repeat(4097))).toBe('Max 4096 characters')
    })

    it('should pass custom rows to the textarea', async () => {
      const wrapper = mount(MarkdownEditor, {
        props: { modelValue: 'text', onSave: vi.fn(), rows: 8 },
      })

      const vm = wrapper.vm as any
      await vm.startEditing()

      const textarea = wrapper.findAllComponents({ name: 'v-textarea' })[0]
        ?? wrapper.findAllComponents('*').find((c) => 'rows' in c.props())
      expect(textarea?.props('rows')).toBe(8)
    })
  })

  describe('DataCard context', () => {
    it('should prefer DataCard context over standalone modelValue and save via context.onSave', async () => {
      const contextOnSave = vi.fn().mockResolvedValue(undefined)
      const model = ref({ notes: 'from context' })
      const standaloneOnSave = vi.fn()

      const wrapper = mount(MarkdownEditor, {
        props: {
          field: 'notes',
          modelValue: 'standalone should lose',
          onSave: standaloneOnSave,
        },
        global: {
          provide: {
            [dataCardContextKey as symbol]: { model, onSave: contextOnSave },
          },
        },
      })

      const vm = wrapper.vm as any
      expect(vm.currentValue).toBe('from context')
      expect(wrapper.find('[data-automation-id="markdown-field-display"]').text()).toContain(
        'from context'
      )

      vm.handleInput('context updated')
      await vm.handleBlur()

      expect(contextOnSave).toHaveBeenCalledWith('notes', 'context updated')
      expect(standaloneOnSave).not.toHaveBeenCalled()
    })
  })
})
