import React from 'react'
import styles from './StudentTable.module.css'
import { formatDate } from '../../utils/dateUtils.js'

// Note: only view is supported here (no edit/delete) since the backend
// doesn't expose update/delete endpoints for members yet.
export default function StudentTable({ students }) {
  if (students.length === 0) {
    return <div className={styles.empty}>No students found. Try adjusting your search or register a new student.</div>
  }

  return (
    <div className={styles.tableWrap}>
      <table className={styles.table}>
        <thead>
          <tr>
            <th>Name</th>
            <th>Email</th>
            <th>Phone</th>
            <th>Member Since</th>
          </tr>
        </thead>
        <tbody>
          {students.map(s => (
            <tr key={s.id} className="spine">
              <td className={styles.nameCell}>{s.name}</td>
              <td>{s.email}</td>
              <td>{s.phone}</td>
              <td>{formatDate(s.membershipDate)}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  )
}
