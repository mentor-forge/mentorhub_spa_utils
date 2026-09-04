import { describe, it, expect } from 'vitest'
import { shallowMount, type VueWrapper } from '@vue/test-utils'
import TokenClaimsCard from '../../src/components/admin/TokenClaimsCard.vue'

const FULL_TOKEN = {
  remote_ip: '203.0.113.10',
  display_name: 'Ada Lovelace',
  profile_id: 'A00000000000000000000001',
  customer_id: 'D00000000000000000000006',
  mentor_id: 'B00000000000000000000002',
  roles: ['admin', 'mentor'],
}

const vuetifyStubs = {
  'v-text-field': {
    inheritAttrs: false,
    props: ['modelValue', 'label', 'readonly', 'variant', 'density', 'prependInnerIcon'],
    template: '<input :value="modelValue" :aria-label="label" v-bind="$attrs" />',
  },
  'v-card': { template: '<div class="v-card-stub"><slot /></div>' },
  'v-card-title': { template: '<div class="v-card-title-stub"><slot /></div>' },
  'v-card-text': { template: '<div class="v-card-text-stub"><slot /></div>' },
  'v-alert': { template: '<div class="v-alert-stub"><slot /></div>' },
  'v-icon': { template: '<span class="v-icon-stub"></span>' },
  'v-row': { template: '<div class="v-row-stub"><slot /></div>' },
  'v-col': { template: '<div class="v-col-stub"><slot /></div>' },
  'v-chip-group': { template: '<div class="v-chip-group-stub"><slot /></div>' },
  'v-chip': { template: '<span class="v-chip-stub"><slot /></span>' },
}

function mountCard(token?: Record<string, unknown>): VueWrapper {
  return shallowMount(TokenClaimsCard, {
    props: token === undefined ? {} : { token },
    global: {
      renderStubDefaultSlot: true,
      stubs: vuetifyStubs,
    },
  })
}

function findField(wrapper: VueWrapper, automationId: string) {
  return wrapper.find(`[data-automation-id="${automationId}"]`)
}

describe('TokenClaimsCard', () => {
  it('renders profile_id, customer_id, and mentor_id from token claims', () => {
    const wrapper = mountCard(FULL_TOKEN)

    const profile = findField(wrapper, 'admin-token-profile-id-display')
    const customer = findField(wrapper, 'admin-token-customer-id-display')
    const mentor = findField(wrapper, 'admin-token-mentor-id-display')

    expect(profile.exists()).toBe(true)
    expect(profile.attributes('aria-label')).toBe('profile_id')
    expect(profile.attributes('value')).toBe(FULL_TOKEN.profile_id)

    expect(customer.exists()).toBe(true)
    expect(customer.attributes('aria-label')).toBe('customer_id')
    expect(customer.attributes('value')).toBe(FULL_TOKEN.customer_id)

    expect(mentor.exists()).toBe(true)
    expect(mentor.attributes('aria-label')).toBe('mentor_id')
    expect(mentor.attributes('value')).toBe(FULL_TOKEN.mentor_id)
  })

  it('renders display_name from token claims', () => {
    const wrapper = mountCard(FULL_TOKEN)
    const displayName = findField(wrapper, 'admin-token-display-name-display')

    expect(displayName.exists()).toBe(true)
    expect(displayName.attributes('aria-label')).toBe('display_name')
    expect(displayName.attributes('value')).toBe(FULL_TOKEN.display_name)
  })

  it('keeps IP Address and Roles presentation', () => {
    const wrapper = mountCard(FULL_TOKEN)

    const ipField = wrapper.find('[aria-label="IP Address"]')
    expect(ipField.exists()).toBe(true)
    expect(ipField.attributes('value')).toBe(FULL_TOKEN.remote_ip)

    expect(wrapper.text()).toContain('Roles')
    expect(wrapper.text()).toContain('admin')
    expect(wrapper.text()).toContain('mentor')
    expect(wrapper.text()).not.toContain('No roles assigned')
  })

  it('shows the empty-token alert when no token is provided', () => {
    const wrapper = mountCard()

    expect(wrapper.text()).toContain('No token data available')
    expect(findField(wrapper, 'admin-token-profile-id-display').exists()).toBe(false)
    expect(findField(wrapper, 'admin-token-customer-id-display').exists()).toBe(false)
    expect(findField(wrapper, 'admin-token-mentor-id-display').exists()).toBe(false)
    expect(findField(wrapper, 'admin-token-display-name-display').exists()).toBe(false)
  })

  it('displays N/A when individual claim keys are missing', () => {
    const wrapper = mountCard({ roles: [] })

    expect(findField(wrapper, 'admin-token-profile-id-display').attributes('value')).toBe('N/A')
    expect(findField(wrapper, 'admin-token-customer-id-display').attributes('value')).toBe('N/A')
    expect(findField(wrapper, 'admin-token-mentor-id-display').attributes('value')).toBe('N/A')
    expect(findField(wrapper, 'admin-token-display-name-display').attributes('value')).toBe('unknown')
    expect(wrapper.find('[aria-label="IP Address"]').attributes('value')).toBe('N/A')
    expect(wrapper.text()).toContain('No roles assigned')
  })

  it('does not populate profile_id from user_id or sub', () => {
    const wrapper = mountCard({
      user_id: 'legacy-user-id',
      sub: 'legacy-sub',
      customer_id: 'D00000000000000000000006',
    })

    const profile = findField(wrapper, 'admin-token-profile-id-display')
    expect(profile.attributes('value')).toBe('N/A')
    expect(profile.attributes('value')).not.toBe('legacy-user-id')
    expect(profile.attributes('value')).not.toBe('legacy-sub')

    expect(findField(wrapper, 'admin-token-customer-id-display').attributes('value')).toBe(
      'D00000000000000000000006'
    )
    expect(findField(wrapper, 'admin-token-mentor-id-display').attributes('value')).toBe('N/A')
  })

  it('does not populate display_name from name, given_name, email, user_id, or sub', () => {
    const wrapper = mountCard({
      name: 'Full Name',
      given_name: 'Given',
      email: 'ada@example.com',
      user_id: 'legacy-user-id',
      sub: 'legacy-sub',
      profile_id: 'A00000000000000000000001',
    })

    const displayName = findField(wrapper, 'admin-token-display-name-display')
    expect(displayName.attributes('value')).toBe('unknown')
    expect(displayName.attributes('value')).not.toBe('Full Name')
    expect(displayName.attributes('value')).not.toBe('Given')
    expect(displayName.attributes('value')).not.toBe('ada@example.com')
    expect(displayName.attributes('value')).not.toBe('legacy-user-id')
    expect(displayName.attributes('value')).not.toBe('legacy-sub')
    expect(findField(wrapper, 'admin-token-profile-id-display').attributes('value')).toBe(
      'A00000000000000000000001'
    )
  })
})
