import React, { useEffect, useMemo, useState } from 'react'
import BookTable from '../../components/BookTable/BookTable.jsx'
import SearchBar from '../../components/SearchBar/SearchBar.jsx'
import Pagination from '../../components/Pagination/Pagination.jsx'
import Modal from '../../components/Modal/Modal.jsx'
import ConfirmDialog from '../../components/ConfirmDialog/ConfirmDialog.jsx'
import Loader from '../../components/Loader/Loader.jsx'
import { bookService } from '../../services/bookService.js'
import { exportToExcel } from '../../utils/exportUtils.js'
import styles from './Books.module.css'

const PAGE_SIZE = 8
const EMPTY_FORM = { title: '', author: '', isbn: '', genre: '', totalCopies: 1 }

export default function Books() {
  const [books, setBooks] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const [search, setSearch] = useState('')
  const [genreFilter, setGenreFilter] = useState('All')
  const [page, setPage] = useState(1)

  const [modalMode, setModalMode] = useState(null) // 'add' | 'edit' | 'view'
  const [form, setForm] = useState(EMPTY_FORM)
  const [formErrors, setFormErrors] = useState({})
  const [activeBook, setActiveBook] = useState(null)
  const [deleteTarget, setDeleteTarget] = useState(null)
  const [saving, setSaving] = useState(false)

  useEffect(() => { loadBooks() }, [])

  async function loadBooks() {
    try {
      setLoading(true)
      const data = await bookService.getAll()
      setBooks(data)
      setError('')
    } catch (err) {
      setError(err.message)
    } finally {
      setLoading(false)
    }
  }

  const genres = useMemo(() => ['All', ...new Set(books.map(b => b.genre).filter(Boolean))], [books])

  const filtered = useMemo(() => {
    return books.filter(b => {
      const matchesSearch = `${b.title} ${b.author} ${b.isbn}`.toLowerCase().includes(search.toLowerCase())
      const matchesGenre = genreFilter === 'All' || b.genre === genreFilter
      return matchesSearch && matchesGenre
    })
  }, [books, search, genreFilter])

  const totalPages = Math.max(1, Math.ceil(filtered.length / PAGE_SIZE))
  const paged = filtered.slice((page - 1) * PAGE_SIZE, page * PAGE_SIZE)

  function openAdd() {
    setForm(EMPTY_FORM); setFormErrors({}); setModalMode('add')
  }
  function openEdit(book) {
    setForm({ title: book.title, author: book.author, isbn: book.isbn, genre: book.genre, totalCopies: book.totalCopies })
    setActiveBook(book); setFormErrors({}); setModalMode('edit')
  }
  function openView(book) {
    setActiveBook(book); setModalMode('view')
  }
  function closeModal() {
    setModalMode(null); setActiveBook(null)
  }

  function validate() {
    const errs = {}
    if (!form.title.trim()) errs.title = 'Title is required.'
    if (!form.author.trim()) errs.author = 'Author is required.'
    if (!form.isbn.trim()) errs.isbn = 'ISBN is required.'
    if (!form.genre.trim()) errs.genre = 'Genre is required.'
    if (!form.totalCopies || form.totalCopies < 1) errs.totalCopies = 'Must be at least 1 copy.'
    setFormErrors(errs)
    return Object.keys(errs).length === 0
  }

  async function handleSave() {
    if (!validate()) return
    setSaving(true)
    try {
      if (modalMode === 'add') {
        await bookService.add({ ...form, totalCopies: Number(form.totalCopies) })
      } else if (modalMode === 'edit') {
        await bookService.update(activeBook.id, {
          ...activeBook,
          ...form,
          totalCopies: Number(form.totalCopies),
        })
      }
      await loadBooks()
      closeModal()
    } catch (err) {
      setFormErrors({ submit: err.message })
    } finally {
      setSaving(false)
    }
  }

  async function handleDelete() {
    try {
      await bookService.remove(deleteTarget.id)
      setDeleteTarget(null)
      await loadBooks()
    } catch (err) {
      setError(err.message)
      setDeleteTarget(null)
    }
  }

  if (loading) return <Loader label="Loading books..." />

  return (
    <div>
      <div className={styles.header}>
        <div>
          <h2>Books</h2>
          <p className={styles.subtitle}>{filtered.length} book{filtered.length !== 1 ? 's' : ''} found</p>
        </div>
        <div className={styles.actions}>
          <button className="btn btn-outline" onClick={() => exportToExcel(filtered, 'shelfsync-books')}>⬇ Export</button>
          <button className="btn btn-primary" onClick={openAdd}>+ Add Book</button>
        </div>
      </div>

      {error && <div className={styles.errorBanner}>{error}</div>}

      <div className={styles.filters}>
        <SearchBar value={search} onChange={(v) => { setSearch(v); setPage(1) }} placeholder="Search by title, author, ISBN..." />
        <select className={styles.select} value={genreFilter} onChange={(e) => { setGenreFilter(e.target.value); setPage(1) }}>
          {genres.map(g => <option key={g} value={g}>{g}</option>)}
        </select>
      </div>

      <BookTable books={paged} onEdit={openEdit} onDelete={setDeleteTarget} onView={openView} />
      <Pagination page={page} totalPages={totalPages} onChange={setPage} />

      {/* Add / Edit Modal */}
      <Modal
        open={modalMode === 'add' || modalMode === 'edit'}
        title={modalMode === 'add' ? 'Add New Book' : 'Edit Book'}
        onClose={closeModal}
        footer={
          <>
            <button className="btn btn-outline" onClick={closeModal}>Cancel</button>
            <button className="btn btn-primary" onClick={handleSave} disabled={saving}>
              {saving ? 'Saving...' : 'Save Book'}
            </button>
          </>
        }
      >
        <div className="formfield">
          <label>Title</label>
          <input className={formErrors.title ? 'invalid' : ''} value={form.title} onChange={e => setForm({ ...form, title: e.target.value })} />
          {formErrors.title && <span className="error">{formErrors.title}</span>}
        </div>
        <div className="formfield">
          <label>Author</label>
          <input className={formErrors.author ? 'invalid' : ''} value={form.author} onChange={e => setForm({ ...form, author: e.target.value })} />
          {formErrors.author && <span className="error">{formErrors.author}</span>}
        </div>
        <div className="formfield">
          <label>ISBN</label>
          <input className={formErrors.isbn ? 'invalid' : ''} value={form.isbn} onChange={e => setForm({ ...form, isbn: e.target.value })} />
          {formErrors.isbn && <span className="error">{formErrors.isbn}</span>}
        </div>
        <div className="formfield">
          <label>Genre</label>
          <input className={formErrors.genre ? 'invalid' : ''} value={form.genre} onChange={e => setForm({ ...form, genre: e.target.value })} />
          {formErrors.genre && <span className="error">{formErrors.genre}</span>}
        </div>
        <div className="formfield">
          <label>Total Copies</label>
          <input type="number" min="1" className={formErrors.totalCopies ? 'invalid' : ''} value={form.totalCopies} onChange={e => setForm({ ...form, totalCopies: e.target.value })} />
          {formErrors.totalCopies && <span className="error">{formErrors.totalCopies}</span>}
        </div>
        {formErrors.submit && <p className="error">{formErrors.submit}</p>}
      </Modal>

      {/* View Modal */}
      <Modal open={modalMode === 'view'} title="Book Details" onClose={closeModal}>
        {activeBook && (
          <div className={styles.viewGrid}>
            <div><span className={styles.viewLabel}>Title</span><p>{activeBook.title}</p></div>
            <div><span className={styles.viewLabel}>Author</span><p>{activeBook.author}</p></div>
            <div><span className={styles.viewLabel}>ISBN</span><p>{activeBook.isbn}</p></div>
            <div><span className={styles.viewLabel}>Genre</span><p>{activeBook.genre}</p></div>
            <div><span className={styles.viewLabel}>Total Copies</span><p>{activeBook.totalCopies}</p></div>
            <div><span className={styles.viewLabel}>Available Copies</span><p>{activeBook.availableCopies}</p></div>
          </div>
        )}
      </Modal>

      <ConfirmDialog
        open={!!deleteTarget}
        title="Delete Book"
        message={`Are you sure you want to delete "${deleteTarget?.title}"? This can't be undone.`}
        onConfirm={handleDelete}
        onCancel={() => setDeleteTarget(null)}
        danger
      />
    </div>
  )
}
