import { JOURNEY_APP_PATHS, buildJourneyUrl, hostingConfigHref } from '../utils/journeyUrls'

export type UniversalNavItemId =
  | 'home'
  | 'events'
  | 'resources'
  | 'paths'
  | 'plans'
  | 'notifications'
  | 'settings'

export type UniversalNavPathKey = keyof typeof JOURNEY_APP_PATHS

export interface UniversalNavCatalogEntry {
  id: UniversalNavItemId
  automationId: string
  pathKey?: Exclude<UniversalNavPathKey, 'profile'>
  requiredRoles: readonly string[]
  title: string
}

export interface UniversalNavItem {
  id: UniversalNavItemId
  title: string
  href: string
  automationId: string
}

/** Compiled hamburger catalog. Filter with JWT roles; do not override from a host SPA. */
export const UNIVERSAL_NAV_CATALOG: readonly UniversalNavCatalogEntry[] = [
  {
    id: 'home',
    automationId: 'nav-home-link',
    pathKey: 'home',
    requiredRoles: [],
    title: 'Home',
  },
  {
    id: 'resources',
    automationId: 'nav-resources-link',
    pathKey: 'resources',
    requiredRoles: [],
    title: 'Resources',
  },
  {
    id: 'paths',
    automationId: 'nav-paths-link',
    pathKey: 'paths',
    requiredRoles: [],
    title: 'Paths',
  },
  {
    id: 'plans',
    automationId: 'nav-plans-link',
    pathKey: 'plans',
    requiredRoles: ['mentor'],
    title: 'Plans',
  },
  {
    id: 'notifications',
    automationId: 'nav-notifications-link',
    pathKey: 'notifications',
    requiredRoles: ['admin'],
    title: 'Notifications',
  },
  {
    id: 'events',
    automationId: 'nav-events-link',
    pathKey: 'events',
    requiredRoles: ['admin'],
    title: 'Events',
  },
  {
    id: 'settings',
    automationId: 'nav-settings-link',
    requiredRoles: ['admin'],
    title: 'Settings',
  },
]

function readAccessToken(): string | null {
  try {
    return localStorage.getItem('access_token')
  } catch {
    return null
  }
}

function decodeJwtPayload(token: string): Record<string, unknown> | null {
  const parts = token.split('.')
  if (parts.length < 2 || !parts[1]) {
    return null
  }

  try {
    const base64 = parts[1].replace(/-/g, '+').replace(/_/g, '/')
    const padded = base64.padEnd(base64.length + ((4 - (base64.length % 4)) % 4), '=')
    const json = atob(padded)
    const parsed = JSON.parse(json)
    return parsed && typeof parsed === 'object' ? (parsed as Record<string, unknown>) : null
  } catch {
    return null
  }
}

function readAccessTokenClaims(): Record<string, unknown> | null {
  const token = readAccessToken()
  return token ? decodeJwtPayload(token) : null
}

function claimString(claims: Record<string, unknown> | null, key: string): string | null {
  const value = claims?.[key]
  return typeof value === 'string' && value.trim() ? value.trim() : null
}

/**
 * Display label for the two customer-role links.
 * Explicit name wins; otherwise JWT `customer_name` / `custom:customer_name`; else `Customer`.
 */
export function resolveCustomerDisplayName(explicitName?: string | null): string {
  if (explicitName != null && String(explicitName).trim() !== '') {
    return String(explicitName).trim()
  }

  const claims = readAccessTokenClaims()
  return (
    claimString(claims, 'customer_name') ??
    claimString(claims, 'custom:customer_name') ??
    'Customer'
  )
}

/** OIDC `picture` claim from the stored access token, if present. */
export function readProfilePicture(): string | null {
  return claimString(readAccessTokenClaims(), 'picture')
}

/**
 * JWT `display_name` from the stored access token.
 * Authoritative only when the claim is explicitly present and non-blank;
 * does not synthesize a name from `name`, `given_name`, `email`, `user_id`, or `sub`.
 */
export function readDisplayName(): string | null {
  return claimString(readAccessTokenClaims(), 'display_name')
}

function catalogHref(entry: UniversalNavCatalogEntry): string {
  if (entry.id === 'settings') {
    return hostingConfigHref()
  }

  const { journey, path } = JOURNEY_APP_PATHS[entry.pathKey!]
  return buildJourneyUrl(journey, path)
}

/**
 * Catalog rows the given JWT roles may see. Combined roles are a union.
 * Empty / missing roles → Home + Resources + Paths.
 */
export function visibleUniversalNavItems(
  roles: readonly string[],
  customerName?: string
): UniversalNavItem[] {
  const displayName = resolveCustomerDisplayName(customerName)
  const roleSet = new Set(roles)

  return UNIVERSAL_NAV_CATALOG.filter((entry) => {
    if (entry.requiredRoles.length === 0) {
      return true
    }
    return entry.requiredRoles.some((role) => roleSet.has(role))
  }).map((entry) => ({
    id: entry.id,
    automationId: entry.automationId,
    href: catalogHref(entry),
    title: entry.title.replace(/\[Customer Name\]/g, displayName),
  }))
}
