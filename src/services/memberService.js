import api from './api.js'

// Note: the backend currently only exposes add + list + get-by-id for members.
// Edit/delete endpoints don't exist yet, so the UI intentionally does not offer them.
export const memberService = {
  getAll: () => api.get('/members').then(res => res.data),
  getById: (id) => api.get(`/members/${id}`).then(res => res.data),
  add: (member) => api.post('/members', member).then(res => res.data),
}
