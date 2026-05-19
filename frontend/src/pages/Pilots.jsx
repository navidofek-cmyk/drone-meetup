import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { getPilots } from '../api'

const ACCENT = '#e94560'

const LICENSE_COLORS = {
  'A1/A3': { bg: '#d1fae5', color: '#065f46' },
  'A2':    { bg: '#dbeafe', color: '#1e40af' },
  'STS':   { bg: '#ede9fe', color: '#5b21b6' },
  'BVLOS': { bg: '#fee2e2', color: '#991b1b' },
}

function LicenseBadge({ license }) {
  const cfg = LICENSE_COLORS[license] || { bg: '#f3f4f6', color: '#374151' }
  return (
    <span style={{
      background: cfg.bg, color: cfg.color,
      borderRadius: 20, padding: '2px 9px',
      fontSize: '0.73rem', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.04em',
    }}>
      {license}
    </span>
  )
}

export default function Pilots() {
  const [pilots, setPilots] = useState([])

  useEffect(() => { getPilots().then(setPilots).catch(() => {}) }, [])

  return (
    <div>
      <h1 style={{ color: '#1a1a2e', marginTop: 0, fontSize: '2rem' }}>Piloti</h1>
      {pilots.length === 0 && <p style={{ color: '#6b7280' }}>Žádní piloti zatím nejsou k dispozici.</p>}

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(250px, 1fr))', gap: '1rem' }}>
        {pilots.map(p => (
          <Link key={p.id ?? p.slug} to={`/pilots/${p.slug}`} style={{ textDecoration: 'none' }}>
            <div
              style={{
                border: '1px solid #e5e7eb', borderRadius: 10, padding: '1.2rem',
                background: '#fff', boxShadow: '0 1px 4px rgba(0,0,0,0.06)',
                transition: 'box-shadow 0.15s, transform 0.15s', cursor: 'pointer',
              }}
              onMouseEnter={e => { e.currentTarget.style.boxShadow = '0 4px 16px rgba(0,0,0,0.12)'; e.currentTarget.style.transform = 'translateY(-2px)' }}
              onMouseLeave={e => { e.currentTarget.style.boxShadow = '0 1px 4px rgba(0,0,0,0.06)'; e.currentTarget.style.transform = 'none' }}
            >
              <div style={{
                width: 56, height: 56, borderRadius: '50%',
                background: '#1a1a2e', display: 'flex', alignItems: 'center',
                justifyContent: 'center', fontSize: '1.6rem', marginBottom: '0.75rem',
              }}>
                {p.photo_url
                  ? <img src={p.photo_url} alt={p.name} style={{ width: '100%', height: '100%', borderRadius: '50%', objectFit: 'cover' }} />
                  : '🧑‍✈️'}
              </div>

              <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', flexWrap: 'wrap', marginBottom: '0.4rem' }}>
                <h2 style={{ margin: 0, color: '#111827', fontSize: '1rem' }}>{p.name}</h2>
                {p.license_type && <LicenseBadge license={p.license_type} />}
              </div>

              {p.drone_types && (
                <p style={{ color: '#6b7280', fontSize: '0.83rem', margin: '0 0 0.5rem' }}>
                  🚁 {Array.isArray(p.drone_types) ? p.drone_types.join(', ') : p.drone_types}
                </p>
              )}

              {p.bio && (
                <p style={{ color: '#9ca3af', fontSize: '0.82rem', margin: 0 }}>
                  {p.bio.slice(0, 90)}{p.bio.length > 90 ? '…' : ''}
                </p>
              )}
            </div>
          </Link>
        ))}
      </div>
    </div>
  )
}
