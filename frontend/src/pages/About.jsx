const ACCENT = '#e94560'
const DARK = '#1a1a2e'

export default function About() {
  return (
    <div style={{ maxWidth: 760 }}>
      <h1 style={{ color: DARK, marginTop: 0, fontSize: '2rem' }}>O nás</h1>

      <p style={{ fontSize: '1.1rem', lineHeight: 1.8, color: '#374151', marginBottom: '1rem' }}>
        <strong>DroneBrno</strong> je neformální komunita dronových nadšenců z Brna a okolí.
        Scházíme se pravidelně, sdílíme zkušenosti, pořádáme fly-iny, workshopy a závodní setkání.
      </p>

      <p style={{ lineHeight: 1.8, color: '#374151', marginBottom: '1.5rem' }}>
        Naše akce jsou otevřené všem — od úplných začátečníků, kteří teprve rozbalují svůj první dron,
        po zkušené závodní piloty a profesionály v letecké fotografii.
      </p>

      <h2 style={{ color: DARK, fontSize: '1.3rem', marginBottom: '0.75rem' }}>Co nabízíme</h2>
      <ul style={{ lineHeight: 2.2, color: '#374151', paddingLeft: '1.2rem' }}>
        <li>🚁 Fly-iny na prověřených lokalitách v okolí Brna</li>
        <li>🎤 Přednášky a workshopy o dronových technologiích</li>
        <li>🏁 Závodní setkání — FPV racing a freestyle</li>
        <li>📸 Setkání fotodronistů a videografů</li>
        <li>🤝 Networking a sdílení know-how</li>
        <li>📢 Call for Flyers — zapoj se jako pilot nebo přednášející</li>
      </ul>

      <h2 style={{ color: DARK, fontSize: '1.3rem', marginTop: '2rem', marginBottom: '0.75rem' }}>Bezpečnostní pravidla</h2>
      <p style={{ lineHeight: 1.8, color: '#374151', marginBottom: '0.75rem' }}>
        Bezpečnost je u nás na prvním místě. Všichni piloti jsou povinni dodržovat platnou českou
        a evropskou legislativu pro provoz bezpilotních letadel.
        Létáme vždy v souladu s předpisy <strong>ÚCL (Úřad pro civilní letectví)</strong> a nařízením EU 2019/947.
      </p>
      <p style={{ marginBottom: '1.5rem' }}>
        <a
          href="https://www.ucl.cz/drony"
          target="_blank" rel="noreferrer"
          style={{ color: ACCENT, fontWeight: 700, textDecoration: 'none' }}
        >
          Pravidla pro drony — UCL.cz →
        </a>
      </p>

      <h2 style={{ color: DARK, fontSize: '1.3rem', marginTop: '2rem', marginBottom: '0.75rem' }}>Kontakt</h2>
      <p style={{ color: '#374151', lineHeight: 1.8 }}>
        Najdete nás na sociálních sítích, nebo se přihlaste přes formulář{' '}
        <a href="/cff" style={{ color: ACCENT, fontWeight: 600, textDecoration: 'none' }}>Call for Flyers</a>.
        Rádi přivítáme každého nadšence do světa dronů!
      </p>
    </div>
  )
}
