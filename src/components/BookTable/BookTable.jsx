import React from 'react'
import styles from './BookTable.module.css'

export default function BookTable({ books, onEdit, onDelete, onView }) {
  if (books.length === 0) {
    return <div className={styles.empty}>No books found. Try adjusting your search or add a new book.</div>
  }

  return (
    <div className={styles.tableWrap}>
      <table className={styles.table}>
        <thead>
          <tr>
            <th>Title</th>
            <th>Author</th>
            <th>Genre</th>
            <th>ISBN</th>
            <th>Copies</th>
            <th>Status</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {books.map(book => {
            const available = book.availableCopies > 0
            return (
              <tr key={book.id} className={`spine ${available ? 'success' : 'danger'}`}>
                <td className={styles.titleCell}>{book.title}</td>
                <td>{book.author}</td>
                <td>{book.genre}</td>
                <td className={styles.mono}>{book.isbn}</td>
                <td>{book.availableCopies} / {book.totalCopies}</td>
                <td>
                  <span className={`badge ${available ? 'badge-success' : 'badge-danger'}`}>
                    {available ? 'Available' : 'All Issued'}
                  </span>
                </td>
                <td>
                  <div className={styles.actions}>
                    <button className={styles.actionBtn} onClick={() => onView(book)} title="View details">👁</button>
                    <button className={styles.actionBtn} onClick={() => onEdit(book)} title="Edit">✏️</button>
                    <button className={`${styles.actionBtn} ${styles.danger}`} onClick={() => onDelete(book)} title="Delete">🗑</button>
                  </div>
                </td>
              </tr>
            )
          })}
        </tbody>
      </table>
    </div>
  )
}
