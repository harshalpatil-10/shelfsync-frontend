// --- Placeholder client-side auth ---
// The backend does not yet expose a login/authentication endpoint,
// so this is a local-only gate to demonstrate the login flow in the UI.
// Swap this for real calls to a Spring Security/JWT endpoint once the backend supports it.

const DEMO_USERNAME = 'admin'
const DEMO_PASSWORD = 'shelfsync123'
const SESSION_KEY = 'shelfsync_session'

export function login(username, password) {
  if (username === DEMO_USERNAME && password === DEMO_PASSWORD) {
    localStorage.setItem(SESSION_KEY, JSON.stringify({ username, loginAt: new Date().toISOString() }))
    return true
  }
  return false
}

export function logout() {
  localStorage.removeItem(SESSION_KEY)
}

export function isAuthenticated() {
  return !!localStorage.getItem(SESSION_KEY)
}

export function getSession() {
  const raw = localStorage.getItem(SESSION_KEY)
  return raw ? JSON.parse(raw) : null
}
