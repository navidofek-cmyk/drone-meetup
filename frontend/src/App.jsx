import { Routes, Route, Link, NavLink } from 'react-router-dom'
import Home from './pages/Home'
import Locations from './pages/Locations'
import LocationDetail from './pages/LocationDetail'
import Pilots from './pages/Pilots'
import PilotDetail from './pages/PilotDetail'
import Program from './pages/Program'
import Cff from './pages/Cff'
import About from './pages/About'

const DARK = '#1a1a2e'
const ACCENT = '#e94560'

const nav = [
  ['/', 'Akce'],
  ['/locations', 'Místa'],
  ['/pilots', 'Piloti'],
  ['/program', 'Program'],
  ['/cff', 'Call for Flyers'],
  ['/about', 'O nás'],
]

export default function App() {
  return (
    <div style={{ fontFamily: 'system-ui, sans-serif', minHeight: '100vh', background: '#f5f6fa' }}>
      <header style={{ background: DARK, padding: '0 1.5rem', boxShadow: '0 2px 8px rgba(0,0,0,0.3)' }}>
        <div style={{ maxWidth: 1100, margin: '0 auto', display: 'flex', alignItems: 'center', gap: '2rem', height: 60 }}>
          <Link to="/" style={{ fontSize: '1.4rem', fontWeight: 700, color: '#fff', textDecoration: 'none', flexShrink: 0 }}>
            <span style={{ color: ACCENT }}>🚁</span> DroneBrno
          </Link>
          <nav style={{ display: 'flex', gap: '0.2rem', flexWrap: 'wrap' }}>
            {nav.map(([to, label]) => (
              <NavLink
                key={to}
                to={to}
                end={to === '/'}
                style={({ isActive }) => ({
                  color: isActive ? ACCENT : '#cbd5e1',
                  textDecoration: 'none',
                  fontWeight: isActive ? 600 : 400,
                  padding: '0.3rem 0.75rem',
                  borderRadius: 4,
                  fontSize: '0.92rem',
                  background: isActive ? 'rgba(233,69,96,0.12)' : 'transparent',
                  transition: 'background 0.15s',
                })}
              >
                {label}
              </NavLink>
            ))}
          </nav>
        </div>
      </header>

      <main style={{ maxWidth: 1100, margin: '0 auto', padding: '2rem 1.5rem' }}>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/locations" element={<Locations />} />
          <Route path="/locations/:slug" element={<LocationDetail />} />
          <Route path="/pilots" element={<Pilots />} />
          <Route path="/pilots/:slug" element={<PilotDetail />} />
          <Route path="/program" element={<Program />} />
          <Route path="/cff" element={<Cff />} />
          <Route path="/about" element={<About />} />
        </Routes>
      </main>

      <footer style={{ background: DARK, color: '#94a3b8', padding: '1rem 1.5rem', marginTop: '3rem', textAlign: 'center', fontSize: '0.85rem' }}>
        DroneBrno &copy; 2025 &mdash; Komunita dronových nadšenců v Brně &nbsp;🚁
      </footer>
    </div>
  )
}
