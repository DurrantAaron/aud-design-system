import React, { useId, useLayoutEffect } from 'react'
import type { FamilyKey } from '../families'

/**
 * One Google Fonts <link> for the data-forward duotone hub. Space Grotesk is the
 * confident display grotesk for the hero metrics + identity title; Hanken Grotesk
 * is the humane UI/text grotesk for the body + launcher rows; Space Mono is the
 * telemetry face (eyebrows, keys, metrics). Injected once per document
 * (id-guarded) so mounting many hubs never duplicates the stylesheet.
 */
const FONTS_LINK_ID = 'aud-duotone-mc-fonts'
const FONTS_HREF =
  'https://fonts.googleapis.com/css2?family=Space+Grotesk:wght@400;500;600;700&family=Hanken+Grotesk:wght@400;500;600;700;800&family=Space+Mono:wght@400;700&display=swap'

const HERO_FONT = "'Space Grotesk', system-ui, sans-serif"
const BODY_FONT = "'Hanken Grotesk', system-ui, sans-serif"
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

/* ============================================================================
 * BESPOKE SEAL GLYPHS
 * Inlined verbatim from /home/pi/design-lab/glyphs/final/<id>.svg. Each draws
 * with `currentColor` so the launcher seals + the brand mark colour themselves
 * from the family accent. Kept internal so the hub renders fully self-contained
 * (no icon dependency on consumers). The `precinct-ops` glyph doubles as the
 * top-left brand mark.
 * ========================================================================== */
const GLYPHS: Record<string, string> = {
  'precinct-ops':
    '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.75" stroke-linecap="round" stroke-linejoin="round"><path d="M3 17h18"/><path d="M3 17a9 9 0 0 1 18 0"/><path d="M7.5 17a4.5 4.5 0 0 1 9 0"/><path d="m12 17 6-5"/><circle cx="16.5" cy="9.5" r="1" fill="currentColor" stroke="none"/></svg>',
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

/* ============================================================================
 * THEME TOKENS — ported verbatim from the verified prototype's :root +
 * :root[data-theme="light"] blocks.
 * ========================================================================== */
interface MCTokens {
  /* neutral frame (the page the plate + launcher sit on) */
  bg: string
  bg2: string
  bgFloor: string
  hair: string
  hairSoft: string
  onDark: string
  onDarkDim: string
  onDarkFaint: string
  /* panel surfaces for the launcher rows below the plate */
  panel: string
  panel2: string
  panelHair: string
  panelHair2: string
  /* chrome on the plate (glass chips, hairlines) */
  chipBg: string
  chipHair: string
  chipHairSoft: string
  chipSheen: string
  /* hero ink + plate-content tones */
  heroInk: string
  heroDim: string
  heroFaint: string
  plateHair: string
  plateHairSoft: string
  heroShadow: string
  /* launcher text tones */
  tileName: string
  tileFam: string
  tileFaint: string
  /* foot maker's-mark */
  footInk: string
  footSealInk: string
  footSealBg: string
  footSealHair: string
  /* reading scrim + plate lift */
  scrimTop: string
  scrimMid: string
  scrimBot: string
  vignette: string
  grainBlend: 'overlay' | 'soft-light'
  grainOpacity: string
  plateFade: string
  pageHaloOp: string
  /* the hub's OWN duotone pair = the OS teal signal (dashboards family) */
  duoDark: string
  duoMid: string
  duoLight: string
  leak: string
  accent: string
  accent2: string
  accentDeep: string
  accentInk: string
  halo: string
  meshRot: string
  /* hero-metric special tones */
  accValLight: string
  warnVal: string
  warnValLight: string
  accValLightVal: string
  /* family-accent launcher map (the colour-coded rows) */
  aud: string
  aud2: string
  audGlow: string
  audVeil: string
  dsh: string
  dsh2: string
  dshGlow: string
  dshVeil: string
  reg: string
  reg2: string
  regGlow: string
  regVeil: string
  log: string
  log2: string
  logGlow: string
  logVeil: string
  /* page body backdrop + card shadow */
  bodyBg: string
  cardShadow: string
  /* locked-row text + seal/go neutrals */
  lockedHover: string
}

const THEME: Record<'light' | 'dark', MCTokens> = {
  dark: {
    bg: '#0B0C11',
    bg2: '#13141B',
    bgFloor: '#070810',
    hair: 'rgba(255,255,255,.10)',
    hairSoft: 'rgba(255,255,255,.055)',
    onDark: '#F4F5F9',
    onDarkDim: '#B2B5C5',
    onDarkFaint: '#71748A',
    panel: '#12141C',
    panel2: '#161922',
    panelHair: 'rgba(255,255,255,.07)',
    panelHair2: 'rgba(255,255,255,.11)',
    chipBg: 'rgba(7,8,15,.40)',
    chipHair: 'rgba(255,255,255,.15)',
    chipHairSoft: 'rgba(255,255,255,.13)',
    chipSheen: 'rgba(255,255,255,.05)',
    heroInk: '#ffffff',
    heroDim: '#B2B5C5',
    heroFaint: '#71748A',
    plateHair: 'rgba(255,255,255,.12)',
    plateHairSoft: 'rgba(255,255,255,.07)',
    heroShadow: '0 2px 30px rgba(0,0,0,.45)',
    tileName: '#F4F5F9',
    tileFam: '#B2B5C5',
    tileFaint: '#71748A',
    footInk: '#71748A',
    footSealInk: '#B2B5C5',
    footSealBg: 'rgba(255,255,255,.03)',
    footSealHair: 'rgba(255,255,255,.10)',
    scrimTop: 'rgba(6,7,14,.30)',
    scrimMid: 'rgba(6,7,14,.50)',
    scrimBot: 'rgba(5,6,11,.93)',
    vignette: 'rgba(5,7,14,.48)',
    grainBlend: 'overlay',
    grainOpacity: '.40',
    plateFade: '0',
    pageHaloOp: '.42',
    duoDark: '#04222C',
    duoMid: '#0C5A66',
    duoLight: '#4FE0E3',
    leak: '#7DF0F0',
    accent: '#22C9C9',
    accent2: '#6EEFE0',
    accentDeep: '#12969C',
    accentInk: '#041416',
    halo: 'rgba(34,201,201,.40)',
    meshRot: '-46deg',
    accValLight: '#6EEFE0',
    warnVal: '#FFD98A',
    warnValLight: '#B07E1C',
    accValLightVal: '#0C5A62',
    aud: '#E8B04B',
    aud2: '#F6CE7E',
    audGlow: 'rgba(232,176,75,.42)',
    audVeil: 'rgba(232,176,75,.14)',
    dsh: '#2DD4BF',
    dsh2: '#6EEFE0',
    dshGlow: 'rgba(45,212,191,.42)',
    dshVeil: 'rgba(45,212,191,.13)',
    reg: '#F0876A',
    reg2: '#F8A98F',
    regGlow: 'rgba(240,135,106,.42)',
    regVeil: 'rgba(240,135,106,.14)',
    log: '#5BD08A',
    log2: '#8BE3AE',
    logGlow: 'rgba(91,208,138,.42)',
    logVeil: 'rgba(91,208,138,.14)',
    bodyBg: '#000',
    cardShadow:
      '0 1px 0 0 rgba(255,255,255,.06) inset,' +
      '0 0 0 1px rgba(255,255,255,.09),' +
      '0 0 0 1px rgba(0,0,0,.5),' +
      '0 2px 6px -2px rgba(0,0,0,.5),' +
      '0 18px 38px -22px rgba(0,0,0,.7),' +
      '0 36px 80px -40px rgba(0,0,0,.9)',
    lockedHover: '#0A0D0C',
  },
  light: {
    bg: '#F4F2EE',
    bg2: '#FBFAF7',
    bgFloor: '#E7E3DB',
    hair: 'rgba(20,18,14,.12)',
    hairSoft: 'rgba(20,18,14,.07)',
    onDark: '#1A1814',
    onDarkDim: '#5A554C',
    onDarkFaint: '#8E887C',
    panel: '#FFFFFF',
    panel2: '#FBFAF7',
    panelHair: 'rgba(20,18,14,.10)',
    panelHair2: 'rgba(20,18,14,.16)',
    chipBg: 'rgba(255,255,255,.55)',
    chipHair: 'rgba(255,255,255,.7)',
    chipHairSoft: 'rgba(20,18,14,.10)',
    chipSheen: 'rgba(255,255,255,.6)',
    heroInk: '#101820',
    heroDim: '#3A453F',
    heroFaint: '#6A726E',
    plateHair: 'rgba(20,30,28,.18)',
    plateHairSoft: 'rgba(20,30,28,.11)',
    heroShadow: '0 1px 16px rgba(255,255,255,.5)',
    tileName: '#1A1814',
    tileFam: '#5A554C',
    tileFaint: '#8E887C',
    footInk: '#8E887C',
    footSealInk: '#5A554C',
    footSealBg: 'rgba(255,255,255,.7)',
    footSealHair: 'rgba(20,18,14,.12)',
    scrimTop: 'rgba(255,253,248,.08)',
    scrimMid: 'rgba(255,253,248,.16)',
    scrimBot: 'rgba(255,253,248,.55)',
    vignette: 'rgba(120,110,96,.16)',
    grainBlend: 'soft-light',
    grainOpacity: '.26',
    plateFade: '.30',
    pageHaloOp: '.36',
    duoDark: '#0E5A62',
    duoMid: '#2E9498',
    duoLight: '#A6EEF0',
    leak: '#CFF6F7',
    accent: '#119499',
    accent2: '#0C7479',
    accentDeep: '#0C7479',
    accentInk: '#E8FBFB',
    halo: 'rgba(17,148,153,.30)',
    meshRot: '-46deg',
    accValLight: '#0C5A62',
    warnVal: '#FFD98A',
    warnValLight: '#B07E1C',
    accValLightVal: '#0C5A62',
    aud: '#B07E1C',
    aud2: '#C9821A',
    audGlow: 'rgba(176,126,28,.34)',
    audVeil: 'rgba(176,126,28,.12)',
    dsh: '#0C7479',
    dsh2: '#119499',
    dshGlow: 'rgba(12,116,121,.34)',
    dshVeil: 'rgba(12,116,121,.10)',
    reg: '#C45236',
    reg2: '#D85A3C',
    regGlow: 'rgba(196,82,54,.34)',
    regVeil: 'rgba(196,82,54,.11)',
    log: '#0C7C4A',
    log2: '#118A52',
    logGlow: 'rgba(12,124,74,.34)',
    logVeil: 'rgba(12,124,74,.10)',
    bodyBg: '#E7E3DB',
    cardShadow:
      '0 1px 0 0 rgba(255,255,255,.5) inset,' +
      '0 0 0 1px rgba(255,255,255,.5),' +
      '0 0 0 1px rgba(120,110,96,.18),' +
      '0 2px 8px -3px rgba(80,72,60,.22),' +
      '0 18px 38px -22px rgba(80,72,60,.30),' +
      '0 36px 80px -42px rgba(80,72,60,.40)',
    lockedHover: '#fff',
  },
}

/** Maps a {@link FamilyKey} to its launcher row class suffix. */
const FAMILY_ROW_CLASS: Record<FamilyKey, string> = {
  audits: 'f-audits',
  dashboards: 'f-dash',
  registers: 'f-reg',
  logs: 'f-logs',
}

/** The short family label shown in each row's eyebrow. */
const FAMILY_LABEL: Record<FamilyKey, string> = {
  audits: 'Audits',
  dashboards: 'Dashboards',
  registers: 'Registers',
  logs: 'Logs',
}

/** Live-ops hero metrics shown in the duotone header plate. */
export interface MissionControlOps {
  /** "Venues live" — rendered as N/total when {@link venuesTotal} is given. */
  venuesLive: number
  /** Optional denominator for the venues-live metric (e.g. 13 -> "12/13"). */
  venuesTotal?: number
  /** "Run events" — a running count. */
  runEvents: number
  /** "Open flags" — rendered in the warn tone. */
  openFlags: number
}

/** One launchable (or restricted) app in the launcher. */
export interface MissionControlApp {
  /**
   * Stable id — also the key into the bespoke seal-glyph map. When it matches a
   * known glyph (venue-audit, cleaning-audit, precinct-compliance,
   * cleaning-dashboard, first-aid-register, headset-issuance, security-tracker,
   * control-log) the matching seal is drawn; otherwise the family glyph or the
   * first letter of {@link MissionControlApp.name} stands in.
   */
  id: string
  /** Display name. */
  name: string
  /** Which function family colours the row + seal. */
  family: FamilyKey
  /** Right-aligned status, e.g. "87% pass", "38 out". Ignored while `live`. */
  metric?: string
  /** Renders a pulsing "LIVE" pip in place of the metric. */
  live?: boolean
  /** Restricted — greyed, lock icon, not launchable. */
  locked?: boolean
  /** Launch handler. Not wired when `locked`. */
  onLaunch?: () => void
}

export interface DuotoneMissionControlProps
  extends Omit<React.HTMLAttributes<HTMLDivElement>, 'title'> {
  /** The suite label after the "AuD" wordmark in the brand chip. Default "Operations Suite". */
  suiteName?: string
  /** Identity line under the title, e.g. "A. Durrant". Hidden when absent. */
  signedInAs?: string
  /** Initials inside the identity avatar. Defaults to initials of {@link signedInAs}, then "A". */
  initials?: string
  /** Role suffix on the identity line, e.g. "Operations". Default "Operations". */
  role?: string
  /** The eyebrow over the title, e.g. "Precinct 04 · Mission Control". */
  eyebrow?: string
  /** The plate title. Default "Precinct Ops" with "Ops" in the accent. */
  title?: React.ReactNode
  /** The live/status word in the top-right chip. Default "Live". */
  liveword?: string
  /** Live-ops hero metrics. Hidden when absent. */
  ops?: MissionControlOps
  /**
   * Sparkline points as `0..1` highs (0 = top of the well, 1 = bottom). The last
   * point carries the streaming pip. Defaults to the prototype's series.
   */
  spark?: number[]
  /** The launcher apps (any length; 8 in the prototype). */
  apps: MissionControlApp[]
  /** Neutral + duotone palette. Default "dark". */
  theme?: 'light' | 'dark'
}

const DEFAULT_SPARK = [30, 24, 31, 16, 22, 11, 18, 6, 12, 8]

function initialsOf(name?: string): string {
  if (!name) return 'A'
  const parts = name.replace(/[.,]/g, ' ').trim().split(/\s+/).filter(Boolean)
  if (parts.length === 0) return 'A'
  if (parts.length === 1) return parts[0].slice(0, 2).toUpperCase()
  return (parts[0][0] + parts[parts.length - 1][0]).toUpperCase()
}

/** Builds the sparkline path `d` (line) + the fill-floor path from 0..1 highs. */
function sparkPaths(points: number[]): { line: string; fill: string; lastX: number; lastY: number } {
  const n = Math.max(points.length, 2)
  const W = 96
  const H = 42
  const step = W / (n - 1)
  const coords = points.map((p, i) => {
    const x = Math.min(i * step, W)
    // The prototype expresses highs directly as y in a 0..42 well (smaller = higher).
    const y = Math.max(0, Math.min(H, p))
    return [Math.round(x), Math.round(y)] as const
  })
  const line = coords.map(([x, y], i) => `${i === 0 ? 'M' : 'L'}${x},${y}`).join(' ')
  const [lx, ly] = coords[coords.length - 1]
  const fill = `${line} L${lx},${H} L0,${H} Z`.replace(/^M/, 'M')
  return { line, fill, lastX: lx, lastY: ly }
}

/**
 * The data-forward DUOTONE precinct-ops hub — "Mission Control".
 *
 * A neutral page frame holds a framed duotone HEADER PLATE (an abstract, lit
 * teal material) carrying the suite identity, the signed-in line, and LIVE-OPS
 * hero metrics with a streaming sparkline. Below the plate, a compact app
 * launcher renders one family-coloured row per app — each with its bespoke seal
 * glyph, a live/metric readout, and a go affordance (restricted apps grey out
 * behind a lock). A maker's-mark footer closes it out.
 *
 * Self-contained: all styling is inline + one scoped `<style>` block; the 8
 * bespoke seal glyphs are inlined as an internal id->SVG map (currentColor); the
 * only external dependency is the Google Fonts `<link>` (Space Grotesk + Hanken
 * Grotesk + Space Mono) injected once per document.
 *
 * ```tsx
 * <DuotoneMissionControl
 *   eyebrow="Precinct 04 · Mission Control"
 *   signedInAs="A. Durrant"
 *   ops={{ venuesLive: 12, venuesTotal: 13, runEvents: 1482, openFlags: 3 }}
 *   apps={[
 *     { id: 'venue-audit', name: 'Venue Audit', family: 'audits', metric: '87% pass', onLaunch },
 *     { id: 'precinct-compliance', name: 'Precinct Compliance', family: 'dashboards', live: true, onLaunch },
 *     { id: 'control-log', name: 'Control Log', family: 'logs', metric: 'restricted', locked: true },
 *   ]}
 * />
 * ```
 */
export function DuotoneMissionControl({
  suiteName = 'Operations Suite',
  signedInAs,
  initials,
  role = 'Operations',
  eyebrow = 'Precinct 04 · Mission Control',
  title,
  liveword = 'Live',
  ops,
  spark = DEFAULT_SPARK,
  apps,
  theme = 'dark',
  style,
  ...rest
}: DuotoneMissionControlProps) {
  useFontsLink()

  const t = THEME[theme]

  // A scope id so the (necessarily class-based) plate/grain/launcher layers and
  // hover states never leak between two hubs on the same page.
  const rawId = useId()
  const scope = `aud-mc-${rawId.replace(/[^a-zA-Z0-9_-]/g, '')}`

  // CSS custom properties feed the scoped <style> rules (gradients reference
  // multiple vars, which inline styles cannot express cleanly).
  const vars = {
    '--bg': t.bg,
    '--bg-2': t.bg2,
    '--bg-floor': t.bgFloor,
    '--hair': t.hair,
    '--hair-soft': t.hairSoft,
    '--on-dark': t.onDark,
    '--on-dark-dim': t.onDarkDim,
    '--on-dark-faint': t.onDarkFaint,
    '--panel': t.panel,
    '--panel-2': t.panel2,
    '--panel-hair': t.panelHair,
    '--panel-hair-2': t.panelHair2,
    '--chip-bg': t.chipBg,
    '--chip-hair': t.chipHair,
    '--chip-hair-soft': t.chipHairSoft,
    '--chip-sheen': t.chipSheen,
    '--hero-ink': t.heroInk,
    '--hero-dim': t.heroDim,
    '--hero-faint': t.heroFaint,
    '--plate-hair': t.plateHair,
    '--plate-hair-soft': t.plateHairSoft,
    '--hero-shadow': t.heroShadow,
    '--tile-name': t.tileName,
    '--tile-fam': t.tileFam,
    '--tile-faint': t.tileFaint,
    '--foot-ink': t.footInk,
    '--foot-seal-ink': t.footSealInk,
    '--foot-seal-bg': t.footSealBg,
    '--foot-seal-hair': t.footSealHair,
    '--scrim-top': t.scrimTop,
    '--scrim-mid': t.scrimMid,
    '--scrim-bot': t.scrimBot,
    '--vignette': t.vignette,
    '--grain-blend': t.grainBlend,
    '--grain-opacity': t.grainOpacity,
    '--plate-fade': t.plateFade,
    '--page-halo-op': t.pageHaloOp,
    '--duo-dark': t.duoDark,
    '--duo-mid': t.duoMid,
    '--duo-light': t.duoLight,
    '--leak': t.leak,
    '--accent': t.accent,
    '--accent-2': t.accent2,
    '--accent-deep': t.accentDeep,
    '--accent-ink': t.accentInk,
    '--halo': t.halo,
    '--mesh-rot': t.meshRot,
    '--acc-val': t.accValLight,
    '--warn-val': theme === 'light' ? t.warnValLight : t.warnVal,
    '--aud': t.aud,
    '--aud-2': t.aud2,
    '--aud-glow': t.audGlow,
    '--aud-veil': t.audVeil,
    '--dsh': t.dsh,
    '--dsh-2': t.dsh2,
    '--dsh-glow': t.dshGlow,
    '--dsh-veil': t.dshVeil,
    '--reg': t.reg,
    '--reg-2': t.reg2,
    '--reg-glow': t.regGlow,
    '--reg-veil': t.regVeil,
    '--log': t.log,
    '--log-2': t.log2,
    '--log-glow': t.logGlow,
    '--log-veil': t.logVeil,
    '--locked-hover': t.lockedHover,
  } as React.CSSProperties

  const lockedCount = apps.filter((a) => a.locked).length
  const resolvedInitials = initials ?? initialsOf(signedInAs)
  const { line, fill, lastX, lastY } = sparkPaths(spark)

  const titleNode: React.ReactNode =
    title ?? (
      <>
        Precinct <span className={`${scope}-os`}>Ops</span>
      </>
    )

  return (
    <div
      data-theme={theme}
      style={{
        ...vars,
        minHeight: '100vh',
        width: '100%',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        background: t.bodyBg,
        color: t.onDark,
        fontFamily: BODY_FONT,
        WebkitFontSmoothing: 'antialiased',
        ...style,
      }}
      {...rest}
    >
      <style>{scopedCss(scope)}</style>

      <div className={`${scope}-stage`}>
        {/* ============ 1 · FRAMED DUOTONE HEADER PLATE ============ */}
        <div className={`${scope}-plate-card`}>
          <div className={`${scope}-plate`} />
          <div className={`${scope}-mesh`} />
          <div className={`${scope}-streak`} />
          <div className={`${scope}-leak`} />
          <div className={`${scope}-lift`} />
          <div className={`${scope}-grain`} />
          <div className={`${scope}-vignette`} />
          <div className={`${scope}-scrim`} />

          <div className={`${scope}-pc`}>
            <div className={`${scope}-topbar`}>
              <div className={`${scope}-brandchip`}>
                <span
                  className={`${scope}-mark`}
                  dangerouslySetInnerHTML={{ __html: GLYPHS['precinct-ops'] }}
                />
                <b>AuD</b>
                <span>{suiteName}</span>
              </div>
              <div className={`${scope}-livechip`}>
                <span className={`${scope}-dot`} />
                <span>{liveword}</span>
              </div>
            </div>

            <div className={`${scope}-eyebrow`}>{eyebrow}</div>
            <div className={`${scope}-ptitle`}>{titleNode}</div>
            {signedInAs && (
              <div className={`${scope}-pwho`}>
                <span className={`${scope}-av`}>{resolvedInitials}</span>
                Signed in as <b>{signedInAs}</b>
                {role ? <> &middot; {role}</> : null}
              </div>
            )}

            {/* LIVE-OPS HERO METRICS + streaming sparkline */}
            {ops && (
              <div className={`${scope}-hero-metrics`}>
                <div className={`${scope}-hm`}>
                  <span className={`${scope}-k`}>Venues live</span>
                  <span className={`${scope}-v ${scope}-acc`}>
                    {ops.venuesLive}
                    {typeof ops.venuesTotal === 'number' && (
                      <em>/{ops.venuesTotal}</em>
                    )}
                  </span>
                </div>
                <div className={`${scope}-hm`}>
                  <span className={`${scope}-k`}>Run events</span>
                  <span className={`${scope}-v`}>{ops.runEvents.toLocaleString()}</span>
                </div>
                <div className={`${scope}-hm`}>
                  <span className={`${scope}-k`}>Open flags</span>
                  <span className={`${scope}-v ${scope}-warn`}>{ops.openFlags}</span>
                </div>
                <div className={`${scope}-spark`} aria-hidden="true">
                  <svg viewBox="0 0 96 42" preserveAspectRatio="none">
                    <path className={`${scope}-fl`} d={fill} />
                    <path className={`${scope}-ln`} d={line} />
                    <circle className={`${scope}-pp`} cx={lastX} cy={lastY} r="2" />
                  </svg>
                </div>
              </div>
            )}
          </div>
        </div>

        {/* ============ 2 · APP LAUNCHER ============ */}
        <div className={`${scope}-launch`}>
          <div className={`${scope}-launch-head`}>
            <span>
              Apps &middot; {apps.length}
              {lockedCount > 0 && (
                <>
                  {' '}
                  &middot; <span style={{ opacity: 0.7 }}>{lockedCount} restricted</span>
                </>
              )}
            </span>
            <span className={`${scope}-legend`}>
              <span>
                <span className={`${scope}-sw`} style={{ background: 'var(--aud)' }} />
                Audits
              </span>
              <span>
                <span className={`${scope}-sw`} style={{ background: 'var(--dsh)' }} />
                Dash
              </span>
              <span>
                <span className={`${scope}-sw`} style={{ background: 'var(--reg)' }} />
                Reg
              </span>
              <span>
                <span className={`${scope}-sw`} style={{ background: 'var(--log)' }} />
                Logs
              </span>
            </span>
          </div>

          <div className={`${scope}-rows`}>
            {apps.map((app, i) => (
              <LauncherRow key={app.id || i} app={app} scope={scope} />
            ))}
          </div>
        </div>

        {/* ============ FOOTER ============ */}
        <div className={`${scope}-foot`}>
          <span className={`${scope}-maker`}>
            <span className={`${scope}-d`} />
            Powered by{' '}
            <span className={`${scope}-seal-mk`}>
              A<i>u</i>D
            </span>{' '}
            OS
          </span>
          <span className={`${scope}-secure`}>
            <ShieldIcon />
            SSO &middot; ENCRYPTED
          </span>
        </div>
      </div>
    </div>
  )
}

function LauncherRow({ app, scope }: { app: MissionControlApp; scope: string }) {
  const { id, name, family, metric, live, locked, onLaunch } = app
  const famClass = FAMILY_ROW_CLASS[family]
  const sealGlyph = GLYPHS[id]
  const label = `${name} · ${FAMILY_LABEL[family]}${locked ? ' · restricted' : ''}`

  const cls = `${scope}-row ${scope}-${famClass}${locked ? ` ${scope}-locked` : ''}`

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

  const mid = (
    <span className={`${scope}-rmid`}>
      <span className={`${scope}-fam`}>{FAMILY_LABEL[family]}</span>
      <span className={`${scope}-name`}>{name}</span>
    </span>
  )

  const right = (
    <span className={`${scope}-rright`}>
      <span className={`${scope}-metric${live ? ` ${scope}-metric-live` : ''}`}>
        {live ? (
          <>
            <span className={`${scope}-ld`} />
            LIVE
          </>
        ) : (
          metric
        )}
      </span>
      <span className={`${scope}-go`}>{locked ? <LockIcon /> : <ArrowIcon />}</span>
    </span>
  )

  if (locked) {
    return (
      <div className={cls} aria-label={label} aria-disabled="true">
        {seal}
        {mid}
        {right}
      </div>
    )
  }

  return (
    <button type="button" className={cls} aria-label={label} onClick={onLaunch}>
      {seal}
      {mid}
      {right}
    </button>
  )
}

function ArrowIcon() {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
      <path d="M5 12h13M13 6l6 6-6 6" />
    </svg>
  )
}

function LockIcon() {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.9" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
      <rect x="5" y="11" width="14" height="9" rx="2" />
      <path d="M8 11V7.5a4 4 0 0 1 8 0V11" />
    </svg>
  )
}

function ShieldIcon() {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
      <path d="M12 3l7 3v5c0 4.5-3 8-7 9-4-1-7-4.5-7-9V6l7-3Z" />
      <path d="m9 12 2 2 4-4" />
    </svg>
  )
}

/**
 * The scoped style block. Everything is prefixed with the instance `scope` so
 * multiple hubs coexist, and the duotone gradients (which compose many CSS vars
 * and can't be expressed as a single inline value) live here. Ported verbatim
 * from the verified prototype, prefixed + theme-keyed via [data-theme].
 */
function scopedCss(s: string): string {
  return `
.${s}-stage,.${s}-stage *,.${s}-stage *::before,.${s}-stage *::after{box-sizing:border-box}
@keyframes ${s}-cardIn{from{opacity:0;transform:translateY(12px) scale(.99)}to{opacity:1;transform:none}}
@keyframes ${s}-plateDrift{from{opacity:0;transform:scale(1.07) translateY(-1.5%)}60%{opacity:.96}to{opacity:.96;transform:none}}
@keyframes ${s}-leakIn{from{opacity:0}to{opacity:.40}}
@keyframes ${s}-fadeUp{from{opacity:0;transform:translateY(10px)}to{opacity:1;transform:none}}
@keyframes ${s}-rowIn{from{opacity:0;transform:translateY(8px)}to{opacity:1;transform:none}}
@keyframes ${s}-pulse{0%,100%{opacity:1;box-shadow:0 0 0 3px var(--halo)}50%{opacity:.55;box-shadow:0 0 0 6px transparent}}
@keyframes ${s}-draw{to{stroke-dashoffset:0}}
@keyframes ${s}-pip{0%{opacity:.95;r:2}70%{opacity:0;r:6}100%{opacity:0}}

/* ---------- STAGE / PAGE FRAME ---------- */
.${s}-stage{
  position:relative;width:100%;max-width:430px;height:100vh;max-height:932px;
  background:radial-gradient(135% 88% at 50% -16%, var(--bg-2) 0%, var(--bg) 58%, var(--bg-floor) 100%);
  display:flex;flex-direction:column;padding:14px 14px 14px;overflow:hidden;
}
.${s}-stage::before{
  content:"";position:absolute;left:50%;bottom:-14%;width:130%;height:48%;
  transform:translateX(-50%);
  background:radial-gradient(60% 100% at 50% 100%, var(--halo) 0%, transparent 70%);
  opacity:var(--page-halo-op);pointer-events:none;filter:blur(8px);
}

/* ===== 1 · FRAMED DUOTONE HEADER PLATE ===== */
.${s}-plate-card{
  position:relative;flex:0 0 auto;border-radius:24px;overflow:hidden;
  background:var(--duo-dark);
  box-shadow:${THEME.dark.cardShadow.replace(/,/g, ',\n    ')};
  display:flex;flex-direction:column;isolation:isolate;
  animation:${s}-cardIn 1s cubic-bezier(.2,.8,.2,1) both;
}
[data-theme="light"] .${s}-plate-card{box-shadow:${THEME.light.cardShadow.replace(/,/g, ',\n    ')};}

.${s}-plate{position:absolute;inset:0;z-index:0;overflow:hidden;
  background:
    radial-gradient(95% 62% at 50% 4%, color-mix(in srgb, var(--duo-mid) 88%, var(--duo-light) 12%) 0%, transparent 56%),
    radial-gradient(120% 88% at 50% 6%, var(--duo-mid) 0%, var(--duo-dark) 64%),
    radial-gradient(140% 72% at 50% 110%, color-mix(in srgb, var(--duo-mid) 60%, var(--duo-dark)) 0%, transparent 60%),
    var(--duo-dark);
}
.${s}-plate::before{
  content:"";position:absolute;inset:-28%;
  background:
    radial-gradient(42% 40% at 24% 22%, var(--duo-light) 0%, transparent 58%),
    radial-gradient(50% 46% at 82% 26%, color-mix(in srgb, var(--duo-light) 72%, var(--duo-dark)) 0%, transparent 60%),
    radial-gradient(60% 54% at 64% 98%, color-mix(in srgb, var(--duo-light) 46%, var(--duo-dark)) 0%, transparent 62%),
    radial-gradient(30% 28% at 92% 66%, color-mix(in srgb, var(--duo-mid) 80%, var(--duo-light)) 0%, transparent 60%);
  filter:blur(34px) saturate(122%);opacity:.96;transform:translateZ(0);
  animation:${s}-plateDrift 1.4s cubic-bezier(.2,.8,.2,1) both;
}
.${s}-plate::after{
  content:"";position:absolute;inset:-12%;
  background:conic-gradient(from calc(205deg + var(--mesh-rot, 0deg)) at 68% 16%,
    color-mix(in srgb, var(--duo-light) 60%, transparent) 0deg,
    transparent 60deg,
    color-mix(in srgb, var(--duo-mid) 70%, transparent) 138deg,
    transparent 216deg,
    color-mix(in srgb, var(--duo-light) 46%, transparent) 308deg,
    transparent 360deg);
  mix-blend-mode:screen;filter:blur(26px) saturate(112%);opacity:.52;
}
.${s}-mesh{
  position:absolute;z-index:1;inset:-15%;pointer-events:none;mix-blend-mode:screen;
  background:
    radial-gradient(28% 24% at 38% 38%, color-mix(in srgb,var(--duo-light) 55%, transparent) 0%, transparent 60%),
    radial-gradient(22% 20% at 72% 56%, color-mix(in srgb,var(--leak) 45%, transparent) 0%, transparent 62%),
    radial-gradient(20% 18% at 16% 56%, color-mix(in srgb,var(--duo-mid) 70%, transparent) 0%, transparent 60%);
  filter:blur(20px);opacity:.6;
}
.${s}-streak{
  position:absolute;z-index:2;left:-30%;top:24%;width:160%;height:36%;
  background:linear-gradient(100deg, transparent 0%, color-mix(in srgb, var(--duo-light) 82%, white 12%) 50%, transparent 100%);
  filter:blur(16px);opacity:.40;transform:rotate(-9deg);mix-blend-mode:screen;pointer-events:none;
}
.${s}-leak{
  position:absolute;z-index:2;top:-16%;right:-18%;width:80%;height:70%;
  background:radial-gradient(60% 60% at 80% 18%, color-mix(in srgb,var(--leak) 90%, white 8%) 0%, color-mix(in srgb,var(--leak) 40%, transparent) 34%, transparent 70%);
  filter:blur(28px);opacity:.40;mix-blend-mode:screen;pointer-events:none;
  animation:${s}-leakIn 1.6s ease both;
}
.${s}-lift{
  position:absolute;z-index:2;inset:0;pointer-events:none;
  background:
    radial-gradient(120% 100% at 50% 0%, rgba(255,255,255,.55) 0%, transparent 60%),
    linear-gradient(180deg, rgba(255,255,255,.35) 0%, rgba(255,255,255,.10) 50%, rgba(255,255,255,.30) 100%);
  mix-blend-mode:screen;opacity:var(--plate-fade);
}
.${s}-grain{
  position:absolute;z-index:3;inset:0;pointer-events:none;mix-blend-mode:var(--grain-blend);opacity:var(--grain-opacity);
  background-image:
    radial-gradient(1px 1px at 12% 18%, rgba(255,255,255,.5) 50%, transparent 51%),
    radial-gradient(1px 1px at 33% 64%, rgba(255,255,255,.4) 50%, transparent 51%),
    radial-gradient(1px 1px at 58% 28%, rgba(255,255,255,.45) 50%, transparent 51%),
    radial-gradient(1px 1px at 76% 72%, rgba(255,255,255,.4) 50%, transparent 51%),
    radial-gradient(1px 1px at 90% 44%, rgba(255,255,255,.5) 50%, transparent 51%),
    radial-gradient(1px 1px at 4% 50%, rgba(255,255,255,.4) 50%, transparent 51%),
    radial-gradient(1px 1px at 46% 88%, rgba(0,0,0,.30) 50%, transparent 51%),
    radial-gradient(1px 1px at 22% 80%, rgba(0,0,0,.26) 50%, transparent 51%),
    radial-gradient(1px 1px at 66% 12%, rgba(0,0,0,.24) 50%, transparent 51%);
  background-size:96px 96px,72px 72px,116px 116px,88px 88px,104px 104px,60px 60px,132px 132px,80px 80px,120px 120px;
}
.${s}-vignette{
  position:absolute;z-index:3;inset:0;pointer-events:none;
  background:radial-gradient(118% 96% at 50% 30%, transparent 54%, var(--vignette) 100%);
}
.${s}-scrim{
  position:absolute;z-index:4;inset:0;pointer-events:none;
  background:linear-gradient(180deg, var(--scrim-top) 0%, transparent 26%, transparent 46%, var(--scrim-mid) 74%, var(--scrim-bot) 100%);
}

/* ---------- PLATE CONTENT ---------- */
.${s}-pc{position:relative;z-index:5;display:flex;flex-direction:column;
  padding:15px 17px 16px;animation:${s}-fadeUp .9s .15s cubic-bezier(.2,.8,.2,1) both}

.${s}-topbar{display:flex;align-items:center;justify-content:space-between;gap:10px;margin-bottom:18px}
.${s}-brandchip{
  display:flex;align-items:center;gap:9px;padding:6px 12px 6px 7px;border-radius:999px;
  background:var(--chip-bg);border:1px solid var(--chip-hair);
  box-shadow:0 1px 0 var(--chip-sheen) inset, 0 8px 20px -14px rgba(0,0,0,.7);
  backdrop-filter:blur(10px) saturate(120%);-webkit-backdrop-filter:blur(10px) saturate(120%);
}
.${s}-mark{
  width:24px;height:24px;border-radius:8px;display:grid;place-items:center;
  background:linear-gradient(150deg, var(--accent), color-mix(in srgb,var(--accent-deep) 70%, var(--duo-dark)));
  color:var(--accent-ink);
  box-shadow:0 0 0 1px rgba(255,255,255,.2) inset, 0 6px 14px -6px var(--halo);
}
.${s}-mark svg{width:15px;height:15px;display:block}
.${s}-brandchip b{font-family:${BODY_FONT};font-weight:700;font-size:12.5px;letter-spacing:.2px;color:var(--hero-ink)}
.${s}-brandchip span{color:var(--hero-dim);font-weight:500;font-size:10.5px}

.${s}-livechip{
  display:flex;align-items:center;gap:7px;
  font-family:${MONO_FONT};font-size:9.5px;font-weight:700;letter-spacing:.18em;
  text-transform:uppercase;color:var(--hero-ink);
  padding:7px 12px;border-radius:999px;
  background:var(--chip-bg);border:1px solid var(--chip-hair-soft);
  box-shadow:0 1px 0 var(--chip-sheen) inset, 0 8px 20px -14px rgba(0,0,0,.7);
  backdrop-filter:blur(10px) saturate(120%);-webkit-backdrop-filter:blur(10px) saturate(120%);
}
.${s}-dot{width:7px;height:7px;border-radius:50%;background:var(--accent);
  box-shadow:0 0 0 3px var(--halo);animation:${s}-pulse 2.6s ease-in-out infinite}

.${s}-eyebrow{
  font-family:${MONO_FONT};font-size:9.5px;letter-spacing:.30em;text-transform:uppercase;
  color:var(--hero-faint);margin-bottom:7px;
}
.${s}-ptitle{
  font-family:${HERO_FONT};font-weight:700;font-size:25px;
  letter-spacing:-.028em;line-height:1.0;color:var(--hero-ink);text-shadow:var(--hero-shadow);
}
.${s}-os{color:var(--accent-2)}
.${s}-pwho{
  margin-top:6px;font-size:11.5px;color:var(--hero-dim);font-weight:500;
  display:flex;align-items:center;gap:7px;
}
.${s}-av{
  width:17px;height:17px;border-radius:5px;flex:none;
  background:linear-gradient(135deg,var(--accent-2),var(--accent-deep));
  color:var(--accent-ink);font-size:8px;font-weight:700;display:flex;align-items:center;justify-content:center;
  font-family:${HERO_FONT};
}
.${s}-pwho b{color:var(--hero-ink);font-weight:600}

/* ===== LIVE-OPS HERO METRICS + sparkline ===== */
.${s}-hero-metrics{
  margin-top:17px;padding-top:15px;position:relative;
  display:flex;align-items:flex-end;gap:0;
}
.${s}-hero-metrics::before{
  content:"";position:absolute;left:0;right:0;top:0;height:1px;
  background:linear-gradient(90deg, transparent, var(--plate-hair) 12%, var(--plate-hair) 88%, transparent);
}
.${s}-hm{display:flex;flex-direction:column;gap:5px;flex:none}
.${s}-hm + .${s}-hm{margin-left:13px;padding-left:13px;position:relative}
.${s}-hm + .${s}-hm::before{content:"";position:absolute;left:0;top:3px;bottom:5px;width:1px;background:var(--plate-hair-soft)}
.${s}-k{font-family:${MONO_FONT};font-size:8px;letter-spacing:.16em;text-transform:uppercase;color:var(--hero-faint)}
.${s}-v{
  font-family:${HERO_FONT};font-weight:700;font-size:30px;line-height:.9;
  letter-spacing:-.03em;color:var(--hero-ink);font-variant-numeric:tabular-nums;text-shadow:var(--hero-shadow);
}
.${s}-v em{font-style:normal;font-size:14px;color:var(--hero-faint);font-weight:600;letter-spacing:0}
.${s}-v.${s}-acc{color:var(--acc-val)}
.${s}-v.${s}-warn{color:var(--warn-val)}

.${s}-spark{flex:1;min-width:0;display:flex;align-items:flex-end;justify-content:flex-end;align-self:stretch;padding-left:12px}
.${s}-spark svg{width:96px;height:42px;display:block;overflow:visible}
.${s}-fl{fill:var(--accent);opacity:.10}
.${s}-ln{fill:none;stroke:var(--accent);stroke-width:1.6;
  filter:drop-shadow(0 0 4px var(--halo));
  stroke-dasharray:260;stroke-dashoffset:260;animation:${s}-draw 1.9s cubic-bezier(.5,0,.2,1) .35s forwards}
.${s}-pp{fill:var(--accent-2);opacity:0;animation:${s}-pip 2.8s ease-out 1.9s infinite}

/* ===== 2 · APP LAUNCHER ===== */
.${s}-launch{flex:1;min-height:0;display:flex;flex-direction:column;
  padding:13px 4px 0;animation:${s}-fadeUp .9s .28s cubic-bezier(.2,.8,.2,1) both}
.${s}-launch-head{
  display:flex;align-items:center;justify-content:space-between;margin-bottom:9px;padding:0 4px;
  font-family:${MONO_FONT};font-size:9px;letter-spacing:.18em;text-transform:uppercase;color:var(--on-dark-faint);
}
.${s}-legend{display:flex;align-items:center;gap:9px}
.${s}-legend span{display:flex;align-items:center;gap:4px;font-size:8px;letter-spacing:.08em}
.${s}-sw{width:7px;height:7px;border-radius:2px;flex:none}

.${s}-rows{flex:1;min-height:0;display:flex;flex-direction:column;gap:6px}

.${s}-row{
  position:relative;display:flex;align-items:center;gap:11px;width:100%;text-align:left;
  box-sizing:border-box;color:var(--tile-name);appearance:none;-webkit-appearance:none;
  padding:9px 11px 9px 10px;border-radius:14px;font-family:${BODY_FONT};
  background:linear-gradient(180deg, var(--panel-2) 0%, var(--panel) 100%);
  border:1px solid var(--panel-hair);
  cursor:pointer;overflow:hidden;text-decoration:none;
  transition:transform .16s cubic-bezier(.2,.7,.2,1), border-color .16s ease, box-shadow .16s ease;
  box-shadow:0 1px 0 rgba(255,255,255,.025) inset, 0 12px 24px -22px rgba(0,0,0,.9);
  --c:var(--dsh); --c2:var(--dsh-2); --cg:var(--dsh-glow); --cv:var(--dsh-veil);
  animation:${s}-rowIn .5s cubic-bezier(.2,.7,.2,1) both;
}
.${s}-row:nth-child(1){animation-delay:.34s}
.${s}-row:nth-child(2){animation-delay:.39s}
.${s}-row:nth-child(3){animation-delay:.44s}
.${s}-row:nth-child(4){animation-delay:.49s}
.${s}-row:nth-child(5){animation-delay:.54s}
.${s}-row:nth-child(6){animation-delay:.59s}
.${s}-row:nth-child(7){animation-delay:.64s}
.${s}-row:nth-child(8){animation-delay:.69s}
.${s}-f-audits{--c:var(--aud);--c2:var(--aud-2);--cg:var(--aud-glow);--cv:var(--aud-veil)}
.${s}-f-dash{--c:var(--dsh);--c2:var(--dsh-2);--cg:var(--dsh-glow);--cv:var(--dsh-veil)}
.${s}-f-reg{--c:var(--reg);--c2:var(--reg-2);--cg:var(--reg-glow);--cv:var(--reg-veil)}
.${s}-f-logs{--c:var(--log);--c2:var(--log-2);--cg:var(--log-glow);--cv:var(--log-veil)}
.${s}-row::before{
  content:"";position:absolute;left:0;top:9px;bottom:9px;width:3px;border-radius:0 3px 3px 0;
  background:linear-gradient(180deg,var(--c2),var(--c));box-shadow:0 0 10px -1px var(--cg);
}
.${s}-row::after{
  content:"";position:absolute;right:-24px;top:-24px;width:64px;height:64px;border-radius:50%;
  background:radial-gradient(circle at 50% 50%, var(--cv) 0%, transparent 70%);
  pointer-events:none;transition:opacity .16s ease;opacity:.7;
}
.${s}-row:hover{transform:translateX(2px);border-color:var(--c);
  box-shadow:0 1px 0 rgba(255,255,255,.04) inset, 0 14px 30px -18px var(--cg), 0 0 0 1px var(--cv)}
.${s}-row:active{transform:translateX(1px)}

.${s}-seal{
  width:38px;height:38px;border-radius:11px;flex:none;position:relative;
  background:linear-gradient(150deg, var(--cv), rgba(255,255,255,.015));
  border:1px solid var(--cv);
  display:flex;align-items:center;justify-content:center;color:var(--c2);
  transition:all .16s ease;
}
[data-theme="light"] .${s}-seal{color:var(--c)}
.${s}-row:hover .${s}-seal{
  background:radial-gradient(120% 120% at 30% 20%, var(--c2) 0%, var(--c) 56%, var(--c) 100%);
  border-color:transparent;color:#0A0D0C;
  box-shadow:0 1px 0 rgba(255,255,255,.4) inset, 0 8px 16px -7px var(--cg);
}
[data-theme="light"] .${s}-row:hover .${s}-seal{color:#fff}
.${s}-seal svg{width:21px;height:21px}
.${s}-seal-glyph{display:flex;align-items:center;justify-content:center}
.${s}-seal-letter{font-family:${HERO_FONT};font-weight:700;font-size:15px;letter-spacing:-.01em}

.${s}-rmid{flex:1;min-width:0;display:flex;flex-direction:column;gap:2px}
.${s}-fam{
  font-family:${MONO_FONT};font-size:7.5px;letter-spacing:.16em;text-transform:uppercase;color:var(--c2);
}
[data-theme="light"] .${s}-fam{color:var(--c)}
.${s}-name{font-size:14px;font-weight:600;letter-spacing:-.012em;color:var(--tile-name);line-height:1.05;
  white-space:nowrap;overflow:hidden;text-overflow:ellipsis}

.${s}-rright{flex:none;display:flex;align-items:center;gap:10px}
.${s}-metric{
  font-family:${MONO_FONT};font-size:10.5px;font-weight:700;color:var(--tile-name);
  font-variant-numeric:tabular-nums;letter-spacing:.01em;display:flex;align-items:center;gap:5px;white-space:nowrap;
}
.${s}-ld{width:5px;height:5px;border-radius:50%;background:var(--c);box-shadow:0 0 7px var(--cg);
  animation:${s}-pulse 2.6s ease-in-out infinite}
.${s}-metric-live{color:var(--c2)}
[data-theme="light"] .${s}-metric-live{color:var(--c)}
.${s}-go{
  width:24px;height:24px;border-radius:50%;flex:none;display:flex;align-items:center;justify-content:center;
  border:1px solid var(--panel-hair-2);color:var(--tile-faint);transition:all .16s ease;
}
.${s}-go svg{width:12px;height:12px}
.${s}-row:hover .${s}-go{background:var(--c);border-color:transparent;color:#0A0D0C;box-shadow:0 0 14px -2px var(--cg)}
[data-theme="light"] .${s}-row:hover .${s}-go{color:#fff}

/* RESTRICTED rows — greyed + lock, not launchable */
.${s}-locked{cursor:not-allowed;
  background:linear-gradient(180deg, color-mix(in srgb,var(--panel) 88%, #000 12%) 0%, color-mix(in srgb,var(--panel) 80%, #000 20%) 100%);
  border-color:var(--hair-soft)}
[data-theme="light"] .${s}-locked{
  background:linear-gradient(180deg, #F1EEE8 0%, #ECE8E0 100%);border-color:var(--hair-soft)}
.${s}-locked::before{background:var(--on-dark-faint);box-shadow:none;opacity:.5}
.${s}-locked::after{opacity:0}
.${s}-locked:hover{transform:none;border-color:var(--hair);
  box-shadow:0 1px 0 rgba(255,255,255,.02) inset}
.${s}-locked .${s}-seal{background:rgba(127,127,127,.05);border-color:var(--hair-soft);color:var(--tile-faint)}
.${s}-locked:hover .${s}-seal{background:rgba(127,127,127,.05);border-color:var(--hair-soft);color:var(--tile-faint);box-shadow:none}
.${s}-locked .${s}-fam{color:var(--tile-faint)}
.${s}-locked .${s}-name{color:var(--on-dark-faint)}
.${s}-locked .${s}-metric{color:var(--tile-faint)}
.${s}-locked .${s}-go{border-color:var(--hair-soft);color:var(--tile-faint)}
.${s}-locked:hover .${s}-go{background:transparent;border-color:var(--hair-soft);color:var(--tile-faint);box-shadow:none}

/* ---------- FOOTER maker's-mark ---------- */
.${s}-foot{
  flex:0 0 auto;display:flex;align-items:center;justify-content:space-between;
  padding:11px 6px 2px;color:var(--foot-ink);
  font-family:${MONO_FONT};font-size:9px;letter-spacing:.14em;
  animation:${s}-fadeUp .9s .4s cubic-bezier(.2,.8,.2,1) both;
}
.${s}-maker{display:flex;align-items:center;gap:7px}
.${s}-d{width:4px;height:4px;border-radius:50%;background:var(--accent);box-shadow:0 0 6px var(--halo)}
.${s}-seal-mk{
  font-family:${HERO_FONT};font-weight:700;font-size:10px;letter-spacing:.02em;
  color:var(--foot-seal-ink);padding:3px 7px;border-radius:6px;
  border:1px solid var(--foot-seal-hair);background:var(--foot-seal-bg);
}
.${s}-seal-mk i{font-style:normal;color:var(--accent)}
.${s}-secure{display:flex;align-items:center;gap:6px}
.${s}-secure svg{width:11px;height:11px}

@media (prefers-reduced-motion:reduce){
  .${s}-stage *{animation:none !important}
  .${s}-ln{stroke-dashoffset:0 !important}
}

/* compact safety for very short viewports */
@media (max-height:850px){
  .${s}-pc{padding:13px 16px 14px}
  .${s}-v{font-size:28px}
  .${s}-ptitle{font-size:24px}
  .${s}-rows{gap:5px}
  .${s}-row{padding:8px 11px 8px 10px}
  .${s}-seal{width:36px;height:36px}
}
`
}

export default DuotoneMissionControl
