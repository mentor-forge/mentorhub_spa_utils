import { shallowMount } from '@vue/test-utils'
import { afterEach, describe, expect, it } from 'vitest'
import AdminPage from '../../src/components/AdminPage.vue'
import ConfigItemsTable from '../../src/components/admin/ConfigItemsTable.vue'

const apiBuild = { name: 'BUILT_AT', value: '20261122-190000', from: 'file' }
const slotStub = { template: '<div><slot /></div>' }

function configItems() {
  const wrapper = shallowMount(AdminPage, {
    props: { config: { config_items: [apiBuild] } },
    global: {
      stubs: {
        'v-container': slotStub,
        'v-row': slotStub,
        'v-col': slotStub,
        'v-card': slotStub,
        'v-card-title': slotStub,
        'v-card-text': slotStub,
        'v-tabs': slotStub,
        'v-tab': slotStub,
        'v-window': slotStub,
        'v-window-item': slotStub,
      },
    },
  })
  const items = wrapper.getComponent(ConfigItemsTable).props('items')
  wrapper.unmount()
  return items
}

afterEach(() => document.head.querySelector('meta[name="spa-built-at"]')?.remove())

describe('AdminPage SPA build stamp', () => {
  it.each(['LOCAL', '20261122-191500'])('prepends the SPA build value %s', (content) => {
    const meta = document.createElement('meta')
    meta.name = 'spa-built-at'
    meta.content = content
    document.head.append(meta)

    expect(configItems()).toEqual([
      { name: 'SPA_BUILT_AT', value: content, from: 'SPA' },
      apiBuild,
    ])
  })

  it('keeps the API items when the host does not supply a build stamp', () => {
    expect(configItems()).toEqual([apiBuild])
  })
})
