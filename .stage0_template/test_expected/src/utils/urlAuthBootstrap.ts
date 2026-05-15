/**
 * Bootstrap auth from the URL before the Vue app mounts.
 *
 * - Fragment `#access_token=...&expires_at=...&roles=a,b` persists to localStorage (keys match SPA useAuth).
 * - Query `?clear_stored_auth=1` clears auth storage (e.g. welcome-page or iframe flows).
 */
const LS_ACCESS = 'access_token'
const LS_EXPIRES = 'token_expires_at'
const LS_ROLES = 'user_roles'

const CLEAR_QUERY = 'clear_stored_auth'

export function clearUrlSeededAuthLocalStorage(): void {
  localStorage.removeItem(LS_ACCESS)
  localStorage.removeItem(LS_EXPIRES)
  localStorage.removeItem(LS_ROLES)
}

function stripClearAuthQuery(): void {
  const url = new URL(window.location.href)
  if (url.searchParams.get(CLEAR_QUERY) !== '1') return
  url.searchParams.delete(CLEAR_QUERY)
  const q = url.searchParams.toString()
  const path = url.pathname + (q ? `?${q}` : '') + url.hash
  window.history.replaceState(null, '', path)
}

function applyHashToken(): void {
  const raw = window.location.hash.replace(/^#/, '')
  if (!raw || !raw.includes('access_token=')) return

  let params: URLSearchParams
  try {
    params = new URLSearchParams(raw)
  } catch {
    return
  }

  const token = params.get('access_token')
  const expiresAt = params.get('expires_at')
  if (!token || !expiresAt) return

  localStorage.setItem(LS_ACCESS, token)
  localStorage.setItem(LS_EXPIRES, expiresAt)
  const roles = params.get('roles')
  if (roles) {
    const list = roles
      .split(',')
      .map((r) => r.trim())
      .filter(Boolean)
    localStorage.setItem(LS_ROLES, JSON.stringify(list))
  }

  window.history.replaceState(null, '', window.location.pathname + window.location.search)
}

/**
 * Run once at SPA entry (import before router). Idempotent for normal navigations.
 */
export function bootstrapAuthFromUrl(): void {
  if (typeof window === 'undefined' || !window.localStorage) return

  if (window.location.search.includes(`${CLEAR_QUERY}=1`)) {
    clearUrlSeededAuthLocalStorage()
    stripClearAuthQuery()
    return
  }

  applyHashToken()
}
