import { useEffect, useState } from 'react'
import { getEvents, getEventProgram } from '../api'

const ACCENT = '#e94560'

const card = {
  border: '1px solid #e5e7eb', borderRadius: 8, padding: '1.1rem',
  marginBottom: '0.75rem', background: '#fff', boxShadow: '0 1px 4px rgba(0,0,0,0.05)',
}

export default function Program() {
  const [items, setItems] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    setLoading(true)
    getEvents()
      .then(async events => {
        const all = []
        for (const ev of events) {
          try {
            const prog = await getEventProgram(ev.id)
            const list = Array.isArray(prog) ? prog : (prog.items || [])
            list.forEach(item => all.push({ ...item, event_title: ev.title, event_date: ev.date }))
          } catch (_) {}
        }
        setItems(all)
      })
      .catch(() => {})
      .finally(() => setLoading(false))
  }, [])

  if (loading) return <p style={{ color: '#6b7280' }}>Načítám program...</p>

  return (
    <div>
      <h1 style={{ color: '#1a1a2e', marginTop: 0, fontSize: '2rem' }}>Program akcí</h1>
      <p style={{ color: '#6b7280', marginBottom: '1.5rem' }}>
        Přednášky, ukázky a prezentace ze všech akcí DroneBrno.
      </p>

      {items.length === 0 && (
        <p style={{ color: '#9ca3af' }}>Program zatím není k dispozici.</p>
      )}

      {items.map((item, i) => (
        <div key={item.id ?? i} style={card}>
          <h2 style={{ margin: '0 0 0.4rem', color: '#111827', fontSize: '1.1rem' }}>{item.title}</h2>

          {item.description && (
            <p style={{ color: '#374151', margin: '0 0 0.5rem', lineHeight: 1.6 }}>{item.description}</p>
          )}

          <div style={{ display: 'flex', flexWrap: 'wrap', gap: '1rem', color: '#9ca3af', fontSize: '0.83rem' }}>
            {item.duration_minutes && <span>⏱ {item.duration_minutes} min</span>}
            {item.pilot_name && (
              <span>🧑‍✈️ <span style={{ color: ACCENT, fontWeight: 600 }}>{item.pilot_name}</span></span>
            )}
            {item.event_title && <span>📅 {item.event_title}{item.event_date ? ` (${item.event_date})` : ''}</span>}
          </div>
        </div>
      ))}
    </div>
  )
}
