import { describe, it, expect, beforeEach, vi } from 'vitest'
import { computed } from 'vue'
import { shallowMount } from '@vue/test-utils'
import PageFrame from '../../src/components/PageFrame.vue'
import { useAuth } from '../../src/composables/useAuth'
import { redirectToIdpLogin } from '../../src/utils/idpRedirect'
import { JOURNEY_APP_PATHS, buildJourneyUrl, hostingConfigHref } from '../../src/utils/journeyUrls'

const mocks = vi.hoisted(() => ({
  logout: vi.fn(),
  isAuthenticated: { value: true },
  roles: { value: [] as string[] },
}))

vi.mock('../../src/composables/useAuth', () => ({
  useAuth: vi.fn(),
}))

vi.mock('../../src/utils/idpRedirect', () => ({
  redirectToIdpLogin: vi.fn(),
}))

function encodeJwt(payload: unknown): string {
  const header = btoa(JSON.stringify({ alg: 'none', typ: 'JWT' }))
    .replace(/=/g, '')
    .replace(/\+/g, '-')
    .replace(/\//g, '_')
  const body = btoa(JSON.stringify(payload))
    .replace(/=/g, '')
    .replace(/\+/g, '-')
    .replace(/\//g, '_')
  return `${header}.${body}.sig`
}

const vuetifyStubs = {
  'v-app-bar': { template: '<header><slot /></header>' },
  'v-app-bar-nav-icon': {
    inheritAttrs: false,
    template: '<button type="button" v-bind="$attrs"><slot /></button>',
  },
  'v-app-bar-title': {
    inheritAttrs: false,
    template: '<div v-bind="$attrs"><slot /></div>',
  },
  'v-spacer': { template: '<div class="v-spacer-stub" />' },
  'v-avatar': { template: '<span class="v-avatar-stub"><slot /></span>' },
  'v-img': { props: ['src'], template: '<img :src="src" alt="" />' },
  'v-icon': { template: '<i class="v-icon-stub"><slot /></i>' },
  'v-navigation-drawer': { template: '<nav><slot /><slot name="append" /></nav>' },
  'v-list': { template: '<ul><slot /></ul>' },
  'v-list-item': {
    inheritAttrs: false,
    props: ['href', 'title', 'prependIcon'],
    template: '<a :href="href" v-bind="$attrs">{{ title }}<slot /></a>',
  },
  'v-divider': { template: '<hr />' },
  'v-main': { template: '<main><slot /></main>' },
}

function mountPageFrame(
  props: { pageTitle?: string; customerName?: string } = {},
  options: Record<string, unknown> = {}
) {
  return shallowMount(PageFrame, {
    props: { pageTitle: 'Discover', ...props },
    global: {
      renderStubDefaultSlot: true,
      stubs: vuetifyStubs,
    },
    ...options,
  })
}

describe('PageFrame', () => {
  beforeEach(() => {
    localStorage.clear()
    mocks.logout.mockReset()
    mocks.isAuthenticated.value = true
    mocks.roles.value = []
    vi.mocked(useAuth).mockReturnValue({
      isAuthenticated: computed(() => mocks.isAuthenticated.value),
      roles: computed(() => mocks.roles.value),
      logout: mocks.logout,
    } as ReturnType<typeof useAuth>)
    vi.mocked(redirectToIdpLogin).mockReset()
  })

  it('renders pageTitle on the stable title id', () => {
    const wrapper = mountPageFrame({ pageTitle: 'Learning Paths' })
    const title = wrapper.find('[data-automation-id="page-frame-title"]')
    expect(title.exists()).toBe(true)
    expect(title.text()).toBe('Learning Paths')
    expect(wrapper.html()).not.toContain('v-app')
  })

  it('shows the hamburger and profile link when authenticated', () => {
    const wrapper = mountPageFrame()
    expect(wrapper.find('[data-automation-id="nav-drawer-toggle"]').exists()).toBe(true)

    const profile = wrapper.find('[data-automation-id="nav-profile-link"]')
    expect(profile.exists()).toBe(true)
    const { journey, path } = JOURNEY_APP_PATHS.profile
    expect(profile.attributes('href')).toBe(buildJourneyUrl(journey, path))
    expect(profile.classes()).toContain('me-4')
    expect(wrapper.find('.v-icon-stub').exists()).toBe(true)
    expect(wrapper.find('[data-automation-id="nav-profile-name-display"]').exists()).toBe(false)
  })

  it('hides hamburger, drawer, and profile when unauthenticated', () => {
    mocks.isAuthenticated.value = false
    const wrapper = mountPageFrame()
    expect(wrapper.find('[data-automation-id="nav-drawer-toggle"]').exists()).toBe(false)
    expect(wrapper.find('[data-automation-id="nav-profile-link"]').exists()).toBe(false)
    expect(wrapper.find('[data-automation-id="nav-home-link"]').exists()).toBe(false)
    expect(wrapper.find('[data-automation-id="nav-logout-link"]').exists()).toBe(false)
  })

  it('does not declare disallowed nav / ALB props', () => {
    const wrapper = mountPageFrame()
    const propKeys = Object.keys(wrapper.props())
    expect(propKeys.sort()).toEqual(['customerName', 'pageTitle'])
    expect(propKeys).not.toContain('navItems')
    expect(propKeys).not.toContain('albOrigin')
    expect(wrapper.vm.$slots['nav-extra']).toBeUndefined()
  })

  it('hides role-gated drawer items when the token has no roles', () => {
    const wrapper = mountPageFrame()
    expect(wrapper.find('[data-automation-id="nav-home-link"]').exists()).toBe(true)
    expect(wrapper.find('[data-automation-id="nav-resources-link"]').exists()).toBe(true)
    expect(wrapper.find('[data-automation-id="nav-paths-link"]').exists()).toBe(true)
    expect(wrapper.find('[data-automation-id="nav-events-link"]').exists()).toBe(false)
    expect(wrapper.find('[data-automation-id="nav-notifications-link"]').exists()).toBe(false)
    expect(wrapper.find('[data-automation-id="nav-settings-link"]').exists()).toBe(false)
    expect(wrapper.find('[data-automation-id="nav-customer-link"]').exists()).toBe(false)
    expect(wrapper.find('[data-automation-id="nav-customer-members-link"]').exists()).toBe(false)
    expect(wrapper.find('[data-automation-id="nav-plans-link"]').exists()).toBe(false)
    expect(wrapper.find('[data-automation-id="nav-products-link"]').exists()).toBe(false)
    expect(wrapper.find('[data-automation-id="nav-logout-link"]').exists()).toBe(true)
  })

  it('does not resurrect Customer links for the customer role', () => {
    mocks.roles.value = ['customer']
    const wrapper = mountPageFrame({ customerName: 'Acme' })

    expect(wrapper.find('[data-automation-id="nav-home-link"]').exists()).toBe(true)
    expect(wrapper.find('[data-automation-id="nav-resources-link"]').exists()).toBe(true)
    expect(wrapper.find('[data-automation-id="nav-paths-link"]').exists()).toBe(true)
    expect(wrapper.find('[data-automation-id="nav-events-link"]').exists()).toBe(false)
    expect(wrapper.find('[data-automation-id="nav-customer-link"]').exists()).toBe(false)
    expect(wrapper.find('[data-automation-id="nav-customer-members-link"]').exists()).toBe(false)
    expect(wrapper.find('[data-automation-id="nav-products-link"]').exists()).toBe(false)
    expect(wrapper.find('[data-automation-id="nav-notifications-link"]').exists()).toBe(false)
    expect(wrapper.find('[data-automation-id="nav-settings-link"]').exists()).toBe(false)
  })

  it('shows mentor collections and admin Notifications/Settings without Products', () => {
    mocks.roles.value = ['customer', 'mentor', 'admin']
    const wrapper = mountPageFrame({ customerName: 'Acme' })

    expect(wrapper.find('[data-automation-id="nav-events-link"]').exists()).toBe(true)
    expect(wrapper.find('[data-automation-id="nav-resources-link"]').exists()).toBe(true)
    expect(wrapper.find('[data-automation-id="nav-paths-link"]').exists()).toBe(true)
    expect(wrapper.find('[data-automation-id="nav-plans-link"]').exists()).toBe(true)
    expect(wrapper.find('[data-automation-id="nav-notifications-link"]').exists()).toBe(true)
    expect(wrapper.find('[data-automation-id="nav-settings-link"]').exists()).toBe(true)
    expect(wrapper.find('[data-automation-id="nav-products-link"]').exists()).toBe(false)
    expect(wrapper.find('[data-automation-id="nav-customer-link"]').exists()).toBe(false)

    const settings = wrapper.find('[data-automation-id="nav-settings-link"]')
    expect(settings.attributes('href')).toBe(hostingConfigHref())
    expect(settings.attributes('href')).not.toBe(buildJourneyUrl('admin', 'settings'))
  })

  it('keeps Settings on the hosting debug-port origin instead of welcome :8080', () => {
    const originalLocation = window.location
    Object.defineProperty(window, 'location', {
      configurable: true,
      value: {
        protocol: 'http:',
        hostname: 'dev.example.ts.net',
        port: '8392',
        origin: 'http://dev.example.ts.net:8392',
        pathname: '/customer/profile/',
        href: 'http://dev.example.ts.net:8392/customer/profile/',
      },
    })

    try {
      mocks.roles.value = ['admin']
      const wrapper = mountPageFrame()
      const href = wrapper.find('[data-automation-id="nav-settings-link"]').attributes('href')
      expect(href).toBe('http://dev.example.ts.net:8392/customer/config')
      expect(href).not.toContain(':8080')
      expect(href).not.toContain('127.0.0.1')
    } finally {
      Object.defineProperty(window, 'location', {
        configurable: true,
        value: originalLocation,
      })
    }
  })

  it('uses the JWT picture claim on the profile avatar when present', () => {
    localStorage.setItem(
      'access_token',
      encodeJwt({ picture: 'https://cdn.example/avatar.png' })
    )
    const wrapper = mountPageFrame()
    expect(wrapper.find('img').attributes('src')).toBe('https://cdn.example/avatar.png')
    expect(wrapper.find('.v-icon-stub').exists()).toBe(false)
  })

  it('shows JWT display_name below logout at the drawer bottom when the claim is present', () => {
    localStorage.setItem(
      'access_token',
      encodeJwt({
        display_name: '  Ada Lovelace  ',
        picture: 'https://cdn.example/avatar.png',
      })
    )
    const wrapper = mountPageFrame()
    const logout = wrapper.find('[data-automation-id="nav-logout-link"]')
    const name = wrapper.find('[data-automation-id="nav-profile-name-display"]')
    expect(logout.exists()).toBe(true)
    expect(name.exists()).toBe(true)
    expect(name.text()).toBe('Ada Lovelace')
    expect(wrapper.find('[data-automation-id="nav-profile-link"]').text()).not.toContain('Ada Lovelace')
    expect(wrapper.html().indexOf('nav-logout-link')).toBeLessThan(
      wrapper.html().indexOf('nav-profile-name-display')
    )
    expect(wrapper.find('img').attributes('src')).toBe('https://cdn.example/avatar.png')
  })

  it('keeps compact avatar-only chrome when display_name is blank or missing', () => {
    localStorage.setItem('access_token', encodeJwt({ display_name: '   ' }))
    const blankWrapper = mountPageFrame()
    expect(blankWrapper.find('[data-automation-id="nav-profile-name-display"]').exists()).toBe(false)
    expect(blankWrapper.find('[data-automation-id="nav-profile-link"]').exists()).toBe(true)
    expect(blankWrapper.find('.v-icon-stub').exists()).toBe(true)

    localStorage.setItem('access_token', encodeJwt({ picture: 'https://cdn.example/me.png' }))
    const missingWrapper = mountPageFrame()
    expect(missingWrapper.find('[data-automation-id="nav-profile-name-display"]').exists()).toBe(false)
    expect(missingWrapper.find('img').attributes('src')).toBe('https://cdn.example/me.png')
  })

  it('keeps compact avatar-only chrome when the JWT is malformed', () => {
    localStorage.setItem('access_token', 'not-a-jwt')
    const wrapper = mountPageFrame()
    expect(wrapper.find('[data-automation-id="nav-profile-name-display"]').exists()).toBe(false)
    expect(wrapper.find('[data-automation-id="nav-profile-link"]').exists()).toBe(true)
    expect(wrapper.find('.v-icon-stub').exists()).toBe(true)
  })

  it('does not synthesize display_name from name, given_name, email, user_id, or sub', () => {
    localStorage.setItem(
      'access_token',
      encodeJwt({
        name: 'Full Name',
        given_name: 'Given',
        email: 'ada@example.com',
        user_id: 'legacy-user-id',
        sub: 'legacy-sub',
      })
    )
    const wrapper = mountPageFrame()
    expect(wrapper.find('[data-automation-id="nav-profile-name-display"]').exists()).toBe(false)
    expect(wrapper.find('[data-automation-id="nav-profile-link"]').exists()).toBe(true)
    expect(wrapper.text()).not.toContain('Full Name')
    expect(wrapper.text()).not.toContain('Given')
    expect(wrapper.text()).not.toContain('ada@example.com')
    expect(wrapper.text()).not.toContain('legacy-user-id')
    expect(wrapper.text()).not.toContain('legacy-sub')
  })

  it('renders the default slot inside v-main', () => {
    const wrapper = mountPageFrame({}, { slots: { default: '<p>Page body</p>' } })
    expect(wrapper.find('main').html()).toContain('Page body')
  })

  it('toggles the drawer from the hamburger', async () => {
    const wrapper = mountPageFrame()
    const vm = wrapper.vm as unknown as { drawer: boolean }
    expect(vm.drawer).toBe(false)
    await wrapper.find('[data-automation-id="nav-drawer-toggle"]').trigger('click')
    expect(vm.drawer).toBe(true)
  })

  it('calls logout then redirectToIdpLogin from the logout link', async () => {
    const wrapper = mountPageFrame()
    const vm = wrapper.vm as unknown as { drawer: boolean }
    vm.drawer = true

    await wrapper.find('[data-automation-id="nav-logout-link"]').trigger('click')

    expect(mocks.logout).toHaveBeenCalledTimes(1)
    expect(redirectToIdpLogin).toHaveBeenCalledTimes(1)
    const expectedReturnTo = buildJourneyUrl('discovery')
    expect(redirectToIdpLogin).toHaveBeenCalledWith(expectedReturnTo)
    expect(expectedReturnTo).not.toBe(`${window.location.origin}/`)
    const returnTo = vi.mocked(redirectToIdpLogin).mock.calls[0]?.[0]
    expect(returnTo).toBe(expectedReturnTo)
    if (!expectedReturnTo.includes('127.0.0.1')) {
      expect(returnTo).not.toContain('127.0.0.1')
    }
    expect(mocks.logout.mock.invocationCallOrder[0]).toBeLessThan(
      vi.mocked(redirectToIdpLogin).mock.invocationCallOrder[0]
    )
    expect(vm.drawer).toBe(false)
  })
})
