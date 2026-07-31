/**
 * Redirect unauthenticated SPA users to the configured IdP / dev login page.
 *
 * Resolution order: explicit override → runtime `IDP_LOGIN_URI` (container env) →
 * build-time `VITE_IDP_LOGIN_URI` (dev server) → Developer Edition fallback.
 * Production: commercial IdP authorize/login URL (passed via runtime or build-time env).
 */

/** Developer Edition welcome-page login when no env is configured. */
export const DEVELOPER_EDITION_IDP_LOGIN_URI = 'http://127.0.0.1:8080/login.html'

/** Global key journey SPA containers use for runtime config injected at startup. */
export const MENTORHUB_RUNTIME_CONFIG_KEY = '__MENTORHUB_RUNTIME__' as const

/** Runtime config shape populated from container `IDP_LOGIN_URI` (see README). */
export interface MentorHubRuntimeConfig {
  IDP_LOGIN_URI?: string
}

type WindowWithRuntime = Window & {
  [MENTORHUB_RUNTIME_CONFIG_KEY]?: MentorHubRuntimeConfig
}

function readRuntimeIdpLoginUri(): string | undefined {
  if (typeof window === 'undefined') {
    return undefined
  }

  try {
    const runtime = (window as WindowWithRuntime)[MENTORHUB_RUNTIME_CONFIG_KEY]
    const url = runtime?.IDP_LOGIN_URI
    if (typeof url === 'string' && url.trim()) {
      return url.trim()
    }
  } catch {
    // Ignore malformed runtime config.
  }

  return undefined
}

function readConfiguredIdpLoginUri(): string | undefined {
  try {
    const url = import.meta.env?.VITE_IDP_LOGIN_URI
    if (typeof url === 'string' && url.trim()) {
      return url.trim()
    }
  } catch {
    // Non-Vite consumers may omit import.meta.env.
  }
  return undefined
}

function resolveIdpLoginUri(override?: string): string {
  if (override?.trim()) {
    return override.trim()
  }

  return (
    readRuntimeIdpLoginUri() ??
    readConfiguredIdpLoginUri() ??
    DEVELOPER_EDITION_IDP_LOGIN_URI
  )
}

function defaultReturnTo(): string {
  if (typeof window === 'undefined') {
    return ''
  }
  return window.location.origin + window.location.pathname + window.location.search
}

/**
 * Resolved IdP login page URL from runtime env, build-time env, or Developer Edition fallback.
 */
export function getIdpLoginBaseUrl(override?: string): string {
  return resolveIdpLoginUri(override)
}

/**
 * Build a login redirect URL with `return_to` set to the SPA entry (or an explicit target).
 */
export function buildIdpLoginRedirectUrl(returnTo?: string, idpLoginUri?: string): string {
  const base = resolveIdpLoginUri(idpLoginUri)
  const url = new URL(base)
  url.searchParams.set('return_to', returnTo ?? defaultReturnTo())
  return url.toString()
}

/**
 * Navigate to the configured IdP / dev login page (`login.html` in Developer Edition).
 * Uses `location.replace` so the SPA route is not left in browser history.
 */
export function redirectToIdpLogin(returnTo?: string, idpLoginUri?: string): void {
  if (typeof window === 'undefined') {
    return
  }

  window.location.replace(buildIdpLoginRedirectUrl(returnTo, idpLoginUri))
}
