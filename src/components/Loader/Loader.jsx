import React from 'react'
import styles from './Loader.module.css'

export default function Loader({ label = 'Loading...' }) {
  return (
    <div className={styles.wrap}>
      <div className={styles.spinner} />
      <span>{label}</span>
    </div>
  )
}
