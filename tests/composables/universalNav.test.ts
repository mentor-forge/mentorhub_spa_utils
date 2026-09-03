import { describe, it, expect, beforeEach, afterEach, vi } from 'vitest'
import { JOURNEY_APP_PATHS, buildJourneyUrl, hostingConfigHref } from '../../src/utils/journeyUrls'
import {
  UNIVERSAL_NAV_CATALOG,
  visibleUniversalNavItems,
  resolveCustomerDisplayName,
  readProfilePicture,
  readDisplayName,
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

const REMOVED_NAV_IDS = ['nav-products-link', 'nav-customer-link', 'nav-customer-members-link']

describe('UNIVERSAL_NAV_CATALOG', () => {
  it('includes every locked table row with path keys and role gates', () => {
    const byId = Object.fromEntries(UNIVERSAL_NAV_CATALOG.map((row) => [row.id, row]))

    expect(UNIVERSAL_NAV_CATALOG).toHaveLength(7)
    expect(Object.keys(byId)).toEqual([
      'home',
      'resources',
      'paths',
      'plans',
      'notifications',
      'events',
      'settings',
    ])

    expect(byId.home).toMatchObject({
      title: 'Home',
      automationId: 'nav-home-link',
      pathKey: 'home',
      requiredRoles: [],
    })
    expect(byId.resources).toMatchObject({
      title: 'Resources',
      automationId: 'nav-resources-link',
      pathKey: 'resources',
      requiredRoles: [],
    })
    expect(byId.paths).toMatchObject({
      title: 'Paths',
      automationId: 'nav-paths-link',
      pathKey: 'paths',
      requiredRoles: [],
    })
    expect(byId.events).toMatchObject({
      title: 'Events',
      automationId: 'nav-events-link',
      pathKey: 'events',
      requiredRoles: ['admin'],
    })
    expect(byId.plans).toMatchObject({
      title: 'Plans',
      automationId: 'nav-plans-link',
      pathKey: 'plans',
      requiredRoles: ['mentor'],
    })
    expect(byId.notifications).toMatchObject({
      title: 'Notifications',
      automationId: 'nav-notifications-link',
      pathKey: 'notifications',
      requiredRoles: ['admin'],
    })
    expect(byId.settings).toMatchObject({
      title: 'Settings',
      automationId: 'nav-settings-link',
      requiredRoles: ['admin'],
    })
    expect(byId.settings.pathKey).toBeUndefined()
    expect(UNIVERSAL_NAV_CATALOG.map((row) => row.automationId)).not.toEqual(
      expect.arrayContaining(REMOVED_NAV_IDS)
    )
    expect(UNIVERSAL_NAV_CATALOG.some((row) => row.id === 'products')).toBe(false)
    expect(UNIVERSAL_NAV_CATALOG.some((row) => row.id === 'customer')).toBe(false)
    expect(UNIVERSAL_NAV_CATALOG.some((row) => row.id === 'customerMembers')).toBe(false)
  })
})

describe('visibleUniversalNavItems', () => {
  it('returns Home + Resources + Paths when the token has no roles', () => {
    const items = visibleUniversalNavItems([], 'Acme')
    expect(items.map((item) => item.id)).toEqual(['home', 'resources', 'paths'])
    expect(items.map((item) => item.automationId)).toEqual([
      'nav-home-link',
      'nav-resources-link',
      'nav-paths-link',
    ])
    expect(items[0].href).toBe(hrefFor('home'))
    expect(items[1].href).toBe(hrefFor('resources'))
    expect(items[2].href).toBe(hrefFor('paths'))
    expect(items.map((item) => item.automationId)).not.toEqual(
      expect.arrayContaining(REMOVED_NAV_IDS)
    )
    expect(items.some((item) => item.id === 'events' || item.id === 'notifications' || item.id === 'settings')).toBe(
      false
    )
  })

  it('does not resurrect Customer or Products links for the customer role', () => {
    const items = visibleUniversalNavItems(['customer'], 'Acme')
    expect(items.map((item) => item.id)).toEqual(['home', 'resources', 'paths'])
    expect(items.find((item) => item.id === 'customer')).toBeUndefined()
    expect(items.find((item) => item.id === 'customerMembers')).toBeUndefined()
    expect(items.find((item) => item.automationId === 'nav-customer-link')).toBeUndefined()
    expect(items.find((item) => item.automationId === 'nav-customer-members-link')).toBeUndefined()
    expect(items.find((item) => item.automationId === 'nav-products-link')).toBeUndefined()
    expect(items.some((item) => item.id === 'events' || item.id === 'notifications' || item.id === 'settings')).toBe(
      false
    )
  })

  it('adds Resources / Paths / Plans for mentor and still hides Notifications and Settings', () => {
    const items = visibleUniversalNavItems(['mentor'])
    expect(items.map((item) => item.id)).toEqual(['home', 'resources', 'paths', 'plans'])
    expect(items.find((item) => item.id === 'resources')?.href).toBe(hrefFor('resources'))
    expect(items.find((item) => item.id === 'paths')?.href).toBe(hrefFor('paths'))
    expect(items.find((item) => item.id === 'plans')?.href).toBe(hrefFor('plans'))
    expect(items.find((item) => item.id === 'notifications')).toBeUndefined()
    expect(items.find((item) => item.id === 'settings')).toBeUndefined()
    expect(items.find((item) => item.id === 'events')).toBeUndefined()
    expect(items.find((item) => item.automationId === 'nav-products-link')).toBeUndefined()
  })

  it('adds Notifications + Settings for admin and does not resurrect Products', () => {
    const items = visibleUniversalNavItems(['admin'])
    expect(items.map((item) => item.id)).toEqual([
      'home',
      'resources',
      'paths',
      'notifications',
      'events',
      'settings',
    ])
    expect(items.find((item) => item.id === 'notifications')?.href).toBe(hrefFor('notifications'))
    expect(items.find((item) => item.id === 'settings')?.href).toBe(hostingConfigHref())
    expect(items.find((item) => item.id === 'settings')?.href).not.toBe(hrefFor('settings'))
    expect(items.find((item) => item.id === 'products')).toBeUndefined()
    expect(items.find((item) => item.automationId === 'nav-products-link')).toBeUndefined()
  })

  it('unions combined roles without Customer or Products rows', () => {
    const items = visibleUniversalNavItems(['customer', 'mentor', 'admin'], 'Northwind')
    expect(items.map((item) => item.id)).toEqual(UNIVERSAL_NAV_CATALOG.map((row) => row.id))
    expect(items).toHaveLength(7)
    expect(items.find((item) => item.id === 'customer')).toBeUndefined()
    expect(items.find((item) => item.id === 'products')).toBeUndefined()
    expect(items.find((item) => item.id === 'settings')?.href).toBe(hostingConfigHref())
  })

  it('treats mentee-only as authenticated-without-gated-roles', () => {
    const items = visibleUniversalNavItems(['mentee'])
    expect(items.map((item) => item.id)).toEqual(['home', 'resources', 'paths'])
    expect(items.some((item) => item.id === 'events' || item.id === 'notifications' || item.id === 'settings')).toBe(
      false
    )
  })
})

describe('resolveCustomerDisplayName / readProfilePicture / readDisplayName', () => {
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

  it('returns the JWT display_name when present and trims whitespace', () => {
    expect(readDisplayName()).toBeNull()

    localStorage.setItem('access_token', encodeJwt({ display_name: '  Ada Lovelace  ' }))
    expect(readDisplayName()).toBe('Ada Lovelace')
  })

  it('returns null display_name when the claim is blank, missing, or unrelated keys are set', () => {
    localStorage.setItem('access_token', encodeJwt({ display_name: '   ' }))
    expect(readDisplayName()).toBeNull()

    localStorage.setItem(
      'access_token',
      encodeJwt({
        name: 'Full Name',
        given_name: 'Given',
        email: 'ada@example.com',
        user_id: 'legacy-user-id',
        sub: 'legacy-sub',
        picture: 'https://cdn.example/me.png',
      })
    )
    expect(readDisplayName()).toBeNull()
    expect(readProfilePicture()).toBe('https://cdn.example/me.png')
  })

  it('ignores malformed tokens and non-object payloads', () => {
    localStorage.setItem('access_token', 'not-a-jwt')
    expect(resolveCustomerDisplayName()).toBe('Customer')
    expect(readProfilePicture()).toBeNull()
    expect(readDisplayName()).toBeNull()

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
    expect(readDisplayName()).toBeNull()
  })

  it('still accepts customerName and resolves JWT customer_name without drawer labels', () => {
    localStorage.setItem('access_token', encodeJwt({ customer_name: 'Stored Org' }))
    expect(resolveCustomerDisplayName()).toBe('Stored Org')
    const items = visibleUniversalNavItems(['customer'], 'Acme')
    expect(items.map((item) => item.id)).toEqual(['home', 'resources', 'paths'])
    expect(items.every((item) => !item.title.includes('Acme'))).toBe(true)
    expect(items.every((item) => !item.title.includes('Stored Org'))).toBe(true)
  })

  it('falls back when localStorage cannot be read', () => {
    const spy = vi.spyOn(Storage.prototype, 'getItem').mockImplementation(() => {
      throw new Error('blocked')
    })
    expect(resolveCustomerDisplayName()).toBe('Customer')
    expect(readProfilePicture()).toBeNull()
    expect(readDisplayName()).toBeNull()
    spy.mockRestore()
  })
})
