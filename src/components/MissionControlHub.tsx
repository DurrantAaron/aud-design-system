import React, { useId, useLayoutEffect, useState } from 'react'
import type { FamilyKey } from '../families'

/**
 * One Google Fonts <link> for the mission-control shell. Space Grotesk is the
 * confident display grotesk for the suite title + app names; Space Mono is the
 * telemetry/monospace voice for status chrome, eyebrows and metrics. Injected
 * once per document (id-guarded) so mounting the hub never duplicates the link.
 */
const FONTS_LINK_ID = 'aud-mission-fonts'
const FONTS_HREF =
  'https://fonts.googleapis.com/css2?family=Space+Grotesk:wght@400;500;600;700&family=Space+Mono:wght@400;700&display=swap'

const DISPLAY_FONT = "'Space Grotesk', system-ui, sans-serif"
const MONO_FONT = "'Space Mono', ui-monospace, monospace"

function useFontsLink() {
  useLayoutEffect(() => {
    if (typeof document === 'undefined') return
    if (document.getElementById(FONTS_LINK_ID)) return
    const link = document.createElement('link')
    link.id = FONTS_LINK_ID
    link.rel = 'stylesheet'
    link.href = FONTS_HREF
    document.head.appendChild(link)
  }, [])
}

/* ============================================================
   INLINED GLYPHS — the 8 bespoke app marks, from
   /design-lab/glyphs/final/<id>.svg. Each draws with
   currentColor so the tile sets the colour. Keeping them in an
   internal id->SVG map keeps the hub fully self-contained: an
   app passes only the glyph `id` (matching its app id) and the
   hub renders the mark with no icon-library dependency.
   ============================================================ */
const GLYPHS: Record<string, string> = {
  'venue-audit':
    '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.75" stroke-linecap="round" stroke-linejoin="round"><path d="M9 5H7a2 2 0 0 0-2 2v12a2 2 0 0 0 2 2h10a2 2 0 0 0 2-2V7a2 2 0 0 0-2-2h-2"/><rect x="9" y="3.5" width="6" height="3" rx="1"/><path d="m8.5 13 2.5 2.5 4.5-5"/></svg>',
  'cleaning-audit':
    '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.75" stroke-linecap="round" stroke-linejoin="round"><path d="M12 3v8.5"/><path d="M8.5 11.5h7"/><path d="M12 11.5c-3.5 1.8-5.3 4.3-5.3 8.5"/><path d="M12 11.5c-1.4 2.6-1.8 5.3-1.6 8.5"/><path d="M12 11.5v8.5"/><path d="M12 11.5c1.4 2.6 1.8 5.3 1.6 8.5"/><path d="M12 11.5c3.5 1.8 5.3 4.3 5.3 8.5"/></svg>',
  'precinct-compliance':
    '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.75" stroke-linecap="round" stroke-linejoin="round"><path d="M12 3 5 5.5v6c0 4.4 2.9 7.6 7 9 4.1-1.4 7-4.6 7-9v-6L12 3Z"/><path d="m8.5 12 2.5 2.5 4.5-5"/></svg>',
  'cleaning-dashboard':
    '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.75" stroke-linecap="round" stroke-linejoin="round"><path d="M12 3.5c2.6 3 4.2 5.1 4.2 7.2a4.2 4.2 0 0 1-8.4 0c0-2.1 1.6-4.2 4.2-7.2Z"/><path d="M4 18.5h16"/><path d="M10.5 20.5 12 18.5l1.5 2"/></svg>',
  'first-aid-register':
    '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.75" stroke-linecap="round" stroke-linejoin="round"><rect x="4" y="4" width="16" height="16" rx="3.5"/><path d="M12 8.5v7M8.5 12h7"/></svg>',
  'headset-issuance':
    '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.75" stroke-linecap="round" stroke-linejoin="round"><path d="M4 14v-2a8 8 0 0 1 16 0v2"/><path d="M4 13.5h2a1 1 0 0 1 1 1V18a1 1 0 0 1-1 1H4Z"/><path d="M20 13.5h-2a1 1 0 0 0-1 1V18a1 1 0 0 0 1 1h2Z"/><path d="M18 19v1a2 2 0 0 1-2 2h-3.5"/><circle cx="11" cy="22" r="1" fill="currentColor" stroke="none"/></svg>',
  'security-tracker':
    '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.75" stroke-linecap="round" stroke-linejoin="round"><path d="M7 3.5v17"/><circle cx="7" cy="7" r="1" fill="currentColor" stroke="none"/><circle cx="7" cy="12" r="1" fill="currentColor" stroke="none"/><circle cx="7" cy="17" r="1" fill="currentColor" stroke="none"/><path d="M9 7h8"/><path d="M9 12h6"/><path d="M9 17h8"/></svg>',
  'control-log':
    '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.75" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="7"/><path d="M12 3v3"/><path d="M12 18v3"/><path d="M3 12h3"/><path d="M18 12h3"/><circle cx="12" cy="12" r="1" fill="currentColor" stroke="none"/></svg>',
}

/** A fallback mark for app ids without a bespoke glyph — a generic app square. */
const GLYPH_FALLBACK =
  '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.75" stroke-linecap="round" stroke-linejoin="round"><rect x="4" y="4" width="16" height="16" rx="4"/><path d="M9 12h6M12 9v6"/></svg>'

/** The forward arrow on an unlocked tile's launch affordance. */
const ARROW_SVG =
  '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round"><path d="M5 12h13M13 6l6 6-6 6"/></svg>'

/** The padlock on a locked tile. */
const LOCK_SVG =
  '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"><rect x="5" y="11" width="14" height="9" rx="2"/><path d="M8 11V7.5a4 4 0 0 1 8 0V11"/></svg>'

/** The shield-check used in the secure colophon. */
const SHIELD_SVG =
  '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.7" stroke-linecap="round" stroke-linejoin="round"><path d="M12 3l7 3v5c0 4.5-3 8-7 9-4-1-7-4.5-7-9V6l7-3Z"/><path d="m9 12 2 2 4-4"/></svg>'

/** The passcode keypad-lock used on the sign-in secondary action. */
const PASSCODE_SVG =
  '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.7" stroke-linecap="round" stroke-linejoin="round"><rect x="4" y="10.5" width="16" height="10" rx="2"/><path d="M8 10.5V7a4 4 0 0 1 8 0v3.5"/><circle cx="12" cy="15.5" r="1.4" fill="currentColor" stroke="none"/></svg>'

/** The four-square Microsoft mark for the sign-in primary action. */
const MS_SVG =
  '<svg viewBox="0 0 21 21" width="16" height="16" aria-hidden="true" style="display:block"><rect x="1" y="1" width="9" height="9" fill="#f25022"/><rect x="11" y="1" width="9" height="9" fill="#7fba00"/><rect x="1" y="11" width="9" height="9" fill="#00a4ef"/><rect x="11" y="11" width="9" height="9" fill="#ffb900"/></svg>'

/** Renders a raw SVG string inline (the inlined glyph map draws with currentColor). */
function Svg({ markup, className }: { markup: string; className?: string }) {
  return <span className={className} aria-hidden="true" dangerouslySetInnerHTML={{ __html: markup }} />
}

/* ============================================================
   FAMILY ACCENT MAP — the colour-coded OS. Each function family
   owns one hue, inlined from the verified prototype so the grid
   colour-codes without any external token import.
   ============================================================ */
interface FamilyAccent {
  c: string
  c2: string
  glow: string
  veil: string
}

const FAMILY_ACCENTS: Record<FamilyKey, FamilyAccent> = {
  audits: { c: '#E8B04B', c2: '#F6CE7E', glow: 'rgba(232,176,75,.42)', veil: 'rgba(232,176,75,.13)' },
  dashboards: { c: '#2DD4BF', c2: '#6EEFE0', glow: 'rgba(45,212,191,.42)', veil: 'rgba(45,212,191,.12)' },
  registers: { c: '#F0876A', c2: '#F8A98F', glow: 'rgba(240,135,106,.42)', veil: 'rgba(240,135,106,.13)' },
  logs: { c: '#5BD08A', c2: '#8BE3AE', glow: 'rgba(91,208,138,.42)', veil: 'rgba(91,208,138,.13)' },
}

/** Human labels for the family eyebrow on each tile + the legend. */
const FAMILY_LABEL: Record<FamilyKey, string> = {
  audits: 'Audits',
  dashboards: 'Dashboards',
  registers: 'Registers',
  logs: 'Logs',
}

/* ============================================================
   SHELL TOKENS — the mission-control dark frame (cool graphite),
   inlined from the prototype. Light is a quieter daylight frame
   on the same structure.
   ============================================================ */
interface ShellTokens {
  body: string
  os0: string
  os1: string
  os2: string
  os3: string
  hair: string
  hair2: string
  grid: string
  txt: string
  txt2: string
  txt3: string
  txt4: string
  acc: string
  acc2: string
  accDeep: string
  accGlow: string
  accVeil: string
  onAcc: string
  good: string
  tileFrom: string
  tileTo: string
  lockedFrom: string
  lockedTo: string
}

const SHELL: Record<'light' | 'dark', ShellTokens> = {
  dark: {
    body: '#04060A',
    os0: '#070A10',
    os1: '#0D1118',
    os2: '#141A23',
    os3: '#1C232E',
    hair: 'rgba(255,255,255,.06)',
    hair2: 'rgba(255,255,255,.11)',
    grid: 'rgba(120,180,255,.045)',
    txt: '#F2F5FA',
    txt2: '#9CA6B6',
    txt3: '#5E6878',
    txt4: '#3A4350',
    acc: '#2DD4BF',
    acc2: '#6EEFE0',
    accDeep: '#0E8C7E',
    accGlow: 'rgba(45,212,191,.5)',
    accVeil: 'rgba(45,212,191,.12)',
    onAcc: '#04110E',
    good: '#3DDC84',
    tileFrom: '#141A23',
    tileTo: '#0D1118',
    lockedFrom: '#0E121A',
    lockedTo: '#0A0E14',
  },
  light: {
    body: '#DDE3EC',
    os0: '#EEF1F6',
    os1: '#F6F8FB',
    os2: '#FFFFFF',
    os3: '#EDF1F7',
    hair: 'rgba(10,20,40,.08)',
    hair2: 'rgba(10,20,40,.14)',
    grid: 'rgba(40,90,160,.05)',
    txt: '#101720',
    txt2: '#4A5563',
    txt3: '#7E8794',
    txt4: '#A7AEB9',
    acc: '#0E9E8E',
    acc2: '#13B7A4',
    accDeep: '#0A7468',
    accGlow: 'rgba(14,158,142,.35)',
    accVeil: 'rgba(14,158,142,.10)',
    onAcc: '#F2FCFA',
    good: '#1AA85E',
    tileFrom: '#FFFFFF',
    tileTo: '#F4F7FB',
    lockedFrom: '#EDF0F5',
    lockedTo: '#E6EAF1',
  },
}

/* ============================================================
   PUBLIC API
   ============================================================ */

/** One app tile in the launcher grid. */
export interface MissionControlApp {
  /** App id — also the glyph key into the internal id->SVG map. */
  id: string
  /** Display name, e.g. "Venue Audit". */
  name: string
  /** Which function family colour-codes the tile. */
  family: FamilyKey
  /**
   * The metric line in the tile's footer, e.g. "87% pass", "38 out",
   * "1 flag". Omit for locked tiles (a status word is shown instead).
   */
  metric?: string
  /** Live apps show a pulsing "LIVE" pill instead of the metric. */
  live?: boolean
  /** Locked apps are role-gated: dimmed, padlocked, not launchable. */
  locked?: boolean
  /** Launch handler — fired on click for unlocked tiles. */
  onLaunch?: () => void
}

/** The live-ops summary numbers shown in the home strip. */
export interface MissionControlOps {
  /** e.g. "12/13" — venues currently live. */
  venuesLive?: string
  /** e.g. "1,482" — run events today. */
  runEvents?: string
  /** e.g. "3" — open flags needing attention. */
  openFlags?: string
}

export interface MissionControlHubProps
  extends Omit<React.HTMLAttributes<HTMLDivElement>, 'title'> {
  /** The suite title. The trailing word is accent-tinted. Default "AuD Operations Suite". */
  suiteName?: string
  /** The signed-in operator, shown after an avatar in the home header, e.g. "A. Durrant". */
  signedInAs?: string
  /** Sub-label after the operator name, e.g. "Operations". Default "Operations". */
  role?: string
  /** Live-ops summary numbers for the home strip. */
  ops?: MissionControlOps
  /** The apps to render in the launcher grid. */
  apps: MissionControlApp[]
  /** Neutral shell palette. Default "dark" (the mission-control frame). */
  theme?: 'light' | 'dark'
  /** Which view to render. Default "home". */
  view?: 'signin' | 'home'
  /** Sign-in primary action handler (Microsoft SSO). */
  onSignIn?: () => void
  /** Sign-in secondary action handler (suite passcode). */
  onPasscode?: () => void
}

/**
 * The mission-control "OS" hub — the suite front door.
 *
 * A dark control-room shell (engineering grid + faint telemetry + a breathing
 * accent aurora) carrying a shared OS status bar, and one of two views:
 *
 *  - `signin` — a centred emblem, suite title, and the SSO + passcode actions.
 *  - `home`   — the live launcher: a suite header with the signed-in operator,
 *               a live-ops summary strip with a streaming sparkline, and a
 *               colour-coded app grid (per-family hue, live pills, locked tiles).
 *
 * Self-contained: all styling is inline + one scoped `<style>` block (scoped via
 * `useId` so several hubs can coexist), the bespoke app glyphs are inlined into
 * an internal id->SVG map (drawing with `currentColor`), and the only external
 * dependency is the Google Fonts `<link>` (Space Grotesk + Space Mono) injected
 * once per document.
 *
 * ```tsx
 * <MissionControlHub
 *   view="home"
 *   suiteName="AuD Operations Suite"
 *   signedInAs="A. Durrant"
 *   ops={{ venuesLive: '12/13', runEvents: '1,482', openFlags: '3' }}
 *   apps={[
 *     { id: 'venue-audit', name: 'Venue Audit', family: 'audits', metric: '87% pass', onLaunch },
 *     { id: 'precinct-compliance', name: 'Precinct Compliance', family: 'dashboards', live: true, onLaunch },
 *     { id: 'first-aid-register', name: 'First Aid Register', family: 'registers', locked: true },
 *   ]}
 * />
 * ```
 */
export function MissionControlHub({
  suiteName = 'AuD Operations Suite',
  signedInAs,
  role = 'Operations',
  ops,
  apps,
  theme = 'dark',
  view = 'home',
  onSignIn,
  onPasscode,
  style,
  ...rest
}: MissionControlHubProps) {
  useFontsLink()

  const s = SHELL[theme]

  // A scope id so the (necessarily class-based) shell layers, tile hover states
  // and keyframes never leak between two hubs on the same page.
  const rawId = useId()
  const scope = `aud-mission-${rawId.replace(/[^a-zA-Z0-9_-]/g, '')}`

  // A live OS clock — settles to a real wall-clock time, ticking each minute.
  const [clock, setClock] = useState(() => formatClock(new Date()))
  useLayoutEffect(() => {
    const tick = () => setClock(formatClock(new Date()))
    tick()
    const t = window.setInterval(tick, 10000)
    return () => window.clearInterval(t)
  }, [])

  // CSS custom properties feed the scoped <style> rules.
  const vars = {
    '--os-0': s.os0,
    '--os-1': s.os1,
    '--os-2': s.os2,
    '--os-3': s.os3,
    '--hair': s.hair,
    '--hair-2': s.hair2,
    '--grid': s.grid,
    '--txt': s.txt,
    '--txt-2': s.txt2,
    '--txt-3': s.txt3,
    '--txt-4': s.txt4,
    '--acc': s.acc,
    '--acc-2': s.acc2,
    '--acc-deep': s.accDeep,
    '--acc-glow': s.accGlow,
    '--acc-veil': s.accVeil,
    '--on-acc': s.onAcc,
    '--good': s.good,
    '--tile-from': s.tileFrom,
    '--tile-to': s.tileTo,
    '--locked-from': s.lockedFrom,
    '--locked-to': s.lockedTo,
    '--aud': FAMILY_ACCENTS.audits.c,
    '--aud-2': FAMILY_ACCENTS.audits.c2,
    '--aud-glow': FAMILY_ACCENTS.audits.glow,
    '--aud-veil': FAMILY_ACCENTS.audits.veil,
    '--dsh': FAMILY_ACCENTS.dashboards.c,
    '--dsh-2': FAMILY_ACCENTS.dashboards.c2,
    '--dsh-glow': FAMILY_ACCENTS.dashboards.glow,
    '--dsh-veil': FAMILY_ACCENTS.dashboards.veil,
    '--reg': FAMILY_ACCENTS.registers.c,
    '--reg-2': FAMILY_ACCENTS.registers.c2,
    '--reg-glow': FAMILY_ACCENTS.registers.glow,
    '--reg-veil': FAMILY_ACCENTS.registers.veil,
    '--log': FAMILY_ACCENTS.logs.c,
    '--log-2': FAMILY_ACCENTS.logs.c2,
    '--log-glow': FAMILY_ACCENTS.logs.glow,
    '--log-veil': FAMILY_ACCENTS.logs.veil,
  } as React.CSSProperties

  // Split the suite title so the trailing word reads in the accent tint.
  const { head: titleHead, tail: titleTail } = splitTitle(suiteName)
  const avatar = initials(signedInAs)

  return (
    <div
      data-theme={theme}
      data-view={view}
      style={{
        ...vars,
        minHeight: '100vh',
        width: '100%',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        background: s.body,
        color: s.txt,
        fontFamily: DISPLAY_FONT,
        WebkitFontSmoothing: 'antialiased',
        ...style,
      }}
      {...rest}
    >
      <style>{scopedCss(scope)}</style>

      <div className={`${scope}-os`}>
        {/* LIVE OPS BACKDROP — engineering grid + faint telemetry tickers */}
        <div className={`${scope}-ops-bg`} aria-hidden="true">
          <div className={`${scope}-grid`} />
          <div className={`${scope}-ticker ${scope}-ticker-a`}>PRECINCT // 04 LIVE</div>
          <div className={`${scope}-ticker ${scope}-ticker-c`}>
            UPTIME 99.98% · {ops?.venuesLive ?? '—'} LIVE
          </div>
          <div className={`${scope}-ticker ${scope}-ticker-b`}>SYNC &uarr; 1.4k EV/MIN</div>
        </div>

        {/* STATUS BAR — shared OS chrome on every view */}
        <div className={`${scope}-statusbar`}>
          <span className={`${scope}-clock`}>{clock}</span>
          <span className={`${scope}-sysmark`}>
            <span className={`${scope}-sysmark-aud`}>
              A<b>u</b>D
            </span>{' '}
            &middot; OS
          </span>
          <span className={`${scope}-status-right`}>
            <span className={`${scope}-net`}>
              <span className={`${scope}-net-dot`} />
              ONLINE
            </span>
            <span className={`${scope}-glyphs`}>
              <i />
              <i />
              <i />
              <span className={`${scope}-batt`}>
                <span />
              </span>
            </span>
          </span>
        </div>

        {view === 'signin' ? (
          <SignInView
            scope={scope}
            titleHead={titleHead}
            titleTail={titleTail}
            onSignIn={onSignIn}
            onPasscode={onPasscode}
          />
        ) : (
          <HomeView
            scope={scope}
            titleHead={titleHead}
            titleTail={titleTail}
            signedInAs={signedInAs}
            role={role}
            avatar={avatar}
            ops={ops}
            apps={apps}
          />
        )}
      </div>
    </div>
  )
}

/* ============================================================
   HOME / LAUNCHER VIEW
   ============================================================ */
function HomeView({
  scope,
  titleHead,
  titleTail,
  signedInAs,
  role,
  avatar,
  ops,
  apps,
}: {
  scope: string
  titleHead: string
  titleTail: string
  signedInAs?: string
  role: string
  avatar: string
  ops?: MissionControlOps
  apps: MissionControlApp[]
}) {
  return (
    <div className={`${scope}-shell`}>
      {/* suite identity header */}
      <div className={`${scope}-suite-head`}>
        <div className={`${scope}-eyebrow`}>
          <span className={`${scope}-eyebrow-live`} />
          Precinct&nbsp;Ops · Suite&nbsp;OS
        </div>
        <h1 className={`${scope}-suite-title`}>
          {titleHead} <span className={`${scope}-os-mark`}>{titleTail}</span>
        </h1>
        {signedInAs && (
          <div className={`${scope}-who`}>
            <span className={`${scope}-av`}>{avatar}</span>
            Signed in as <b>{signedInAs}</b>
            {role ? ` · ${role}` : ''}
          </div>
        )}
      </div>

      {/* LIVE OPS SUMMARY strip */}
      {(ops?.venuesLive || ops?.runEvents || ops?.openFlags) && (
        <div className={`${scope}-opsbar`}>
          {ops?.venuesLive && (
            <div className={`${scope}-stat`}>
              <span className={`${scope}-k`}>Venues live</span>
              <span className={`${scope}-num ${scope}-num-acc`}>{splitVenues(ops.venuesLive)}</span>
            </div>
          )}
          {ops?.runEvents && (
            <div className={`${scope}-stat`}>
              <span className={`${scope}-k`}>Run events</span>
              <span className={`${scope}-num`}>{ops.runEvents}</span>
            </div>
          )}
          {ops?.openFlags && (
            <div className={`${scope}-stat ${scope}-stat-flag`}>
              <span className={`${scope}-k`}>Open flags</span>
              <span className={`${scope}-num ${scope}-num-warn`}>{ops.openFlags}</span>
            </div>
          )}
          {/* streaming sparkline tucked at the right */}
          <div className={`${scope}-spark`} aria-hidden="true">
            <svg viewBox="0 0 74 30" preserveAspectRatio="none">
              <path className={`${scope}-spark-fl`} d="M0,22 L9,18 L18,23 L27,12 L36,16 L45,8 L54,13 L63,5 L74,9 L74,30 L0,30 Z" />
              <path className={`${scope}-spark-ln`} d="M0,22 L9,18 L18,23 L27,12 L36,16 L45,8 L54,13 L63,5 L74,9" />
              <circle className={`${scope}-spark-pp`} cx="63" cy="5" r="2" />
            </svg>
          </div>
        </div>
      )}

      {/* APP GRID */}
      <div className={`${scope}-grid-wrap`}>
        <div className={`${scope}-grid-label`}>
          <span>Your apps · {apps.length}</span>
          <span className={`${scope}-legend`}>
            <span>
              <span className={`${scope}-sw`} style={{ background: FAMILY_ACCENTS.audits.c }} />
              Audits
            </span>
            <span>
              <span className={`${scope}-sw`} style={{ background: FAMILY_ACCENTS.dashboards.c }} />
              Dash
            </span>
            <span>
              <span className={`${scope}-sw`} style={{ background: FAMILY_ACCENTS.registers.c }} />
              Reg
            </span>
            <span>
              <span className={`${scope}-sw`} style={{ background: FAMILY_ACCENTS.logs.c }} />
              Logs
            </span>
          </span>
        </div>
        <div className={`${scope}-appgrid`}>
          {apps.map((app, i) => (
            <AppTile key={app.id ?? i} app={app} scope={scope} index={i} />
          ))}
        </div>
      </div>

      {/* HOME footer / colophon */}
      <div className={`${scope}-home-foot`}>
        <span className={`${scope}-maker`}>
          <span className={`${scope}-maker-dot`} />
          Powered by{' '}
          <b>
            A<i>u</i>D
          </b>{' '}
          OS
        </span>
        <span className={`${scope}-secure`}>
          <Svg markup={SHIELD_SVG} />
          ENCRYPTED
        </span>
      </div>
    </div>
  )
}

/** One app tile — `<button>` when launchable, `<div>` when locked. */
function AppTile({ app, scope, index }: { app: MissionControlApp; scope: string; index: number }) {
  const famClass = `${scope}-f-${app.family}`
  const glyph = GLYPHS[app.id] ?? GLYPH_FALLBACK
  const locked = !!app.locked
  const cls = [`${scope}-tile`, famClass, locked ? `${scope}-locked` : '']
    .filter(Boolean)
    .join(' ')
  // Stagger the entrance per tile (capped) so the grid cascades in.
  const tileStyle = { animationDelay: `${0.24 + Math.min(index, 7) * 0.06}s` } as React.CSSProperties

  const inner = (
    <>
      <div className={`${scope}-ticon`}>
        <Svg markup={glyph} />
      </div>
      <div className={`${scope}-fam`}>{FAMILY_LABEL[app.family]}</div>
      <div className={`${scope}-tname`}>{app.name}</div>
      <div className={`${scope}-trow`}>
        <span className={app.live ? `${scope}-metric ${scope}-metric-acc` : `${scope}-metric`}>
          {app.live ? (
            <>
              <span className={`${scope}-ld`} />
              LIVE
            </>
          ) : (
            app.metric ?? (locked ? 'no access' : '—')
          )}
        </span>
        <span className={`${scope}-go`}>
          <Svg markup={locked ? LOCK_SVG : ARROW_SVG} />
        </span>
      </div>
      {locked && (
        <span className={`${scope}-lockbadge`}>
          <Svg markup={LOCK_SVG} />
        </span>
      )}
    </>
  )

  if (locked) {
    return (
      <div
        className={cls}
        style={tileStyle}
        aria-label={`${app.name} · ${FAMILY_LABEL[app.family]} · locked`}
        aria-disabled="true"
      >
        {inner}
      </div>
    )
  }

  return (
    <button
      type="button"
      className={cls}
      style={tileStyle}
      onClick={app.onLaunch}
      aria-label={`${app.name} · ${FAMILY_LABEL[app.family]}`}
    >
      {inner}
    </button>
  )
}

/* ============================================================
   SIGN-IN VIEW
   ============================================================ */
function SignInView({
  scope,
  titleHead,
  titleTail,
  onSignIn,
  onPasscode,
}: {
  scope: string
  titleHead: string
  titleTail: string
  onSignIn?: () => void
  onPasscode?: () => void
}) {
  return (
    <div className={`${scope}-signin`}>
      <div className={`${scope}-si-spacer`} />
      <div className={`${scope}-si-card`}>
        <div className={`${scope}-si-emblem`}>
          <span className={`${scope}-wm`}>
            A<i>u</i>D
          </span>
        </div>
        <div className={`${scope}-si-eyebrow`}>Precinct Ops · Suite OS</div>
        <h1 className={`${scope}-si-title`}>
          {titleHead} <span className={`${scope}-os-mark`}>{titleTail}</span>
        </h1>
        <p className={`${scope}-si-sub`}>
          One sign-in for every operations app. Mission control for your venues, audits and logs.
        </p>

        <div className={`${scope}-si-actions`}>
          <button type="button" className={`${scope}-btn-primary`} onClick={onSignIn}>
            <span className={`${scope}-ms`}>
              <Svg markup={MS_SVG} />
            </span>
            <span>Sign in with Microsoft</span>
          </button>
          <div className={`${scope}-si-divider`}>OR</div>
          <button type="button" className={`${scope}-secondary`} onClick={onPasscode}>
            <Svg markup={PASSCODE_SVG} />
            <span>
              Use <b>suite passcode</b>
            </span>
          </button>
        </div>
      </div>
      <div className={`${scope}-si-spacer`} />

      <div className={`${scope}-si-foot`}>
        <span className={`${scope}-maker`}>
          <span className={`${scope}-maker-dot`} />
          Powered by{' '}
          <b>
            A<i>u</i>D
          </b>{' '}
          OS
        </span>
        <span className={`${scope}-secure`}>
          <Svg markup={SHIELD_SVG} />
          SSO · ENCRYPTED
        </span>
      </div>
    </div>
  )
}

/* ============================================================
   HELPERS
   ============================================================ */

/** 12-hour wall-clock, e.g. "9:41". Falls back to "9:41" on error. */
function formatClock(d: Date): string {
  try {
    let h = d.getHours()
    const m = d.getMinutes()
    h = h % 12
    if (h === 0) h = 12
    return `${h}:${String(m).padStart(2, '0')}`
  } catch {
    return '9:41'
  }
}

/** Split a suite title into a head + accent-tinted trailing word. */
function splitTitle(name: string): { head: string; tail: string } {
  const parts = name.trim().split(/\s+/)
  if (parts.length <= 1) return { head: '', tail: name }
  const tail = parts.pop() as string
  return { head: parts.join(' '), tail }
}

/** Render "12/13" as a big number with a faint "/13" suffix. */
function splitVenues(value: string): React.ReactNode {
  const idx = value.indexOf('/')
  if (idx === -1) return value
  return (
    <>
      {value.slice(0, idx)}
      <em>{value.slice(idx)}</em>
    </>
  )
}

/** Up-to-two-letter initials from a name like "A. Durrant" -> "AD". */
function initials(name?: string): string {
  if (!name) return 'A'
  const letters = name
    .split(/[\s.]+/)
    .filter(Boolean)
    .map((w) => w[0]?.toUpperCase() ?? '')
    .join('')
  return letters.slice(0, 2) || 'A'
}

/* ============================================================
   SCOPED STYLE BLOCK — everything prefixed with the instance
   `scope` so multiple hubs coexist. Mirrors the verified
   prototype 1:1 (the mission-control shell, the grid, the
   colour-coded tiles, locked tiles, sign-in, and the entrance
   choreography), themed light/dark via CSS vars.
   ============================================================ */
function scopedCss(s: string): string {
  return `
.${s}-os{
  position:relative;width:100vw;max-width:460px;height:100vh;max-height:940px;
  overflow:hidden;
  background:radial-gradient(135% 95% at 50% -10%, var(--os-2) 0%, var(--os-1) 44%, var(--os-0) 100%);
  display:flex;flex-direction:column;padding:14px 0 0;
}
.${s}-os::before{
  content:"";position:absolute;left:50%;top:-18%;
  width:620px;height:620px;transform:translateX(-50%);
  background:radial-gradient(circle at 50% 50%, var(--acc-glow) 0%, transparent 60%);
  opacity:.26;filter:blur(12px);pointer-events:none;
  animation:${s}-breathe 7s ease-in-out infinite;
}
@keyframes ${s}-breathe{0%,100%{opacity:.20}50%{opacity:.32}}

/* ===== LIVE OPS BACKDROP ===== */
.${s}-ops-bg{position:absolute;inset:0;pointer-events:none;z-index:0;overflow:hidden}
.${s}-grid{
  position:absolute;inset:0;opacity:.9;
  background-image:
    linear-gradient(var(--grid) 1px, transparent 1px),
    linear-gradient(90deg, var(--grid) 1px, transparent 1px);
  background-size:38px 38px;
  -webkit-mask-image:radial-gradient(125% 78% at 50% 8%, #000 0%, transparent 80%);
          mask-image:radial-gradient(125% 78% at 50% 8%, #000 0%, transparent 80%);
}
.${s}-ticker{
  position:absolute;font-family:${MONO_FONT};font-size:10px;letter-spacing:.14em;
  color:var(--txt-3);opacity:.16;white-space:nowrap;
}
.${s}-ticker-a{top:64px;left:24px}
.${s}-ticker-b{bottom:20px;right:22px}
.${s}-ticker-c{bottom:20px;left:24px}

/* ===== STATUS BAR ===== */
.${s}-statusbar{
  position:relative;z-index:5;
  display:flex;align-items:center;justify-content:space-between;
  padding:0 22px 0 24px;height:22px;
  font-family:${MONO_FONT};
  font-size:12.5px;letter-spacing:.02em;color:var(--txt);
  animation:${s}-fade .6s ease both;
}
.${s}-clock{font-weight:700;font-variant-numeric:tabular-nums}
.${s}-sysmark{display:flex;align-items:center;gap:7px;color:var(--txt-2);font-size:10.5px;letter-spacing:.16em}
.${s}-sysmark-aud{color:var(--txt);font-family:${DISPLAY_FONT};font-weight:700;font-size:12.5px;letter-spacing:.02em}
.${s}-sysmark-aud b{color:var(--acc-2);font-weight:700}
.${s}-status-right{display:flex;align-items:center;gap:9px}
.${s}-net{display:flex;align-items:center;gap:5px;font-size:9.5px;letter-spacing:.14em;color:var(--good)}
.${s}-net-dot{width:6px;height:6px;border-radius:50%;background:var(--good);box-shadow:0 0 7px var(--good);animation:${s}-blink 2.4s ease-in-out infinite}
@keyframes ${s}-blink{0%,100%{opacity:1}50%{opacity:.45}}
.${s}-glyphs{display:flex;align-items:center;gap:5px}
.${s}-glyphs i{display:block;width:3px;border-radius:1px;background:var(--txt-2)}
.${s}-glyphs i:nth-child(1){height:5px}
.${s}-glyphs i:nth-child(2){height:8px}
.${s}-glyphs i:nth-child(3){height:11px}
.${s}-batt{margin-left:4px;width:20px;height:11px;border:1px solid var(--txt-2);border-radius:3px;position:relative;padding:1.5px}
.${s}-batt::after{content:"";position:absolute;right:-3px;top:3px;width:2px;height:4px;background:var(--txt-2);border-radius:0 1px 1px 0}
.${s}-batt span{display:block;height:100%;width:82%;background:var(--acc-2);border-radius:1px}

/* ============================================================
   HOME / LAUNCHER
   ============================================================ */
.${s}-shell{position:relative;z-index:4;flex:1;display:flex;flex-direction:column;min-height:0}

.${s}-suite-head{padding:13px 24px 0;animation:${s}-rise .6s cubic-bezier(.2,.7,.2,1) .04s both}
.${s}-eyebrow{font-family:${MONO_FONT};font-size:10px;letter-spacing:.32em;text-transform:uppercase;color:var(--txt-3);display:flex;align-items:center;gap:8px;margin-bottom:8px}
.${s}-eyebrow-live{width:6px;height:6px;border-radius:50%;background:var(--acc);box-shadow:0 0 0 3px var(--acc-veil),0 0 8px var(--acc-glow);animation:${s}-blink 2.4s ease-in-out infinite}
.${s}-suite-title{font-size:25px;font-weight:700;letter-spacing:-.028em;line-height:1.02;color:var(--txt);margin:0}
.${s}-os-mark{color:var(--acc-2)}
.${s}-who{margin-top:6px;font-size:12px;color:var(--txt-2);font-weight:400;display:flex;align-items:center;gap:7px}
.${s}-av{
  width:18px;height:18px;border-radius:6px;flex:none;
  background:linear-gradient(135deg,var(--acc-2),var(--acc-deep));
  color:var(--on-acc);font-size:9px;font-weight:700;display:flex;align-items:center;justify-content:center;
  letter-spacing:.01em;font-family:${DISPLAY_FONT};
}
.${s}-who b{color:var(--txt);font-weight:600}

/* LIVE OPS summary strip */
.${s}-opsbar{
  margin:13px 24px 0;
  background:linear-gradient(180deg, var(--os-2) 0%, color-mix(in srgb, var(--os-1) 70%, transparent) 100%);
  border:1px solid var(--hair);border-radius:16px;
  padding:11px 15px 10px;
  display:flex;align-items:center;gap:0;position:relative;overflow:hidden;
  box-shadow:0 1px 0 rgba(255,255,255,.04) inset, 0 22px 40px -30px rgba(0,0,0,.9);
  animation:${s}-rise .7s cubic-bezier(.2,.7,.2,1) .12s both;
}
.${s}-opsbar::before{content:"";position:absolute;left:16px;right:16px;top:0;height:1px;background:linear-gradient(90deg,transparent,var(--acc-2),transparent);opacity:.5}
.${s}-stat{flex:none;display:flex;flex-direction:column;gap:4px}
.${s}-stat-flag{flex:1}
.${s}-stat + .${s}-stat{margin-left:14px;padding-left:14px;border-left:1px solid var(--hair)}
.${s}-k{font-family:${MONO_FONT};font-size:8px;letter-spacing:.15em;text-transform:uppercase;color:var(--txt-3)}
.${s}-num{font-size:18px;font-weight:700;color:var(--txt);letter-spacing:-.01em;font-variant-numeric:tabular-nums;line-height:1}
.${s}-num em{font-style:normal;font-size:11px;color:var(--txt-3);font-weight:500}
.${s}-num-acc{color:var(--acc-2)}
.${s}-num-warn{color:var(--aud-2)}
.${s}-spark{flex:none;margin-left:14px;width:74px;height:30px;align-self:center}
.${s}-spark svg{width:100%;height:100%;display:block;overflow:visible}
.${s}-spark-ln{fill:none;stroke:var(--acc);stroke-width:1.5;stroke-dasharray:240;stroke-dashoffset:240;animation:${s}-draw 1.9s cubic-bezier(.5,0,.2,1) .35s forwards}
.${s}-spark-fl{fill:var(--acc);opacity:.07}
.${s}-spark-pp{fill:var(--acc-2);opacity:0;animation:${s}-pip 2.8s ease-out 1.9s infinite}
@keyframes ${s}-draw{to{stroke-dashoffset:0}}
@keyframes ${s}-pip{0%{opacity:.9;r:2}70%{opacity:0;r:6}100%{opacity:0}}

/* APP GRID */
.${s}-grid-wrap{flex:1;min-height:0;overflow:hidden;padding:14px 24px 0;display:flex;flex-direction:column}
.${s}-grid-label{display:flex;align-items:center;justify-content:space-between;margin-bottom:9px;font-family:${MONO_FONT};font-size:9.5px;letter-spacing:.2em;text-transform:uppercase;color:var(--txt-3);animation:${s}-fade .7s ease .2s both}
.${s}-legend{display:flex;align-items:center;gap:9px}
.${s}-legend span{display:flex;align-items:center;gap:4px;font-size:8.5px;letter-spacing:.1em}
.${s}-sw{width:7px;height:7px;border-radius:2px}
.${s}-appgrid{flex:1;display:grid;grid-template-columns:1fr 1fr;gap:9px;align-content:start}

.${s}-tile{
  position:relative;border-radius:17px;
  background:linear-gradient(180deg, var(--tile-from) 0%, var(--tile-to) 100%);
  border:1px solid var(--hair);
  padding:12px 13px 11px;
  display:flex;flex-direction:column;text-align:left;width:100%;
  font-family:${DISPLAY_FONT};color:var(--txt);
  overflow:hidden;cursor:pointer;
  transition:transform .16s cubic-bezier(.2,.7,.2,1), border-color .16s ease, box-shadow .16s ease;
  box-shadow:0 1px 0 rgba(255,255,255,.03) inset, 0 18px 32px -26px rgba(0,0,0,.9);
  --tile:var(--dsh); --tile-2:var(--dsh-2); --tile-glow:var(--dsh-glow); --tile-veil:var(--dsh-veil);
  animation:${s}-tileIn .6s cubic-bezier(.2,.7,.2,1) both;
}
.${s}-f-audits{--tile:var(--aud);--tile-2:var(--aud-2);--tile-glow:var(--aud-glow);--tile-veil:var(--aud-veil)}
.${s}-f-dashboards{--tile:var(--dsh);--tile-2:var(--dsh-2);--tile-glow:var(--dsh-glow);--tile-veil:var(--dsh-veil)}
.${s}-f-registers{--tile:var(--reg);--tile-2:var(--reg-2);--tile-glow:var(--reg-glow);--tile-veil:var(--reg-veil)}
.${s}-f-logs{--tile:var(--log);--tile-2:var(--log-2);--tile-glow:var(--log-glow);--tile-veil:var(--log-veil)}
.${s}-tile::after{
  content:"";position:absolute;right:-30px;top:-30px;width:80px;height:80px;border-radius:50%;
  background:radial-gradient(circle at 50% 50%, var(--tile-veil) 0%, transparent 70%);
  pointer-events:none;transition:opacity .16s ease;opacity:.8;
}
.${s}-tile:hover{transform:translateY(-3px);border-color:var(--tile);box-shadow:0 1px 0 rgba(255,255,255,.05) inset, 0 22px 38px -22px var(--tile-glow), 0 0 0 1px var(--tile-veil)}
.${s}-tile:active{transform:translateY(-1px)}

.${s}-ticon{
  width:38px;height:38px;border-radius:12px;flex:none;
  background:linear-gradient(150deg, var(--tile-veil), rgba(255,255,255,.02));
  border:1px solid var(--tile-veil);
  display:flex;align-items:center;justify-content:center;color:var(--tile-2);
  position:relative;transition:all .16s ease;
}
.${s}-tile:hover .${s}-ticon{
  background:radial-gradient(120% 120% at 30% 20%, var(--tile-2) 0%, var(--tile) 55%, var(--tile) 100%);
  border-color:transparent;color:var(--on-acc);
  box-shadow:0 1px 0 rgba(255,255,255,.4) inset, 0 10px 18px -8px var(--tile-glow);
}
.${s}-ticon svg{width:21px;height:21px;display:block}

.${s}-fam{margin-top:10px;font-family:${MONO_FONT};font-size:8px;letter-spacing:.18em;text-transform:uppercase;color:var(--tile-2);opacity:.95}
.${s}-tname{margin-top:4px;font-size:14.5px;font-weight:600;letter-spacing:-.014em;color:var(--txt);line-height:1.08}
.${s}-trow{margin-top:8px;padding-top:8px;border-top:1px solid var(--hair);display:flex;align-items:center;justify-content:space-between;gap:6px}
.${s}-metric{font-family:${MONO_FONT};font-size:11px;font-weight:700;color:var(--txt);font-variant-numeric:tabular-nums;letter-spacing:.01em;display:flex;align-items:center;gap:5px}
.${s}-ld{width:5px;height:5px;border-radius:50%;background:var(--tile);box-shadow:0 0 7px var(--tile-glow)}
.${s}-metric-acc{color:var(--tile-2)}
.${s}-go{width:22px;height:22px;border-radius:50%;flex:none;display:flex;align-items:center;justify-content:center;border:1px solid var(--hair-2);color:var(--txt-3);transition:all .16s ease}
.${s}-go svg{width:12px;height:12px;display:block}
.${s}-tile:hover .${s}-go{background:var(--tile);border-color:transparent;color:var(--on-acc);box-shadow:0 0 14px -2px var(--tile-glow)}

/* LOCKED tiles */
.${s}-locked{cursor:not-allowed;background:linear-gradient(180deg,var(--locked-from) 0%,var(--locked-to) 100%);border-color:var(--hair)}
.${s}-locked::after{opacity:0}
.${s}-locked:hover{transform:none;border-color:var(--hair-2);box-shadow:0 1px 0 rgba(255,255,255,.03) inset}
.${s}-locked .${s}-ticon{background:color-mix(in srgb, var(--txt) 4%, transparent);border-color:var(--hair);color:var(--txt-4)}
.${s}-locked:hover .${s}-ticon{background:color-mix(in srgb, var(--txt) 4%, transparent);border-color:var(--hair);color:var(--txt-4);box-shadow:none}
.${s}-locked .${s}-fam{color:var(--txt-4);opacity:1}
.${s}-locked .${s}-tname{color:var(--txt-3)}
.${s}-locked .${s}-metric{color:var(--txt-4)}
.${s}-locked .${s}-go{border-color:var(--hair);color:var(--txt-4)}
.${s}-locked:hover .${s}-go{background:transparent;border-color:var(--hair);color:var(--txt-4);box-shadow:none}
.${s}-lockbadge{position:absolute;top:11px;right:11px;width:22px;height:22px;border-radius:7px;background:color-mix(in srgb, var(--txt) 4%, transparent);border:1px solid var(--hair);display:flex;align-items:center;justify-content:center;color:var(--txt-3)}
.${s}-lockbadge svg{width:11px;height:11px;display:block}

/* HOME footer / colophon */
.${s}-home-foot{position:relative;z-index:5;padding:11px 24px 15px;display:flex;align-items:center;justify-content:space-between;font-family:${MONO_FONT};font-size:9.5px;letter-spacing:.16em;color:var(--txt-3);animation:${s}-fade .8s ease .7s both}
.${s}-maker{display:flex;align-items:center;gap:7px}
.${s}-maker-dot{width:4px;height:4px;border-radius:50%;background:var(--acc)}
.${s}-maker b{color:var(--txt-2);font-weight:700;font-family:${DISPLAY_FONT};font-size:11px;letter-spacing:.01em}
.${s}-maker b i{font-style:normal;color:var(--acc-2)}
.${s}-secure{display:flex;align-items:center;gap:6px}
.${s}-secure svg{width:11px;height:11px;display:block}

/* ============================================================
   SIGN-IN
   ============================================================ */
.${s}-signin{position:relative;z-index:4;flex:1;display:flex;flex-direction:column;padding:0 24px}
.${s}-si-spacer{flex:1;min-height:0}
.${s}-si-card{display:flex;flex-direction:column;align-items:center;text-align:center;padding:0 4px}
.${s}-si-emblem{
  width:78px;height:78px;border-radius:23px;position:relative;
  background:radial-gradient(120% 120% at 30% 18%, var(--acc-2) 0%, var(--acc) 46%, var(--acc-deep) 100%);
  display:flex;align-items:center;justify-content:center;color:var(--on-acc);
  box-shadow:0 1px 0 rgba(255,255,255,.5) inset, 0 22px 44px -16px var(--acc-glow);
  margin-bottom:24px;animation:${s}-rise .7s cubic-bezier(.2,.7,.2,1) .06s both;
}
.${s}-si-emblem::after{content:"";position:absolute;inset:0;border-radius:23px;border:1px solid rgba(255,255,255,.2)}
.${s}-wm{font-family:${DISPLAY_FONT};font-weight:700;font-size:30px;letter-spacing:-.02em}
.${s}-wm i{font-style:normal;opacity:.62}
.${s}-si-eyebrow{font-family:${MONO_FONT};font-size:10px;letter-spacing:.34em;text-transform:uppercase;color:var(--txt-3);margin-bottom:11px;animation:${s}-rise .6s cubic-bezier(.2,.7,.2,1) .14s both}
.${s}-si-title{font-size:30px;font-weight:700;letter-spacing:-.03em;line-height:1.04;color:var(--txt);margin:0;animation:${s}-rise .6s cubic-bezier(.2,.7,.2,1) .2s both}
.${s}-si-sub{margin:11px 0 0;font-size:13.5px;line-height:1.45;color:var(--txt-2);font-weight:400;max-width:262px;animation:${s}-rise .6s cubic-bezier(.2,.7,.2,1) .26s both}
.${s}-si-actions{margin-top:30px;width:100%;animation:${s}-rise .7s cubic-bezier(.2,.7,.2,1) .34s both}
.${s}-btn-primary{
  width:100%;display:flex;align-items:center;justify-content:center;gap:11px;
  padding:18px;border:none;border-radius:16px;
  background:linear-gradient(180deg, var(--acc-2) 0%, var(--acc) 52%, var(--acc-deep) 100%);
  color:var(--on-acc);
  font-family:${DISPLAY_FONT};font-size:16px;font-weight:600;letter-spacing:.005em;cursor:pointer;
  box-shadow:0 1px 0 rgba(255,255,255,.45) inset, 0 18px 34px -14px var(--acc-glow);
  transition:transform .14s ease, filter .2s ease;
}
.${s}-btn-primary:hover{filter:brightness(1.03)}
.${s}-btn-primary:active{transform:translateY(1px)}
.${s}-ms{display:flex}
.${s}-ms svg{display:block}
.${s}-secondary{
  margin-top:13px;width:100%;display:flex;align-items:center;justify-content:center;gap:9px;
  padding:15px;border-radius:14px;background:var(--os-2);border:1px solid var(--hair);
  color:var(--txt-2);font-family:${DISPLAY_FONT};font-size:14px;font-weight:500;cursor:pointer;
  transition:border-color .14s ease,background .14s ease;
}
.${s}-secondary:hover{border-color:var(--hair-2);background:var(--os-3)}
.${s}-secondary b{color:var(--txt);font-weight:600}
.${s}-secondary svg{width:15px;height:15px;color:var(--txt-3);display:block}
.${s}-si-divider{display:flex;align-items:center;gap:12px;margin:18px 2px;font-family:${MONO_FONT};font-size:9px;letter-spacing:.2em;color:var(--txt-4)}
.${s}-si-divider::before,.${s}-si-divider::after{content:"";flex:1;height:1px;background:var(--hair)}
.${s}-si-foot{padding:18px 0 22px;display:flex;align-items:center;justify-content:space-between;font-family:${MONO_FONT};font-size:9.5px;letter-spacing:.16em;color:var(--txt-3);animation:${s}-fade .9s ease .6s both}

/* ===== ENTRANCE CHOREOGRAPHY ===== */
@keyframes ${s}-rise{from{opacity:0;transform:translateY(14px)}to{opacity:1;transform:none}}
@keyframes ${s}-fade{from{opacity:0}to{opacity:1}}
@keyframes ${s}-tileIn{from{opacity:0;transform:translateY(12px) scale(.98)}to{opacity:1;transform:none}}

@media (prefers-reduced-motion: reduce){
  .${s}-os *{animation:none !important}
  .${s}-spark-ln{stroke-dashoffset:0}
}
`
}

export default MissionControlHub
