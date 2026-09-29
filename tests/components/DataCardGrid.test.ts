import { describe, it, expect } from 'vitest'
import { shallowMount } from '@vue/test-utils'
import { h } from 'vue'
import { readFileSync } from 'node:fs'
import { resolve } from 'node:path'
import DataCardGrid from '../../src/components/DataCardGrid.vue'

const dataCardGridSource = readFileSync(
  resolve(__dirname, '../../src/components/DataCardGrid.vue'),
  'utf-8'
)

describe('DataCardGrid', () => {
  it('should render root with class data-card-grid and hardcoded automation id', () => {
    const wrapper = shallowMount(DataCardGrid)

    const root = wrapper.find('.data-card-grid')
    expect(root.exists()).toBe(true)
    expect(root.attributes('data-automation-id')).toBe('data-card-grid')
  })

  it('should render slotted children inside the root in order with their automation ids intact', () => {
    const wrapper = shallowMount(DataCardGrid, {
      slots: {
        default: () => [
          h('div', { 'data-automation-id': 'card-alpha', class: 'child' }, 'Alpha'),
          h('div', { 'data-automation-id': 'card-beta', class: 'child' }, 'Beta'),
        ],
      },
    })

    const root = wrapper.find('.data-card-grid')
    const children = root.findAll('.child')
    expect(children).toHaveLength(2)
    expect(children.map((c) => c.text())).toEqual(['Alpha', 'Beta'])
    expect(children[0].attributes('data-automation-id')).toBe('card-alpha')
    expect(children[1].attributes('data-automation-id')).toBe('card-beta')
  })

  it('should render an empty .data-card-grid when no children are slotted', () => {
    const wrapper = shallowMount(DataCardGrid)

    expect(wrapper.find('.data-card-grid').exists()).toBe(true)
    expect(wrapper.find('.data-card-grid').element.childElementCount).toBe(0)
  })

  it('should encode 1 / 2 / 4 column rules, 16px gap, stretch, and no 3-col or 5+ rule', () => {
    expect(dataCardGridSource).toContain('display: grid')
    expect(dataCardGridSource).toContain('width: 100%')
    expect(dataCardGridSource).toContain('gap: 16px')
    expect(dataCardGridSource).toContain('align-items: stretch')
    expect(dataCardGridSource).toContain('grid-template-columns: minmax(0, 1fr)')
    expect(dataCardGridSource).toContain('repeat(2, minmax(0, 1fr))')
    expect(dataCardGridSource).toContain('repeat(4, minmax(0, 1fr))')
    expect(dataCardGridSource).toContain('@media (min-width: 641px)')
    expect(dataCardGridSource).toContain('@media (min-width: 1920px)')

    expect(dataCardGridSource).not.toContain('repeat(3,')
    expect(dataCardGridSource).not.toContain('repeat(5,')
    expect(dataCardGridSource).not.toContain('repeat(6,')
    expect(dataCardGridSource).not.toContain('repeat(7,')
    expect(dataCardGridSource).not.toContain('repeat(8,')
    expect(dataCardGridSource).not.toContain(':deep')
  })

  it('should remain domain-independent (no journey, Paths, Plans, or Mentor naming)', () => {
    const lower = dataCardGridSource.toLowerCase()
    expect(lower).not.toContain('journey')
    expect(lower).not.toContain('paths')
    expect(lower).not.toContain('path')
    expect(lower).not.toContain('plans')
    expect(lower).not.toContain('plan')
    expect(lower).not.toContain('mentor')
    expect(lower).not.toContain('mentee')
  })

  it('should expose no props', () => {
    const wrapper = shallowMount(DataCardGrid)
    expect(Object.keys(wrapper.props())).toHaveLength(0)
  })
})
