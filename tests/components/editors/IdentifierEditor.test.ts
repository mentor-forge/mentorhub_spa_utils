import { describe, it, expect, vi } from 'vitest'
import { mount } from '@vue/test-utils'
import IdentifierEditor from '../../../src/components/editors/IdentifierEditor.vue'
import StringEditor from '../../../src/components/editors/StringEditor.vue'
import { validationRules } from '../../../src/utils/validation'

describe('IdentifierEditor', () => {
  it('should default to editable=false (display-first)', () => {
    const wrapper = mount(IdentifierEditor, {
      props: { modelValue: '507f1f77bcf86cd799439011' },
    })

    const editor = wrapper.findComponent(StringEditor)
    expect(editor.props('editable')).toBe(false)
    expect(wrapper.find('input').exists()).toBe(false)
    expect(wrapper.text()).toContain('507f1f77bcf86cd799439011')
  })

  it('should render an editable input when editable is explicitly true', () => {
    const wrapper = mount(IdentifierEditor, {
      props: { modelValue: '507f1f77bcf86cd799439011', onSave: vi.fn(), editable: true },
    })

    expect(wrapper.find('input').exists()).toBe(true)
  })

  it('should forward field/visible/automationId/modelValue/onSave to StringEditor', () => {
    const onSave = vi.fn()
    const wrapper = mount(IdentifierEditor, {
      props: {
        modelValue: '507f1f77bcf86cd799439011',
        onSave,
        automationId: 'demo-identifier',
        visible: true,
      },
    })

    const editor = wrapper.findComponent(StringEditor)
    expect(editor.props()).toMatchObject({
      modelValue: '507f1f77bcf86cd799439011',
      onSave,
      automationId: 'demo-identifier',
      visible: true,
    })
  })

  it('should default rules to identifierPattern', () => {
    const wrapper = mount(IdentifierEditor, {
      props: { modelValue: '507f1f77bcf86cd799439011', editable: true, onSave: vi.fn() },
    })

    const editor = wrapper.findComponent(StringEditor)
    expect(editor.props('rules')).toEqual([validationRules.identifierPattern])
  })
})
