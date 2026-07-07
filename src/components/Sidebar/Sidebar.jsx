import React from 'react'
import { NavLink } from 'react-router-dom'
import styles from './Sidebar.module.css'

const NAV_ITEMS = [
  { to: '/', label: 'Dashboard', icon: '📊', end: true },
  { to: '/books', label: 'Books', icon: '📚' },
  { to: '/students', label: 'Students', icon: '🎓' },
  { to: '/issue', label: 'Issue Book', icon: '➡️' },
  { to: '/return', label: 'Return Book', icon: '⬅️' },
  { to: '/profile', label: 'Profile', icon: '👤' },
]

export default function Sidebar({ open }) {
  return (
    <aside className={`${styles.sidebar} ${open ? styles.open : ''}`}>
      <div className={styles.logo}>
        <span className={styles.logoMark}>📖</span>
        <span className={styles.logoText}>ShelfSync</span>
      </div>
      <nav className={styles.nav}>
        {NAV_ITEMS.map(item => (
          <NavLink
            key={item.to}
            to={item.to}
            end={item.end}
            className={({ isActive }) => `${styles.navItem} ${isActive ? styles.active : ''}`}
          >
            <span className={styles.icon}>{item.icon}</span>
            <span>{item.label}</span>
          </NavLink>
        ))}
      </nav>
      <div className={styles.footer}>
        <p>ShelfSync v1.0</p>
        <p className={styles.sub}>Library Management System</p>
      </div>
    </aside>
  )
}
