import React from 'react'
import { createRoot } from 'react-dom/client'
import { SplashScreen, PoweredByAud, fonts } from '@aud/brand'

// The three IVY dashboards, with the accent each app actually uses.
const APPS: Record<string, { title: string; accent: string; eyebrow: string; statement: string; foot: string; subtitle: string }> = {
  cleaning: {
    title: 'Cleaning Costs',
    accent: '#C8A84B', // brass
    eyebrow: 'IVY · Cleaning',
    statement: 'Every invoice, every venue — one clean number.',
    foot: 'Cost intelligence for cleaning contracts',
    subtitle: 'Sign in to SharePoint to load invoice data',
  },
  compliance: {
    title: 'Precinct Compliance',
    accent: '#3FBFB0', // ivy teal
    eyebrow: 'IVY · Compliance',
    statement: 'Precinct compliance, current to the minute.',
    foot: 'AusComply checklist analytics',
    subtitle: 'Sign in to SharePoint to load compliance data',
  },
  security: {
    title: 'Security Costs',
    accent: '#5A6B93', // security indigo
    eyebrow: 'IVY · Security',
    statement: 'Every cost, roster and audit on one floor.',
    foot: 'Budget · roster · invoices',
    subtitle: 'Sign in to SharePoint to load budget, roster and invoice data',
  },
}

/** The Microsoft 4-square glyph. */
const MsLogo = () => (
  <span style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gridTemplateRows: '1fr 1fr', gap: 1.5, width: 15, height: 15 }}>
    <span style={{ background: '#F25022' }} />
    <span style={{ background: '#7FBA00' }} />
    <span style={{ background: '#00A4EF' }} />
    <span style={{ background: '#FFB900' }} />
  </span>
)

/** Restrained hairline lettermark — replaces the solid accent tile. */
const Mark = ({ accent }: { accent: string }) => (
  <div
    style={{
      width: 46,
      height: 46,
      borderRadius: 13,
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      border: `1.5px solid ${accent}`,
      background: `color-mix(in srgb, ${accent} 12%, transparent)`,
      color: '#F2F0EB',
      fontFamily: fonts.heading,
      fontWeight: 700,
      fontSize: 15,
      letterSpacing: '0.08em',
    }}
  >
    IVY
  </div>
)

const q = new URLSearchParams(location.search)
const appKey = q.get('app') || 'cleaning'
// Optional image: drop a file in showcase/public and pass ?img=/your.jpg
const img = q.get('img') || undefined
// Optional crop focal point, e.g. ?imgpos=60%25 center  (URL-encoded)
const imgpos = q.get('imgpos') || 'center'

const a = APPS[appKey] ?? APPS.cleaning

createRoot(document.getElementById('root')!).render(
  <SplashScreen
    layout="split"
    theme="dark"
    accent={a.accent}
    mark={<Mark accent={a.accent} />}
    title={a.title}
    subtitle={a.subtitle}
    primary={{ label: 'Sign in with Microsoft', icon: <MsLogo /> }}
    brandPanel={{
      image: img,
      imagePosition: imgpos,
      statement: a.statement,
    }}
    footer={<PoweredByAud accent={a.accent} />}
  />,
)
