import React, { useEffect, useState } from 'react'
import Loader from '../../components/Loader/Loader.jsx'
import EmptyState from '../../components/EmptyState/EmptyState.jsx'
import { bookService } from '../../services/bookService.js'
import { reservationService } from '../../services/reservationService.js'
import { memberService } from '../../services/memberService.js'
import { formatDate } from '../../utils/dateUtils.js'
import styles from './Reservations.module.css'

export default function Reservations() {
  const [books, setBooks] = useState([])
  const [members, setMembers] = useState([])
  const [selectedBookId, setSelectedBookId] = useState('')
  const [selectedMemberId, setSelectedMemberId] = useState('')
  const [queue, setQueue] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const [success, setSuccess] = useState('')

  useEffect(() => { load() }, [])

  async function load() {
    try {
      setLoading(true)
      const [b, m] = await Promise.all([bookService.getAllBooks(), memberService.getAllMembers()])
      setBooks(b.filter(bk => bk.availableCopies === 0))
      setMembers(m)
    } catch (err) {
      setError(err.message)
    } finally {
      setLoading(false)
    }
  }

  async function handleViewQueue(bookId) {
    setSelectedBookId(bookId)
    try {
      const q = await reservationService.getQueueForBook(bookId)
      setQueue(q)
    } catch (err) {
      setError(err.message)
    }
  }

  async function handleReserve() {
    if (!selectedBookId || !selectedMemberId) {
      setError('Select both a book and a member.')
      return
    }
    setError(''); setSuccess('')
    try {
      await reservationService.reserve(selectedBookId, selectedMemberId)
      setSuccess('Added to the reservation queue.')
      await handleViewQueue(selectedBookId)
    } catch (err) {
      setError(err.message)
    }
  }

  if (loading) return <Loader label="Loading reservations..." />

  return (
    <div>
      <div style={{ marginBottom: 20 }}>
        <h2 style={{ fontSize: 22, fontWeight: 700 }}>Reservation Queue</h2>
        <p style={{ color: 'var(--muted)', fontSize: 13.5, marginTop: 4 }}>
          Books with zero available copies. Join the queue and get it automatically when it's returned.
        </p>
      </div>

      {error && <div className={styles.errorBanner}>{error}</div>}
      {success && <div className={styles.successBanner}>{success}</div>}

      {books.length === 0 ? (
        <EmptyState icon="📚" title="No books need reservations" subtitle="Every book currently has copies available." />
      ) : (
        <div className={styles.grid}>
          <div className="card" style={{ padding: 20 }}>
            <h3 style={{ fontSize: 15, marginBottom: 14 }}>Fully Booked Titles</h3>
            <div className={styles.bookList}>
              {books.map(b => (
                <button
                  key={b.id}
                  className={`${styles.bookItem} ${selectedBookId === b.id ? styles.active : ''}`}
                  onClick={() => handleViewQueue(b.id)}
                >
                  {b.title}
                  <span className="badge badge-danger">0 available</span>
                </button>
              ))}
            </div>
          </div>

          <div className="card" style={{ padding: 20 }}>
            <h3 style={{ fontSize: 15, marginBottom: 14 }}>Current Queue</h3>
            {!selectedBookId ? (
              <p style={{ fontSize: 13, color: 'var(--muted)' }}>Select a book to see its queue.</p>
            ) : queue.length === 0 ? (
              <p style={{ fontSize: 13, color: 'var(--muted)' }}>No one in the queue yet — be the first.</p>
            ) : (
              <ol className={styles.queueList}>
                {queue.map((r, i) => (
                  <li key={r.id}>
                    <span className={styles.position}>{i + 1}</span>
                    {r.member.name} <span className={styles.queueMeta}>· requested {formatDate(r.requestedAt)}</span>
                  </li>
                ))}
              </ol>
            )}

            <div style={{ marginTop: 20, paddingTop: 16, borderTop: '1px solid var(--border)' }}>
              <div className="formfield">
                <label>Join queue as</label>
                <select value={selectedMemberId} onChange={e => setSelectedMemberId(e.target.value)}>
                  <option value="">Select a member...</option>
                  {members.map(m => <option key={m.id} value={m.id}>{m.name}</option>)}
                </select>
              </div>
              <button className="btn btn-primary" onClick={handleReserve} disabled={!selectedBookId}>
                Join Reservation Queue
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
