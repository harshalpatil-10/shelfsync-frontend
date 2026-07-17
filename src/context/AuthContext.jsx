import React, { createContext, useContext, useState } from 'react'
import { authService } from '../services/authService.js'

const AuthContext = createContext()

export function AuthProvider({ children }) {
  const [user, setUser] = useState(() => {
    const stored = localStorage.getItem('shelfsync_user')
    return stored ? JSON.parse(stored) : null
  })

  async function login(email, password) {
    const data = await authService.login({ email, password })
    persist(data)
    return data
  }

  async function register(name, email, password) {
    const data = await authService.register({ name, email, password })
    persist(data)
    return data
  }

  function persist(data) {
    localStorage.setItem('shelfsync_token', data.token)
    const u = { name: data.name, email: data.email, role: data.role }
    localStorage.setItem('shelfsync_user', JSON.stringify(u))
    setUser(u)
  }

  function logout() {
    localStorage.removeItem('shelfsync_token')
    localStorage.removeItem('shelfsync_user')
    setUser(null)
  }

  function isAuthenticated() {
    return !!localStorage.getItem('shelfsync_token')
  }

  function isAdmin() {
    return user?.role === 'ADMIN'
  }

  return (
    <AuthContext.Provider value={{ user, login, register, logout, isAuthenticated, isAdmin }}>
      {children}
    </AuthContext.Provider>
  )
}

export function useAuth() {
  return useContext(AuthContext)
}
