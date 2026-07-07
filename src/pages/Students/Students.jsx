import React, { useEffect, useMemo, useState } from 'react'
import StudentTable from '../../components/StudentTable/StudentTable.jsx'
import SearchBar from '../../components/SearchBar/SearchBar.jsx'
import Pagination from '../../components/Pagination/Pagination.jsx'
import Modal from '../../components/Modal/Modal.jsx'
import Loader from '../../components/Loader/Loader.jsx'
import { memberService } from '../../services/memberService.js'
import { exportToExcel } from '../../utils/exportUtils.js'
import styles from './Students.module.css'

const PAGE_SIZE = 8
const EMPTY_FORM = { name: '', email: '', phone: '' }

export default function Students() {
  const [students, setStudents] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const [search, setSearch] = useState('')
  const [page, setPage] = useState(1)

  const [showAdd, setShowAdd] = useState(false)
  const [form, setForm] = useState(EMPTY_FORM)
  const [formErrors, setFormErrors] = useState({})
  const [saving, setSaving] = useState(false)

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

  const filtered = useMemo(() => {
    return students.filter(s => `${s.name} ${s.email} ${s.phone}`.toLowerCase().includes(search.toLowerCase()))
  }, [students, search])

  const totalPages = Math.max(1, Math.ceil(filtered.length / PAGE_SIZE))
  const paged = filtered.slice((page - 1) * PAGE_SIZE, page * PAGE_SIZE)

  function validate() {
    const errs = {}
    if (!form.name.trim()) errs.name = 'Name is required.'
    if (!form.email.trim()) errs.email = 'Email is required.'
    else if (!/^\S+@\S+\.\S+$/.test(form.email)) errs.email = 'Enter a valid email address.'
    if (!form.phone.trim()) errs.phone = 'Phone number is required.'
    setFormErrors(errs)
    return Object.keys(errs).length === 0
  }

  async function handleAdd() {
    if (!validate()) return
    setSaving(true)
    try {
      await memberService.add(form)
      await loadStudents()
      setShowAdd(false)
      setForm(EMPTY_FORM)
    } catch (err) {
      setFormErrors({ submit: err.message })
    } finally {
      setSaving(false)
    }
  }

  if (loading) return <Loader label="Loading students..." />

  return (
    <div>
      <div className={styles.header}>
        <div>
          <h2>Students</h2>
          <p className={styles.subtitle}>{filtered.length} student{filtered.length !== 1 ? 's' : ''} registered</p>
        </div>
        <div className={styles.actions}>
          <button className="btn btn-outline" onClick={() => exportToExcel(filtered, 'shelfsync-students')}>⬇ Export</button>
          <button className="btn btn-primary" onClick={() => setShowAdd(true)}>+ Register Student</button>
        </div>
      </div>

      {error && <div className={styles.errorBanner}>{error}</div>}

      <p className={styles.note}>
        Editing and removing students isn't available yet — the backend doesn't expose those endpoints for members.
      </p>

      <div className={styles.filters}>
        <SearchBar value={search} onChange={(v) => { setSearch(v); setPage(1) }} placeholder="Search by name, email, phone..." />
      </div>

      <StudentTable students={paged} />
      <Pagination page={page} totalPages={totalPages} onChange={setPage} />

      <Modal
        open={showAdd}
        title="Register Student"
        onClose={() => setShowAdd(false)}
        footer={
          <>
            <button className="btn btn-outline" onClick={() => setShowAdd(false)}>Cancel</button>
            <button className="btn btn-primary" onClick={handleAdd} disabled={saving}>
              {saving ? 'Saving...' : 'Register'}
            </button>
          </>
        }
      >
        <div className="formfield">
          <label>Full Name</label>
          <input className={formErrors.name ? 'invalid' : ''} value={form.name} onChange={e => setForm({ ...form, name: e.target.value })} />
          {formErrors.name && <span className="error">{formErrors.name}</span>}
        </div>
        <div className="formfield">
          <label>Email</label>
          <input className={formErrors.email ? 'invalid' : ''} value={form.email} onChange={e => setForm({ ...form, email: e.target.value })} />
          {formErrors.email && <span className="error">{formErrors.email}</span>}
        </div>
        <div className="formfield">
          <label>Phone</label>
          <input className={formErrors.phone ? 'invalid' : ''} value={form.phone} onChange={e => setForm({ ...form, phone: e.target.value })} />
          {formErrors.phone && <span className="error">{formErrors.phone}</span>}
        </div>
        {formErrors.submit && <p className="error">{formErrors.submit}</p>}
      </Modal>
    </div>
  )
}
