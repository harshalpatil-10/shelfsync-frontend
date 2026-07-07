import React, { useEffect, useState } from 'react'
import Loader from '../../components/Loader/Loader.jsx'
import { bookService } from '../../services/bookService.js'
import { memberService } from '../../services/memberService.js'
import { borrowService } from '../../services/borrowService.js'
import { logActivity } from '../../utils/activityLog.js'
import { formatDate } from '../../utils/dateUtils.js'
import styles from './IssueBook.module.css'

export default function IssueBook() {
  const [books, setBooks] = useState([])
  const [students, setStudents] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const [bookId, setBookId] = useState('')
  const [memberId, setMemberId] = useState('')
  const [submitting, setSubmitting] = useState(false)
  const [result, setResult] = useState(null)
  const [formError, setFormError] = useState('')

  useEffect(() => { loadData() }, [])

  async function loadData() {
    try {
      setLoading(true)
      const [bookList, studentList] = await Promise.all([bookService.getAll(), memberService.getAll()])
      setBooks(bookList)
      setStudents(studentList)
      setError('')
    } catch (err) {
      setError(err.message)
    } finally {
      setLoading(false)
    }
  }

  const availableBooks = books.filter(b => b.availableCopies > 0)
  const selectedBook = books.find(b => String(b.id) === String(bookId))

  async function handleIssue(e) {
    e.preventDefault()
    setFormError('')
    setResult(null)

    if (!bookId || !memberId) {
      setFormError('Please select both a book and a student.')
      return
    }
    if (selectedBook && selectedBook.availableCopies <= 0) {
      setFormError('This book has no available copies right now.')
      return
    }

    setSubmitting(true)
    try {
      const record = await borrowService.borrow(bookId, memberId)
      setResult(record)
      logActivity({
        type: 'issue',
        bookTitle: record.book?.title,
        memberName: record.member?.name,
      })
      setBookId(''); setMemberId('')
      await loadData()
    } catch (err) {
      setFormError(err.message)
    } finally {
      setSubmitting(false)
    }
  }

  if (loading) return <Loader label="Loading books and students..." />

  return (
    <div className={styles.wrap}>
      <div className={styles.header}>
        <h2>Issue Book</h2>
        <p className={styles.subtitle}>Select a student and an available book to issue a 14-day loan.</p>
      </div>

      {error && <div className={styles.errorBanner}>{error}</div>}

      <div className={`card ${styles.card}`}>
        <form onSubmit={handleIssue}>
          <div className="formfield">
            <label>Student</label>
            <select value={memberId} onChange={e => setMemberId(e.target.value)}>
              <option value="">Select a student...</option>
              {students.map(s => <option key={s.id} value={s.id}>{s.name} ({s.email})</option>)}
            </select>
          </div>

          <div className="formfield">
            <label>Book</label>
            <select value={bookId} onChange={e => setBookId(e.target.value)}>
              <option value="">Select a book...</option>
              {availableBooks.map(b => (
                <option key={b.id} value={b.id}>{b.title} — {b.availableCopies} available</option>
              ))}
            </select>
            {availableBooks.length === 0 && (
              <span className={styles.warnText}>No books currently have available copies.</span>
            )}
          </div>

          {selectedBook && (
            <div className={styles.previewBox}>
              <span>📚 {selectedBook.title}</span>
              <span className="badge badge-success">{selectedBook.availableCopies} available</span>
            </div>
          )}

          {formError && <p className="error" style={{ marginBottom: 14 }}>{formError}</p>}

          <button type="submit" className="btn btn-primary" disabled={submitting} style={{ width: '100%', padding: '12px 0' }}>
            {submitting ? 'Issuing...' : 'Issue Book'}
          </button>
        </form>
      </div>

      {result && (
        <div className={`card ${styles.resultCard} spine success`}>
          <h3>✅ Book Issued Successfully</h3>
          <div className={styles.resultGrid}>
            <div><span className={styles.viewLabel}>Book</span><p>{result.book?.title}</p></div>
            <div><span className={styles.viewLabel}>Student</span><p>{result.member?.name}</p></div>
            <div><span className={styles.viewLabel}>Issue Date</span><p>{formatDate(result.borrowDate)}</p></div>
            <div><span className={styles.viewLabel}>Due Date</span><p>{formatDate(result.dueDate)}</p></div>
          </div>
        </div>
      )}
    </div>
  )
}
