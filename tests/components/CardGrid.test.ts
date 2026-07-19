import { describe, it, expect } from 'vitest'
import { shallowMount, mount } from '@vue/test-utils'
import { h, Fragment, Text, createCommentVNode } from 'vue'
import { readFileSync } from 'node:fs'
import { resolve } from 'node:path'
import CardGrid from '../../src/components/CardGrid.vue'
import MhCard from '../../src/components/MhCard.vue'

const cardGridSource = readFileSync(
  resolve(__dirname, '../../src/components/CardGrid.vue'),
  'utf-8'
)

describe('CardGrid', () => {
  it('should wrap each slotted card in one .mh-card-grid__item and preserve content', () => {
    const wrapper = shallowMount(CardGrid, {
      slots: {
        default: () => [h('div', { class: 'card' }, 'Alpha'), h('div', { class: 'card' }, 'Beta')],
      },
    })

    const items = wrapper.findAll('.mh-card-grid__item')
    expect(items).toHaveLength(2)
    expect(wrapper.findAll('.card').map((c) => c.text())).toEqual(['Alpha', 'Beta'])
    expect(items[0].find('.card').text()).toBe('Alpha')
    expect(items[1].find('.card').text()).toBe('Beta')
  })

  it('should recursively flatten nested Fragment slot content into individual items', () => {
    const wrapper = shallowMount(CardGrid, {
      slots: {
        default: () => [
          h(Fragment, [
            h(Fragment, [
              h('div', { class: 'card', key: 'a' }, 'One'),
              h('div', { class: 'card', key: 'b' }, 'Two'),
            ]),
            h('div', { class: 'card', key: 'c' }, 'Three'),
          ]),
        ],
      },
    })

    expect(wrapper.findAll('.mh-card-grid__item')).toHaveLength(3)
    expect(wrapper.findAll('.card').map((c) => c.text())).toEqual(['One', 'Two', 'Three'])
  })

  it('should skip null, comment, and text nodes', () => {
    const wrapper = shallowMount(CardGrid, {
      slots: {
        default: () => [
          h('div', { class: 'card' }, 'Visible'),
          null,
          createCommentVNode('hidden'),
          h(Text, '   '),
        ],
      },
    })

    expect(wrapper.findAll('.mh-card-grid__item')).toHaveLength(1)
    expect(wrapper.find('.card').text()).toBe('Visible')
  })

  it('should preserve VNode keys and fall back to flattened index keys', () => {
    const wrapper = shallowMount(CardGrid, {
      slots: {
        default: () => [
          h('div', { class: 'card', key: 'stable-key' }, 'Keyed'),
          h('div', { class: 'card' }, 'Unkeyed'),
        ],
      },
    })

    const items = wrapper.findAll('.mh-card-grid__item')
    expect(items).toHaveLength(2)

    // Vue Test Utils exposes vnode keys on the wrapper's vnode children.
    const rootVNode = (wrapper.vm.$).subTree
    const children = (rootVNode.children ?? []) as Array<{ key?: string | number }>
    expect(children[0]?.key).toBe('stable-key')
    expect(children[1]?.key).toBe(1)
  })

  it('should render an empty .mh-card-grid when no cards are slotted', () => {
    const wrapper = shallowMount(CardGrid)

    expect(wrapper.find('.mh-card-grid').exists()).toBe(true)
    expect(wrapper.findAll('.mh-card-grid__item')).toHaveLength(0)
  })

  it('should apply automationId as data-automation-id on the grid root', () => {
    const wrapper = shallowMount(CardGrid, {
      props: { automationId: 'dashboard-grid' },
      slots: { default: () => [h('div', 'Card 1')] },
    })

    expect(wrapper.find('.mh-card-grid').attributes('data-automation-id')).toBe('dashboard-grid')
  })

  it('should not expose legacy Vuetify breakpoint props (cols/sm/md/lg/xl)', () => {
    const wrapper = shallowMount(CardGrid, {
      slots: { default: () => [h('div', 'Card 1')] },
    })

    expect(wrapper.props()).not.toHaveProperty('cols')
    expect(wrapper.props()).not.toHaveProperty('sm')
    expect(wrapper.props()).not.toHaveProperty('md')
    expect(wrapper.props()).not.toHaveProperty('lg')
    expect(wrapper.props()).not.toHaveProperty('xl')
    expect(wrapper.findComponent({ name: 'VRow' }).exists()).toBe(false)
    expect(wrapper.findComponent({ name: 'VCol' }).exists()).toBe(false)
    expect(cardGridSource).not.toMatch(/\bcols\s*:/)
    expect(cardGridSource).not.toContain("resolveComponent('VRow')")
    expect(cardGridSource).not.toContain("resolveComponent('VCol')")
  })

  it('should encode equal-width tracks, stretch, every 1→8 breakpoint, and no 9+ column rule', () => {
    expect(cardGridSource).toContain('display: grid')
    expect(cardGridSource).toContain('width: 100%')
    expect(cardGridSource).toContain('gap: 16px')
    expect(cardGridSource).toContain('align-items: stretch')
    expect(cardGridSource).toContain('minmax(0, 1fr)')

    expect(cardGridSource).toContain('grid-template-columns: minmax(0, 1fr)')
    expect(cardGridSource).toContain('repeat(2, minmax(0, 1fr))')
    expect(cardGridSource).toContain('repeat(3, minmax(0, 1fr))')
    expect(cardGridSource).toContain('repeat(4, minmax(0, 1fr))')
    expect(cardGridSource).toContain('repeat(5, minmax(0, 1fr))')
    expect(cardGridSource).toContain('repeat(6, minmax(0, 1fr))')
    expect(cardGridSource).toContain('repeat(7, minmax(0, 1fr))')
    expect(cardGridSource).toContain('repeat(8, minmax(0, 1fr))')
    expect(cardGridSource).not.toContain('repeat(9,')

    expect(cardGridSource).toContain('@media (min-width: 600px)')
    expect(cardGridSource).toContain('@media (min-width: 960px)')
    expect(cardGridSource).toContain('@media (min-width: 1280px)')
    expect(cardGridSource).toContain('@media (min-width: 1600px)')
    expect(cardGridSource).toContain('@media (min-width: 1920px)')
    expect(cardGridSource).toContain('@media (min-width: 2240px)')
    expect(cardGridSource).toContain('@media (min-width: 2560px)')

    const wrapper = shallowMount(CardGrid, {
      slots: { default: () => [h('div', 'Card 1')] },
    })
    expect(wrapper.find('.mh-card-grid').classes()).toContain('mh-card-grid')
    expect(wrapper.find('.mh-card-grid__item').exists()).toBe(true)
  })

  it('should stretch expanded MhCard and keep collapsed MhCard intrinsic via scoped deep rules', () => {
    expect(cardGridSource).toContain(':deep(.mh-card:not(.mh-card--collapsed))')
    expect(cardGridSource).toMatch(/\.mh-card:not\(\.mh-card--collapsed\)[\s\S]*?align-self:\s*stretch/)
    expect(cardGridSource).toMatch(/\.mh-card:not\(\.mh-card--collapsed\)[\s\S]*?height:\s*100%/)
    expect(cardGridSource).toMatch(/\.mh-card:not\(\.mh-card--collapsed\)[\s\S]*?flex:\s*1 1 auto/)

    expect(cardGridSource).toContain(':deep(.mh-card--collapsed)')
    expect(cardGridSource).toMatch(/\.mh-card--collapsed[\s\S]*?align-self:\s*flex-start/)
    expect(cardGridSource).toMatch(/\.mh-card--collapsed[\s\S]*?height:\s*auto/)
    expect(cardGridSource).toMatch(/\.mh-card--collapsed[\s\S]*?flex:\s*0 0 auto/)
    expect(cardGridSource).toMatch(/\.mh-card--collapsed[\s\S]*?min-height:\s*0/)

    const wrapper = mount(CardGrid, {
      slots: {
        default: () => [
          h(MhCard, { title: 'Expanded', automationId: 'expanded-card' }, () => 'Tall body'),
          h(
            MhCard,
            { title: 'Collapsed', collapsible: true, collapsed: true, automationId: 'collapsed-card' },
            () => 'Hidden body'
          ),
        ],
      },
      global: {
        stubs: {
          'v-card': { template: '<div class="v-card mh-card" :class="$attrs.class"><slot /></div>', inheritAttrs: false },
          'v-toolbar': { template: '<div class="v-toolbar"><slot /></div>' },
          'v-toolbar-title': { template: '<div class="v-toolbar-title"><slot /></div>' },
          'v-card-text': { template: '<div class="v-card-text"><slot /></div>' },
          'v-btn': { template: '<button><slot /></button>' },
          'v-icon': { template: '<i />' },
        },
      },
    })

    const cards = wrapper.findAll('.mh-card')
    expect(cards).toHaveLength(2)
    expect(cards[0].classes()).not.toContain('mh-card--collapsed')
    expect(cards[1].classes()).toContain('mh-card--collapsed')
  })

  it('should remain domain-independent (no Paths or journey naming)', () => {
    expect(cardGridSource.toLowerCase()).not.toContain('path')
    expect(cardGridSource.toLowerCase()).not.toContain('paths')
    expect(cardGridSource.toLowerCase()).not.toContain('journey')
    expect(cardGridSource.toLowerCase()).not.toContain('mentee')
    expect(cardGridSource.toLowerCase()).not.toContain('mentor')
    expect(cardGridSource).not.toContain('responsive-card-grid')
  })
})
