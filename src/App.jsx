import React from 'react'
import { Routes, Route } from 'react-router-dom'
import Login from './pages/Login/Login.jsx'
import Signup from './pages/Signup/Signup.jsx'
import Dashboard from './pages/Dashboard/Dashboard.jsx'
import Books from './pages/Books/Books.jsx'
import Students from './pages/Students/Students.jsx'
import IssueBook from './pages/IssueBook/IssueBook.jsx'
import ReturnBook from './pages/ReturnBook/ReturnBook.jsx'
import Profile from './pages/Profile/Profile.jsx'
import NotFound from './pages/NotFound/NotFound.jsx'
import MainLayout from './layouts/MainLayout.jsx'
import ProtectedRoute from './components/ProtectedRoute.jsx'
import Reservations from './pages/Reservations/Reservations.jsx'

export default function App() {
  return (
    <Routes>
      <Route path="/login" element={<Login />} />
      <Route path="/signup" element={<Signup />} />

      <Route element={<ProtectedRoute><MainLayout /></ProtectedRoute>}>
        <Route path="/" element={<Dashboard />} />
        <Route path="/books" element={<Books />} />
        <Route path="/students" element={<Students />} />
        <Route path="/issue" element={<IssueBook />} />
        <Route path="/return" element={<ReturnBook />} />
        <Route path="/profile" element={<Profile />} />
        <Route path="/reservations" element={<Reservations />} />
      </Route>

      <Route path="*" element={<NotFound />} />
    </Routes>
  )
}
