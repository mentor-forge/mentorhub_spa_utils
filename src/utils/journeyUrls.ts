/**
 * Cross-SPA URLs through welcome nginx / ALB path prefixes (L022).
 *
 * Origin is compiled in — no per-SPA config. Do not use IdP login host as ALB origin.
 */

/** L022 journey path prefixes on the welcome / ALB host. */
export const JOURNEY_PREFIXES = [
  'discovery',
  'customer',
  'admin',
  'mentor',
  'mentee',
] as const

export type JourneyPrefix = (typeof JOURNEY_PREFIXES)[number]

/** Minimal location shape for unit tests (optional `resolveAlbOrigin` / `hostingConfigHref` argument). */
export interface AlbOriginLocation {
  protocol: string
  hostname: string
  port: string
  origin: string
  pathname?: string
}

const ALB_PORTS = new Set(['8080', '80', '443', ''])

/** Locked in-app paths consumed by F036 PageFrame hamburger links. */
export const JOURNEY_APP_PATHS = {
  home: { journey: 'discovery', path: '' },
  events: { journey: 'discovery', path: 'events' },
  customerEdit: { journey: 'customer', path: '' },
  members: { journey: 'discovery', path: 'members/' },
  resources: { journey: 'discovery', path: 'resources' },
  paths: { journey: 'discovery', path: 'paths' },
  plans: { journey: 'discovery', path: 'plans' },
  products: { journey: 'discovery', path: 'products' },
  notifications: { journey: 'discovery', path: 'notifications' },
  settings: { journey: 'admin', path: 'settings' },
  profile: { journey: 'customer', path: 'profile/' },
} as const satisfies Record<string, { journey: JourneyPrefix; path: string }>

function readLocation(location?: AlbOriginLocation): AlbOriginLocation {
  if (location) {
    return location
  }

  if (typeof window === 'undefined') {
    throw new Error('resolveAlbOrigin requires window.location or an explicit location argument')
  }

  return window.location
}

/**
 * Resolve the ALB / welcome nginx origin for cross-SPA hrefs.
 *
 * - Ports `8080`, `80`, `443`, or empty → current `origin` (local welcome or cloud ALB).
 * - Vite / debug ports (8386, 8388, …) → `{protocol}//{hostname}:8080` (Tailscale-safe).
 */
export function resolveAlbOrigin(location?: AlbOriginLocation): string {
  const loc = readLocation(location)

  if (ALB_PORTS.has(loc.port)) {
    return loc.origin
  }

  return `${loc.protocol}//${loc.hostname}:8080`
}

function normalizeJourneyPath(journey: JourneyPrefix, path: string): string {
  let normalized = path.trim()

  while (normalized.startsWith('/')) {
    normalized = normalized.slice(1)
  }

  const journeyPrefix = `${journey}/`
  if (normalized === journey || normalized.startsWith(journeyPrefix)) {
    normalized = normalized.slice(journey.length)
    while (normalized.startsWith('/')) {
      normalized = normalized.slice(1)
    }
  }

  return normalized
}

/**
 * Build a cross-SPA URL: `{origin}/{journey}/{path}` with normalized slashes.
 */
export function buildJourneyUrl(journey: JourneyPrefix, path = ''): string {
  const origin = resolveAlbOrigin()
  const normalizedPath = normalizeJourneyPath(journey, path)

  if (!normalizedPath) {
    return `${origin}/${journey}/`
  }

  return `${origin}/${journey}/${normalizedPath}`
}

/**
 * First L022 journey segment of `pathname`, or `null` when the path is not under a journey prefix.
 */
export function currentJourneyPrefix(pathname: string): JourneyPrefix | null {
  const firstSegment = pathname.split('/').find((segment) => segment.length > 0)
  if (!firstSegment) {
    return null
  }

  return (JOURNEY_PREFIXES as readonly string[]).includes(firstSegment)
    ? (firstSegment as JourneyPrefix)
    : null
}

/**
 * Settings href on the **hosting** SPA origin (no welcome `:8080` rewrite).
 * Journey prefix from pathname → `{origin}/{prefix}/config`; otherwise `{origin}/config`.
 */
export function hostingConfigHref(location?: AlbOriginLocation): string {
  const loc = readLocation(location)
  const origin = loc.origin.replace(/\/+$/, '')
  const pathname = loc.pathname ?? ''
  const prefix = currentJourneyPrefix(pathname)

  if (prefix) {
    return `${origin}/${prefix}/config`
  }

  return `${origin}/config`
}
