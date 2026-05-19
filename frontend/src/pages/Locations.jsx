import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { getLocations } from '../api'

const ACCENT = '#e94560'

export default function Locations() {
  const [locations, setLocations] = useState([])

  useEffect(() => { getLocations().then(setLocations).catch(() => {}) }, [])

  return (
    <div>
      <h1 style={{ color: '#1a1a2e', marginTop: 0, fontSize: '2rem' }}>Místa létání</h1>
      {locations.length === 0 && <p style={{ color: '#6b7280' }}>Žádná místa zatím nejsou k dispozici.</p>}

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))', gap: '1rem' }}>
        {locations.map(loc => (
          <Link key={loc.id ?? loc.slug} to={`/locations/${loc.slug}`} style={{ textDecoration: 'none' }}>
            <div
              style={{
                border: '1px solid #e5e7eb', borderRadius: 10, padding: '1.2rem',
                background: '#fff', boxShadow: '0 1px 4px rgba(0,0,0,0.06)',
                transition: 'box-shadow 0.15s, transform 0.15s', cursor: 'pointer',
              }}
              onMouseEnter={e => { e.currentTarget.style.boxShadow = '0 4px 16px rgba(0,0,0,0.12)'; e.currentTarget.style.transform = 'translateY(-2px)' }}
              onMouseLeave={e => { e.currentTarget.style.boxShadow = '0 1px 4px rgba(0,0,0,0.06)'; e.currentTarget.style.transform = 'none' }}
            >
              <div style={{ fontSize: '2rem', marginBottom: '0.5rem' }}>🗺️</div>
              <h2 style={{ margin: '0 0 0.4rem', color: '#111827', fontSize: '1.1rem' }}>{loc.name}</h2>

              {loc.city && (
                <p style={{ margin: '0 0 0.3rem', color: '#6b7280', fontSize: '0.88rem' }}>
                  📍 {loc.city}
                </p>
              )}

              {(loc.gps_lat != null && loc.gps_lng != null) && (
                <p style={{ margin: '0 0 0.3rem', color: '#9ca3af', fontSize: '0.8rem', fontFamily: 'monospace' }}>
                  {Number(loc.gps_lat).toFixed(5)}, {Number(loc.gps_lng).toFixed(5)}
                </p>
              )}

              {loc.surface_type && (
                <span style={{
                  display: 'inline-block', marginTop: '0.4rem',
                  background: '#f3f4f6', color: '#374151',
                  borderRadius: 20, padding: '2px 10px', fontSize: '0.78rem', fontWeight: 600,
                }}>
                  {loc.surface_type}
                </span>
              )}

              <p style={{ margin: '0.6rem 0 0', color: ACCENT, fontSize: '0.85rem', fontWeight: 600 }}>
                Zobrazit detail →
              </p>
            </div>
          </Link>
        ))}
      </div>
    </div>
  )
}
