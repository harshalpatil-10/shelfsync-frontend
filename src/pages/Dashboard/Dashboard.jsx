import React, { useEffect, useState } from 'react'
import StatCard from '../../components/StatCard/StatCard.jsx'
import Loader from '../../components/Loader/Loader.jsx'
import { bookService } from '../../services/bookService.js'
import { memberService } from '../../services/memberService.js'
import { borrowService } from '../../services/borrowService.js'
import { getActivityLog } from '../../utils/activityLog.js'
import { formatDate } from '../../utils/dateUtils.js'
import styles from './Dashboard.module.css'

export default function Dashboard() {
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const [stats, setStats] = useState({ total: 0, available: 0, issued: 0, students: 0 })
  const [overdue, setOverdue] = useState([])
  const [activity, setActivity] = useState([])

  useEffect(() => {
    async function load() {
      try {
        setLoading(true)
        const [books, members, overdueList] = await Promise.all([
          bookService.getAll(),
          memberService.getAll(),
          borrowService.overdue(),
        ])

        const totalCopies = books.reduce((sum, b) => sum + b.totalCopies, 0)
        const availableCopies = books.reduce((sum, b) => sum + b.availableCopies, 0)

        setStats({
          total: totalCopies,
          available: availableCopies,
          issued: totalCopies - availableCopies,
          students: members.length,
        })
        setOverdue(overdueList)
        setActivity(getActivityLog())
        setError('')
      } catch (err) {
        setError(err.message)
      } finally {
        setLoading(false)
      }
    }
    load()
  }, [])

  if (loading) return <Loader label="Loading dashboard..." />

  return (
    <div>
      <div className={styles.header}>
        <h2>Dashboard</h2>
        <p className={styles.subtitle}>Overview of your library right now.</p>
      </div>

      {error && <div className={styles.errorBanner}>{error}</div>}

      <div className={styles.statGrid}>
        <StatCard label="Total Books" value={stats.total} icon="📚" />
        <StatCard label="Available Books" value={stats.available} icon="✅" tone="success" />
        <StatCard label="Issued Books" value={stats.issued} icon="📤" tone="warning" />
        <StatCard label="Registered Students" value={stats.students} icon="🎓" />
      </div>

      <div className={styles.row}>
        <div className={`card ${styles.panel} spine danger`}>
          <div className={styles.panelHeader}>
            <h3>⚠️ Overdue Books</h3>
            <span className="badge badge-danger">{overdue.length} overdue</span>
          </div>
          {overdue.length === 0 ? (
            <p className={styles.emptyText}>No overdue books right now. Nice work!</p>
          ) : (
            <ul className={styles.list}>
              {overdue.map(r => (
                <li key={r.id} className={styles.listItem}>
                  <div>
                    <strong>{r.book?.title}</strong>
                    <span className={styles.muted}> · {r.member?.name}</span>
                  </div>
                  <span className={styles.dueDate}>Due {formatDate(r.dueDate)}</span>
                </li>
              ))}
            </ul>
          )}
        </div>

        <div className={`card ${styles.panel} spine`}>
          <div className={styles.panelHeader}>
            <h3>🕓 Recent Transactions</h3>
          </div>
          {activity.length === 0 ? (
            <p className={styles.emptyText}>No activity yet this session. Issue or return a book to see it here.</p>
          ) : (
            <ul className={styles.list}>
              {activity.map((a, i) => (
                <li key={i} className={styles.listItem}>
                  <div>
                    <span className={`badge ${a.type === 'issue' ? 'badge-warning' : 'badge-success'}`}>
                      {a.type === 'issue' ? 'Issued' : 'Returned'}
                    </span>
                    <strong className={styles.txTitle}>{a.bookTitle}</strong>
                    <span className={styles.muted}> · {a.memberName}</span>
                  </div>
                  <span className={styles.muted}>{formatDate(a.timestamp)}</span>
                </li>
              ))}
            </ul>
          )}
          <p className={styles.note}>Showing activity from this browser session.</p>
        </div>
      </div>
    </div>
  )
}
