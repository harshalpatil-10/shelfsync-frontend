import axios from 'axios'

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'https://library-management-backend-cv4d.onrender.com/api'

const api = axios.create({
  baseURL: API_BASE_URL,
  headers: { 'Content-Type': 'application/json' }
})

// Surface backend error messages consistently across the app
api.interceptors.request.use((config) => {
  const token = localStorage.getItem('shelfsync_token')
  if (token) config.headers.Authorization = `Bearer ${token}`
  return config
})

export default api
