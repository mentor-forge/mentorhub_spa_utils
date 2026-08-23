/**
 * @vitest-environment node
 */
import { describe, it, expect, beforeEach, afterEach } from 'vitest'
import {
  JOURNEY_PREFIXES,
  JOURNEY_APP_PATHS,
  resolveAlbOrigin,
  buildJourneyUrl,
} from '../../src/utils/journeyUrls'

function installWindowLocation(location: Record<string, unknown>) {
  Object.defineProperty(globalThis, 'window', {
    configurable: true,
    writable: true,
    value: { location },
  })
}

describe('journeyUrls', () => {
  afterEach(() => {
    // @ts-expect-error test cleanup
    delete globalThis.window
  })

  describe('JOURNEY_PREFIXES', () => {
    it('lists the five L022 journey keys', () => {
      expect(JOURNEY_PREFIXES).toEqual([
        'discovery',
        'customer',
        'admin',
        'mentor',
        'mentee',
      ])
    })
  })

  describe('resolveAlbOrigin', () => {
    it('uses location origin on welcome port 8080', () => {
      const location = {
        protocol: 'http:',
        hostname: '127.0.0.1',
        port: '8080',
        origin: 'http://127.0.0.1:8080',
        pathname: '/mentor/x',
      }

      expect(resolveAlbOrigin(location)).toBe('http://127.0.0.1:8080')
    })

    it('uses location origin for https with empty port (cloud ALB)', () => {
      const location = {
        protocol: 'https:',
        hostname: 'app.example.com',
        port: '',
        origin: 'https://app.example.com',
        pathname: '/discovery/',
      }

      expect(resolveAlbOrigin(location)).toBe('https://app.example.com')
    })

    it('maps Vite debug port 8386 to welcome :8080 on current hostname', () => {
      const location = {
        protocol: 'http:',
        hostname: 'dev.example.ts.net',
        port: '8386',
        origin: 'http://dev.example.ts.net:8386',
      }

      expect(resolveAlbOrigin(location)).toBe('http://dev.example.ts.net:8080')
    })

    it('maps debug port 8392 to welcome :8080 preserving protocol', () => {
      const location = {
        protocol: 'https:',
        hostname: 'dev.example.ts.net',
        port: '8392',
        origin: 'https://dev.example.ts.net:8392',
      }

      expect(resolveAlbOrigin(location)).toBe('https://dev.example.ts.net:8080')
    })

    it('reads window.location when no explicit location is passed', () => {
      installWindowLocation({
        protocol: 'http:',
        hostname: '127.0.0.1',
        port: '8080',
        origin: 'http://127.0.0.1:8080',
      })

      expect(resolveAlbOrigin()).toBe('http://127.0.0.1:8080')
    })
  })

  describe('buildJourneyUrl', () => {
    const origin8080 = {
      protocol: 'http:',
      hostname: '127.0.0.1',
      port: '8080',
      origin: 'http://127.0.0.1:8080',
    }

    beforeEach(() => {
      installWindowLocation(origin8080)
    })

    it('builds Home (Discover) at journey root with trailing slash', () => {
      expect(buildJourneyUrl('discovery', '')).toBe('http://127.0.0.1:8080/discovery/')
      expect(buildJourneyUrl('discovery', '/')).toBe('http://127.0.0.1:8080/discovery/')
    })

    it('normalizes members/ and avoids duplicate journey segments', () => {
      expect(buildJourneyUrl('discovery', 'members/')).toBe(
        'http://127.0.0.1:8080/discovery/members/'
      )
      expect(buildJourneyUrl('discovery', '/members/')).toBe(
        'http://127.0.0.1:8080/discovery/members/'
      )
      expect(buildJourneyUrl('discovery', 'discovery/members/')).toBe(
        'http://127.0.0.1:8080/discovery/members/'
      )
    })

    it('uses debug-port origin mapped to :8080', () => {
      installWindowLocation({
        protocol: 'http:',
        hostname: 'dev.example.ts.net',
        port: '8392',
        origin: 'http://dev.example.ts.net:8392',
      })

      expect(buildJourneyUrl('discovery', '')).toBe('http://dev.example.ts.net:8080/discovery/')
    })

    describe('locked JOURNEY_APP_PATHS', () => {
      it('home → /discovery/', () => {
        const { journey, path } = JOURNEY_APP_PATHS.home
        expect(buildJourneyUrl(journey, path)).toBe('http://127.0.0.1:8080/discovery/')
        expect(buildJourneyUrl(journey, '/')).toBe('http://127.0.0.1:8080/discovery/')
      })

      it('customerEdit → /customer/', () => {
        const { journey, path } = JOURNEY_APP_PATHS.customerEdit
        expect(buildJourneyUrl(journey, path)).toBe('http://127.0.0.1:8080/customer/')
        expect(buildJourneyUrl(journey, '/')).toBe('http://127.0.0.1:8080/customer/')
      })

      it('members → /discovery/members/', () => {
        const { journey, path } = JOURNEY_APP_PATHS.members
        expect(buildJourneyUrl(journey, path)).toBe('http://127.0.0.1:8080/discovery/members/')
      })

      it('resources → /discovery/resources', () => {
        const { journey, path } = JOURNEY_APP_PATHS.resources
        expect(buildJourneyUrl(journey, path)).toBe('http://127.0.0.1:8080/discovery/resources')
      })

      it('paths → /discovery/paths', () => {
        const { journey, path } = JOURNEY_APP_PATHS.paths
        expect(buildJourneyUrl(journey, path)).toBe('http://127.0.0.1:8080/discovery/paths')
      })

      it('plans → /discovery/plans', () => {
        const { journey, path } = JOURNEY_APP_PATHS.plans
        expect(buildJourneyUrl(journey, path)).toBe('http://127.0.0.1:8080/discovery/plans')
      })

      it('products → /discovery/products', () => {
        const { journey, path } = JOURNEY_APP_PATHS.products
        expect(buildJourneyUrl(journey, path)).toBe('http://127.0.0.1:8080/discovery/products')
      })

      it('notifications → /discovery/notifications', () => {
        const { journey, path } = JOURNEY_APP_PATHS.notifications
        expect(buildJourneyUrl(journey, path)).toBe(
          'http://127.0.0.1:8080/discovery/notifications'
        )
      })

      it('settings → /admin/settings', () => {
        const { journey, path } = JOURNEY_APP_PATHS.settings
        expect(buildJourneyUrl(journey, path)).toBe('http://127.0.0.1:8080/admin/settings')
      })

      it('profile → /customer/profile/', () => {
        const { journey, path } = JOURNEY_APP_PATHS.profile
        expect(buildJourneyUrl(journey, path)).toBe('http://127.0.0.1:8080/customer/profile/')
      })
    })
  })
})
