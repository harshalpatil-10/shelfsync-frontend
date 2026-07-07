import React from 'react'
import styles from './SearchBar.module.css'

export default function SearchBar({ value, onChange, placeholder = 'Search...' }) {
  return (
    <div className={styles.wrap}>
      <span className={styles.icon}>🔍</span>
      <input
        type="text"
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder={placeholder}
        className={styles.input}
      />
      {value && (
        <button className={styles.clear} onClick={() => onChange('')} aria-label="Clear search">✕</button>
      )}
    </div>
  )
}
