import { describe, it, expect, vi } from 'vitest'
import { mount } from '@vue/test-utils'
import { ref } from 'vue'
import UrlEditor from '../../../src/components/editors/UrlEditor.vue'
import StringEditor from '../../../src/components/editors/StringEditor.vue'
import { validationRules } from '../../../src/utils/validation'
import { dataCardContextKey } from '../../../src/composables/useDataCardContext'

describe('UrlEditor', () => {
  describe('editable mode', () => {
    it('should forward field/editable/automationId/modelValue/onSave to StringEditor', () => {
      const onSave = vi.fn()
      const wrapper = mount(UrlEditor, {
        props: {
          modelValue: 'https://example.com',
          onSave,
          label: 'Website',
          automationId: 'demo-url',
        },
      })

      const editor = wrapper.findComponent(StringEditor)
      expect(editor.exists()).toBe(true)
      expect(editor.props()).toMatchObject({
        modelValue: 'https://example.com',
        onSave,
        label: 'Website',
        automationId: 'demo-url',
        editable: true,
      })
    })

    it('should default rules to urlPattern', () => {
      const wrapper = mount(UrlEditor, {
        props: { modelValue: 'https://example.com', onSave: vi.fn() },
      })

      const editor = wrapper.findComponent(StringEditor)
      expect(editor.props('rules')).toEqual([validationRules.urlPattern])
    })

    it('should honor a custom rules override', () => {
      const customRules = [(v: string | number) => !!v || 'required']
      const wrapper = mount(UrlEditor, {
        props: { modelValue: 'https://example.com', onSave: vi.fn(), rules: customRules },
      })

      const editor = wrapper.findComponent(StringEditor)
      expect(editor.props('rules')).toEqual(customRules)
    })
  })

  describe('display mode (editable=false)', () => {
    it('should render a clickable link instead of a plain-text display', () => {
      const wrapper = mount(UrlEditor, {
        props: { modelValue: 'https://example.com/path', editable: false, label: 'Website' },
      })

      expect(wrapper.find('input').exists()).toBe(false)
      const link = wrapper.find('a')
      expect(link.exists()).toBe(true)
      expect(link.attributes('href')).toBe('https://example.com/path')
      expect(link.attributes('target')).toBe('_blank')
      expect(link.attributes('rel')).toBe('noopener noreferrer')
      expect(link.text()).toBe('https://example.com/path')
      expect(wrapper.text()).toContain('Website')
    })

    it('should render an em-dash placeholder when empty', () => {
      const wrapper = mount(UrlEditor, {
        props: { modelValue: undefined, editable: false },
      })

      expect(wrapper.find('a').exists()).toBe(false)
      expect(wrapper.text()).toContain('—')
    })

    it('should fall back to plain text when the value is not a valid URL', () => {
      const wrapper = mount(UrlEditor, {
        props: { modelValue: 'not a url', editable: false },
      })

      expect(wrapper.find('a').exists()).toBe(false)
      expect(wrapper.text()).toContain('not a url')
    })

    it('should suffix automationId with -display', () => {
      const wrapper = mount(UrlEditor, {
        props: { modelValue: 'https://example.com', editable: false, automationId: 'demo-url' },
      })

      expect(wrapper.find('[data-automation-id="demo-url-display"]').exists()).toBe(true)
    })

    it('should not double-suffix an automationId that already ends with -display', () => {
      const wrapper = mount(UrlEditor, {
        props: { modelValue: 'https://example.com', editable: false, automationId: 'demo-url-display' },
      })

      expect(wrapper.find('[data-automation-id="demo-url-display"]').exists()).toBe(true)
    })

    it('should render nothing when visible is false', () => {
      const wrapper = mount(UrlEditor, {
        props: { modelValue: 'https://example.com', editable: false, visible: false },
      })

      expect(wrapper.html()).toBe('<!--v-if-->')
    })

    it('should read the value from an injected DataCard context when field is set', () => {
      const model = ref({ website: 'https://from-card.example.com' })
      const wrapper = mount(UrlEditor, {
        props: { field: 'website', editable: false, modelValue: 'ignored' },
        global: {
          provide: { [dataCardContextKey as symbol]: { model, onSave: vi.fn() } },
        },
      })

      const link = wrapper.find('a')
      expect(link.attributes('href')).toBe('https://from-card.example.com')
    })
  })
})
