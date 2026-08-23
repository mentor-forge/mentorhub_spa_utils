import { describe, it, expect, beforeEach, afterEach, vi } from 'vitest'
import { JOURNEY_APP_PATHS, buildJourneyUrl } from '../../src/utils/journeyUrls'
import {
  UNIVERSAL_NAV_CATALOG,
  visibleUniversalNavItems,
  resolveCustomerDisplayName,
  readProfilePicture,
} from '../../src/composables/universalNav'

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

function hrefFor(pathKey: keyof typeof JOURNEY_APP_PATHS): string {
  const { journey, path } = JOURNEY_APP_PATHS[pathKey]
  return buildJourneyUrl(journey, path)
}

describe('UNIVERSAL_NAV_CATALOG', () => {
  it('includes every locked table row with path keys and role gates', () => {
    const byId = Object.fromEntries(UNIVERSAL_NAV_CATALOG.map((row) => [row.id, row]))

    expect(UNIVERSAL_NAV_CATALOG).toHaveLength(9)
    expect(Object.keys(byId)).toEqual([
      'home',
      'customer',
      'customerMembers',
      'resources',
      'paths',
      'plans',
      'products',
      'notifications',
      'settings',
    ])

    expect(byId.home).toMatchObject({
      title: 'Home',
      automationId: 'nav-home-link',
      pathKey: 'home',
      requiredRoles: [],
    })
    expect(byId.customer).toMatchObject({
      title: '[Customer Name]',
      automationId: 'nav-customer-link',
      pathKey: 'customerEdit',
      requiredRoles: ['customer'],
    })
    expect(byId.customerMembers).toMatchObject({
      title: '[Customer Name] Members',
      automationId: 'nav-customer-members-link',
      pathKey: 'members',
      requiredRoles: ['customer'],
    })
    expect(byId.resources).toMatchObject({
      title: 'Learning Resources',
      automationId: 'nav-resources-link',
      pathKey: 'resources',
      requiredRoles: ['mentor'],
    })
    expect(byId.paths).toMatchObject({
      title: 'Learning Paths',
      automationId: 'nav-paths-link',
      pathKey: 'paths',
      requiredRoles: ['mentor'],
    })
    expect(byId.plans).toMatchObject({
      title: 'Encounter Plans',
      automationId: 'nav-plans-link',
      pathKey: 'plans',
      requiredRoles: ['mentor'],
    })
    expect(byId.products).toMatchObject({
      title: 'Products',
      automationId: 'nav-products-link',
      pathKey: 'products',
      requiredRoles: ['admin'],
    })
    expect(byId.notifications).toMatchObject({
      title: 'Notifications',
      automationId: 'nav-notifications-link',
      pathKey: 'notifications',
      requiredRoles: [],
    })
    expect(byId.settings).toMatchObject({
      title: 'Settings',
      automationId: 'nav-settings-link',
      pathKey: 'settings',
      requiredRoles: ['admin'],
    })
  })
})

describe('visibleUniversalNavItems', () => {
  it('returns Home + Notifications only when the token has no roles', () => {
    const items = visibleUniversalNavItems([], 'Acme')
    expect(items.map((item) => item.id)).toEqual(['home', 'notifications'])
    expect(items.map((item) => item.automationId)).toEqual([
      'nav-home-link',
      'nav-notifications-link',
    ])
    expect(items[0].href).toBe(hrefFor('home'))
    expect(items[1].href).toBe(hrefFor('notifications'))
  })

  it('adds org + members links for the customer role', () => {
    const items = visibleUniversalNavItems(['customer'], 'Acme')
    expect(items.map((item) => item.id)).toEqual([
      'home',
      'customer',
      'customerMembers',
      'notifications',
    ])
    expect(items.find((item) => item.id === 'customer')?.title).toBe('Acme')
    expect(items.find((item) => item.id === 'customerMembers')?.title).toBe('Acme Members')
    expect(items.find((item) => item.id === 'customer')?.href).toBe(hrefFor('customerEdit'))
    expect(items.find((item) => item.id === 'customerMembers')?.href).toBe(hrefFor('members'))
  })

  it('adds the three learning links for the mentor role', () => {
    const items = visibleUniversalNavItems(['mentor'])
    expect(items.map((item) => item.id)).toEqual([
      'home',
      'resources',
      'paths',
      'plans',
      'notifications',
    ])
    expect(items.find((item) => item.id === 'resources')?.href).toBe(hrefFor('resources'))
    expect(items.find((item) => item.id === 'paths')?.href).toBe(hrefFor('paths'))
    expect(items.find((item) => item.id === 'plans')?.href).toBe(hrefFor('plans'))
  })

  it('adds Products + Settings for the admin role', () => {
    const items = visibleUniversalNavItems(['admin'])
    expect(items.map((item) => item.id)).toEqual([
      'home',
      'products',
      'notifications',
      'settings',
    ])
    expect(items.find((item) => item.id === 'products')?.href).toBe(hrefFor('products'))
    expect(items.find((item) => item.id === 'settings')?.href).toBe(hrefFor('settings'))
  })

  it('unions combined roles', () => {
    const items = visibleUniversalNavItems(['customer', 'mentor', 'admin'], 'Northwind')
    expect(items.map((item) => item.id)).toEqual(UNIVERSAL_NAV_CATALOG.map((row) => row.id))
    expect(items).toHaveLength(9)
    expect(items.find((item) => item.id === 'customer')?.title).toBe('Northwind')
  })

  it('treats mentee-only as authenticated-without-gated-roles', () => {
    const items = visibleUniversalNavItems(['mentee'])
    expect(items.map((item) => item.id)).toEqual(['home', 'notifications'])
  })
})

describe('resolveCustomerDisplayName / readProfilePicture', () => {
  beforeEach(() => {
    localStorage.clear()
  })

  afterEach(() => {
    localStorage.clear()
  })

  it('prefers an explicit customerName over the JWT', () => {
    localStorage.setItem('access_token', encodeJwt({ customer_name: 'From Token' }))
    expect(resolveCustomerDisplayName('  Acme  ')).toBe('Acme')
  })

  it('reads customer_name from the access token when the prop is omitted', () => {
    localStorage.setItem('access_token', encodeJwt({ customer_name: 'Token Org' }))
    expect(resolveCustomerDisplayName()).toBe('Token Org')
    expect(resolveCustomerDisplayName('')).toBe('Token Org')
    expect(resolveCustomerDisplayName('   ')).toBe('Token Org')
  })

  it('falls back to custom:customer_name then Customer', () => {
    localStorage.setItem('access_token', encodeJwt({ 'custom:customer_name': 'Cognito Org' }))
    expect(resolveCustomerDisplayName()).toBe('Cognito Org')

    localStorage.setItem('access_token', encodeJwt({ customer_name: '  ' }))
    expect(resolveCustomerDisplayName()).toBe('Customer')

    localStorage.removeItem('access_token')
    expect(resolveCustomerDisplayName()).toBe('Customer')
  })

  it('returns null picture when the claim is missing and the URL when present', () => {
    expect(readProfilePicture()).toBeNull()

    localStorage.setItem('access_token', encodeJwt({ picture: 'https://cdn.example/me.png' }))
    expect(readProfilePicture()).toBe('https://cdn.example/me.png')

    localStorage.setItem('access_token', encodeJwt({ picture: '   ' }))
    expect(readProfilePicture()).toBeNull()
  })

  it('ignores malformed tokens and non-object payloads', () => {
    localStorage.setItem('access_token', 'not-a-jwt')
    expect(resolveCustomerDisplayName()).toBe('Customer')
    expect(readProfilePicture()).toBeNull()

    localStorage.setItem('access_token', 'a.b')
    expect(resolveCustomerDisplayName()).toBe('Customer')

    const badJson = btoa('not-json').replace(/=/g, '')
    localStorage.setItem('access_token', `hdr.${badJson}.sig`)
    expect(resolveCustomerDisplayName()).toBe('Customer')

    const arrayPayload = btoa(JSON.stringify(['nope']))
      .replace(/=/g, '')
      .replace(/\+/g, '-')
      .replace(/\//g, '_')
    localStorage.setItem('access_token', `hdr.${arrayPayload}.sig`)
    expect(resolveCustomerDisplayName()).toBe('Customer')

    const primitivePayload = btoa(JSON.stringify(42))
      .replace(/=/g, '')
      .replace(/\+/g, '-')
      .replace(/\//g, '_')
    localStorage.setItem('access_token', `hdr.${primitivePayload}.sig`)
    expect(resolveCustomerDisplayName()).toBe('Customer')
    expect(readProfilePicture()).toBeNull()
  })

  it('uses JWT customer_name when visibleUniversalNavItems omits the label', () => {
    localStorage.setItem('access_token', encodeJwt({ customer_name: 'Stored Org' }))
    const items = visibleUniversalNavItems(['customer'])
    expect(items.find((item) => item.id === 'customer')?.title).toBe('Stored Org')
  })

  it('falls back when localStorage cannot be read', () => {
    const spy = vi.spyOn(Storage.prototype, 'getItem').mockImplementation(() => {
      throw new Error('blocked')
    })
    expect(resolveCustomerDisplayName()).toBe('Customer')
    expect(readProfilePicture()).toBeNull()
    spy.mockRestore()
  })
})
