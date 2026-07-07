import React from 'react'
import { Link } from 'react-router-dom'
import styles from './NotFound.module.css'

export default function NotFound() {
  return (
    <div className={styles.page}>
      <div className={styles.content}>
        <span className={styles.mark}>📖</span>
        <h1>404</h1>
        <p>This page doesn't exist in the catalog.</p>
        <Link to="/" className="btn btn-primary">Back to Dashboard</Link>
      </div>
    </div>
  )
}
