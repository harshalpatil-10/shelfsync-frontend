export function formatDate(dateStr) {
  if (!dateStr) return '—'
  const d = new Date(dateStr)
  return d.toLocaleDateString('en-IN', { day: '2-digit', month: 'short', year: 'numeric' })
}

export function isOverdue(dueDate, returnDate) {
  if (returnDate) return false
  return new Date(dueDate) < new Date()
}

export function daysBetween(a, b) {
  const ms = new Date(b) - new Date(a)
  return Math.max(0, Math.floor(ms / (1000 * 60 * 60 * 24)))
}
