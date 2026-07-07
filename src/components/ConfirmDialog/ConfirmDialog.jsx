import React from 'react'
import Modal from '../Modal/Modal.jsx'

export default function ConfirmDialog({ open, title = 'Are you sure?', message, onConfirm, onCancel, danger = false }) {
  return (
    <Modal
      open={open}
      title={title}
      onClose={onCancel}
      footer={
        <>
          <button className="btn btn-outline" onClick={onCancel}>Cancel</button>
          <button className={`btn ${danger ? 'btn-danger' : 'btn-primary'}`} onClick={onConfirm}>Confirm</button>
        </>
      }
    >
      <p style={{ fontSize: '14px', color: 'var(--muted)', lineHeight: 1.6 }}>{message}</p>
    </Modal>
  )
}
