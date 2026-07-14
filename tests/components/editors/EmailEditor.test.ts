import { describe, it, expect, vi } from 'vitest'
import { mount } from '@vue/test-utils'
import EmailEditor from '../../../src/components/editors/EmailEditor.vue'
import StringEditor from '../../../src/components/editors/StringEditor.vue'
import { validationRules } from '../../../src/utils/validation'

describe('EmailEditor', () => {
  it('should forward field/editable/visible/automationId/modelValue/onSave to StringEditor', () => {
    const onSave = vi.fn()
    const wrapper = mount(EmailEditor, {
      props: {
        modelValue: 'user@example.com',
        onSave,
        label: 'Email',
        automationId: 'demo-email',
      },
    })

    const editor = wrapper.findComponent(StringEditor)
    expect(editor.props()).toMatchObject({
      modelValue: 'user@example.com',
      onSave,
      label: 'Email',
      automationId: 'demo-email',
      editable: true,
      visible: true,
    })
  })

  it('should default rules to emailPattern', () => {
    const wrapper = mount(EmailEditor, {
      props: { modelValue: 'user@example.com', onSave: vi.fn() },
    })

    const editor = wrapper.findComponent(StringEditor)
    expect(editor.props('rules')).toEqual([validationRules.emailPattern])
  })

  it('should render a plain display when editable is false', () => {
    const wrapper = mount(EmailEditor, {
      props: { modelValue: 'user@example.com', editable: false },
    })

    expect(wrapper.find('input').exists()).toBe(false)
    expect(wrapper.text()).toContain('user@example.com')
  })
})
