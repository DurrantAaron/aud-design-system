import { useState } from 'react'
import type { CSSProperties } from 'react'
import {
  AudMark,
  PoweredByAud,
  AuditorWordmark,
  SplashScreen,
  AppMark,
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

/** One app each: same tile, the accent + glyph are the only things that move. */
const APPS = [
  { name: 'Venue Audit', hex: accents.brass, Glyph: GlyphClipboard, note: 'brass' },
  { name: 'First Aid', hex: accents.clay, Glyph: GlyphCross, note: 'clay' },
  { name: 'Cleaning Audit', hex: accents.eucalypt, Glyph: GlyphSparkle, note: 'eucalypt' },
  { name: 'Precinct Ops', hex: accents.sage, Glyph: GlyphGauge, note: 'sage' },
  { name: 'Compliance', hex: accents.steel, Glyph: GlyphShield, note: 'steel' },
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

      {/* ── the app mark ─────────────────────────────────────── */}
      <section className="section">
        <div className="section-label">The App Mark — one tile, five glyphs</div>
        <p className="lede" style={{ marginBottom: 20 }}>
          Identical construction every time — same size, radius and glyph scale. Only the
          accent and the glyph move, so each app stays recognisable while the suite reads as
          one family. Each app supplies its own icon; the tile is system-owned.
        </p>
        {(['light', 'dark'] as const).map((mode) => (
          <div
            key={mode}
            style={{
              display: 'flex',
              flexWrap: 'wrap',
              gap: 28,
              padding: '24px 20px',
              marginBottom: 12,
              borderRadius: 12,
              background: neutrals[mode].ground,
              border: `1px solid ${neutrals[mode].rule}`,
            }}
          >
            {APPS.map(({ name, hex, Glyph, note }) => (
              <div
                key={name}
                style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 8, width: 92 }}
              >
                <AppMark accent={hex} theme={mode} label={name}>
                  <Glyph />
                </AppMark>
                <div
                  style={{
                    fontFamily: fonts.heading,
                    fontWeight: 600,
                    fontSize: 13,
                    textAlign: 'center',
                    color: neutrals[mode].ink,
                  }}
                >
                  {name}
                </div>
                <span
                  style={{
                    fontFamily: fonts.mono,
                    fontSize: 10,
                    textTransform: 'uppercase',
                    letterSpacing: '0.15em',
                    color: neutrals[mode].mid,
                  }}
                >
                  {note}
                </span>
              </div>
            ))}
          </div>
        ))}
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
                mark={<AppMark accent={accents.steel}><GlyphShield /></AppMark>}
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
                mark={<AppMark accent={accents.brass}><GlyphClipboard /></AppMark>}
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

/* ── per-app glyphs ──────────────────────────────────────────
   Stand-ins for each app's own icon (apps pass their own Lucide icon as the
   AppMark child). Drawn with currentColor; AppMark sizes the <svg>. */
function GlyphClipboard() {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
      <rect x="8" y="2" width="8" height="4" rx="1" />
      <path d="M16 4h2a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2H6a2 2 0 0 1-2-2V6a2 2 0 0 1 2-2h2" />
      <path d="m9 14 2 2 4-4" />
    </svg>
  )
}

function GlyphCross() {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
      <path d="M12 5v14M5 12h14" />
    </svg>
  )
}

function GlyphSparkle() {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
      <path d="M12 3c.5 3.5 1.5 4.5 5 5-3.5.5-4.5 1.5-5 5-.5-3.5-1.5-4.5-5-5 3.5-.5 4.5-1.5 5-5z" />
    </svg>
  )
}

function GlyphGauge() {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
      <path d="M12 13.5 18 8" />
      <path d="M3.5 18a9 9 0 1 1 17 0" />
    </svg>
  )
}

function GlyphShield() {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
      <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" />
      <path d="m9 12 2 2 4-4" />
    </svg>
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
