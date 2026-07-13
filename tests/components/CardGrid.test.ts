import { describe, it, expect } from 'vitest'
import { shallowMount } from '@vue/test-utils'
import { h, Fragment } from 'vue'
import CardGrid from '../../src/components/CardGrid.vue'

describe('CardGrid', () => {
  it('should apply default breakpoints (cols=12 sm=6 md=4 lg=3) to each card', () => {
    const wrapper = shallowMount(CardGrid, {
      slots: {
        default: () => [h('div', { class: 'card' }, 'Card 1'), h('div', { class: 'card' }, 'Card 2')],
      },
    })

    const cols = wrapper.findAll('v-col')
    expect(cols).toHaveLength(2)
    cols.forEach((col) => {
      expect(col.attributes('cols')).toBe('12')
      expect(col.attributes('sm')).toBe('6')
      expect(col.attributes('md')).toBe('4')
      expect(col.attributes('lg')).toBe('3')
    })
  })

  it('should allow overriding breakpoint props', () => {
    const wrapper = shallowMount(CardGrid, {
      props: { cols: '6', sm: '4', md: '3', lg: '2', xl: '1' },
      slots: { default: () => [h('div', 'Card 1')] },
    })

    const col = wrapper.find('v-col')
    expect(col.attributes('cols')).toBe('6')
    expect(col.attributes('sm')).toBe('4')
    expect(col.attributes('md')).toBe('3')
    expect(col.attributes('lg')).toBe('2')
    expect(col.attributes('xl')).toBe('1')
  })

  it('should apply automationId to the grid root', () => {
    const wrapper = shallowMount(CardGrid, {
      props: { automationId: 'dashboard-grid' },
      slots: { default: () => [h('div', 'Card 1')] },
    })

    expect(wrapper.find('v-row').attributes('data-automation-id')).toBe('dashboard-grid')
  })

  it('should render each slotted card inside its own v-col, preserving content', () => {
    const wrapper = shallowMount(CardGrid, {
      slots: {
        default: () => [h('div', { class: 'card' }, 'Alpha'), h('div', { class: 'card' }, 'Beta')],
      },
    })

    const cards = wrapper.findAll('.card')
    expect(cards).toHaveLength(2)
    expect(cards[0].text()).toBe('Alpha')
    expect(cards[1].text()).toBe('Beta')
  })

  it('should flatten v-for Fragment slot content into individual columns', () => {
    const wrapper = shallowMount(CardGrid, {
      slots: {
        default: () => [
          h(Fragment, [
            h('div', { class: 'card', key: 1 }, 'One'),
            h('div', { class: 'card', key: 2 }, 'Two'),
            h('div', { class: 'card', key: 3 }, 'Three'),
          ]),
        ],
      },
    })

    expect(wrapper.findAll('v-col')).toHaveLength(3)
    expect(wrapper.findAll('.card').map((c) => c.text())).toEqual(['One', 'Two', 'Three'])
  })

  it('should skip comment/null nodes produced by v-if false branches', () => {
    const wrapper = shallowMount(CardGrid, {
      slots: {
        default: () => [h('div', { class: 'card' }, 'Visible'), null],
      },
    })

    expect(wrapper.findAll('v-col')).toHaveLength(1)
    expect(wrapper.find('.card').text()).toBe('Visible')
  })

  it('should render an empty row when no cards are slotted', () => {
    const wrapper = shallowMount(CardGrid)

    expect(wrapper.find('v-row').exists()).toBe(true)
    expect(wrapper.findAll('v-col')).toHaveLength(0)
  })
})
