import { useEffect, useState } from 'react'
import { useParams, Link } from 'react-router-dom'
import { getLocation } from '../api'

const ACCENT = '#e94560'

const card = {
  border: '1px solid #e5e7eb', borderRadius: 8, padding: '1rem',
  marginBottom: '0.75rem', background: '#fff', boxShadow: '0 1px 4px rgba(0,0,0,0.05)',
}

export default function LocationDetail() {
  const { slug } = useParams()
  const [loc, setLoc] = useState(null)
  const [error, setError] = useState('')

  useEffect(() => {
    getLocation(slug).then(setLoc).catch(() => setError('Místo nebylo nalezeno.'))
  }, [slug])

  if (error) return (
    <div>
      <Link to="/locations" style={{ color: ACCENT, textDecoration: 'none' }}>← Zpět na místa</Link>
      <p style={{ color: '#ef4444', marginTop: '1rem' }}>{error}</p>
    </div>
  )
  if (!loc) return <p style={{ color: '#6b7280' }}>Načítám...</p>

  const upcoming = (loc.events || []).filter(e => !e.archived)
  const past = (loc.events || []).filter(e => e.archived)

  return (
    <div>
      <Link to="/locations" style={{ color: ACCENT, textDecoration: 'none', fontWeight: 600 }}>← Zpět na místa</Link>

      <div style={{ background: '#fff', borderRadius: 12, padding: '1.5rem 2rem', marginTop: '1.5rem', boxShadow: '0 2px 8px rgba(0,0,0,0.08)', border: '1px solid #e5e7eb' }}>
        <div style={{ fontSize: '2.5rem', marginBottom: '0.5rem' }}>🗺️</div>
        <h1 style={{ margin: '0 0 0.5rem', color: '#1a1a2e', fontSize: '1.8rem' }}>{loc.name}</h1>

        <div style={{ display: 'flex', flexWrap: 'wrap', gap: '1.5rem', color: '#6b7280', fontSize: '0.92rem', marginTop: '0.75rem' }}>
          {loc.city && <span>📍 <strong>Město:</strong> {loc.city}</span>}
          {loc.surface_type && <span>🛬 <strong>Povrch:</strong> {loc.surface_type}</span>}
          {(loc.gps_lat != null && loc.gps_lng != null) && (
            <span>
              🌐 <strong>GPS:</strong>{' '}
              <a
                href={`https://maps.google.com/?q=${loc.gps_lat},${loc.gps_lng}`}
                target="_blank" rel="noreferrer"
                style={{ color: ACCENT }}
              >
                {Number(loc.gps_lat).toFixed(5)}, {Number(loc.gps_lng).toFixed(5)}
              </a>
            </span>
          )}
        </div>

        {loc.description && (
          <p style={{ color: '#374151', marginTop: '1rem', lineHeight: 1.7 }}>{loc.description}</p>
        )}
      </div>

      {upcoming.length > 0 && (
        <>
          <h2 style={{ color: '#1a1a2e', marginTop: '2rem', fontSize: '1.3rem' }}>Nadcházející akce na tomto místě</h2>
          {upcoming.map(ev => (
            <div key={ev.id} style={card}>
              <h3 style={{ margin: '0 0 0.25rem', color: '#111827' }}>{ev.title}</h3>
              <p style={{ color: '#6b7280', margin: 0, fontSize: '0.88rem' }}>📅 {ev.date}</p>
            </div>
          ))}
        </>
      )}

      {past.length > 0 && (
        <>
          <h2 style={{ color: '#6b7280', marginTop: '2rem', fontSize: '1.1rem' }}>Proběhlé akce</h2>
          {past.map(ev => (
            <div key={ev.id} style={{ ...card, opacity: 0.6 }}>
              <h3 style={{ margin: '0 0 0.25rem', color: '#374151' }}>{ev.title}</h3>
              <p style={{ color: '#9ca3af', margin: 0, fontSize: '0.85rem' }}>📅 {ev.date}</p>
            </div>
          ))}
        </>
      )}

      {(loc.events || []).length === 0 && (
        <p style={{ color: '#9ca3af', marginTop: '1.5rem' }}>Na tomto místě zatím žádné akce nejsou.</p>
      )}
    </div>
  )
}
