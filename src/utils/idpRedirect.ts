/**
 * Redirect unauthenticated SPA users to the configured IdP / dev login page.
 *
 * Developer Edition: `VITE_IDP_LOGIN_URI` → `http://127.0.0.1:8080/login.html`
 * Production: commercial IdP authorize/login URL.
 */

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

function defaultReturnTo(): string {
  if (typeof window === 'undefined') {
    return ''
  }
  return window.location.origin + window.location.pathname + window.location.search
}

/**
 * Resolved IdP login page URL from build-time env (`VITE_IDP_LOGIN_URI`).
 */
export function getIdpLoginBaseUrl(override?: string): string | undefined {
  if (override?.trim()) {
    return override.trim()
  }
  return readConfiguredIdpLoginUri()
}

/**
 * Build a login redirect URL with `return_to` set to the SPA entry (or an explicit target).
 */
export function buildIdpLoginRedirectUrl(returnTo?: string, idpLoginUri?: string): string {
  const base = idpLoginUri ?? getIdpLoginBaseUrl()
  if (!base) {
    throw new Error('VITE_IDP_LOGIN_URI is not configured')
  }

  const url = new URL(base)
  url.searchParams.set('return_to', returnTo ?? defaultReturnTo())
  return url.toString()
}

/**
 * Navigate to the configured IdP / dev login page (`login.html` in Developer Edition).
 * No-op when `VITE_IDP_LOGIN_URI` is unset — journey SPAs do not host a local `/login` route.
 */
export function redirectToIdpLogin(returnTo?: string, idpLoginUri?: string): void {
  if (typeof window === 'undefined') {
    return
  }

  const base = idpLoginUri ?? getIdpLoginBaseUrl()
  if (!base) {
    return
  }

  window.location.href = buildIdpLoginRedirectUrl(returnTo, base)
}
