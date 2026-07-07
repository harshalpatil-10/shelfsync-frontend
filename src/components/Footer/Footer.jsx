import React from 'react'
import styles from './Footer.module.css'

export default function Footer() {
  return (
    <footer className={styles.footer}>
      <span>© {new Date().getFullYear()} ShelfSync</span>
      <span className={styles.dot}>·</span>
      <span>Library Management System</span>
    </footer>
  )
}
