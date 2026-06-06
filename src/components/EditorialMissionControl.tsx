import React, { useEffect, useId, useLayoutEffect, useRef, useState } from 'react'
import { useTakeoverBody } from '../useTakeoverBody'
import type { FamilyKey } from '../families'

/**
 * One Google Fonts <link> for the editorial broadsheet hub. Fraunces is the
 * high-contrast display serif for the nameplate, the lead figures, and the
 * station names; Newsreader is the humane reading serif for the body, small-caps
 * eyebrows, and dotted-leader labels. Injected once per document (id-guarded) so
 * mounting many hubs never duplicates the stylesheet.
 */
const FONTS_LINK_ID = 'aud-editorial-mc-fonts'
const FONTS_HREF =
  'https://fonts.googleapis.com/css2?family=Fraunces:ital,opsz,wght@0,9..144,300;0,9..144,400;0,9..144,500;0,9..144,600;0,9..144,700;1,9..144,400;1,9..144,500;1,9..144,600&family=Newsreader:ital,opsz,wght@0,6..72,400;0,6..72,500;0,6..72,600;1,6..72,400;1,6..72,500&display=swap'

const DISPLAY_FONT = "'Fraunces', Georgia, 'Times New Roman', serif"
const BODY_FONT = "'Newsreader', Georgia, 'Times New Roman', serif"

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

/* ============================================================================
 * BESPOKE SEAL GLYPHS
 * Inlined verbatim from /home/pi/design-lab/glyphs/final/<id>.svg. Each draws
 * with `currentColor` so the station seals colour themselves from the family
 * ink. Kept internal so the hub renders fully self-contained (no icon
 * dependency on consumers).
 * ========================================================================== */
const GLYPHS: Record<string, string> = {
  'venue-audit':
    '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.9" stroke-linecap="round" stroke-linejoin="round"><path d="M9 5H7a2 2 0 0 0-2 2v12a2 2 0 0 0 2 2h10a2 2 0 0 0 2-2V7a2 2 0 0 0-2-2h-2"/><rect x="9" y="3.5" width="6" height="3" rx="1"/><path d="m8.5 13 2.5 2.5 4.5-5"/></svg>',
  'cleaning-audit':
    '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.9" stroke-linecap="round" stroke-linejoin="round"><path d="M12 3v8.5"/><path d="M8.5 11.5h7"/><path d="M12 11.5c-3.5 1.8-5.3 4.3-5.3 8.5"/><path d="M12 11.5c-1.4 2.6-1.8 5.3-1.6 8.5"/><path d="M12 11.5v8.5"/><path d="M12 11.5c1.4 2.6 1.8 5.3 1.6 8.5"/><path d="M12 11.5c3.5 1.8 5.3 4.3 5.3 8.5"/></svg>',
  'precinct-compliance':
    '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.9" stroke-linecap="round" stroke-linejoin="round"><path d="M12 3 5 5.5v6c0 4.4 2.9 7.6 7 9 4.1-1.4 7-4.6 7-9v-6L12 3Z"/><path d="m8.5 12 2.5 2.5 4.5-5"/></svg>',
  'cleaning-dashboard':
    '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.9" stroke-linecap="round" stroke-linejoin="round"><path d="M12 3.5c2.6 3 4.2 5.1 4.2 7.2a4.2 4.2 0 0 1-8.4 0c0-2.1 1.6-4.2 4.2-7.2Z"/><path d="M4 18.5h16"/><path d="M10.5 20.5 12 18.5l1.5 2"/></svg>',
  'first-aid-register':
    '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.9" stroke-linecap="round" stroke-linejoin="round"><rect x="4" y="4" width="16" height="16" rx="3.5"/><path d="M12 8.5v7M8.5 12h7"/></svg>',
  'headset-issuance':
    '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.9" stroke-linecap="round" stroke-linejoin="round"><path d="M4 14v-2a8 8 0 0 1 16 0v2"/><path d="M4 13.5h2a1 1 0 0 1 1 1V18a1 1 0 0 1-1 1H4Z"/><path d="M20 13.5h-2a1 1 0 0 0-1 1V18a1 1 0 0 0 1 1h2Z"/><path d="M18 19v1a2 2 0 0 1-2 2h-3.5"/><circle cx="11" cy="22" r="1" fill="currentColor" stroke="none"/></svg>',
  'security-tracker':
    '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.9" stroke-linecap="round" stroke-linejoin="round"><path d="M7 3.5v17"/><circle cx="7" cy="7" r="1" fill="currentColor" stroke="none"/><circle cx="7" cy="12" r="1" fill="currentColor" stroke="none"/><circle cx="7" cy="17" r="1" fill="currentColor" stroke="none"/><path d="M9 7h8"/><path d="M9 12h6"/><path d="M9 17h8"/></svg>',
  'control-log':
    '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.9" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="7"/><path d="M12 3v3"/><path d="M12 18v3"/><path d="M3 12h3"/><path d="M18 12h3"/><circle cx="12" cy="12" r="1" fill="currentColor" stroke="none"/></svg>',
}

/* ============================================================================
 * THEME TOKENS — ported verbatim from the verified prototype's :root +
 * html[data-theme="dark"] blocks. Light is the warm ivory broadsheet; dark is
 * the luxurious "ink edition" mission-control default.
 * ========================================================================== */
interface MCTokens {
  /* paper + ink */
  paper: string
  paper2: string
  ink: string
  inkSoft: string
  inkFaint: string
  inkGhost: string
  rule: string
  ruleSoft: string
  grain: string
  grainOp: string
  grainBlend: 'multiply' | 'screen'
  vignette: string
  sealHi: string
  sealLo: string
  behind: string
  /* the suite "live ops / signal" accent (dashboards teal) */
  accent: string
  accentDeep: string
  accentTint: string
  /* family inks — light + dark variants live in their own theme block */
  aud: string
  audDeep: string
  audTint: string
  dsh: string
  dshDeep: string
  dshTint: string
  reg: string
  regDeep: string
  regTint: string
  log: string
  logDeep: string
  logTint: string
}

const THEME: Record<'light' | 'dark', MCTokens> = {
  light: {
    paper: '#F4EEE2',
    paper2: '#EBE2D0',
    ink: '#1B1712',
    inkSoft: '#473F35',
    inkFaint: '#726755',
    inkGhost: '#9A8E78',
    rule: '#CDC2AB',
    ruleSoft: '#DCD1BD',
    grain: 'rgba(120,100,70,.06)',
    grainOp: '.5',
    grainBlend: 'multiply',
    vignette: 'rgba(58,44,22,.11)',
    sealHi: '#FBF6EC',
    sealLo: '#EBE2D0',
    behind: '#241E15',
    accent: '#2E7D78',
    accentDeep: '#1E5C58',
    accentTint: '#CBE2DF',
    aud: '#9C6B1E',
    audDeep: '#6E4A12',
    audTint: '#EBDCBF',
    dsh: '#2E7D78',
    dshDeep: '#1E5C58',
    dshTint: '#CBE2DF',
    reg: '#B45B3E',
    regDeep: '#8A3F26',
    regTint: '#EFD3C6',
    log: '#3F7A55',
    logDeep: '#2A5B3C',
    logTint: '#CFE0D2',
  },
  dark: {
    paper: '#1E1A14',
    paper2: '#171410',
    ink: '#F2EAD9',
    inkSoft: '#C8BCA6',
    inkFaint: '#948871',
    inkGhost: '#5E5645',
    rule: '#473F31',
    ruleSoft: '#352E24',
    grain: 'rgba(255,238,200,.05)',
    grainOp: '.6',
    grainBlend: 'screen',
    vignette: 'rgba(0,0,0,.5)',
    sealHi: '#2B251C',
    sealLo: '#15120D',
    behind: '#0E0C08',
    accent: '#5BB3AC',
    accentDeep: '#6CC0B9',
    accentTint: '#15211F',
    aud: '#D6A24B',
    audDeep: '#E0AE5C',
    audTint: '#2E2516',
    dsh: '#5BB3AC',
    dshDeep: '#6CC0B9',
    dshTint: '#15211F',
    reg: '#D87B5B',
    regDeep: '#E08A6B',
    regTint: '#2E1E17',
    log: '#6FB089',
    logDeep: '#7FBE96',
    logTint: '#16251C',
  },
}

/** Maps a {@link FamilyKey} to its station row class suffix + label. */
const FAMILY_ROW_CLASS: Record<FamilyKey, string> = {
  audits: 'f-audits',
  dashboards: 'f-dash',
  registers: 'f-reg',
  logs: 'f-logs',
}
const FAMILY_LABEL: Record<FamilyKey, string> = {
  audits: 'Audits',
  dashboards: 'Dashboards',
  registers: 'Registers',
  logs: 'Logs',
}

/** Live-ops hero figures shown as the broadsheet "lead" numbers. */
export interface MissionControlOps {
  /** "Venues live" — rendered as N/total when {@link venuesTotal} is given. */
  venuesLive: number
  /** Optional denominator for the venues-live figure (e.g. 13 -> "12/13"). */
  venuesTotal?: number
  /** "Run events" — a running count (count-up + thousands-separated). */
  runEvents: number
  /** "Open flags" — rendered in the accent ink. */
  openFlags: number
}

/** One launchable (or restricted) app — a "station" in the launcher rail. */
export interface MissionControlApp {
  /**
   * Stable id — also the key into the bespoke seal-glyph map. When it matches a
   * known glyph (venue-audit, cleaning-audit, precinct-compliance,
   * cleaning-dashboard, first-aid-register, headset-issuance, security-tracker,
   * control-log) the matching seal is drawn; otherwise the first letter of
   * {@link MissionControlApp.name} stands in.
   */
  id: string
  /** Display name. */
  name: string
  /** Which function family colours the seal + family slug. */
  family: FamilyKey
  /** Right-aligned state, e.g. "87%", "38 out". Ignored while `live`. */
  metric?: string
  /** Renders a pulsing "Live" state in place of the metric. */
  live?: boolean
  /** Restricted — greyed, lock icon, non-interactive. */
  locked?: boolean
  /** Launch handler. Not wired when `locked`. */
  onLaunch?: () => void
}

export interface EditorialMissionControlProps
  extends Omit<React.HTMLAttributes<HTMLDivElement>, 'title'> {
  /** The suite label after the "AuD" masthead nameplate. Default "the suite". */
  suiteName?: string
  /** Identity line in the nameplate slug, e.g. "A. Durrant". Hidden when absent. */
  signedInAs?: string
  /** The nameplate edition number, e.g. "No.01". Default "No.01". */
  edition?: string
  /** The masthead origin caps, e.g. "MADE IN AUSTRALIA". Default "MADE IN AUSTRALIA". */
  origin?: string
  /**
   * The big nameplate title (auto-fit to one line). Default "Precinct Ops" with
   * "Ops" set in the accent italic. Pass a string or a node.
   */
  title?: React.ReactNode
  /** The italic strapline under the nameplate. Default "The Daily Situation Report". */
  strap?: string
  /** The lead dek (live-ops dispatch eyebrow). Default "Dispatch · Precinct 04". */
  dek?: string
  /** The live/status word stamped on the lead. Default "Streaming · live". */
  liveword?: string
  /** Live-ops hero figures. Hidden when absent. */
  ops?: MissionControlOps
  /**
   * The 24h activity series for the editorial line-art chart (any length, raw
   * relative magnitudes — auto-scaled). Defaults to the prototype's series.
   */
  spark?: number[]
  /** The chart legend value, e.g. "1.4k". Default "1.4k". */
  rateValue?: string
  /** The launcher apps (any length; 8 in the prototype). */
  apps: MissionControlApp[]
  /** Neutral + ink palette. Default "dark" (the ink edition). */
  theme?: 'light' | 'dark'
}

/** The prototype's believable 24h activity series (relative magnitudes). */
const DEFAULT_SPARK = [10, 14, 11, 17, 13, 20, 16, 24, 19, 27, 22, 30, 25, 21, 28, 24, 33, 29, 38, 34, 30, 36, 32, 41]

/**
 * Builds the line-art chart paths (line + filled area) from a raw series, in the
 * prototype's 260x46 well. Returns the last-point coordinates for the pip/halo.
 */
function chartPaths(data: number[]): { line: string; area: string; lastX: string; lastY: string } {
  const W = 260
  const H = 46
  const PAD = 4
  const pts = data.length >= 2 ? data : [0, 0]
  const max = Math.max(...pts)
  const min = Math.min(...pts)
  const span = max - min || 1
  const n = pts.length
  const X = (i: number) => PAD + i * ((W - PAD * 2) / (n - 1))
  const Y = (v: number) => H - PAD - ((v - min) / span) * (H - PAD * 2)
  let d = ''
  pts.forEach((v, i) => {
    d += (i ? 'L' : 'M') + X(i).toFixed(1) + ',' + Y(v).toFixed(1) + ' '
  })
  const line = d.trim()
  const area = line + ' L' + X(n - 1).toFixed(1) + ',' + H + ' L' + X(0).toFixed(1) + ',' + H + ' Z'
  return { line, area, lastX: X(n - 1).toFixed(1), lastY: Y(pts[n - 1]).toFixed(1) }
}

/** Quick-settling count-up for a target number; respects reduced-motion. */
function useCountUp(target: number, run: boolean): number {
  const [value, setValue] = useState(run ? 0 : target)
  useEffect(() => {
    if (!run) {
      setValue(target)
      return
    }
    if (
      typeof window !== 'undefined' &&
      window.matchMedia?.('(prefers-reduced-motion: reduce)').matches
    ) {
      setValue(target)
      return
    }
    let raf = 0
    const T = 900
    const t0 = (typeof performance !== 'undefined' ? performance.now() : Date.now())
    const ease = (x: number) => 1 - Math.pow(1 - x, 3)
    const frame = (now: number) => {
      const p = Math.min(1, (now - t0) / T)
      setValue(Math.round(target * ease(p)))
      if (p < 1) raf = requestAnimationFrame(frame)
      else setValue(target)
    }
    raf = requestAnimationFrame(frame)
    return () => cancelAnimationFrame(raf)
  }, [target, run])
  return value
}

/** A short clock string in the user's locale (h:mm, 12-hour, no AM/PM). */
function nowClock(): string {
  try {
    const n = new Date()
    let h = n.getHours()
    const m = n.getMinutes()
    h = h % 12
    if (h === 0) h = 12
    return h + ':' + String(m).padStart(2, '0')
  } catch {
    return '9:41'
  }
}

/**
 * The EDITORIAL "Daily Situation Report" precinct-ops hub.
 *
 * A warm broadsheet page: a ruled MASTHEAD nameplate (auto-fit Fraunces title +
 * a signed-in slug), THE LEAD — a live-ops dispatch carrying big editorial hero
 * figures and an animated line-art activity chart — and THE STATIONS, a compact
 * launcher rail where each app is a ruled row with a bespoke embossed seal, a
 * broadsheet dotted leader, and its live/metric state (restricted apps grey out
 * behind a lock). A maker's-mark colophon closes the page.
 *
 * Self-contained: all styling is inline + one scoped `<style>` block; the 8
 * bespoke seal glyphs are inlined as an internal id->SVG map (currentColor); the
 * only external dependency is the Google Fonts `<link>` (Fraunces + Newsreader)
 * injected once per document.
 *
 * ```tsx
 * <EditorialMissionControl
 *   signedInAs="A. Durrant"
 *   ops={{ venuesLive: 12, venuesTotal: 13, runEvents: 1482, openFlags: 3 }}
 *   apps={[
 *     { id: 'precinct-compliance', name: 'Precinct Compliance', family: 'dashboards', live: true, onLaunch },
 *     { id: 'venue-audit', name: 'Venue Audit', family: 'audits', metric: '87%', onLaunch },
 *     { id: 'control-log', name: 'Control Log', family: 'logs', locked: true },
 *   ]}
 * />
 * ```
 */
export function EditorialMissionControl({
  suiteName = 'the suite',
  signedInAs,
  edition = 'No.01',
  origin = 'MADE IN AUSTRALIA',
  title,
  strap = 'The Daily Situation Report',
  dek = 'Dispatch · Precinct 04',
  liveword = 'Streaming · live',
  ops,
  spark = DEFAULT_SPARK,
  rateValue = '1.4k',
  apps,
  theme = 'dark',
  style,
  ...rest
}: EditorialMissionControlProps) {
  useFontsLink()

  const t = THEME[theme]

  // A scope id so the (necessarily class-based) station rows, dotted leaders,
  // chart strokes and hover states never leak between two hubs on the page.
  const rawId = useId()
  const scope = `aud-emc-${rawId.replace(/[^a-zA-Z0-9_-]/g, '')}`

  // CSS custom properties feed the scoped <style> rules (gradients + the
  // family-ink bindings reference multiple vars, which inline can't express).
  const vars = {
    '--paper': t.paper,
    '--paper-2': t.paper2,
    '--ink': t.ink,
    '--ink-soft': t.inkSoft,
    '--ink-faint': t.inkFaint,
    '--ink-ghost': t.inkGhost,
    '--rule': t.rule,
    '--rule-soft': t.ruleSoft,
    '--grain': t.grain,
    '--grain-op': t.grainOp,
    '--grain-blend': t.grainBlend,
    '--vignette': t.vignette,
    '--seal-hi': t.sealHi,
    '--seal-lo': t.sealLo,
    '--behind': t.behind,
    '--accent': t.accent,
    '--accent-deep': t.accentDeep,
    '--accent-tint': t.accentTint,
    '--aud': t.aud,
    '--aud-deep': t.audDeep,
    '--aud-tint': t.audTint,
    '--dsh': t.dsh,
    '--dsh-deep': t.dshDeep,
    '--dsh-tint': t.dshTint,
    '--reg': t.reg,
    '--reg-deep': t.regDeep,
    '--reg-tint': t.regTint,
    '--log': t.log,
    '--log-deep': t.logDeep,
    '--log-tint': t.logTint,
  } as React.CSSProperties

  const lockedCount = apps.filter((a) => a.locked).length
  const { line, area, lastX, lastY } = chartPaths(spark)

  // The nameplate title — auto-fit to a single line (measured, never guessed).
  const titleNode: React.ReactNode =
    title ?? (
      <>
        Precinct <em>Ops</em>
      </>
    )

  // ===== MEASURED TITLE AUTO-FIT (binary search to the available width) =====
  const overRef = useRef<HTMLDivElement>(null)
  const titleRef = useRef<HTMLHeadingElement>(null)
  const signedRef = useRef<HTMLDivElement>(null)

  useLayoutEffect(() => {
    const el = titleRef.current
    const over = overRef.current
    if (!el || !over) return

    const fit = () => {
      const sib = signedRef.current
      const avail = over.clientWidth - (sib ? sib.offsetWidth : 0) - 12
      if (avail <= 0) return
      const MAX = 52
      const MIN = 22
      const SAFETY = 0.99
      let lo = MIN
      let hi = MAX
      let best = MIN
      const fits = (px: number) => {
        el.style.setProperty('--title-size', px + 'px')
        return el.scrollWidth <= avail * SAFETY
      }
      let guard = 40
      while (hi - lo > 0.25 && guard-- > 0) {
        const mid = (lo + hi) / 2
        if (fits(mid)) {
          best = mid
          lo = mid
        } else {
          hi = mid
        }
      }
      el.style.setProperty('--title-size', best.toFixed(2) + 'px')
    }

    fit()
    if (typeof document !== 'undefined' && document.fonts?.ready) {
      document.fonts.ready.then(fit).catch(() => {})
    }
    const onResize = () => fit()
    window.addEventListener('resize', onResize)
    return () => window.removeEventListener('resize', onResize)
  }, [title, signedInAs, theme])

  // ===== count-up on the hero figures (quick-settling telemetry) =====
  // Run once on mount; we gate the count-up by a one-shot flag so it doesn't
  // re-animate on every render.
  const [animate, setAnimate] = useState(true)
  useEffect(() => {
    const id = window.setTimeout(() => setAnimate(false), 1100)
    return () => window.clearTimeout(id)
  }, [])
  const runCount = animate
  const venuesLive = useCountUp(ops?.venuesLive ?? 0, runCount && !!ops)
  const runEvents = useCountUp(ops?.runEvents ?? 0, runCount && !!ops)
  const openFlags = useCountUp(ops?.openFlags ?? 0, runCount && !!ops)

  // ===== live clock =====
  const [clock, setClock] = useState('9:41')
  useEffect(() => {
    setClock(nowClock())
    const id = window.setInterval(() => setClock(nowClock()), 10000)
    return () => window.clearInterval(id)
  }, [])

  // Paint the page backdrop + lock document scroll while mounted so an iOS
  // standalone PWA never flashes a white band behind the status bar and can't
  // rubber-band-scroll / elongate the 100dvh stage. Restored on unmount.
  useTakeoverBody(t.behind)

  return (
    <div
      data-theme={theme}
      style={{
        ...vars,
        position: 'relative',
        height: '100dvh',
        width: '100%',
        overflow: 'hidden',
        background: t.behind,
        color: t.ink,
        fontFamily: BODY_FONT,
        WebkitFontSmoothing: 'antialiased',
        ...style,
      }}
      {...rest}
    >
      <style>{scopedCss(scope)}</style>

      <div className={`${scope}-stage`}>
        {/* ===================== MASTHEAD ===================== */}
        <div className={`${scope}-masthead`}>
          <div className={`${scope}-rule-top`} />
          <div className={`${scope}-meta`}>
            <span className={`${scope}-m-left`}>AuD</span>
            <span className={`${scope}-m-mid`}>{origin}</span>
            <span className={`${scope}-m-right`}>
              <span className={`${scope}-pip`} />
              <span>{edition}</span>
            </span>
          </div>
          <div className={`${scope}-rule-bot`} />

          <div className={`${scope}-nameplate`}>
            <div className={`${scope}-over`} ref={overRef}>
              <h1 className={`${scope}-plate-title`} ref={titleRef}>
                {titleNode}
              </h1>
              {signedInAs && (
                <div className={`${scope}-signed`} ref={signedRef}>
                  Signed in as
                  <b>{signedInAs}</b>
                </div>
              )}
            </div>
            <div className={`${scope}-strap`}>
              <span className={`${scope}-tick`} />
              {strap}
              <span className={`${scope}-clk`}>
                <span className={`${scope}-clk-live`} />
                <span>{clock}</span> AEST
              </span>
            </div>
          </div>
        </div>

        {/* ===================== BODY ===================== */}
        <div className={`${scope}-body`}>
          {/* THE LEAD — live-ops dispatch with hero figures + chart. Always
              present (the dek + chart stand even without ops figures). */}
          <div className={`${scope}-lead`}>
            <div className={`${scope}-lead-head`}>
                <span className={`${scope}-dek`}>
                  <span className={`${scope}-dek-tick`} />
                  {dek}
                </span>
                <span className={`${scope}-stamp`}>
                  <span className={`${scope}-stamp-live`} />
                  {liveword}
                </span>
              </div>

              {ops && (
                <div className={`${scope}-figs`}>
                  <div className={`${scope}-fig`}>
                    <span className={`${scope}-lbl`}>Venues live</span>
                    <span className={`${scope}-val`}>
                      {venuesLive}
                      {typeof ops.venuesTotal === 'number' && <em>/{ops.venuesTotal}</em>}
                    </span>
                  </div>
                  <div className={`${scope}-fig`}>
                    <span className={`${scope}-lbl`}>Run events</span>
                    <span className={`${scope}-val`}>{runEvents.toLocaleString('en-US')}</span>
                  </div>
                  <div className={`${scope}-fig ${scope}-flag`}>
                    <span className={`${scope}-lbl`}>Open flags</span>
                    <span className={`${scope}-val`}>{openFlags}</span>
                  </div>
                </div>
              )}

              <div className={`${scope}-chart`}>
                <div className={`${scope}-plot`}>
                  <svg viewBox="0 0 260 46" preserveAspectRatio="none" aria-hidden="true">
                    <g className={`${scope}-grid`}>
                      <line x1="0" y1="6" x2="260" y2="6" />
                      <line x1="0" y1="23" x2="260" y2="23" />
                      <line x1="0" y1="40" x2="260" y2="40" />
                    </g>
                    <path className={`${scope}-area`} d={area} />
                    <path className={`${scope}-ln`} d={line} />
                    <circle className={`${scope}-halo`} cx={lastX} cy={lastY} r="2" />
                    <circle className={`${scope}-cpip`} cx={lastX} cy={lastY} r="2" />
                  </svg>
                </div>
                <div className={`${scope}-legend`}>
                  Activity
                  <br />
                  24<span style={{ letterSpacing: '.1em' }}> hrs</span>
                  <b>
                    {rateValue}
                    <span className={`${scope}-up`}> ↑</span>
                  </b>
                  ev / min
                </div>
              </div>
          </div>

          {/* THE STATIONS — compact launcher rail */}
          <div className={`${scope}-stations`}>
            <div className={`${scope}-rail-head`}>
              <span className={`${scope}-rh-name`}>The Stations</span>
              <span className={`${scope}-rh-line`} />
              <span className={`${scope}-rh-count`}>
                {String(apps.length).padStart(2, '0')} · launch
                {lockedCount > 0 && <> · {lockedCount} restricted</>}
              </span>
            </div>

            <div className={`${scope}-grid2`}>
              {apps.map((app, i) => (
                <Station key={app.id || i} app={app} scope={scope} index={i} />
              ))}
            </div>
          </div>
        </div>

        {/* ===================== COLOPHON ===================== */}
        <div className={`${scope}-colophon`}>
          <span className={`${scope}-maker`}>
            Powered by&nbsp;
            <span className={`${scope}-aud`}>
              A<i>u</i>D
            </span>
            &nbsp;· {suiteName}
          </span>
          <span className={`${scope}-secure`}>
            <span className={`${scope}-c-pip`} />
            <span>SSO · ENCRYPTED</span>
          </span>
        </div>
      </div>
    </div>
  )
}

function Station({ app, scope, index }: { app: MissionControlApp; scope: string; index: number }) {
  const { id, name, family, metric, live, locked, onLaunch } = app
  const famClass = FAMILY_ROW_CLASS[family]
  const sealGlyph = GLYPHS[id]
  const label = `${name} · ${FAMILY_LABEL[family]}${locked ? ' · restricted' : ''}`

  const cls = `${scope}-station ${scope}-${famClass}${locked ? ` ${scope}-locked` : ''}`
  const delay = 0.52 + index * 0.05

  const seal = (
    <span className={`${scope}-seal`}>
      {sealGlyph ? (
        <span
          className={`${scope}-seal-glyph`}
          dangerouslySetInnerHTML={{ __html: sealGlyph }}
        />
      ) : (
        <span className={`${scope}-seal-letter`}>{name.charAt(0).toUpperCase()}</span>
      )}
    </span>
  )

  const body = (
    <span className={`${scope}-body2`}>
      <span className={`${scope}-sname`}>{name}</span>
      <span className={`${scope}-sfam`}>{FAMILY_LABEL[family]}</span>
    </span>
  )

  // The number gets the Fraunces figure treatment; a trailing word stays
  // small-caps. Mirrors the prototype's stateHtml() regex split.
  const stateInner = locked ? (
    <>
      <LockIcon />
      Restricted
    </>
  ) : live ? (
    <>
      <span className={`${scope}-st-dot`} />
      Live
    </>
  ) : (
    metricNode(metric, scope)
  )

  const state = (
    <span
      className={`${scope}-state${live ? ` ${scope}-islive` : ''}`}
    >
      {stateInner}
    </span>
  )

  const go = (
    <span className={`${scope}-go`}>{locked ? <LockIcon /> : <ArrowIcon />}</span>
  )

  const content = (
    <>
      {seal}
      {body}
      <span className={`${scope}-leader`} />
      {state}
      {go}
    </>
  )

  if (locked) {
    return (
      <div className={cls} style={{ animationDelay: `${delay}s` }} aria-label={label} aria-disabled="true">
        {content}
      </div>
    )
  }

  return (
    <button
      type="button"
      className={cls}
      style={{ animationDelay: `${delay}s` }}
      aria-label={label}
      onClick={onLaunch}
    >
      {content}
    </button>
  )
}

/** Splits a leading figure ("87%", "38 out") into the Fraunces metric + tail. */
function metricNode(metric: string | undefined, scope: string): React.ReactNode {
  if (!metric) return null
  const m = /^([\d,]+%?)(.*)$/.exec(metric)
  if (!m) return metric
  return (
    <>
      <span className={`${scope}-mtr`}>{m[1]}</span>
      {m[2]}
    </>
  )
}

function ArrowIcon() {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.9" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
      <path d="M5 12h12M11 6l6 6-6 6" />
    </svg>
  )
}

function LockIcon() {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
      <rect x="5" y="11" width="14" height="9" rx="2" />
      <path d="M8 11V7.5a4 4 0 0 1 8 0V11" />
    </svg>
  )
}

/**
 * The scoped style block. Everything is prefixed with the instance `scope` so
 * multiple hubs coexist. Ported verbatim from the verified prototype, prefixed +
 * theme-keyed via [data-theme].
 */
function scopedCss(s: string): string {
  return `
.${s}-stage,.${s}-stage *,.${s}-stage *::before,.${s}-stage *::after{box-sizing:border-box}
@keyframes ${s}-pulse{0%,100%{opacity:1}50%{opacity:.4}}
@keyframes ${s}-draw{to{stroke-dashoffset:0}}
@keyframes ${s}-pop{to{opacity:1}}
@keyframes ${s}-blip{0%{opacity:.55;r:2}70%{opacity:0;r:8}100%{opacity:0}}
@keyframes ${s}-wipe{from{transform:scaleX(0)}to{transform:scaleX(1)}}
@keyframes ${s}-fade{from{opacity:0}to{opacity:1}}
@keyframes ${s}-rise{from{opacity:0;transform:translateY(12px)}to{opacity:1;transform:translateY(0)}}

/* ---------- STAGE / PAGE FRAME ---------- */
.${s}-stage{
  position:absolute;inset:0;margin-inline:auto;max-width:430px;min-height:0;
  background:radial-gradient(125% 80% at 50% -12%, var(--paper) 0%, var(--paper) 50%, var(--paper-2) 100%);
  display:flex;flex-direction:column;overflow:hidden;
  padding:env(safe-area-inset-top) env(safe-area-inset-right) env(safe-area-inset-bottom) env(safe-area-inset-left);
  font-family:${BODY_FONT};color:var(--ink);
}
/* faint paper grain / fibre */
.${s}-stage::before{
  content:"";position:absolute;inset:0;pointer-events:none;z-index:0;
  opacity:var(--grain-op);mix-blend-mode:var(--grain-blend);
  background:
    radial-gradient(1px 1px at 20% 30%, var(--grain) 50%, transparent 51%),
    radial-gradient(1px 1px at 70% 60%, var(--grain) 50%, transparent 51%),
    radial-gradient(1px 1px at 40% 80%, var(--grain) 50%, transparent 51%),
    radial-gradient(1px 1px at 88% 22%, var(--grain) 50%, transparent 51%);
  background-size:7px 7px,11px 11px,9px 9px,13px 13px;
}
/* vignette to seat the type on the page */
.${s}-stage::after{
  content:"";position:absolute;inset:0;pointer-events:none;z-index:0;
  background:radial-gradient(142% 114% at 50% 38%, transparent 56%, var(--vignette) 100%);
}

/* ============ MASTHEAD ============ */
.${s}-masthead{position:relative;z-index:2;padding:14px 22px 0;flex:none}
.${s}-rule-top{height:1.4px;background:var(--ink);opacity:.9;transform-origin:left center;
  animation:${s}-wipe .8s cubic-bezier(.2,.7,.2,1) both}
.${s}-rule-bot{height:.6px;background:var(--rule);margin-top:1px;transform-origin:left center;
  animation:${s}-wipe .8s .05s cubic-bezier(.2,.7,.2,1) both}
.${s}-meta{
  display:flex;align-items:center;justify-content:space-between;
  padding:6px 1px 5px;
  font-family:${BODY_FONT};
  font-size:8.5px;letter-spacing:.24em;text-transform:uppercase;color:var(--ink-soft);
  animation:${s}-fade .6s .12s ease both;
}
.${s}-m-left{font-family:${DISPLAY_FONT};font-weight:600;letter-spacing:.18em;color:var(--ink)}
.${s}-m-mid{letter-spacing:.26em;color:var(--ink-faint)}
.${s}-m-right{
  color:var(--accent-deep);letter-spacing:.18em;
  display:inline-flex;align-items:center;gap:6px;font-variant-numeric:tabular-nums;
}
[data-theme="dark"] .${s}-m-right{color:var(--accent)}
.${s}-pip{width:4px;height:4px;border-radius:50%;background:var(--accent);display:inline-block;
  box-shadow:0 0 0 2px var(--accent-tint);animation:${s}-pulse 2.6s ease-in-out infinite}

.${s}-nameplate{padding:11px 0 9px;animation:${s}-rise .7s .18s cubic-bezier(.2,.75,.2,1) both}
.${s}-over{display:flex;align-items:flex-end;justify-content:space-between;gap:12px}
.${s}-plate-title{
  font-family:${DISPLAY_FONT};font-optical-sizing:auto;color:var(--ink);
  font-weight:600;font-size:var(--title-size,46px);line-height:.9;letter-spacing:-.03em;
  white-space:nowrap;width:max-content;max-width:100%;flex:none;margin:0;
}
.${s}-plate-title em{font-style:italic;font-weight:500;color:var(--accent-deep)}
[data-theme="dark"] .${s}-plate-title em{color:var(--accent);text-shadow:0 0 22px var(--accent-tint)}
.${s}-signed{
  flex:none;text-align:right;line-height:1.35;padding-bottom:3px;
  font-family:${BODY_FONT};font-size:8px;letter-spacing:.2em;text-transform:uppercase;color:var(--ink-faint);
}
.${s}-signed b{
  display:block;font-family:${DISPLAY_FONT};font-weight:600;font-size:11px;
  text-transform:none;letter-spacing:0;color:var(--ink);
}
.${s}-strap{
  margin-top:7px;display:flex;align-items:center;gap:9px;
  font-family:${BODY_FONT};font-style:italic;font-size:10px;letter-spacing:.04em;color:var(--ink-faint);
}
.${s}-tick{width:18px;height:1px;background:var(--accent-deep);opacity:.7;display:inline-block;flex:none}
[data-theme="dark"] .${s}-tick{background:var(--accent);opacity:.6}
.${s}-clk{
  margin-left:auto;font-family:${BODY_FONT};font-style:normal;font-size:9px;
  letter-spacing:.18em;text-transform:uppercase;color:var(--ink-soft);
  font-variant-numeric:tabular-nums;display:inline-flex;align-items:center;gap:6px;
}
.${s}-clk-live{width:5px;height:5px;border-radius:50%;background:var(--accent);
  box-shadow:0 0 0 2px var(--accent-tint);animation:${s}-pulse 2.6s ease-in-out infinite;display:inline-block}

/* ============ BODY column ============ */
.${s}-body{position:relative;z-index:2;flex:1;min-height:0;display:flex;flex-direction:column;padding:0 22px}

/* ====== THE LEAD ====== */
.${s}-lead{
  flex:none;padding:13px 0 14px;
  border-top:1.4px solid var(--ink);border-bottom:.6px solid var(--rule);position:relative;
  animation:${s}-rise .7s .26s cubic-bezier(.2,.75,.2,1) both;
}
.${s}-lead-head{display:flex;align-items:center;justify-content:space-between;gap:10px;margin-bottom:13px}
.${s}-dek{
  font-family:${BODY_FONT};font-style:italic;font-size:10px;letter-spacing:.26em;text-transform:uppercase;
  color:var(--accent-deep);display:inline-flex;align-items:center;gap:9px;
}
[data-theme="dark"] .${s}-dek{color:var(--accent)}
.${s}-dek-tick{width:16px;height:1px;background:var(--accent-deep);opacity:.65;display:inline-block}
[data-theme="dark"] .${s}-dek-tick{background:var(--accent);opacity:.55}
.${s}-stamp{
  font-family:${BODY_FONT};font-size:8px;letter-spacing:.2em;text-transform:uppercase;
  color:var(--ink-faint);display:inline-flex;align-items:center;gap:6px;
}
.${s}-stamp-live{width:5px;height:5px;border-radius:50%;background:var(--accent);
  box-shadow:0 0 0 2px var(--accent-tint),0 0 7px var(--accent);
  animation:${s}-pulse 2.4s ease-in-out infinite;display:inline-block}

/* the hero figures — newspaper lead numbers */
.${s}-figs{display:flex;align-items:flex-end;gap:0}
.${s}-fig{flex:1;display:flex;flex-direction:column;gap:6px;min-width:0}
.${s}-fig + .${s}-fig{padding-left:14px;border-left:.6px solid var(--rule);margin-left:14px}
.${s}-lbl{
  font-family:${BODY_FONT};font-size:8px;letter-spacing:.16em;text-transform:uppercase;
  color:var(--ink-faint);white-space:nowrap;
}
.${s}-val{
  font-family:${DISPLAY_FONT};font-optical-sizing:auto;font-weight:600;font-size:42px;line-height:.84;
  color:var(--ink);letter-spacing:-.02em;font-variant-numeric:lining-nums tabular-nums;
  display:flex;align-items:baseline;gap:2px;
}
.${s}-val em{font-style:normal;font-size:18px;color:var(--ink-faint);font-weight:500;letter-spacing:0}
.${s}-flag .${s}-val{color:var(--accent-deep)}
[data-theme="dark"] .${s}-flag .${s}-val{color:var(--accent)}

/* the editorial line-art chart — thin ruled strokes */
.${s}-chart{
  margin-top:15px;position:relative;border-top:.6px dotted var(--ink-ghost);
  padding-top:11px;display:flex;align-items:flex-end;gap:13px;
}
.${s}-plot{flex:1;height:46px;position:relative;min-width:0}
.${s}-plot svg{width:100%;height:100%;display:block;overflow:visible}
.${s}-grid line{stroke:var(--rule);stroke-width:.5;opacity:.7}
.${s}-area{fill:var(--accent);opacity:.05}
.${s}-ln{
  fill:none;stroke:var(--accent-deep);stroke-width:1.25;stroke-linecap:round;stroke-linejoin:round;
  stroke-dasharray:520;stroke-dashoffset:520;animation:${s}-draw 1.5s cubic-bezier(.4,0,.2,1) .3s forwards;
}
[data-theme="dark"] .${s}-ln{stroke:var(--accent)}
.${s}-cpip{fill:var(--accent-deep);opacity:0;
  animation:${s}-pop .01s linear 1.8s forwards, ${s}-blip 2.6s ease-out 1.9s infinite}
[data-theme="dark"] .${s}-cpip{fill:var(--accent)}
.${s}-halo{fill:none;stroke:var(--accent);stroke-width:1;opacity:0;animation:${s}-blip 2.6s ease-out 1.9s infinite}
.${s}-legend{
  flex:none;width:64px;text-align:right;
  font-family:${BODY_FONT};font-size:7.5px;letter-spacing:.14em;text-transform:uppercase;
  color:var(--ink-faint);line-height:1.5;
}
.${s}-legend b{
  display:block;font-family:${DISPLAY_FONT};font-weight:600;font-size:13px;letter-spacing:0;
  text-transform:none;color:var(--ink);font-variant-numeric:lining-nums;
}
.${s}-up{color:var(--accent-deep);font-style:italic}
[data-theme="dark"] .${s}-up{color:var(--accent)}

/* ====== THE STATIONS ====== */
.${s}-stations{flex:1;min-height:0;display:flex;flex-direction:column;padding:11px 0 0}
.${s}-rail-head{display:flex;align-items:center;gap:10px;margin-bottom:3px;flex:none;
  animation:${s}-fade .6s .5s ease both}
.${s}-rh-name{
  font-family:${BODY_FONT};font-size:8.5px;letter-spacing:.3em;text-transform:uppercase;
  color:var(--ink-faint);flex:none;font-weight:500;
}
.${s}-rh-line{flex:1;height:.6px;background:var(--rule);opacity:.8}
.${s}-rh-count{
  font-family:${BODY_FONT};font-size:8.5px;letter-spacing:.14em;text-transform:uppercase;
  color:var(--ink-ghost);flex:none;font-variant-numeric:lining-nums;
}

.${s}-grid2{flex:1;min-height:0;display:grid;grid-template-columns:minmax(0,1fr);gap:0;align-content:stretch}

.${s}-station{
  display:flex;align-items:center;gap:11px;width:100%;text-align:left;
  appearance:none;-webkit-appearance:none;background:none;border:0;
  padding:0;text-decoration:none;color:inherit;position:relative;cursor:pointer;
  font-family:${BODY_FONT};
  border-bottom:.6px solid var(--rule-soft);
  animation:${s}-rise .55s cubic-bezier(.2,.75,.2,1) both;
}
.${s}-leader{
  flex:1;min-width:12px;align-self:center;height:0;margin:0 2px;
  border-bottom:1.5px dotted var(--ink-ghost);opacity:.5;
}
/* the seal glyph — embossed medallion / debossed glow */
.${s}-seal{
  width:23px;height:23px;flex:none;border-radius:50%;position:relative;
  color:var(--fam-deep);display:flex;align-items:center;justify-content:center;
  background:radial-gradient(circle at 50% 34%, var(--seal-hi) 0%, var(--fam-tint) 64%, var(--seal-lo) 100%);
  box-shadow:
    inset 0 .5px .5px rgba(255,255,255,.8),
    inset 0 -1px 1.5px rgba(110,74,18,.18),
    0 1px 3px -2px rgba(80,52,14,.4);
}
[data-theme="dark"] .${s}-seal{
  color:var(--fam);
  background:radial-gradient(circle at 50% 36%, var(--seal-hi) 0%, var(--seal-lo) 82%, var(--seal-lo) 100%);
  box-shadow:inset 0 .5px .5px rgba(255,238,200,.10), inset 0 -1px 2px rgba(0,0,0,.5), 0 4px 10px -6px rgba(0,0,0,.7);
}
.${s}-seal::before{content:"";position:absolute;inset:0;border-radius:50%;border:.85px solid var(--fam-deep);opacity:.85}
[data-theme="dark"] .${s}-seal::before{border-color:var(--fam);opacity:.7;box-shadow:0 0 8px -2px var(--fam)}
.${s}-seal svg{width:12.5px;height:12.5px;position:relative;z-index:1}
.${s}-seal-glyph{display:flex;align-items:center;justify-content:center}
.${s}-seal-letter{font-family:${DISPLAY_FONT};font-weight:600;font-size:11px;position:relative;z-index:1}

.${s}-body2{flex:none;min-width:0;display:flex;flex-direction:column;gap:0}
.${s}-sname{
  font-family:${DISPLAY_FONT};font-weight:600;font-size:14.5px;letter-spacing:-.012em;
  color:var(--ink);line-height:1.05;white-space:nowrap;
}
.${s}-sfam{
  font-family:${BODY_FONT};font-size:7px;letter-spacing:.2em;text-transform:uppercase;
  color:var(--fam-deep);line-height:1.3;
}
[data-theme="dark"] .${s}-sfam{color:var(--fam)}

.${s}-state{
  flex:none;display:inline-flex;align-items:center;gap:7px;
  font-family:${BODY_FONT};font-size:8px;letter-spacing:.14em;text-transform:uppercase;
  color:var(--ink-faint);white-space:nowrap;
}
.${s}-mtr{
  font-family:${DISPLAY_FONT};font-weight:600;font-size:10.5px;letter-spacing:0;text-transform:none;
  color:var(--ink);font-variant-numeric:lining-nums;
}
.${s}-islive{color:var(--fam-deep);font-style:italic;letter-spacing:.06em}
[data-theme="dark"] .${s}-islive{color:var(--fam)}
.${s}-st-dot{width:5px;height:5px;border-radius:50%;background:var(--fam);
  box-shadow:0 0 6px var(--fam);animation:${s}-pulse 2.4s ease-in-out infinite;display:inline-block}
.${s}-go{
  flex:none;width:14px;display:flex;align-items:center;justify-content:center;
  color:var(--fam-deep);transition:transform .18s cubic-bezier(.2,.7,.2,1);
}
[data-theme="dark"] .${s}-go{color:var(--fam)}
.${s}-go svg{width:14px;height:14px}
.${s}-station:hover .${s}-go{transform:translateX(3px)}

/* family ink binding */
.${s}-f-audits{--fam:var(--aud);--fam-deep:var(--aud-deep);--fam-tint:var(--aud-tint)}
.${s}-f-dash{--fam:var(--dsh);--fam-deep:var(--dsh-deep);--fam-tint:var(--dsh-tint)}
.${s}-f-reg{--fam:var(--reg);--fam-deep:var(--reg-deep);--fam-tint:var(--reg-tint)}
.${s}-f-logs{--fam:var(--log);--fam-deep:var(--log-deep);--fam-tint:var(--log-tint)}

/* RESTRICTED stations — quiet, greyed, non-interactive */
.${s}-locked{cursor:default}
.${s}-locked .${s}-seal{
  color:var(--ink-ghost);
  background:radial-gradient(circle at 50% 34%, var(--paper) 0%, var(--paper-2) 100%);
  box-shadow:inset 0 -1px 1px rgba(0,0,0,.08);
}
.${s}-locked .${s}-seal::before{border-color:var(--ink-ghost);opacity:.5;box-shadow:none}
[data-theme="dark"] .${s}-locked .${s}-seal{color:var(--ink-ghost);box-shadow:inset 0 -1px 1.5px rgba(0,0,0,.4)}
[data-theme="dark"] .${s}-locked .${s}-seal::before{border-color:var(--ink-ghost);opacity:.4;box-shadow:none}
.${s}-locked .${s}-sname{color:var(--ink-faint);font-weight:500}
.${s}-locked .${s}-sfam{color:var(--ink-ghost)}
.${s}-locked .${s}-state{color:var(--ink-ghost);font-style:italic;letter-spacing:.14em}
.${s}-locked .${s}-state svg{width:9px;height:9px;flex:none}
.${s}-locked .${s}-go{color:var(--ink-ghost);opacity:.45}
.${s}-locked:hover .${s}-go{transform:none}

/* ============ COLOPHON ============ */
.${s}-colophon{
  position:relative;z-index:2;flex:none;margin:0 22px;
  padding-top:10px;padding-bottom:15px;border-top:.6px solid var(--rule);
  display:flex;align-items:center;justify-content:space-between;
  font-family:${BODY_FONT};font-size:8.5px;letter-spacing:.22em;text-transform:uppercase;color:var(--ink-faint);
  animation:${s}-fade .8s .9s ease both;
}
.${s}-maker{display:flex;align-items:baseline;gap:7px;color:var(--ink-soft)}
.${s}-aud{
  font-family:${DISPLAY_FONT};font-weight:600;font-size:13px;letter-spacing:.01em;text-transform:none;color:var(--ink);
}
.${s}-aud i{font-style:italic;font-weight:500;color:var(--accent-deep)}
[data-theme="dark"] .${s}-aud i{color:var(--accent)}
.${s}-secure{color:var(--accent-deep);letter-spacing:.18em;display:inline-flex;align-items:center;gap:6px}
[data-theme="dark"] .${s}-secure{color:var(--accent)}
.${s}-c-pip{width:3px;height:3px;border-radius:50%;background:var(--accent);display:inline-block;opacity:.9}

@media (prefers-reduced-motion:reduce){
  .${s}-stage *{animation:none !important}
  .${s}-ln{stroke-dashoffset:0 !important}
  .${s}-cpip,.${s}-halo{opacity:1 !important}
}

/* compact safety for very short viewports */
@media (max-height:850px){
  .${s}-val{font-size:38px}
  .${s}-lead{padding:11px 0 12px}
}
`
}

export default EditorialMissionControl
