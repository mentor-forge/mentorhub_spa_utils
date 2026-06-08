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

export function getCollectionName(version: Record<string, unknown>): string {
  return String(version.collection_name || version.name || version.collection || 'Unknown')
}

export function getVersionNumber(version: Record<string, unknown>): string {
  return String(version.current_version || version.version || version.version_number || 'N/A')
}

export function getEnumeratorVersion(enumerator: unknown): string {
  if (typeof enumerator === 'object' && enumerator !== null) {
    const e = enumerator as Record<string, unknown>
    if (e.version !== undefined && e.version !== null) {
      return String(e.version)
    }
    return 'Unknown'
  }
  return 'Unknown'
}

export function getEnumeratorItems(enumerator: unknown): Array<Record<string, unknown>> {
  if (typeof enumerator === 'object' && enumerator !== null) {
    const e = enumerator as Record<string, unknown>
    if (Array.isArray(e.enumerators)) {
      return e.enumerators as Array<Record<string, unknown>>
    }
  }
  return []
}

export function getEnumeratorItemName(item: Record<string, unknown>): string {
  return String(item.name || 'Unknown')
}

export function getEnumeratorItemValues(item: Record<string, unknown>): Array<Record<string, unknown>> {
  if (Array.isArray(item.values)) {
    return item.values as Array<Record<string, unknown>>
  }
  return []
}

export function getValue(valueItem: Record<string, unknown>): string {
  return String(valueItem.value || '')
}

export function getValueDescription(valueItem: Record<string, unknown>): string {
  return String(valueItem.description || '')
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
