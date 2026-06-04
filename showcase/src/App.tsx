import { useState } from 'react'
import type { CSSProperties, ReactNode } from 'react'
import {
  AudMark,
  PoweredByAud,
  AuditorWordmark,
  SplashScreen,
  accents,
  neutrals,
  fonts,
} from '@aud/brand'

/** Set --aud-accent on a container; everything inside (the mark, the badge) follows. */
const accentVar = (hex: string): CSSProperties =>
  ({ ['--aud-accent']: hex } as CSSProperties)

const FAMILY = [
  { app: 'App 01', name: 'Brass', hex: accents.brass, code: 'APP 01' },
  { app: 'App 02', name: 'Clay', hex: accents.clay, code: 'APP 02' },
  { app: 'App 03', name: 'Steel', hex: accents.steel, code: 'APP 03' },
  { app: 'App 04', name: 'Sage', hex: accents.sage, code: 'APP 04' },
  { app: 'App 05', name: 'Eucalypt', hex: accents.eucalypt, code: 'APP 05' },
]

const NEUTRALS = [
  { label: 'Ground', hex: neutrals.light.ground },
  { label: 'Surface', hex: neutrals.light.surface },
  { label: 'Ink', hex: neutrals.light.ink },
  { label: 'Mid', hex: neutrals.light.mid },
  { label: 'Rule', hex: neutrals.light.rule },
  { label: 'Dark Gnd', hex: neutrals.dark.ground },
]

export function App() {
  const [dark, setDark] = useState(false)

  const toggle = () => {
    const next = !dark
    setDark(next)
    document.documentElement.setAttribute('data-theme', next ? 'dark' : 'light')
  }

  return (
    <div className="page">
      {/* ── masthead ─────────────────────────────────────────── */}
      <header className="masthead">
        <div>
          <span className="field">AuD Identity / Rev 04 — Living System</span>
          <h1>One Mark · One Style · Five Signals</h1>
          <p className="lede">
            The maker&rsquo;s mark for Aaron Durrant&rsquo;s operational app suite.
            Constant warm neutrals, one moving accent per app. Military-grade
            restraint: the system earns its character through discipline, not ornament.
          </p>
        </div>
        <div className="masthead-right">
          <AudMark style={{ fontSize: 40 }} />
          <button className="theme-toggle" onClick={toggle}>
            {dark ? 'Light' : 'Dark'} mode
          </button>
        </div>
      </header>

      {/* ── the mark, light + dark ───────────────────────────── */}
      <section className="section">
        <div className="section-label">The Mark — one colour rule, zero branching</div>
        <div className="mark-row">
          <div className="mark-panel on-light">
            <span className="field">On light · A/D = ink, u = accent</span>
            <AudMark className="mark-hero" />
            <div className="mark-scale">
              <AudMark style={{ fontSize: 40 }} />
              <AudMark style={{ fontSize: 24 }} />
              <AudMark style={{ fontSize: 14 }} />
            </div>
          </div>
          <div className="mark-panel on-dark">
            <span className="field">On dark · same component, currentColor adapts</span>
            <AudMark className="mark-hero" />
            <div className="mark-scale">
              <AudMark style={{ fontSize: 40 }} />
              <AudMark style={{ fontSize: 24 }} />
              <AudMark style={{ fontSize: 14 }} />
            </div>
          </div>
        </div>
      </section>

      {/* ── the family ───────────────────────────────────────── */}
      <section className="section">
        <div className="section-label">The Family — five apps, one accent each</div>
        <div className="family-grid">
          {FAMILY.map((f) => (
            <div className="card" key={f.name} style={accentVar(f.hex)}>
              <div className="card-top">
                <div>
                  <span className="field">{f.code}</span>
                  <div className="card-app">{f.app}</div>
                </div>
                <div className="card-accent">
                  <div className="chip" />
                  <span className="card-accent-name">{f.name}</span>
                  <span className="field" style={{ letterSpacing: 0 }}>{f.hex}</span>
                </div>
              </div>
              <AudMark className="card-hero" />
              <div className="card-demos">
                <div className="demo light">
                  <div className="demo-bar" />
                  <div className="demo-line" />
                  <div className="demo-line short" />
                  <div className="demo-foot"><PoweredByAud style={{ fontSize: 9 }} /></div>
                </div>
                <div className="demo dark">
                  <div className="demo-bar" />
                  <div className="demo-line" />
                  <div className="demo-line short" />
                  <div className="demo-foot"><PoweredByAud style={{ fontSize: 9 }} /></div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* ── AUDITOR wordmark ─────────────────────────────────── */}
      <section className="section">
        <div className="section-label">The AUDITOR Wordmark — login / splash, once per app</div>
        <div className="splash-row">
          <div className="splash light">
            <div className="splash-screen" style={accentVar(accents.brass)}>
              <span className="splash-client">Acme Group · Demo</span>
              <div className="splash-wm">
                <AuditorWordmark style={{ fontSize: 'clamp(38px, 9vw, 56px)' }} />
                <div className="splash-sub">Field Audit</div>
              </div>
              <div className="splash-foot"><PoweredByAud /></div>
            </div>
            <div className="splash-cap">Light · U + I in brass</div>
          </div>
          <div className="splash dark">
            <div className="splash-screen" style={accentVar(accents.brass)}>
              <span className="splash-client">Acme Group · Demo</span>
              <div className="splash-wm">
                <AuditorWordmark style={{ fontSize: 'clamp(38px, 9vw, 56px)' }} />
                <div className="splash-sub">Field Audit</div>
              </div>
              <div className="splash-foot"><PoweredByAud /></div>
            </div>
            <div className="splash-cap">Dark · same accent, currentColor flips</div>
          </div>
        </div>
      </section>

      {/* ── SplashScreen scaffold ────────────────────────────── */}
      <section className="section">
        <div className="section-label">The Splash — shared sign-in scaffold</div>
        <div className="splash-row">
          <div className="splash dark">
            <div style={{ borderRadius: 16, overflow: 'hidden', border: `1px solid ${neutrals.dark.rule}` }}>
              <SplashScreen
                style={{ minHeight: 460 }}
                theme="dark"
                accent={accents.steel}
                mark={<DemoTile hex={accents.steel}>IVY</DemoTile>}
                title="Precinct Compliance"
                subtitle="AusComply checklist analytics · IVY Precinct"
                primary={{ label: 'Sign in with Microsoft', icon: <MsLogo /> }}
                secondary={{ label: 'Continue with static data' }}
              />
            </div>
            <div className="splash-cap">Dark · steel · primary + secondary + footer</div>
          </div>
          <div className="splash light">
            <div style={{ borderRadius: 16, overflow: 'hidden', border: `1px solid ${neutrals.light.rule}` }}>
              <SplashScreen
                style={{ minHeight: 460 }}
                theme="light"
                accent={accents.brass}
                mark={<DemoTile hex={accents.brass}>A01</DemoTile>}
                title="Field Audit"
                subtitle="Quarterly venue compliance"
                primary={{ label: 'Sign in with Microsoft', icon: <MsLogo /> }}
              />
            </div>
            <div className="splash-cap">Light · brass · primary only · same component</div>
          </div>
        </div>
      </section>

      {/* ── colour ───────────────────────────────────────────── */}
      <section className="section">
        <div className="section-label">Colour — constant neutrals, one moving accent</div>
        <div className="subhead">Shared neutrals (the constant)</div>
        <div className="swatch-set">
          {NEUTRALS.map((n) => (
            <div className="swatch" key={n.label}>
              <div className="swatch-chip" style={{ background: n.hex }} />
              <div className="swatch-meta"><strong>{n.label}</strong>{n.hex}</div>
            </div>
          ))}
        </div>
        <div className="subhead">The five accents (the variable)</div>
        <div className="swatch-set">
          {FAMILY.map((f) => (
            <div className="swatch" key={f.name}>
              <div className="swatch-chip" style={{ background: f.hex }} />
              <div className="swatch-meta"><strong>{f.name}</strong>{f.hex}</div>
            </div>
          ))}
        </div>
      </section>

      {/* ── type ─────────────────────────────────────────────── */}
      <section className="section">
        <div className="section-label">Typography — the instrument-panel stack</div>
        <div className="type-row">
          <div className="type-tag">Bebas Neue · display / mark</div>
          <div className="type-display">AUDIT · 01 · 24</div>
        </div>
        <div className="type-row">
          <div className="type-tag">Barlow Condensed · UI headings</div>
          <div className="type-heading">Venue Compliance Review</div>
        </div>
        <div className="type-row">
          <div className="type-tag">Barlow · body</div>
          <p className="type-body">
            Running text and descriptions. The body face keeps the family coherent —
            comfortable to read, sentence case, with a ~1.5 line-height. Nothing showy.
          </p>
        </div>
        <div className="type-row">
          <div className="type-tag">Share Tech Mono · data / field markings</div>
          <div className="type-mono">REV 03 · ID 8842-A · 2026-06-01T06:14Z · POWERED BY</div>
        </div>
      </section>

      {/* ── footer ───────────────────────────────────────────── */}
      <footer className="foot">
        <span className="field field-wide">AuD · Built in Australia</span>
        <PoweredByAud />
      </footer>
    </div>
  )
}

function DemoTile({ children, hex }: { children: ReactNode; hex: string }) {
  return (
    <div
      style={{
        width: 56,
        height: 56,
        borderRadius: 16,
        background: hex,
        color: neutrals.dark.ground,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        fontFamily: fonts.heading,
        fontWeight: 700,
        fontSize: 18,
        letterSpacing: '0.02em',
      }}
    >
      {children}
    </div>
  )
}

function MsLogo() {
  return (
    <svg width="16" height="16" viewBox="0 0 23 23" aria-hidden="true">
      <rect x="1" y="1" width="10" height="10" fill="#F25022" />
      <rect x="12" y="1" width="10" height="10" fill="#7FBA00" />
      <rect x="1" y="12" width="10" height="10" fill="#00A4EF" />
      <rect x="12" y="12" width="10" height="10" fill="#FFB900" />
    </svg>
  )
}
