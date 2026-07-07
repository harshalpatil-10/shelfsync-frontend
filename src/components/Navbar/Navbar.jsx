import React from 'react'
import { useNavigate } from 'react-router-dom'
import styles from './Navbar.module.css'
import ThemeToggle from '../ThemeToggle/ThemeToggle.jsx'
import { logout, getSession } from '../../utils/auth.js'

export default function Navbar({ onMenuClick }) {
  const navigate = useNavigate()
  const session = getSession()

  function handleLogout() {
    logout()
    navigate('/login', { replace: true })
  }

  return (
    <header className={styles.navbar}>
      <button className={styles.menuBtn} onClick={onMenuClick} aria-label="Toggle menu">☰</button>
      <div className={styles.spacer} />
      <ThemeToggle />
      <div className={styles.userMenu}>
        <div className={styles.avatar}>{session?.username?.[0]?.toUpperCase() || 'A'}</div>
        <span className={styles.username}>{session?.username || 'Admin'}</span>
        <button className={styles.logoutBtn} onClick={handleLogout}>Logout</button>
      </div>
    </header>
  )
}
