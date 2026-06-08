/**
 * Utility functions for admin components
 */

export function formatConfigValue(value: unknown): string {
  if (value === null || value === undefined) {
    return 'null'
  }
  if (typeof value === 'object') {
    return JSON.stringify(value, null, 2)
  }
  return String(value)
}

export function getSourceColor(source: string): string {
  const colors: Record<string, string> = {
    'file': 'primary',
    'env': 'success',
    'default': 'default',
  }
  return colors[source] || 'default'
}

export function getTokenValue(token: Record<string, unknown> | undefined, key: string): string | null {
  if (!token || typeof token !== 'object') {
    return null
  }
  if (token[key]) {
    return String(token[key])
  }
  return null
}

export function getTokenRoles(token: Record<string, unknown> | undefined): string[] {
  if (!token || typeof token !== 'object') {
    return []
  }
  if (Array.isArray(token.roles)) {
    return token.roles.map(r => String(r))
  }
  return []
}
