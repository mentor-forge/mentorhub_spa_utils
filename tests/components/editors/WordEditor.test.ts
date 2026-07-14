import { describe, it, expect, vi } from 'vitest'
import { mount } from '@vue/test-utils'
import WordEditor from '../../../src/components/editors/WordEditor.vue'
import StringEditor from '../../../src/components/editors/StringEditor.vue'
import { validationRules } from '../../../src/utils/validation'

describe('WordEditor', () => {
  it('should forward field/editable/visible/automationId/modelValue/onSave to StringEditor', () => {
    const onSave = vi.fn()
    const wrapper = mount(WordEditor, {
      props: {
        modelValue: 'token',
        onSave,
        label: 'Name',
        automationId: 'demo-word-name',
      },
    })

    const editor = wrapper.findComponent(StringEditor)
    expect(editor.exists()).toBe(true)
    expect(editor.props()).toMatchObject({
      modelValue: 'token',
      onSave,
      label: 'Name',
      automationId: 'demo-word-name',
      editable: true,
      visible: true,
    })
  })

  it('should default to editable=true and a writable input', () => {
    const wrapper = mount(WordEditor, {
      props: { modelValue: 'token', onSave: vi.fn() },
    })

    expect(wrapper.find('input').exists()).toBe(true)
  })

  it('should render a plain display when editable is false', () => {
    const wrapper = mount(WordEditor, {
      props: { modelValue: 'token', editable: false },
    })

    expect(wrapper.find('input').exists()).toBe(false)
    expect(wrapper.text()).toContain('token')
  })

  it('should default rules to wordPattern', () => {
    const wrapper = mount(WordEditor, {
      props: { modelValue: 'token', onSave: vi.fn() },
    })

    const editor = wrapper.findComponent(StringEditor)
    expect(editor.props('rules')).toEqual([validationRules.wordPattern])
  })

  it('should honor a custom rules override', () => {
    const customRules = [(v: string | number) => !!v || 'required']
    const wrapper = mount(WordEditor, {
      props: { modelValue: 'token', onSave: vi.fn(), rules: customRules },
    })

    const editor = wrapper.findComponent(StringEditor)
    expect(editor.props('rules')).toEqual(customRules)
  })

  it('should support field-based usage inside a DataCard context', () => {
    const wrapper = mount(WordEditor, {
      props: { field: 'name' },
    })

    const editor = wrapper.findComponent(StringEditor)
    expect(editor.props('field')).toBe('name')
  })
})
