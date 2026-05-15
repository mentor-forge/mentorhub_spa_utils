/**
 * Format a date string to a localized string
 * @param dateString - ISO date string or null/undefined
 * @returns Formatted date string or 'N/A' if invalid
 */
export function formatDate(dateString: string | null | undefined): string {
  if (!dateString) return 'N/A'
  return new Date(dateString).toLocaleString()
}
