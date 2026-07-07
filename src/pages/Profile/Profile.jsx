import React from 'react'
import { getSession } from '../../utils/auth.js'
import styles from './Profile.module.css'

export default function Profile() {
  const session = getSession()

  return (
    <div className={styles.wrap}>
      <div className={styles.header}>
        <h2>Profile</h2>
        <p className={styles.subtitle}>Your account details for this ShelfSync session.</p>
      </div>

      <div className={`card ${styles.card}`}>
        <div className={styles.avatarRow}>
          <div className={styles.avatar}>{session?.username?.[0]?.toUpperCase() || 'A'}</div>
          <div>
            <h3>{session?.username || 'Admin'}</h3>
            <p className={styles.role}>Librarian / Admin</p>
          </div>
        </div>

        <div className={styles.infoGrid}>
          <div>
            <span className={styles.label}>Username</span>
            <p>{session?.username || '—'}</p>
          </div>
          <div>
            <span className={styles.label}>Signed in since</span>
            <p>{session?.loginAt ? new Date(session.loginAt).toLocaleString() : '—'}</p>
          </div>
          <div>
            <span className={styles.label}>Role</span>
            <p>Administrator</p>
          </div>
        </div>

        <p className={styles.note}>
          Profile editing isn't available yet — this is a placeholder screen since the backend doesn't
          currently expose a user/account management endpoint.
        </p>
      </div>
    </div>
  )
}
