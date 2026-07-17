import api from './api.js'

export const reservationService = {
  reserve: (bookId, memberId) => api.post('/reservations', { bookId, memberId }).then(r => r.data),
  cancel: (id) => api.post(`/reservations/${id}/cancel`).then(r => r.data),
  getQueueForBook: (bookId) => api.get(`/reservations/book/${bookId}`).then(r => r.data),
  getMyReservations: (memberId) => api.get(`/reservations/member/${memberId}`).then(r => r.data),
}
