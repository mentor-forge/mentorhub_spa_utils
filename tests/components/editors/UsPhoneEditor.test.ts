import { describe, it, expect, vi } from 'vitest'
import { mount } from '@vue/test-utils'
import UsPhoneEditor from '../../../src/components/editors/UsPhoneEditor.vue'
import StringEditor from '../../../src/components/editors/StringEditor.vue'
import { validationRules } from '../../../src/utils/validation'

describe('UsPhoneEditor', () => {
  it('should forward field/editable/visible/automationId/modelValue/onSave to StringEditor', () => {
    const onSave = vi.fn()
    const wrapper = mount(UsPhoneEditor, {
      props: {
        modelValue: '123-456-7890',
        onSave,
        label: 'Phone',
        automationId: 'demo-us-phone',
      },
    })

    const editor = wrapper.findComponent(StringEditor)
    expect(editor.props()).toMatchObject({
      modelValue: '123-456-7890',
      onSave,
      label: 'Phone',
      automationId: 'demo-us-phone',
      editable: true,
      visible: true,
    })
  })

  it('should default rules to usPhonePattern', () => {
    const wrapper = mount(UsPhoneEditor, {
      props: { modelValue: '123-456-7890', onSave: vi.fn() },
    })

    const editor = wrapper.findComponent(StringEditor)
    expect(editor.props('rules')).toEqual([validationRules.usPhonePattern])
  })

  it('should render a plain display when editable is false', () => {
    const wrapper = mount(UsPhoneEditor, {
      props: { modelValue: '123-456-7890', editable: false },
    })

    expect(wrapper.find('input').exists()).toBe(false)
    expect(wrapper.text()).toContain('123-456-7890')
  })
})
