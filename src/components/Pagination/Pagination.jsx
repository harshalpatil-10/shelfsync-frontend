import React from 'react'
import styles from './Pagination.module.css'

export default function Pagination({ page, totalPages, onChange }) {
  if (totalPages <= 1) return null

  const pages = Array.from({ length: totalPages }, (_, i) => i + 1)

  return (
    <div className={styles.wrap}>
      <button disabled={page === 1} onClick={() => onChange(page - 1)} className={styles.navBtn}>‹ Prev</button>
      <div className={styles.pages}>
        {pages.map(p => (
          <button
            key={p}
            className={`${styles.pageBtn} ${p === page ? styles.active : ''}`}
            onClick={() => onChange(p)}
          >
            {p}
          </button>
        ))}
      </div>
      <button disabled={page === totalPages} onClick={() => onChange(page + 1)} className={styles.navBtn}>Next ›</button>
    </div>
  )
}
