import { useEffect, useState } from 'react'
import { getEvents, confirmRsvp } from '../api'

const ACCENT = '#e94560'

const TYPE_COLORS = {
  'fly-in':              { bg: '#d1fae5', color: '#065f46', label: '✈️ Fly-in',            icon: '✈️' },
  'pouštění dronů':      { bg: '#e0f2fe', color: '#0369a1', label: '🚁 Pouštění dronů',    icon: '🚁' },
  'povídání v hospodě':  { bg: '#fef9c3', color: '#854d0e', label: '🍺 Povídání v hospodě', icon: '🍺' },
  'přednáška':           { bg: '#dbeafe', color: '#1e40af', label: '🎤 Přednáška',          icon: '🎤' },
  'závod':               { bg: '#fee2e2', color: '#991b1b', label: '🏁 Závod',              icon: '🏁' },
}

function TypeBadge({ type }) {
  const cfg = TYPE_COLORS[type] || { bg: '#f3f4f6', color: '#374151', label: type }
  return (
    <span style={{
      background: cfg.bg, color: cfg.color,
      borderRadius: 20, padding: '2px 10px',
      fontSize: '0.75rem', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.05em',
    }}>
      {cfg.label}
    </span>
  )
}

const card = {
  border: '1px solid #e5e7eb',
  borderRadius: 10,
  padding: '1.4rem',
  marginBottom: '1rem',
  background: '#fff',
  boxShadow: '0 1px 4px rgba(0,0,0,0.06)',
}

const inputStyle = {
  padding: '0.4rem 0.7rem', borderRadius: 6,
  border: '1px solid #d1d5db', fontSize: '0.95rem',
}

export default function Home() {
  const [events, setEvents] = useState([])
  const [rsvpForm, setRsvpForm] = useState({ eventId: null, name: '', email: '' })
  const [msg, setMsg] = useState('')
  const [loading, setLoading] = useState(false)

  useEffect(() => { getEvents().then(setEvents).catch(() => {}) }, [])

  const submitRsvp = async (e) => {
    e.preventDefault()
    setLoading(true)
    try {
      const res = await confirmRsvp(rsvpForm.eventId, { name: rsvpForm.name, email: rsvpForm.email })
      setMsg(`Registrace potvrzena! Tvůj token: ${res.token}`)
      setRsvpForm({ eventId: null, name: '', email: '' })
    } catch (err) {
      setMsg(`Chyba: ${err.response?.data?.detail || 'Nepodařilo se zaregistrovat.'}`)
    } finally {
      setLoading(false)
    }
  }

  const upcoming = events.filter(e => !e.archived)
  const archived = events.filter(e => e.archived)

  return (
    <div>
      <h1 style={{ color: '#1a1a2e', marginTop: 0, marginBottom: '1.5rem', fontSize: '2rem' }}>Nadcházející akce</h1>

      {msg && (
        <p style={{
          background: msg.startsWith('Chyba') ? '#fef2f2' : '#f0fdf4',
          border: `1px solid ${msg.startsWith('Chyba') ? '#fca5a5' : '#86efac'}`,
          padding: '0.75rem 1rem', borderRadius: 8, marginBottom: '1rem',
        }}>
          {msg}
        </p>
      )}

      {upcoming.length === 0 && (
        <p style={{ color: '#6b7280' }}>Žádné akce zatím nejsou. Brzy něco chystáme!</p>
      )}

      {upcoming.map(ev => (
        <div key={ev.id} style={card}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', marginBottom: '0.5rem', flexWrap: 'wrap' }}>
            <h2 style={{ margin: 0, color: '#111827', fontSize: '1.2rem' }}>{ev.title}</h2>
            {ev.event_type && <TypeBadge type={ev.event_type} />}
          </div>
          <p style={{ color: '#6b7280', margin: '0 0 0.5rem', fontSize: '0.9rem' }}>
            📅 {ev.date}
            {ev.location_name && <> &nbsp;|&nbsp; 📍 {ev.location_name}</>}
            {ev.capacity != null && <> &nbsp;|&nbsp; 👥 Kapacita: {ev.capacity}</>}
          </p>
          {ev.description && <p style={{ margin: '0 0 1rem', color: '#374151' }}>{ev.description}</p>}

          {rsvpForm.eventId === ev.id ? (
            <form onSubmit={submitRsvp} style={{ display: 'flex', gap: '0.5rem', flexWrap: 'wrap', alignItems: 'center' }}>
              <input
                placeholder="Jméno" required value={rsvpForm.name}
                onChange={e => setRsvpForm(f => ({ ...f, name: e.target.value }))}
                style={inputStyle}
              />
              <input
                type="email" placeholder="Email" required value={rsvpForm.email}
                onChange={e => setRsvpForm(f => ({ ...f, email: e.target.value }))}
                style={inputStyle}
              />
              <button type="submit" disabled={loading} style={{ background: ACCENT, color: '#fff', border: 'none', padding: '0.4rem 1rem', borderRadius: 6, cursor: loading ? 'not-allowed' : 'pointer', opacity: loading ? 0.7 : 1 }}>
                {loading ? 'Odesílám...' : 'Potvrdit'}
              </button>
              <button type="button" onClick={() => setRsvpForm({ eventId: null, name: '', email: '' })}
                style={{ background: '#f3f4f6', border: 'none', padding: '0.4rem 1rem', borderRadius: 6, cursor: 'pointer' }}>
                Zrušit
              </button>
            </form>
          ) : (
            <button onClick={() => setRsvpForm(f => ({ ...f, eventId: ev.id }))}
              style={{ background: ACCENT, color: '#fff', border: 'none', padding: '0.5rem 1.2rem', borderRadius: 6, cursor: 'pointer', fontWeight: 600 }}>
              Přihlásit se
            </button>
          )}
        </div>
      ))}

      {archived.length > 0 && (
        <>
          <h2 style={{ color: '#6b7280', marginTop: '2.5rem', fontSize: '1.2rem' }}>Archiv proběhlých akcí</h2>
          {archived.map(ev => (
            <div key={ev.id} style={{ ...card, opacity: 0.65 }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem', flexWrap: 'wrap' }}>
                <h3 style={{ margin: 0, color: '#374151' }}>{ev.title}</h3>
                {ev.event_type && <TypeBadge type={ev.event_type} />}
              </div>
              <p style={{ color: '#9ca3af', margin: '0.3rem 0 0', fontSize: '0.88rem' }}>
                📅 {ev.date}
                {ev.location_name && <> &nbsp;|&nbsp; 📍 {ev.location_name}</>}
              </p>
            </div>
          ))}
        </>
      )}
    </div>
  )
}
