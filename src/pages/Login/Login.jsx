import React, { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { login, isAuthenticated } from '../../utils/auth.js'
import styles from './Login.module.css'

export default function Login() {
  const navigate = useNavigate()
  const [username, setUsername] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)

  if (isAuthenticated()) {
    navigate('/', { replace: true })
  }

  function handleSubmit(e) {
    e.preventDefault()
    setError('')
    if (!username.trim() || !password.trim()) {
      setError('Please enter both username and password.')
      return
    }
    setLoading(true)
    setTimeout(() => {
      const success = login(username.trim(), password)
      setLoading(false)
      if (success) {
        navigate('/', { replace: true })
      } else {
        setError('Incorrect username or password.')
      }
    }, 400)
  }

  return (
    <div className={styles.page}>
      <div className={styles.card}>
        <div className={styles.brand}>
          <span className={styles.mark}>📖</span>
          <h1>ShelfSync</h1>
        </div>
        <p className={styles.subtitle}>Library Management System</p>

        <form onSubmit={handleSubmit} className={styles.form}>
          <div className="formfield">
            <label>Username</label>
            <input
              type="text"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              placeholder="admin"
              autoFocus
            />
          </div>
          <div className="formfield">
            <label>Password</label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="••••••••"
            />
          </div>

          {error && <p className={styles.error}>{error}</p>}

          <button type="submit" className="btn btn-primary" disabled={loading} style={{ width: '100%', padding: '12px 0', marginTop: '6px' }}>
            {loading ? 'Signing in...' : 'Sign In'}
          </button>
        </form>

        <p className={styles.hint}>Demo credentials: <b>admin</b> / <b>shelfsync123</b></p>
        <p className={styles.note}>
          This is a local demo login — the backend doesn't yet include an authentication endpoint.
        </p>
      </div>
    </div>
  )
}
