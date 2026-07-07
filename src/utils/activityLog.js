// Recent Transactions on the dashboard come from real issue/return actions
// performed in this browser session. The backend does not yet expose a
// global "all transactions" endpoint, so this log is client-side only
// (persisted to localStorage so it survives a refresh, not shared across devices).

const LOG_KEY = 'shelfsync_activity_log'
const MAX_ENTRIES = 20

export function logActivity(entry) {
  const log = getActivityLog()
  log.unshift({ ...entry, timestamp: new Date().toISOString() })
  localStorage.setItem(LOG_KEY, JSON.stringify(log.slice(0, MAX_ENTRIES)))
}

export function getActivityLog() {
  const raw = localStorage.getItem(LOG_KEY)
  return raw ? JSON.parse(raw) : []
}
