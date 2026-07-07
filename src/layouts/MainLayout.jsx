import React, { useState } from 'react'
import { Outlet } from 'react-router-dom'
import Sidebar from '../components/Sidebar/Sidebar.jsx'
import Navbar from '../components/Navbar/Navbar.jsx'
import Footer from '../components/Footer/Footer.jsx'
import styles from './MainLayout.module.css'

export default function MainLayout() {
  const [sidebarOpen, setSidebarOpen] = useState(false)

  return (
    <div className={styles.layout}>
      <Sidebar open={sidebarOpen} />
      {sidebarOpen && <div className={styles.overlay} onClick={() => setSidebarOpen(false)} />}
      <div className={styles.main}>
        <Navbar onMenuClick={() => setSidebarOpen(o => !o)} />
        <div className={styles.content}>
          <Outlet />
        </div>
        <Footer />
      </div>
    </div>
  )
}
