import { describe, it, expect } from 'vitest'
import { shallowMount } from '@vue/test-utils'
import MhCard from '../../src/components/MhCard.vue'

describe('MhCard', () => {
  it('should render the title and default slot content', () => {
    const wrapper = shallowMount(MhCard, {
      props: { title: 'Widget' },
      slots: { default: '<p>Body content</p>' },
    })

    expect(wrapper.html()).toContain('Widget')
    expect(wrapper.html()).toContain('Body content')
  })

  it('should render an optional name next to the title', () => {
    const wrapper = shallowMount(MhCard, {
      props: { title: 'Widget', name: 'Acme Corp' },
    })

    expect(wrapper.html()).toContain('Widget')
    expect(wrapper.html()).toContain('Acme Corp')
  })

  it('should render the actions slot right-justified in the title bar', () => {
    const wrapper = shallowMount(MhCard, {
      props: { title: 'Widget' },
      slots: { actions: '<button>Delete</button>' },
    })

    expect(wrapper.find('.mh-card__actions').exists()).toBe(true)
    expect(wrapper.html()).toContain('Delete')
  })

  it('should default color to primary and allow overriding it', () => {
    const defaultWrapper = shallowMount(MhCard, { props: { title: 'Widget' } })
    expect(defaultWrapper.props('color')).toBe('primary')

    const customWrapper = shallowMount(MhCard, { props: { title: 'Widget', color: 'secondary' } })
    expect(customWrapper.props('color')).toBe('secondary')
  })

  it('should default to expanded and not show a collapse toggle when not collapsible', () => {
    const wrapper = shallowMount(MhCard, { props: { title: 'Widget' } })

    const vm = wrapper.vm as any
    expect(vm.isCollapsed).toBe(false)
    expect(wrapper.find('[data-automation-id="widget-collapse-button"]').exists()).toBe(false)
  })

  it('should toggle uncontrolled collapse state locally when collapsible', async () => {
    const wrapper = shallowMount(MhCard, {
      props: { title: 'Widget', collapsible: true, automationId: 'widget' },
    })

    const vm = wrapper.vm as any
    expect(vm.isCollapsed).toBe(false)

    vm.toggleCollapsed()
    await wrapper.vm.$nextTick()

    expect(vm.isCollapsed).toBe(true)
    expect(wrapper.emitted('update:collapsed')).toBeUndefined()
  })

  it('should defer to v-model:collapsed when the prop is provided (controlled)', async () => {
    const wrapper = shallowMount(MhCard, {
      props: {
        title: 'Widget',
        collapsible: true,
        collapsed: false,
        'onUpdate:collapsed': () => {},
      },
    })

    const vm = wrapper.vm as any
    expect(vm.isCollapsed).toBe(false)

    vm.toggleCollapsed()

    expect(wrapper.emitted('update:collapsed')).toEqual([[true]])
    // Controlled: internal state does not flip on its own until the parent updates the prop
    expect(vm.isCollapsed).toBe(false)

    await wrapper.setProps({ collapsed: true })
    expect(vm.isCollapsed).toBe(true)
  })

  it('should apply the automationId to the card root and derived sub-element ids', () => {
    const wrapper = shallowMount(MhCard, {
      props: { title: 'Widget', automationId: 'widget-card', collapsible: true },
    })

    expect(wrapper.attributes('data-automation-id')).toBe('widget-card')
    expect(wrapper.find('[data-automation-id="widget-card-title-display"]').exists()).toBe(true)
    expect(wrapper.find('[data-automation-id="widget-card-collapse-button"]').exists()).toBe(true)
    expect(wrapper.find('[data-automation-id="widget-card-actions-display"]').exists()).toBe(true)
  })

  it('should not render automation ids on sub-elements when automationId is unset', () => {
    const wrapper = shallowMount(MhCard, { props: { title: 'Widget' } })

    expect(wrapper.attributes('data-automation-id')).toBeUndefined()
  })

  it('exposes isCollapsed and toggleCollapsed for programmatic control', () => {
    const wrapper = shallowMount(MhCard, { props: { title: 'Widget', collapsible: true } })

    const vm = wrapper.vm as any
    expect(typeof vm.toggleCollapsed).toBe('function')
    expect(vm.isCollapsed).toBe(false)
  })
})
