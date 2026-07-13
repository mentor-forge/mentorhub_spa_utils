import { describe, it, expect, vi } from 'vitest'
import { mount } from '@vue/test-utils'
import IpAddressEditor from '../../../src/components/editors/IpAddressEditor.vue'
import StringEditor from '../../../src/components/editors/StringEditor.vue'
import { validationRules } from '../../../src/utils/validation'

describe('IpAddressEditor', () => {
  it('should forward field/editable/visible/automationId/modelValue/onSave to StringEditor', () => {
    const onSave = vi.fn()
    const wrapper = mount(IpAddressEditor, {
      props: {
        modelValue: '192.168.1.1',
        onSave,
        label: 'IP Address',
        automationId: 'demo-ip-address',
      },
    })

    const editor = wrapper.findComponent(StringEditor)
    expect(editor.props()).toMatchObject({
      modelValue: '192.168.1.1',
      onSave,
      label: 'IP Address',
      automationId: 'demo-ip-address',
      editable: true,
      visible: true,
    })
  })

  it('should default rules to ipAddressPattern', () => {
    const wrapper = mount(IpAddressEditor, {
      props: { modelValue: '192.168.1.1', onSave: vi.fn() },
    })

    const editor = wrapper.findComponent(StringEditor)
    expect(editor.props('rules')).toEqual([validationRules.ipAddressPattern])
  })

  it('should render a plain readonly display when editable is false', () => {
    const wrapper = mount(IpAddressEditor, {
      props: { modelValue: '192.168.1.1', editable: false },
    })

    expect(wrapper.find('input').exists()).toBe(false)
    expect(wrapper.text()).toContain('192.168.1.1')
  })
})
