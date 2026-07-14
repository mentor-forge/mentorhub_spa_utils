import { describe, it, expect, vi } from 'vitest'
import { mount } from '@vue/test-utils'
import MarkdownEditor from '../../../src/components/editors/MarkdownEditor.vue'
import StringEditor from '../../../src/components/editors/StringEditor.vue'
import { validationRules } from '../../../src/utils/validation'

describe('MarkdownEditor', () => {
  it('should forward props to StringEditor and always render as a textarea', () => {
    const onSave = vi.fn()
    const wrapper = mount(MarkdownEditor, {
      props: {
        modelValue: '# Heading\n\nSome *markdown*.',
        onSave,
        label: 'Description',
        automationId: 'demo-markdown-description',
      },
    })

    const editor = wrapper.findComponent(StringEditor)
    expect(editor.props()).toMatchObject({
      modelValue: '# Heading\n\nSome *markdown*.',
      onSave,
      label: 'Description',
      automationId: 'demo-markdown-description',
      editable: true,
      visible: true,
      textarea: true,
      rows: 4,
    })
    expect(wrapper.find('textarea').exists()).toBe(true)
  })

  it('should honor a custom rows prop', () => {
    const wrapper = mount(MarkdownEditor, {
      props: { modelValue: 'text', onSave: vi.fn(), rows: 8 },
    })

    const editor = wrapper.findComponent(StringEditor)
    expect(editor.props('rows')).toBe(8)
  })

  it('should default rules to markdownPattern', () => {
    const wrapper = mount(MarkdownEditor, {
      props: { modelValue: 'text', onSave: vi.fn() },
    })

    const editor = wrapper.findComponent(StringEditor)
    expect(editor.props('rules')).toEqual([validationRules.markdownPattern])
  })

  it('should render a plain display (not a textarea) when editable is false', () => {
    const wrapper = mount(MarkdownEditor, {
      props: { modelValue: 'read-only markdown', editable: false },
    })

    expect(wrapper.find('textarea').exists()).toBe(false)
    expect(wrapper.text()).toContain('read-only markdown')
  })
})
