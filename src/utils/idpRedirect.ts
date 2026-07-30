/**
 * Redirect unauthenticated SPA users to the configured IdP / dev login page.
 *
 * Developer Edition: `VITE_IDP_LOGIN_URI` → `http://127.0.0.1:8080/login.html`
 * When that URI (or the Developer Edition fallback) uses a loopback host and the
 * SPA was opened via another hostname (e.g. Tailscale MagicDNS), the login base
 * host is rewritten to `window.location.hostname` so cross-device VPN login works.
 * Production: commercial IdP authorize/login URL (left unchanged).
 */

/** Developer Edition welcome-page login when `VITE_IDP_LOGIN_URI` is unset at build time. */
export const DEVELOPER_EDITION_IDP_LOGIN_URI = 'http://127.0.0.1:8080/login.html'

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

function isLocalDevIdpHost(hostname: string): boolean {
  return hostname === '127.0.0.1' || hostname === 'localhost'
}

/**
 * Rewrite loopback IdP hosts to the hostname the SPA was opened with.
 * Leaves non-loopback (production) IdP URLs unchanged.
 */
function adaptIdpLoginUriToCurrentHost(idpLoginUri: string): string {
  if (typeof window === 'undefined') {
    return idpLoginUri
  }

  try {
    const url = new URL(idpLoginUri)
    if (!isLocalDevIdpHost(url.hostname)) {
      return idpLoginUri
    }

    const currentHost = window.location.hostname
    if (!currentHost || currentHost === url.hostname) {
      return idpLoginUri
    }

    url.hostname = currentHost
    return url.toString()
  } catch {
    return idpLoginUri
  }
}

function resolveIdpLoginUri(override?: string): string {
  const resolved = override?.trim()
    ? override.trim()
    : (readConfiguredIdpLoginUri() ?? DEVELOPER_EDITION_IDP_LOGIN_URI)
  return adaptIdpLoginUriToCurrentHost(resolved)
}

function defaultReturnTo(): string {
  if (typeof window === 'undefined') {
    return ''
  }
  return window.location.origin + window.location.pathname + window.location.search
}

/**
 * Resolved IdP login page URL from build-time env (`VITE_IDP_LOGIN_URI`) or Developer Edition fallback.
 * Loopback hosts are adapted to the current browser hostname when available.
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
