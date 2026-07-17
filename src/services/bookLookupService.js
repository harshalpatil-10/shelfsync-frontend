import api from './api.js'

export const bookLookupService = {
  lookupByIsbn: (isbn) => api.get(`/books/lookup/${isbn}`).then(r => r.data),
}
