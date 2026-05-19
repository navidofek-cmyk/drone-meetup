import { useState } from 'react'
import { submitCff } from '../api'

const ACCENT = '#e94560'
const DARK = '#1a1a2e'

const inputStyle = {
  display: 'block', width: '100%', padding: '0.5rem 0.75rem',
  border: '1px solid #d1d5db', borderRadius: 6, fontSize: '1rem',
  marginTop: '0.3rem', boxSizing: 'border-box', outline: 'none',
}

const LICENSE_OPTIONS = [
  { value: '', label: '-- Vyberte licenci --' },
  { value: 'A1/A3', label: 'A1/A3 – rekreační létání' },
  { value: 'A2', label: 'A2 – v blízkosti osob' },
  { value: 'STS', label: 'STS – standardní scénáře' },
  { value: 'BVLOS', label: 'BVLOS – mimo dohled' },
  { value: 'žádná', label: 'Nemám licenci (zatím)' },
]

export default function Cff() {
  const [form, setForm] = useState({
    name: '',
    email: '',
    pilot_description: '',
    drone_type: '',
    license_type: '',
  })
  const [msg, setMsg] = useState('')
  const [loading, setLoading] = useState(false)

  const set = (k) => (e) => setForm(f => ({ ...f, [k]: e.target.value }))

  const submit = async (e) => {
    e.preventDefault()
    setLoading(true)
    setMsg('')
    try {
      await submitCff(form)
      setMsg('ok')
      setForm({ name: '', email: '', pilot_description: '', drone_type: '', license_type: '' })
    } catch (err) {
      setMsg(`err:${err.response?.data?.detail || 'Chyba při odesílání.'}`)
    } finally {
      setLoading(false)
    }
  }

  return (
    <div style={{ maxWidth: 600 }}>
      <h1 style={{ color: DARK, marginTop: 0, fontSize: '2rem' }}>Call for Flyers</h1>
      <p style={{ color: '#374151', marginBottom: '1.5rem', lineHeight: 1.7 }}>
        Chceš předvést svůj dron na akci DroneBrno? Vyplň přihlášku a my se ti ozveme!
        Uvítáme piloty všech úrovní — od začátečníků po závodní as.
      </p>

      {msg === 'ok' && (
        <div style={{ background: '#f0fdf4', border: '1px solid #86efac', padding: '0.9rem 1rem', borderRadius: 8, marginBottom: '1.2rem' }}>
          Přihláška byla odeslána! Ozveme se ti co nejdříve na zadaný e-mail.
        </div>
      )}
      {msg.startsWith('err:') && (
        <div style={{ background: '#fef2f2', border: '1px solid #fca5a5', padding: '0.9rem 1rem', borderRadius: 8, marginBottom: '1.2rem', color: '#991b1b' }}>
          {msg.slice(4)}
        </div>
      )}

      <form onSubmit={submit} style={{ background: '#fff', borderRadius: 12, padding: '1.5rem', boxShadow: '0 2px 8px rgba(0,0,0,0.07)', border: '1px solid #e5e7eb' }}>
        <div style={{ marginBottom: '1rem' }}>
          <label style={{ fontWeight: 600, color: '#374151' }}>
            Jméno a příjmení *
            <input type="text" required value={form.name} onChange={set('name')} style={inputStyle} placeholder="Jan Novák" />
          </label>
        </div>

        <div style={{ marginBottom: '1rem' }}>
          <label style={{ fontWeight: 600, color: '#374151' }}>
            E-mail *
            <input type="email" required value={form.email} onChange={set('email')} style={inputStyle} placeholder="jan@example.cz" />
          </label>
        </div>

        <div style={{ marginBottom: '1rem' }}>
          <label style={{ fontWeight: 600, color: '#374151' }}>
            Typ dronu *
            <input type="text" required value={form.drone_type} onChange={set('drone_type')} style={inputStyle} placeholder="DJI Mini 4 Pro, závodní FPV, freestyle, ..." />
          </label>
        </div>

        <div style={{ marginBottom: '1rem' }}>
          <label style={{ fontWeight: 600, color: '#374151' }}>
            Typ licence *
            <select required value={form.license_type} onChange={set('license_type')} style={inputStyle}>
              {LICENSE_OPTIONS.map(o => (
                <option key={o.value} value={o.value}>{o.label}</option>
              ))}
            </select>
          </label>
        </div>

        <div style={{ marginBottom: '1.5rem' }}>
          <label style={{ fontWeight: 600, color: '#374151' }}>
            Představ se — co umíš, co chceš ukázat? *
            <textarea
              required rows={4}
              value={form.pilot_description}
              onChange={set('pilot_description')}
              style={{ ...inputStyle, resize: 'vertical' }}
              placeholder="Létat začínám, nebo létám 5 let. Rád ukážu FPV racing / freestyle / fotografii ze vzduchu..."
            />
          </label>
        </div>

        <button
          type="submit" disabled={loading}
          style={{
            background: ACCENT, color: '#fff', border: 'none',
            padding: '0.65rem 1.8rem', borderRadius: 6, fontSize: '1rem',
            fontWeight: 700, cursor: loading ? 'not-allowed' : 'pointer',
            opacity: loading ? 0.7 : 1, transition: 'opacity 0.15s',
          }}
        >
          {loading ? 'Odesílám...' : 'Odeslat přihlášku'}
        </button>
      </form>
    </div>
  )
}
