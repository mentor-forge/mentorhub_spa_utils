import { describe, it, expect, vi } from 'vitest'
import { mount } from '@vue/test-utils'
import SentenceEditor from '../../../src/components/editors/SentenceEditor.vue'
import StringEditor from '../../../src/components/editors/StringEditor.vue'
import { validationRules } from '../../../src/utils/validation'

describe('SentenceEditor', () => {
  it('should forward field/editable/visible/automationId/modelValue/onSave to StringEditor', () => {
    const onSave = vi.fn()
    const wrapper = mount(SentenceEditor, {
      props: {
        modelValue: 'A short description.',
        onSave,
        label: 'Description',
        automationId: 'demo-sentence-description',
        visible: true,
      },
    })

    const editor = wrapper.findComponent(StringEditor)
    expect(editor.props()).toMatchObject({
      modelValue: 'A short description.',
      onSave,
      label: 'Description',
      automationId: 'demo-sentence-description',
      editable: true,
      visible: true,
    })
  })

  it('should default rules to sentencePattern', () => {
    const wrapper = mount(SentenceEditor, {
      props: { modelValue: 'text', onSave: vi.fn() },
    })

    const editor = wrapper.findComponent(StringEditor)
    expect(editor.props('rules')).toEqual([validationRules.sentencePattern])
  })

  it('should render a plain display when editable is false', () => {
    const wrapper = mount(SentenceEditor, {
      props: { modelValue: 'read-only text', editable: false },
    })

    expect(wrapper.find('input').exists()).toBe(false)
    expect(wrapper.text()).toContain('read-only text')
  })

  it('should render nothing when visible is false', () => {
    const wrapper = mount(SentenceEditor, {
      props: { modelValue: 'text', onSave: vi.fn(), visible: false },
    })

    expect(wrapper.find('input').exists()).toBe(false)
  })
})
