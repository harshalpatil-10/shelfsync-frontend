import React, { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { useAuth } from '../../context/AuthContext.jsx'
import styles from './Login.module.css'

export default function Login() {
  const { login } = useAuth()
  const navigate = useNavigate()
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)

  async function handleSubmit(e) {
    e.preventDefault()
    setError('')
    setLoading(true)
    try {
      await login(email, password)
      navigate('/')
    } catch (err) {
      setError(err.message || 'Invalid email or password.')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className={styles.page}>
      <div className={styles.card}>
        <h1 className={styles.title}>ShelfSync</h1>
        <p className={styles.subtitle}>Log in to manage the library.</p>
        <form onSubmit={handleSubmit}>
          <div className="formfield">
            <label>Email</label>
            <input type="email" value={email} onChange={e => setEmail(e.target.value)} autoFocus />
          </div>
          <div className="formfield">
            <label>Password</label>
            <input type="password" value={password} onChange={e => setPassword(e.target.value)} />
          </div>
          {error && <p className="error" style={{ marginBottom: 14 }}>{error}</p>}
          <button type="submit" className="btn btn-primary" disabled={loading} style={{ width: '100%', padding: '12px 0' }}>
            {loading ? 'Signing in...' : 'Log In'}
          </button>
        </form>
        <p className={styles.footerText}>No account? <Link to="/signup" className={styles.link}>Sign up</Link></p>
      </div>
    </div>
  )
}
