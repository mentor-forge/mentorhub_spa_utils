/** Placeholder when `/api/config` token.display_name is blank or missing. */
export const UNKNOWN_DISPLAY_NAME = 'unknown'

/**
 * Read `display_name` from the verified `/api/config` token dict.
 * Does not decode the JWT and does not fall back to `name` or other claims.
 */
export function readConfigDisplayName(
  config: { token?: { display_name?: unknown } | null } | null | undefined
): string {
  const value = config?.token?.display_name
  return typeof value === 'string' && value.trim() ? value.trim() : UNKNOWN_DISPLAY_NAME
}
