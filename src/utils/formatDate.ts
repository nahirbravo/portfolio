/**
 * Formats an ISO date string (YYYY-MM-DD or full ISO) to a human-readable format.
 * @example formatDate("2025-06-15") → "Jun 2025"
 */
export function formatDate(dateStr: string): string {
  const date = new Date(dateStr + 'T00:00:00') // normalize to avoid timezone off-by-one
  return date.toLocaleDateString('es-AR', { month: 'short', year: 'numeric' })
}

/**
 * Formats an ISO date string to full date.
 * @example formatDateFull("2025-06-15") → "15 de junio de 2025"
 */
export function formatDateFull(dateStr: string): string {
  const date = new Date(dateStr + 'T00:00:00')
  return date.toLocaleDateString('es-AR', { day: 'numeric', month: 'long', year: 'numeric' })
}
