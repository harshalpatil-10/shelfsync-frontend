import React from 'react'
import { useTheme } from '../../context/ThemeContext.jsx'
import styles from './ThemeToggle.module.css'

export default function ThemeToggle() {
  const { theme, toggleTheme } = useTheme()
  return (
    <button className={styles.toggle} onClick={toggleTheme} aria-label="Toggle dark mode" title="Toggle dark mode">
      {theme === 'light' ? '🌙' : '☀️'}
    </button>
  )
}
