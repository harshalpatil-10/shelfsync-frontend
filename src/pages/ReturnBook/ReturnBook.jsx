import React, { useEffect, useState } from 'react'
import Loader from '../../components/Loader/Loader.jsx'
import ConfirmDialog from '../../components/ConfirmDialog/ConfirmDialog.jsx'
import { memberService } from '../../services/memberService.js'
import { borrowService } from '../../services/borrowService.js'
import { logActivity } from '../../utils/activityLog.js'
import { formatDate, isOverdue } from '../../utils/dateUtils.js'
import styles from './ReturnBook.module.css'

export default function ReturnBook() {
  const [students, setStudents] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const [memberId, setMemberId] = useState('')
  const [activeLoans, setActiveLoans] = useState([])
  const [loadingLoans, setLoadingLoans] = useState(false)
  const [confirmTarget, setConfirmTarget] = useState(null)
  const [returning, setReturning] = useState(false)
  const [result, setResult] = useState(null)

  useEffect(() => { loadStudents() }, [])

  async function loadStudents() {
    try {
      setLoading(true)
      const data = await memberService.getAll()
      setStudents(data)
      setError('')
    } catch (err) {
      setError(err.message)
    } finally {
      setLoading(false)
    }
  }

  async function handleSelectMember(id) {
    setMemberId(id)
    setResult(null)
    if (!id) { setActiveLoans([]); return }
    try {
      setLoadingLoans(true)
      const history = await borrowService.historyForMember(id)
      setActiveLoans(history.filter(r => !r.returnDate))
      setError('')
    } catch (err) {
      setError(err.message)
    } finally {
      setLoadingLoans(false)
    }
  }

  async function handleConfirmReturn() {
    setReturning(true)
    try {
      const record = await borrowService.returnBook(confirmTarget.id)
      setResult(record)
      logActivity({
        type: 'return',
        bookTitle: record.book?.title,
        memberName: record.member?.name,
      })
      setConfirmTarget(null)
      await handleSelectMember(memberId)
    } catch (err) {
      setError(err.message)
      setConfirmTarget(null)
    } finally {
      setReturning(false)
    }
  }

  if (loading) return <Loader label="Loading students..." />

  return (
    <div className={styles.wrap}>
      <div className={styles.header}>
        <h2>Return Book</h2>
        <p className={styles.subtitle}>Select a student to see their currently borrowed books.</p>
      </div>

      {error && <div className={styles.errorBanner}>{error}</div>}

      <div className={`card ${styles.card}`}>
        <div className="formfield">
          <label>Student</label>
          <select value={memberId} onChange={e => handleSelectMember(e.target.value)}>
            <option value="">Select a student...</option>
            {students.map(s => <option key={s.id} value={s.id}>{s.name} ({s.email})</option>)}
          </select>
        </div>

        {loadingLoans && <Loader label="Loading their borrowed books..." />}

        {!loadingLoans && memberId && activeLoans.length === 0 && (
          <p className={styles.emptyText}>This student has no books currently borrowed.</p>
        )}

        {!loadingLoans && activeLoans.length > 0 && (
          <div className={styles.loanList}>
            {activeLoans.map(loan => {
              const overdue = isOverdue(loan.dueDate, loan.returnDate)
              return (
                <div key={loan.id} className={`${styles.loanItem} spine ${overdue ? 'danger' : ''}`}>
                  <div>
                    <strong>{loan.book?.title}</strong>
                    <div className={styles.meta}>
                      Due {formatDate(loan.dueDate)}
                      {overdue && <span className="badge badge-danger" style={{ marginLeft: 8 }}>Overdue</span>}
                    </div>
                  </div>
                  <button className="btn btn-primary" onClick={() => setConfirmTarget(loan)}>Return</button>
                </div>
              )
            })}
          </div>
        )}
      </div>

      {result && (
        <div className={`card ${styles.resultCard} spine ${result.fineAmount > 0 ? 'warning' : 'success'}`}>
          <h3>{result.fineAmount > 0 ? '⚠️ Book Returned — Late Fine Applied' : '✅ Book Returned Successfully'}</h3>
          <div className={styles.resultGrid}>
            <div><span className={styles.viewLabel}>Book</span><p>{result.book?.title}</p></div>
            <div><span className={styles.viewLabel}>Student</span><p>{result.member?.name}</p></div>
            <div><span className={styles.viewLabel}>Return Date</span><p>{formatDate(result.returnDate)}</p></div>
            <div><span className={styles.viewLabel}>Fine Amount</span><p>₹{result.fineAmount.toFixed(2)}</p></div>
          </div>
        </div>
      )}

      <ConfirmDialog
        open={!!confirmTarget}
        title="Confirm Return"
        message={`Return "${confirmTarget?.book?.title}"? Any late fine will be calculated automatically.`}
        onConfirm={handleConfirmReturn}
        onCancel={() => setConfirmTarget(null)}
      />
    </div>
  )
}
