import api from './api.js'

export const borrowService = {
  borrow: (bookId, memberId) =>
    api.post(`/borrow?bookId=${bookId}&memberId=${memberId}`).then(res => res.data),
  returnBook: (borrowRecordId) =>
    api.post(`/return/${borrowRecordId}`).then(res => res.data),
  historyForMember: (memberId) =>
    api.get(`/borrow/history/${memberId}`).then(res => res.data),
  overdue: () =>
    api.get('/borrow/overdue').then(res => res.data),
}
