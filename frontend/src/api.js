import axios from 'axios'

const api = axios.create({ baseURL: import.meta.env.VITE_API_URL ?? '' })

export const getLocations = () => api.get('/api/locations').then(r => r.data)
export const getLocation = (slug) => api.get(`/api/locations/${slug}`).then(r => r.data)

export const getEvents = (params) => api.get('/api/events', { params }).then(r => r.data)
export const getEvent = (id) => api.get(`/api/events/${id}`).then(r => r.data)

export const getPilots = () => api.get('/api/pilots').then(r => r.data)
export const getPilot = (slug) => api.get(`/api/pilots/${slug}`).then(r => r.data)

export const getEventProgram = (eventId) => api.get(`/api/events/${eventId}/program`).then(r => r.data)

export const confirmRsvp = (eventId, data) => api.post(`/api/events/${eventId}/rsvp`, data).then(r => r.data)
export const cancelRsvp = (eventId, token) => api.delete(`/api/events/${eventId}/rsvp/${token}`).then(r => r.data)

export const getStats = () => api.get('/api/stats').then(r => r.data)

export const submitCff = (data) => api.post('/api/cff', data).then(r => r.data)
