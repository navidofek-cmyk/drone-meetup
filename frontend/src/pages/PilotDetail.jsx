import { useEffect, useState } from 'react'
import { useParams, Link } from 'react-router-dom'
import { getPilot } from '../api'

const ACCENT = '#e94560'

const card = {
  border: '1px solid #e5e7eb', borderRadius: 8, padding: '1rem',
  marginBottom: '0.75rem', background: '#fff', boxShadow: '0 1px 4px rgba(0,0,0,0.05)',
}

export default function PilotDetail() {
  const { slug } = useParams()
  const [pilot, setPilot] = useState(null)
  const [error, setError] = useState('')

  useEffect(() => {
    getPilot(slug).then(setPilot).catch(() => setError('Pilot nebyl nalezen.'))
  }, [slug])

  if (error) return (
    <div>
      <Link to="/pilots" style={{ color: ACCENT, textDecoration: 'none' }}>← Zpět na piloty</Link>
      <p style={{ color: '#ef4444', marginTop: '1rem' }}>{error}</p>
    </div>
  )
  if (!pilot) return <p style={{ color: '#6b7280' }}>Načítám...</p>

  return (
    <div>
      <Link to="/pilots" style={{ color: ACCENT, textDecoration: 'none', fontWeight: 600 }}>← Zpět na piloty</Link>

      <div style={{ background: '#fff', borderRadius: 12, padding: '1.5rem 2rem', marginTop: '1.5rem', boxShadow: '0 2px 8px rgba(0,0,0,0.08)', border: '1px solid #e5e7eb' }}>
        <div style={{ display: 'flex', gap: '1.5rem', alignItems: 'flex-start', flexWrap: 'wrap' }}>
          <div style={{
            width: 90, height: 90, borderRadius: '50%', background: '#1a1a2e',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            fontSize: '2.2rem', flexShrink: 0,
          }}>
            {pilot.photo_url
              ? <img src={pilot.photo_url} alt={pilot.name} style={{ width: '100%', height: '100%', borderRadius: '50%', objectFit: 'cover' }} />
              : '🧑‍✈️'}
          </div>
          <div style={{ flex: 1, minWidth: 0 }}>
            <h1 style={{ margin: '0 0 0.5rem', color: '#1a1a2e', fontSize: '1.7rem' }}>{pilot.name}</h1>

            <div style={{ display: 'flex', flexWrap: 'wrap', gap: '1rem', color: '#6b7280', fontSize: '0.9rem', marginBottom: '0.75rem' }}>
              {pilot.license_type && (
                <span>
                  📋 <strong>Licence:</strong>{' '}
                  <span style={{ color: ACCENT, fontWeight: 700 }}>{pilot.license_type}</span>
                </span>
              )}
              {pilot.drone_types && (
                <span>
                  🚁 <strong>Drony:</strong>{' '}
                  {Array.isArray(pilot.drone_types) ? pilot.drone_types.join(', ') : pilot.drone_types}
                </span>
              )}
            </div>

            {pilot.bio && (
              <p style={{ color: '#374151', lineHeight: 1.7, margin: 0 }}>{pilot.bio}</p>
            )}
          </div>
        </div>
      </div>

      {pilot.program_items?.length > 0 && (
        <>
          <h2 style={{ color: '#1a1a2e', marginTop: '2rem', fontSize: '1.3rem' }}>Program a přednášky</h2>
          {pilot.program_items.map((item, i) => (
            <div key={item.id ?? i} style={card}>
              <h3 style={{ margin: '0 0 0.25rem', color: '#111827' }}>{item.title}</h3>
              {item.description && <p style={{ color: '#374151', margin: '0 0 0.4rem' }}>{item.description}</p>}
              <div style={{ display: 'flex', gap: '1rem', flexWrap: 'wrap', color: '#9ca3af', fontSize: '0.82rem' }}>
                {item.duration_minutes && <span>⏱ {item.duration_minutes} min</span>}
                {item.event_title && <span>📅 {item.event_title}</span>}
              </div>
            </div>
          ))}
        </>
      )}
    </div>
  )
}
