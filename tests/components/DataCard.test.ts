import { describe, it, expect, vi } from 'vitest'
import { mount } from '@vue/test-utils'
import { defineComponent, h, reactive } from 'vue'
import DataCard from '../../src/components/DataCard.vue'
import WordEditor from '../../src/components/editors/WordEditor.vue'
import StringEditor from '../../src/components/editors/StringEditor.vue'
import { useDataCardContext, resolveDataCardModel } from '../../src/composables/useDataCardContext'

/** Minimal descendant used to assert the raw provide/inject contract independent of any editor. */
const ContextProbe = defineComponent({
  name: 'ContextProbe',
  setup() {
    const context = useDataCardContext()
    return () =>
      h('div', { class: 'context-probe' }, context ? JSON.stringify(resolveDataCardModel(context)) : 'no-context')
  },
})

describe('DataCard', () => {
  it('should compose MhCard: forward title, color, and automationId to the card shell', () => {
    const wrapper = mount(DataCard, {
      props: {
        title: 'Identity',
        color: 'secondary',
        automationId: 'profile-identity-card',
        model: reactive({ name: 'Ada' }),
        onSave: vi.fn(),
      },
    })

    expect(wrapper.text()).toContain('Identity')
    expect(wrapper.find('[data-automation-id="profile-identity-card"]').exists()).toBe(true)
  })

  it('should render the actions slot through to MhCard', () => {
    const wrapper = mount(DataCard, {
      props: { model: reactive({}), onSave: vi.fn() },
      slots: { actions: '<button class="delete-btn">Delete</button>' },
    })

    expect(wrapper.find('.delete-btn').exists()).toBe(true)
  })

  describe('nameField live binding', () => {
    it('should render the model value at nameField next to the title', () => {
      const model = reactive({ full_name: 'Ada Lovelace' })
      const wrapper = mount(DataCard, {
        props: { title: 'Identity', nameField: 'full_name', model, onSave: vi.fn() },
      })

      expect(wrapper.text()).toContain('Ada Lovelace')
    })

    it('should update the displayed name reactively when the model changes', async () => {
      const model = reactive({ full_name: 'Ada Lovelace' })
      const wrapper = mount(DataCard, {
        props: { title: 'Identity', nameField: 'full_name', model, onSave: vi.fn() },
      })

      model.full_name = 'Grace Hopper'
      await wrapper.vm.$nextTick()

      expect(wrapper.text()).toContain('Grace Hopper')
      expect(wrapper.text()).not.toContain('Ada Lovelace')
    })

    it('should omit the name display when nameField is not set', () => {
      const wrapper = mount(DataCard, {
        props: { title: 'Identity', model: reactive({ full_name: 'Ada Lovelace' }), onSave: vi.fn() },
      })

      expect(wrapper.text()).not.toContain('Ada Lovelace')
    })
  })

  describe('provide/inject binding', () => {
    it('should provide a DataCardContext descendants can inject via the exported Symbol', () => {
      const model = reactive({ name: 'Ada' })
      const wrapper = mount(DataCard, {
        props: { model, onSave: vi.fn() },
        slots: { default: () => h(ContextProbe) },
      })

      expect(wrapper.find('.context-probe').text()).toBe(JSON.stringify({ name: 'Ada' }))
    })

    it('should keep the provided model live as the underlying reactive object changes', async () => {
      const model = reactive({ name: 'Ada' })
      const wrapper = mount(DataCard, {
        props: { model, onSave: vi.fn() },
        slots: { default: () => h(ContextProbe) },
      })

      model.name = 'Grace'
      await wrapper.vm.$nextTick()

      expect(wrapper.find('.context-probe').text()).toBe(JSON.stringify({ name: 'Grace' }))
    })

    it('should let a typed editor resolve its value from the injected model via field', () => {
      const model = reactive({ name: 'Ada' })
      const wrapper = mount(DataCard, {
        props: { model, onSave: vi.fn() },
        slots: { default: () => h(WordEditor, { field: 'name', automationId: 'name-field' }) },
      })

      expect(wrapper.find('input').element.value).toBe('Ada')
    })
  })

  describe('save callback', () => {
    it('should invoke onSave(field, value) when a descendant editor saves through the injected context', async () => {
      const onSave = vi.fn().mockResolvedValue(undefined)
      const model = reactive({ name: 'Ada' })
      const wrapper = mount(DataCard, {
        props: { model, onSave },
        slots: { default: () => h(WordEditor, { field: 'name', automationId: 'name-field' }) },
      })

      const editor = wrapper.findComponent(StringEditor)
      const vm = editor.vm as any
      vm.handleInput('Grace')
      await vm.handleBlur()

      expect(onSave).toHaveBeenCalledWith('name', 'Grace')
    })

    it('should always call the current onSave prop (not a stale reference) when it changes', async () => {
      const firstOnSave = vi.fn().mockResolvedValue(undefined)
      const secondOnSave = vi.fn().mockResolvedValue(undefined)
      const model = reactive({ name: 'Ada' })
      const wrapper = mount(DataCard, {
        props: { model, onSave: firstOnSave },
        slots: { default: () => h(WordEditor, { field: 'name', automationId: 'name-field' }) },
      })

      await wrapper.setProps({ onSave: secondOnSave })

      const editor = wrapper.findComponent(StringEditor)
      const vm = editor.vm as any
      vm.handleInput('Grace')
      await vm.handleBlur()

      expect(secondOnSave).toHaveBeenCalledWith('name', 'Grace')
      expect(firstOnSave).not.toHaveBeenCalled()
    })
  })

  describe('collapse', () => {
    // Mounted with `attachTo: document.body` — jsdom's getComputedStyle (used by
    // Vue Test Utils' `isVisible()`) does not reliably re-resolve `display` on detached nodes.
    it('should default to expanded with an uncontrolled local collapse toggle', async () => {
      const wrapper = mount(DataCard, {
        attachTo: document.body,
        props: { title: 'Identity', automationId: 'identity-card', model: reactive({}), onSave: vi.fn() },
      })

      expect(wrapper.find('.mh-card__body').isVisible()).toBe(true)

      await wrapper.find('[data-automation-id="identity-card-collapse-button"]').trigger('click')

      expect(wrapper.find('.mh-card__body').isVisible()).toBe(false)
      expect(wrapper.emitted('update:collapsed')).toBeUndefined()

      wrapper.unmount()
    })

    it('should defer to v-model:collapsed when collapsed is bound (controlled)', async () => {
      const wrapper = mount(DataCard, {
        attachTo: document.body,
        props: {
          title: 'Identity',
          automationId: 'identity-card',
          model: reactive({}),
          onSave: vi.fn(),
          collapsed: false,
        },
      })

      await wrapper.find('[data-automation-id="identity-card-collapse-button"]').trigger('click')

      expect(wrapper.emitted('update:collapsed')).toEqual([[true]])
      // Controlled: body stays as-is until the parent updates the `collapsed` prop.
      expect(wrapper.find('.mh-card__body').isVisible()).toBe(true)

      await wrapper.setProps({ collapsed: true })
      expect(wrapper.find('.mh-card__body').isVisible()).toBe(false)

      wrapper.unmount()
    })
  })

  it('should work inside a CardGrid alongside other cards', async () => {
    const { default: CardGrid } = await import('../../src/components/CardGrid.vue')
    const wrapper = mount(CardGrid, {
      slots: {
        default: () => [
          h(DataCard, { title: 'Identity', model: reactive({ name: 'Ada' }), onSave: vi.fn() }),
          h(DataCard, { title: 'Contact', model: reactive({ email: 'ada@example.com' }), onSave: vi.fn() }),
        ],
      },
    })

    expect(wrapper.findAllComponents(DataCard)).toHaveLength(2)
    expect(wrapper.text()).toContain('Identity')
    expect(wrapper.text()).toContain('Contact')
  })

  it('lets typed editors keep working standalone (modelValue/onSave) alongside DataCard usage', async () => {
    const onSave = vi.fn().mockResolvedValue(undefined)
    const wrapper = mount(WordEditor, {
      props: { modelValue: 'standalone', onSave, automationId: 'standalone-field' },
    })

    const editor = wrapper.findComponent(StringEditor)
    const vm = editor.vm as any
    vm.handleInput('changed')
    await vm.handleBlur()

    expect(onSave).toHaveBeenCalledWith('changed')
  })
})
