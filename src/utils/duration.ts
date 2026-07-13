/**
 * Helpers for the `duration` configurator type. Wire values are ISO-8601 duration
 * strings (`P…T…`, day/hour/minute/second components only); `DurationEditor` edits
 * the human-unit parts and uses these to serialize/parse the wire string.
 */
export interface DurationParts {
  days: number
  hours: number
  minutes: number
  seconds: number
}

const ISO_DURATION_PATTERN = /^P(?!$)(?:(\d+)D)?(?:T(?=\d)(?:(\d+)H)?(?:(\d+)M)?(?:(\d+)S)?)?$/

/**
 * Parse an ISO-8601 duration string into human units. Returns all-zero parts for
 * empty/invalid input so callers can render a sensible default instead of throwing.
 */
export function parseDurationIso(iso: string | null | undefined): DurationParts {
  const zero: DurationParts = { days: 0, hours: 0, minutes: 0, seconds: 0 }
  if (!iso) return zero

  const match = ISO_DURATION_PATTERN.exec(iso)
  if (!match) return zero

  return {
    days: Number(match[1] ?? 0),
    hours: Number(match[2] ?? 0),
    minutes: Number(match[3] ?? 0),
    seconds: Number(match[4] ?? 0),
  }
}

/**
 * Serialize human duration units into a canonical ISO-8601 duration string.
 * Zero-value components are omitted; an all-zero duration serializes to `PT0S`
 * (the shortest valid ISO-8601 representation of "no duration").
 */
export function formatDurationIso(parts: DurationParts): string {
  const days = Math.max(0, Math.trunc(parts.days || 0))
  const hours = Math.max(0, Math.trunc(parts.hours || 0))
  const minutes = Math.max(0, Math.trunc(parts.minutes || 0))
  const seconds = Math.max(0, Math.trunc(parts.seconds || 0))

  const datePortion = days > 0 ? `${days}D` : ''
  const timePortion = [
    hours > 0 ? `${hours}H` : '',
    minutes > 0 ? `${minutes}M` : '',
    seconds > 0 ? `${seconds}S` : '',
  ].join('')

  const result = `P${datePortion}${timePortion ? `T${timePortion}` : ''}`
  return result === 'P' ? 'PT0S' : result
}

/**
 * Render an ISO-8601 duration string as a readable summary (e.g. "3 days, 4 hours,
 * 30 minutes") for `DurationEditor`'s view mode. Returns `'—'` for empty input.
 */
export function formatDurationHuman(iso: string | null | undefined): string {
  if (!iso) return '—'

  const { days, hours, minutes, seconds } = parseDurationIso(iso)
  const segments: string[] = []
  if (days > 0) segments.push(`${days} day${days === 1 ? '' : 's'}`)
  if (hours > 0) segments.push(`${hours} hour${hours === 1 ? '' : 's'}`)
  if (minutes > 0) segments.push(`${minutes} minute${minutes === 1 ? '' : 's'}`)
  if (seconds > 0 || segments.length === 0) segments.push(`${seconds} second${seconds === 1 ? '' : 's'}`)

  return segments.join(', ')
}
