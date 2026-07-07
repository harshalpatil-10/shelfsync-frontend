import api from './api.js'

export const bookService = {
  getAll: () => api.get('/books').then(res => res.data),
  getById: (id) => api.get(`/books/${id}`).then(res => res.data),
  add: (book) => api.post('/books', book).then(res => res.data),
  update: (id, book) => api.put(`/books/${id}`, book).then(res => res.data),
  remove: (id) => api.delete(`/books/${id}`).then(res => res.data),
}
