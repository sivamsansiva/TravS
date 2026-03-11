/**
 * Returns a human-readable relative time string.
 * e.g. "2 hours ago", "3 days ago", "5 minutes ago"
 */
export function timeAgo(dateString) {
  const diff  = Date.now() - new Date(dateString).getTime()
  const mins  = Math.floor(diff / 60000)
  const hours = Math.floor(mins / 60)
  const days  = Math.floor(hours / 24)

  if (days  > 0) return `${days} day${days > 1 ? 's' : ''} ago`
  if (hours > 0) return `${hours} hour${hours > 1 ? 's' : ''} ago`
  return `${mins} minute${mins !== 1 ? 's' : ''} ago`
}

/**
 * Truncates a string to a given length, appending '...' if cut.
 */
export function truncate(str, length = 120) {
  if (!str) return ''
  return str.length > length ? str.slice(0, length) + '...' : str
}
