import React from 'react'
import styles from './StatCard.module.css'

export default function StatCard({ label, value, icon, tone = 'default' }) {
  return (
    <div className={`${styles.card} spine ${tone !== 'default' ? tone : ''}`}>
      <div className={styles.top}>
        <span className={styles.icon}>{icon}</span>
      </div>
      <div className={styles.value}>{value}</div>
      <div className={styles.label}>{label}</div>
    </div>
  )
}
