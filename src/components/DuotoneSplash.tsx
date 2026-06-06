import React, { useId, useLayoutEffect, useRef, useState } from 'react'
import type { SplashAction } from './SplashScreen'
import { useFamily } from './FamilyProvider'
import type { FamilyKey } from '../families'

/**
 * One Google Fonts <link> for the whole duotone system. Space Grotesk is the
 * confident display grotesk for the hero + labels; Hanken Grotesk is the humane
 * UI/text grotesk for the body + buttons. Injected once per document (id-guarded)
 * so mounting many splashes never duplicates the stylesheet.
 */
const FONTS_LINK_ID = 'aud-duotone-fonts'
const FONTS_HREF =
  'https://fonts.googleapis.com/css2?family=Space+Grotesk:wght@400;500;600;700&family=Hanken+Grotesk:wght@400;500;600;700;800&display=swap'

const HERO_FONT = "'Space Grotesk', system-ui, sans-serif"
const BODY_FONT = "'Hanken Grotesk', system-ui, sans-serif"

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

/** One duotone pair + accent set — the only thing that moves between families. */
interface DuotonePair {
  duoDark: string
  duoMid: string
  duoLight: string
  leak: string
  accent: string
  accentDeep: string
  accentInk: string
  halo: string
}

interface FamilyPalette {
  /** Rotates the conic facet sweep so each family catches its own key light. */
  meshRot: string
  dark: DuotonePair
  light: DuotonePair
}

/**
 * Per-FAMILY duotone palettes (dark + light), inlined from the verified
 * prototype. Apps in a family colour-match because they share these.
 *
 *  audits     = warm GOLD / AMBER     (bronze shadow  -> luminous amber)
 *  dashboards = TEAL / AQUA           (ocean shadow   -> bright aqua)
 *  registers  = TERRACOTTA / CORAL    (plum shadow    -> warm coral)
 *  logs       = DEEP GREEN / FOREST   (forest shadow  -> emerald)
 */
const FAMILY_DUOTONES: Record<FamilyKey, FamilyPalette> = {
  audits: {
    meshRot: '0deg',
    dark: {
      duoDark: '#2A1604', duoMid: '#7A4A0E', duoLight: '#FFC24D', leak: '#FFD98A',
      accent: '#F5A623', accentDeep: '#C97E12', accentInk: '#1F1303', halo: 'rgba(245,166,35,.40)',
    },
    light: {
      duoDark: '#8A5A12', duoMid: '#D49A2E', duoLight: '#FFE2A0', leak: '#FFEFC8',
      accent: '#C9821A', accentDeep: '#A0640F', accentInk: '#FFF6E6', halo: 'rgba(201,130,26,.30)',
    },
  },
  dashboards: {
    meshRot: '-46deg',
    dark: {
      duoDark: '#04222C', duoMid: '#0C5A66', duoLight: '#4FE0E3', leak: '#7DF0F0',
      accent: '#22C9C9', accentDeep: '#12969C', accentInk: '#041416', halo: 'rgba(34,201,201,.40)',
    },
    light: {
      duoDark: '#0E5A62', duoMid: '#2E9498', duoLight: '#A6EEF0', leak: '#CFF6F7',
      accent: '#119499', accentDeep: '#0C7479', accentInk: '#E8FBFB', halo: 'rgba(17,148,153,.30)',
    },
  },
  registers: {
    meshRot: '82deg',
    dark: {
      duoDark: '#3A1018', duoMid: '#8A2A2E', duoLight: '#FF9E76', leak: '#FFC0A0',
      accent: '#FB7355', accentDeep: '#D54B36', accentInk: '#2A0A06', halo: 'rgba(251,115,85,.40)',
    },
    light: {
      duoDark: '#9C3A36', duoMid: '#D86B4E', duoLight: '#FFCBA8', leak: '#FFE0CC',
      accent: '#D85A3C', accentDeep: '#B0432A', accentInk: '#FFF0E8', halo: 'rgba(216,90,60,.30)',
    },
  },
  logs: {
    meshRot: '148deg',
    dark: {
      duoDark: '#04201C', duoMid: '#0C5440', duoLight: '#46D98E', leak: '#74E8B0',
      accent: '#1FB872', accentDeep: '#127A4E', accentInk: '#04140C', halo: 'rgba(31,184,114,.40)',
    },
    light: {
      duoDark: '#0E5238', duoMid: '#2E8A5E', duoLight: '#A6EAC4', leak: '#CFF4DF',
      accent: '#118A52', accentDeep: '#0C6B40', accentInk: '#E8FBF1', halo: 'rgba(17,138,82,.30)',
    },
  },
}

/** Theme-keyed neutral frame tokens (the page the duotone plate sits on). */
interface FrameTokens {
  bg: string
  bg2: string
  bgFloor: string
  hair: string
  onDark: string
  onDarkFaint: string
  /* chrome on the plate */
  chipBg: string
  chipHair: string
  chipHairSoft: string
  chipSheen: string
  /* hero ink + plate content tones */
  heroInk: string
  heroDim: string
  heroFaint: string
  plateHair: string
  plateHairSoft: string
  heroShadow: string
  /* dock chrome */
  ghostBg: string
  ghostBgHover: string
  ghostInk: string
  ghostHair: string
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
  grainOpacity: number
  plateFade: number
  pageHaloOp: number
  cardShadow: string
  bodyBg: string
}

const FRAME: Record<'light' | 'dark', FrameTokens> = {
  dark: {
    bg: '#0B0C11', bg2: '#13141B', bgFloor: '#070810',
    hair: 'rgba(255,255,255,.10)',
    onDark: '#F4F5F9', onDarkFaint: '#71748A',
    chipBg: 'rgba(7,8,15,.40)', chipHair: 'rgba(255,255,255,.15)',
    chipHairSoft: 'rgba(255,255,255,.13)', chipSheen: 'rgba(255,255,255,.05)',
    heroInk: '#ffffff', heroDim: '#B2B5C5', heroFaint: '#71748A',
    plateHair: 'rgba(255,255,255,.10)', plateHairSoft: 'rgba(255,255,255,.055)',
    heroShadow: '0 2px 30px rgba(0,0,0,.45)',
    ghostBg: 'rgba(255,255,255,.05)', ghostBgHover: 'rgba(255,255,255,.08)',
    ghostInk: '#F4F5F9', ghostHair: 'rgba(255,255,255,.10)',
    footInk: '#71748A', footSealInk: '#B2B5C5',
    footSealBg: 'rgba(255,255,255,.03)', footSealHair: 'rgba(255,255,255,.10)',
    scrimTop: 'rgba(6,7,14,.46)', scrimMid: 'rgba(6,7,14,.58)', scrimBot: 'rgba(5,6,11,.94)',
    vignette: 'rgba(5,7,14,.5)',
    grainBlend: 'overlay', grainOpacity: 0.42,
    plateFade: 0, pageHaloOp: 0.5,
    cardShadow:
      '0 1px 0 0 rgba(255,255,255,.06) inset,' +
      '0 0 0 1px rgba(255,255,255,.09),' +
      '0 0 0 1px rgba(0,0,0,.5),' +
      '0 2px 6px -2px rgba(0,0,0,.5),' +
      '0 18px 40px -22px rgba(0,0,0,.7),' +
      '0 40px 90px -38px rgba(0,0,0,.9)',
    bodyBg: '#000',
  },
  light: {
    bg: '#F4F2EE', bg2: '#FBFAF7', bgFloor: '#E7E3DB',
    hair: 'rgba(20,18,14,.12)',
    onDark: '#1A1814', onDarkFaint: '#8E887C',
    chipBg: 'rgba(255,255,255,.55)', chipHair: 'rgba(255,255,255,.7)',
    chipHairSoft: 'rgba(20,18,14,.10)', chipSheen: 'rgba(255,255,255,.6)',
    heroInk: '#1A1814', heroDim: '#4A453C', heroFaint: '#7A746A',
    plateHair: 'rgba(20,18,14,.14)', plateHairSoft: 'rgba(20,18,14,.09)',
    heroShadow: '0 1px 16px rgba(255,255,255,.5)',
    ghostBg: 'rgba(255,255,255,.7)', ghostBgHover: 'rgba(255,255,255,.92)',
    ghostInk: '#1A1814', ghostHair: 'rgba(20,18,14,.14)',
    footInk: '#8E887C', footSealInk: '#5A554C',
    footSealBg: 'rgba(255,255,255,.7)', footSealHair: 'rgba(20,18,14,.12)',
    scrimTop: 'rgba(255,253,248,.10)', scrimMid: 'rgba(255,253,248,.18)', scrimBot: 'rgba(255,253,248,.62)',
    vignette: 'rgba(120,110,96,.16)',
    grainBlend: 'soft-light', grainOpacity: 0.28,
    plateFade: 0.3, pageHaloOp: 0.42,
    cardShadow:
      '0 1px 0 0 rgba(255,255,255,.5) inset,' +
      '0 0 0 1px rgba(255,255,255,.5),' +
      '0 0 0 1px rgba(120,110,96,.18),' +
      '0 2px 8px -3px rgba(80,72,60,.22),' +
      '0 18px 40px -22px rgba(80,72,60,.30),' +
      '0 40px 90px -42px rgba(80,72,60,.40)',
    bodyBg: '#E7E3DB',
  },
}

/** Identity metadata — mode / sync / access. NO scores, NO metrics. */
export interface DuotoneMeta {
  /** e.g. "On-site", "Desk", "Mobile". */
  mode?: string
  /** Sync target, rendered after a live dot, e.g. "Cloud" -> "Live Cloud". */
  sync?: string
  /** e.g. "SSO", "Access code". */
  access?: string
}

export interface DuotoneSplashProps
  extends Omit<React.HTMLAttributes<HTMLDivElement>, 'title'> {
  /** The hero app name — measured + auto-fit into the plate. */
  appName: string
  /** The category pill, e.g. "Audits". */
  category: string
  /** The supporting caption under the name. */
  description?: string
  /**
   * Which function family drives the duotone pair + accent. Defaults to the
   * enclosing `<FamilyProvider>`, then "audits".
   */
  family?: FamilyKey
  /**
   * Override the accent (the CTA fill / live dot / pill). Defaults to the
   * family's accent. The duotone PLATE always follows the family.
   */
  accent?: string
  /**
   * Neutral frame palette. Defaults to the enclosing `<FamilyProvider>`'s mode,
   * then "dark".
   */
  theme?: 'light' | 'dark'
  /** Identity metadata row — mode / sync / access. */
  meta?: DuotoneMeta
  /**
   * Brand mark inside the top-left chip — app-provided (a glyph, a lettermark).
   * Sized to ~16px; should draw with `currentColor`. Falls back to "A".
   */
  mark?: React.ReactNode
  /** The suite label after the "AuD" wordmark in the chip. Default "Operations Suite". */
  suite?: string
  /** The live/secure word in the top-right chip. Default "Secure". */
  liveword?: string
  /** Primary call to action — the filled CTA in the family accent. */
  primary: SplashAction
  /** Optional secondary action — the ghost button under the CTA. */
  secondary?: SplashAction
  /**
   * The app's own field(s) — e.g. a code / PIN `<input>` for the many apps that
   * authenticate on the splash instead of via OAuth. Wrapped in an on-brand
   * glass slot on the action dock. A plain `<input className={DUOTONE_FIELD_CLASS}>`
   * (or any `<input>` — the slot styles bare inputs by default) reads correctly
   * against the duotone dock. See {@link DUOTONE_FIELD_CLASS}.
   */
  children?: React.ReactNode
  /**
   * Render `children` (the fields) ABOVE the primary action, for code/PIN apps
   * where the input comes first. Default false — OAuth-first, CTA on top and
   * the fields below, matching the base SplashScreen.
   */
  actionsLast?: boolean
  /** Alias for {@link DuotoneSplashProps.actionsLast}. */
  formMode?: boolean
  /** A micro-line under the fields — a hint, env tag, or revision marker. */
  fieldNote?: React.ReactNode
}

/**
 * The className to put on a plain `<input>` (or `<select>`) passed in as a
 * child, so it inherits the duotone dock's glass/edge field styling and matches
 * the CTA + meta row. The field slot also styles bare `<input>`/`<select>`
 * descendants automatically, so this class is only needed when the app's input
 * carries its own competing styles and you want to opt back in.
 *
 * ```tsx
 * import { DuotoneSplash, DUOTONE_FIELD_CLASS } from '@aud/brand'
 *
 * <DuotoneSplash
 *   formMode
 *   primary={{ label: 'Enter', onClick: submit }}
 *   {...rest}
 * >
 *   <input
 *     className={DUOTONE_FIELD_CLASS}
 *     inputMode="numeric"
 *     placeholder="Access code"
 *     value={code}
 *     onChange={(e) => setCode(e.target.value)}
 *   />
 * </DuotoneSplash>
 * ```
 *
 * Naming mirrors the sibling skins (e.g. `EDITORIAL_FIELD_CLASS`).
 * `duotoneFieldInputClass` is kept as a camelCase alias to the same value.
 */
export const DUOTONE_FIELD_CLASS = 'aud-duotone-field'

/** camelCase alias of {@link DUOTONE_FIELD_CLASS}. */
export const duotoneFieldInputClass = DUOTONE_FIELD_CLASS

/**
 * The premium framed-duotone app splash.
 *
 * A neutral page frame holds a framed duotone "plate" (an abstract, lit material
 * standing in for a duotone photograph) with a per-family colour pair. The
 * editorial hero caption sits at the foot of the plate — category pill, the
 * measured auto-fit Space Grotesk app name, a description, and an IDENTITY
 * metadata row (mode / sync / access — never a scorecard). Below the plate, an
 * action dock carries the primary + secondary actions and the maker's mark.
 *
 * Self-contained: all styling is inline + one scoped `<style>` block; the only
 * external dependency is the Google Fonts `<link>` (Space Grotesk + Hanken
 * Grotesk) injected once per document.
 *
 * ```tsx
 * <DuotoneSplash
 *   family="audits"
 *   appName="Venue Audit"
 *   category="Audits"
 *   description="Venue inspection & scoring"
 *   meta={{ mode: 'On-site', sync: 'Cloud', access: 'SSO' }}
 *   mark={<ClipboardCheck />}
 *   primary={{ label: 'Sign in with Microsoft', icon: <MsLogo/>, onClick }}
 *   secondary={{ label: 'Continue with access code', onClick: guest }}
 * />
 * ```
 */
export function DuotoneSplash({
  appName,
  category,
  description,
  family,
  accent,
  theme,
  meta,
  mark,
  suite = 'Operations Suite',
  liveword = 'Secure',
  primary,
  secondary,
  children,
  actionsLast,
  formMode,
  fieldNote,
  style,
  ...rest
}: DuotoneSplashProps) {
  useFontsLink()

  // Fields-first when the app declares either flag — matches the base
  // SplashScreen (`actionsLast` / `formMode` are aliases).
  const fieldsFirst = !!(actionsLast || formMode)

  // Family + theme follow the enclosing provider, then the explicit props.
  const ctx = useFamily()
  const resolvedFamily: FamilyKey = family ?? ctx?.key ?? 'audits'
  const resolvedTheme = theme ?? ctx?.mode ?? 'dark'

  const fam = FAMILY_DUOTONES[resolvedFamily]
  const duo = resolvedTheme === 'light' ? fam.light : fam.dark
  const f = FRAME[resolvedTheme]
  const accentColor = accent ?? duo.accent

  // A scope id so the (necessarily class-based) plate/grain layers and hover
  // states never leak between two splashes on the same page.
  const rawId = useId()
  const scope = `aud-duotone-${rawId.replace(/[^a-zA-Z0-9_-]/g, '')}`

  // CSS custom properties feed the scoped <style> rules (gradients reference
  // multiple vars, which inline styles cannot express cleanly).
  const vars = {
    '--duo-dark': duo.duoDark,
    '--duo-mid': duo.duoMid,
    '--duo-light': duo.duoLight,
    '--leak': duo.leak,
    '--accent': accentColor,
    '--accent-deep': duo.accentDeep,
    '--accent-ink': duo.accentInk,
    '--halo': duo.halo,
    '--mesh-rot': fam.meshRot,
    '--bg': f.bg,
    '--bg-2': f.bg2,
    '--bg-floor': f.bgFloor,
    '--plate-hair': f.plateHair,
    '--plate-hair-soft': f.plateHairSoft,
    '--scrim-top': f.scrimTop,
    '--scrim-mid': f.scrimMid,
    '--scrim-bot': f.scrimBot,
    '--vignette': f.vignette,
    '--grain-blend': f.grainBlend,
    '--grain-opacity': String(f.grainOpacity),
    '--plate-fade': String(f.plateFade),
    '--page-halo-op': String(f.pageHaloOp),
    '--chip-sheen': f.chipSheen,
  } as React.CSSProperties

  // ===== MEASURED AUTO-FIT for the Space Grotesk hero =====
  // Shrink from the responsive ceiling until the name fits the plate width with
  // no overflow AND occupies at most 2 lines; floor so it never collapses.
  const nameRef = useRef<HTMLHeadingElement>(null)
  const [fitted, setFitted] = useState(false)

  useLayoutEffect(() => {
    const el = nameRef.current
    if (!el) return
    setFitted(false)

    const CEIL = typeof window !== 'undefined' && window.innerHeight <= 860 ? 44 : 47
    const MIN_FS = 26
    const MAX_LINES = 2

    const fit = () => {
      let fs = CEIL
      el.style.fontSize = fs + 'px'
      let guard = 60
      while (guard-- > 0 && fs > MIN_FS) {
        const overWide = el.scrollWidth > el.clientWidth + 0.5
        const lineH = parseFloat(getComputedStyle(el).lineHeight) || fs * 0.94
        const lines = Math.max(1, Math.round(el.getBoundingClientRect().height / lineH))
        if (!overWide && lines <= MAX_LINES) break
        fs -= 1
        el.style.fontSize = fs + 'px'
      }
      setFitted(true)
    }

    fit()
    // Re-fit once the webfont has actually loaded so the measure is true.
    if (typeof document !== 'undefined' && document.fonts?.ready) {
      document.fonts.ready.then(fit).catch(() => {})
      const t = window.setTimeout(fit, 350)
      // Re-fit on rotation / resize so it never clips at other widths.
      const onResize = () => fit()
      window.addEventListener('resize', onResize)
      return () => {
        window.clearTimeout(t)
        window.removeEventListener('resize', onResize)
      }
    }
    const onResize = () => fit()
    window.addEventListener('resize', onResize)
    return () => window.removeEventListener('resize', onResize)
  }, [appName, resolvedTheme, resolvedFamily])

  return (
    <div
      data-aud-family={resolvedFamily}
      data-theme={resolvedTheme}
      style={{
        ...vars,
        minHeight: '100vh',
        width: '100%',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        background: f.bodyBg,
        fontFamily: BODY_FONT,
        WebkitFontSmoothing: 'antialiased',
        ...style,
      }}
      {...rest}
    >
      <style>{scopedCss(scope)}</style>

      <div className={`${scope}-stage`}>
        {/* THE FRAMED DUOTONE CARD */}
        <div className={`${scope}-card`}>
          <div className={`${scope}-plate`} />
          <div className={`${scope}-mesh`} />
          <div className={`${scope}-streak`} />
          <div className={`${scope}-leak`} />
          <div className={`${scope}-lift`} />
          <div className={`${scope}-grain`} />
          <div className={`${scope}-vignette`} />
          <div className={`${scope}-scrim`} />

          <div className={`${scope}-content`}>
            <div className={`${scope}-topbar`}>
              <div className={`${scope}-brandchip`}>
                <span className={`${scope}-mark`}>{mark ?? 'A'}</span>
                <b>AuD</b>
                <span>{suite}</span>
              </div>
              <div className={`${scope}-live`}>
                <span className={`${scope}-dot`} />
                <span>{liveword}</span>
              </div>
            </div>

            <div className={`${scope}-hero`}>
              <div className={`${scope}-catrow`}>
                <span className={`${scope}-pill`}>{category}</span>
              </div>
              <h1
                ref={nameRef}
                className={`${scope}-name${fitted ? ` ${scope}-name-fit` : ''}`}
              >
                {appName}
              </h1>
              {description && <p className={`${scope}-desc`}>{description}</p>}

              {/* IDENTITY metadata only — mode / sync / access. No scores. */}
              {(meta?.mode || meta?.sync || meta?.access) && (
                <div className={`${scope}-meta`}>
                  {meta?.mode && (
                    <div>
                      <div className={`${scope}-k`}>Mode</div>
                      <div className={`${scope}-v`}>{meta.mode}</div>
                    </div>
                  )}
                  {meta?.sync && (
                    <div>
                      <div className={`${scope}-k`}>Sync</div>
                      <div className={`${scope}-v`}>
                        <span className={`${scope}-live-dot`} />
                        Live {meta.sync}
                      </div>
                    </div>
                  )}
                  {meta?.access && (
                    <div>
                      <div className={`${scope}-k`}>Access</div>
                      <div className={`${scope}-v`}>{meta.access}</div>
                    </div>
                  )}
                </div>
              )}
            </div>
          </div>
        </div>

        {/* ACTION DOCK */}
        <div className={`${scope}-dock`}>
          {fieldsFirst && (children || fieldNote) && (
            <DuotoneFieldSlot scope={scope} fieldNote={fieldNote}>
              {children}
            </DuotoneFieldSlot>
          )}
          <DuotoneButton variant="primary" action={primary} scope={scope} />
          {secondary && <DuotoneButton variant="ghost" action={secondary} scope={scope} />}
          {!fieldsFirst && (children || fieldNote) && (
            <DuotoneFieldSlot scope={scope} fieldNote={fieldNote}>
              {children}
            </DuotoneFieldSlot>
          )}
          <div className={`${scope}-foot`}>
            Crafted by{' '}
            <span className={`${scope}-seal`}>
              Au<b>D</b>
            </span>{' '}
            &middot; powered by the AuD Operations Suite
          </div>
        </div>
      </div>
    </div>
  )
}

function DuotoneButton({
  variant,
  action,
  scope,
}: {
  variant: 'primary' | 'ghost'
  action: SplashAction
  scope: string
}) {
  const { label, onClick, icon, loading, loadingLabel, disabled } = action
  const isDisabled = !!disabled || !!loading
  const cls =
    variant === 'primary'
      ? `${scope}-btn ${scope}-btn-primary`
      : `${scope}-btn ${scope}-btn-ghost`

  return (
    <button
      type="button"
      className={cls}
      onClick={onClick}
      disabled={isDisabled}
      style={{ opacity: isDisabled ? 0.55 : 1, cursor: isDisabled ? 'default' : 'pointer' }}
    >
      {loading ? (
        <Spinner color={variant === 'primary' ? 'var(--accent-ink)' : 'var(--accent)'} />
      ) : (
        icon
      )}
      <span>{loading ? loadingLabel ?? label : label}</span>
      {variant === 'ghost' && !loading && <span className={`${scope}-arrow`}>&rarr;</span>}
    </button>
  )
}

/**
 * The on-brand field slot for the action dock. Wraps the app's own field(s) in a
 * glass/edge container that matches the CTA + meta-row chrome, and styles bare
 * `<input>`/`<select>` descendants (or anything carrying
 * {@link DUOTONE_FIELD_CLASS}) so a plain input the app passes in reads
 * on-brand without the app importing any styles.
 */
function DuotoneFieldSlot({
  scope,
  fieldNote,
  children,
}: {
  scope: string
  fieldNote?: React.ReactNode
  children?: React.ReactNode
}) {
  return (
    <div className={`${scope}-fieldslot`}>
      {children}
      {fieldNote && <p className={`${scope}-fieldnote`}>{fieldNote}</p>}
    </div>
  )
}

function Spinner({ color }: { color: string }) {
  return (
    <svg
      width="18"
      height="18"
      viewBox="0 0 16 16"
      aria-hidden="true"
      style={{ animation: 'aud-duotone-spin 0.8s linear infinite' }}
    >
      <circle cx="8" cy="8" r="6.5" fill="none" stroke={color} strokeOpacity="0.25" strokeWidth="2" />
      <path d="M8 1.5a6.5 6.5 0 0 1 6.5 6.5" fill="none" stroke={color} strokeWidth="2" strokeLinecap="round" />
    </svg>
  )
}

/**
 * The scoped style block. Everything is prefixed with the instance `scope` so
 * multiple splashes coexist, and the duotone gradients (which compose many CSS
 * vars and can't be expressed as a single inline value) live here.
 */
function scopedCss(s: string): string {
  return `
@keyframes aud-duotone-spin{to{transform:rotate(360deg)}}
@keyframes ${s}-cardIn{from{opacity:0;transform:translateY(14px) scale(.985)}to{opacity:1;transform:none}}
@keyframes ${s}-plateDrift{from{opacity:0;transform:scale(1.07) translateY(-1.5%)}60%{opacity:.96}to{opacity:.96;transform:none}}
@keyframes ${s}-leakIn{from{opacity:0}to{opacity:.42}}
@keyframes ${s}-fadeUp{from{opacity:0;transform:translateY(12px)}to{opacity:1;transform:none}}
@keyframes ${s}-pulse{0%,100%{opacity:1;box-shadow:0 0 0 3px var(--halo)}50%{opacity:.55;box-shadow:0 0 0 6px transparent}}

.${s}-stage{
  position:relative;width:100%;max-width:430px;height:100vh;max-height:932px;
  background:radial-gradient(135% 88% at 50% -16%, var(--bg-2) 0%, var(--bg) 58%, var(--bg-floor) 100%);
  display:flex;flex-direction:column;padding:18px 18px 22px;overflow:hidden;
}
.${s}-stage::before{
  content:"";position:absolute;left:50%;bottom:-12%;width:120%;height:46%;
  transform:translateX(-50%);
  background:radial-gradient(60% 100% at 50% 100%, var(--halo) 0%, transparent 70%);
  opacity:var(--page-halo-op);pointer-events:none;filter:blur(8px);
}

.${s}-card{
  position:relative;flex:1 1 auto;border-radius:28px;overflow:hidden;
  background:var(--duo-dark);
  box-shadow:${FRAME.dark.cardShadow.replace(/,/g, ',\n    ')};
  display:flex;flex-direction:column;isolation:isolate;
  animation:${s}-cardIn 1s cubic-bezier(.2,.8,.2,1) both;
}
[data-theme="light"] .${s}-card{box-shadow:${FRAME.light.cardShadow.replace(/,/g, ',\n    ')};}

.${s}-plate{position:absolute;inset:0;z-index:0;overflow:hidden;
  background:
    radial-gradient(95% 60% at 50% 4%, color-mix(in srgb, var(--duo-mid) 88%, var(--duo-light) 12%) 0%, transparent 56%),
    radial-gradient(120% 86% at 50% 6%, var(--duo-mid) 0%, var(--duo-dark) 64%),
    radial-gradient(140% 70% at 50% 108%, color-mix(in srgb, var(--duo-mid) 60%, var(--duo-dark)) 0%, transparent 60%),
    var(--duo-dark);
}
.${s}-plate::before{
  content:"";position:absolute;inset:-28%;
  background:
    radial-gradient(42% 34% at 26% 22%, var(--duo-light) 0%, transparent 58%),
    radial-gradient(50% 42% at 80% 26%, color-mix(in srgb, var(--duo-light) 72%, var(--duo-dark)) 0%, transparent 60%),
    radial-gradient(60% 50% at 64% 96%, color-mix(in srgb, var(--duo-light) 50%, var(--duo-dark)) 0%, transparent 62%),
    radial-gradient(44% 36% at 8% 88%, color-mix(in srgb, var(--duo-light) 36%, var(--duo-dark)) 0%, transparent 58%),
    radial-gradient(30% 26% at 92% 70%, color-mix(in srgb, var(--duo-mid) 80%, var(--duo-light)) 0%, transparent 60%);
  filter:blur(36px) saturate(122%);opacity:.96;transform:translateZ(0);
  animation:${s}-plateDrift 1.4s cubic-bezier(.2,.8,.2,1) both;
}
.${s}-plate::after{
  content:"";position:absolute;inset:-12%;
  background:conic-gradient(from calc(205deg + var(--mesh-rot, 0deg)) at 68% 16%,
    color-mix(in srgb, var(--duo-light) 62%, transparent) 0deg,
    transparent 60deg,
    color-mix(in srgb, var(--duo-mid) 72%, transparent) 138deg,
    transparent 216deg,
    color-mix(in srgb, var(--duo-light) 48%, transparent) 308deg,
    transparent 360deg);
  mix-blend-mode:screen;filter:blur(28px) saturate(112%);opacity:.54;
}
.${s}-mesh{
  position:absolute;z-index:1;inset:-15%;pointer-events:none;mix-blend-mode:screen;
  background:
    radial-gradient(28% 22% at 40% 40%, color-mix(in srgb,var(--duo-light) 55%, transparent) 0%, transparent 60%),
    radial-gradient(22% 18% at 72% 56%, color-mix(in srgb,var(--leak) 45%, transparent) 0%, transparent 62%),
    radial-gradient(20% 16% at 18% 54%, color-mix(in srgb,var(--duo-mid) 70%, transparent) 0%, transparent 60%);
  filter:blur(22px);opacity:.62;
}
.${s}-streak{
  position:absolute;z-index:2;left:-30%;top:30%;width:160%;height:34%;
  background:linear-gradient(100deg, transparent 0%, color-mix(in srgb, var(--duo-light) 82%, white 12%) 50%, transparent 100%);
  filter:blur(18px);opacity:.42;transform:rotate(-9deg);mix-blend-mode:screen;pointer-events:none;
}
.${s}-leak{
  position:absolute;z-index:2;top:-14%;right:-18%;width:78%;height:62%;
  background:radial-gradient(60% 60% at 80% 18%, color-mix(in srgb,var(--leak) 90%, white 8%) 0%, color-mix(in srgb,var(--leak) 40%, transparent) 34%, transparent 70%);
  filter:blur(30px);opacity:.42;mix-blend-mode:screen;pointer-events:none;
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
    radial-gradient(1px 1px at 46% 88%, rgba(0,0,0,.32) 50%, transparent 51%),
    radial-gradient(1px 1px at 22% 80%, rgba(0,0,0,.28) 50%, transparent 51%),
    radial-gradient(1px 1px at 66% 12%, rgba(0,0,0,.26) 50%, transparent 51%);
  background-size:96px 96px,72px 72px,116px 116px,88px 88px,104px 104px,60px 60px,132px 132px,80px 80px,120px 120px;
}
.${s}-vignette{
  position:absolute;z-index:3;inset:0;pointer-events:none;
  background:radial-gradient(118% 92% at 50% 36%, transparent 56%, var(--vignette) 100%);
}
.${s}-scrim{
  position:absolute;z-index:4;inset:0;pointer-events:none;
  background:linear-gradient(180deg, var(--scrim-top) 0%, transparent 20%, transparent 40%, var(--scrim-mid) 72%, var(--scrim-bot) 100%);
}

.${s}-content{position:relative;z-index:5;flex:1;display:flex;flex-direction:column;
  padding:22px 22px 24px;animation:${s}-fadeUp .9s .15s cubic-bezier(.2,.8,.2,1) both}

.${s}-topbar{display:flex;align-items:center;justify-content:space-between;gap:10px}
.${s}-brandchip{
  display:flex;align-items:center;gap:9px;padding:7px 12px 7px 8px;border-radius:999px;
  background:${FRAME.dark.chipBg};border:1px solid ${FRAME.dark.chipHair};
  box-shadow:0 1px 0 var(--chip-sheen) inset, 0 8px 20px -14px rgba(0,0,0,.7);
  backdrop-filter:blur(10px) saturate(120%);-webkit-backdrop-filter:blur(10px) saturate(120%);
}
[data-theme="light"] .${s}-brandchip{background:${FRAME.light.chipBg};border-color:${FRAME.light.chipHair};}
.${s}-mark{
  width:25px;height:25px;border-radius:8px;display:grid;place-items:center;
  background:linear-gradient(150deg, var(--accent), color-mix(in srgb,var(--accent-deep) 70%, var(--duo-dark)));
  color:var(--accent-ink);font-family:${HERO_FONT};font-weight:700;font-size:12px;
  box-shadow:0 0 0 1px rgba(255,255,255,.2) inset, 0 6px 14px -6px var(--halo);
  letter-spacing:-.5px;flex:0 0 auto;
}
.${s}-mark svg{width:16px;height:16px;display:block}
.${s}-brandchip b{font-family:${BODY_FONT};font-weight:700;font-size:12.5px;letter-spacing:.2px;color:${FRAME.dark.heroInk}}
.${s}-brandchip span{color:${FRAME.dark.heroDim};font-weight:500;font-size:11px}
[data-theme="light"] .${s}-brandchip b{color:${FRAME.light.heroInk}}
[data-theme="light"] .${s}-brandchip span{color:${FRAME.light.heroDim}}

.${s}-live{
  display:flex;align-items:center;gap:7px;
  font-family:${HERO_FONT};font-size:10px;font-weight:500;letter-spacing:.22em;
  text-transform:uppercase;color:${FRAME.dark.heroInk};
  padding:7px 12px;border-radius:999px;
  background:${FRAME.dark.chipBg};border:1px solid ${FRAME.dark.chipHairSoft};
  box-shadow:0 1px 0 var(--chip-sheen) inset, 0 8px 20px -14px rgba(0,0,0,.7);
  backdrop-filter:blur(10px) saturate(120%);-webkit-backdrop-filter:blur(10px) saturate(120%);
}
[data-theme="light"] .${s}-live{color:${FRAME.light.heroInk};background:${FRAME.light.chipBg};border-color:${FRAME.light.chipHairSoft}}
.${s}-dot{width:7px;height:7px;border-radius:50%;background:var(--accent);
  box-shadow:0 0 0 3px var(--halo);animation:${s}-pulse 2.6s ease-in-out infinite}

.${s}-hero{margin-top:auto;display:flex;flex-direction:column}
.${s}-catrow{display:flex;align-items:center;gap:10px;flex-wrap:wrap;margin-bottom:15px}
.${s}-pill{
  font-family:${HERO_FONT};font-size:10px;font-weight:600;
  letter-spacing:.2em;text-transform:uppercase;color:var(--accent-ink);
  background:linear-gradient(180deg, color-mix(in srgb,var(--accent) 96%, white 6%), var(--accent-deep));
  padding:5px 11px;border-radius:999px;
  box-shadow:0 1px 0 rgba(255,255,255,.35) inset, 0 6px 16px -8px var(--halo);
}
.${s}-name{
  font-family:${HERO_FONT};font-weight:700;
  font-size:47px;line-height:.94;letter-spacing:-.022em;color:${FRAME.dark.heroInk};
  text-shadow:${FRAME.dark.heroShadow};text-wrap:balance;overflow-wrap:break-word;margin:0;
  opacity:0;transform:translateY(6px);
  transition:opacity .5s cubic-bezier(.2,.8,.2,1), transform .5s cubic-bezier(.2,.8,.2,1);
}
[data-theme="light"] .${s}-name{color:${FRAME.light.heroInk};text-shadow:${FRAME.light.heroShadow}}
.${s}-name-fit{opacity:1;transform:none}
.${s}-desc{
  font-size:15px;line-height:1.45;font-weight:500;color:${FRAME.dark.heroDim};
  max-width:30ch;margin:11px 0 0;
}
[data-theme="light"] .${s}-desc{color:${FRAME.light.heroDim}}

.${s}-meta{display:grid;grid-template-columns:repeat(auto-fit, minmax(0, 1fr));margin-top:18px;padding-top:14px;position:relative}
.${s}-meta::before{
  content:"";position:absolute;left:0;right:0;top:0;height:1px;
  background:linear-gradient(90deg, transparent, var(--plate-hair) 14%, var(--plate-hair) 86%, transparent);
}
.${s}-meta > div{position:relative;padding-right:12px}
.${s}-meta > div + div{padding-left:14px}
.${s}-meta > div + div::before{content:"";position:absolute;left:0;top:2px;bottom:2px;width:1px;background:var(--plate-hair-soft)}
.${s}-k{font-family:${HERO_FONT};font-size:8.5px;font-weight:600;letter-spacing:.26em;text-transform:uppercase;color:${FRAME.dark.heroFaint};margin-bottom:6px}
[data-theme="light"] .${s}-k{color:${FRAME.light.heroFaint}}
.${s}-v{font-size:13px;font-weight:600;color:${FRAME.dark.heroInk};letter-spacing:.1px;display:flex;align-items:center;gap:6px;line-height:1.05;white-space:nowrap;overflow:hidden;text-overflow:ellipsis}
[data-theme="light"] .${s}-v{color:${FRAME.light.heroInk}}
.${s}-live-dot{width:6px;height:6px;border-radius:50%;background:var(--accent);box-shadow:0 0 0 2px var(--halo);flex:0 0 auto;animation:${s}-pulse 2.6s ease-in-out infinite}

.${s}-dock{flex:0 0 auto;padding:18px 6px 4px;display:flex;flex-direction:column;gap:11px;animation:${s}-fadeUp .9s .28s cubic-bezier(.2,.8,.2,1) both}
.${s}-btn{
  width:100%;border:0;font-family:${BODY_FONT};
  display:flex;align-items:center;justify-content:center;gap:11px;
  border-radius:17px;font-size:16px;font-weight:700;letter-spacing:.1px;
  transition:transform .18s cubic-bezier(.2,.8,.2,1), box-shadow .25s ease, background .2s ease, filter .2s ease;
}
.${s}-btn:active{transform:translateY(1px) scale(.995)}
.${s}-btn-primary{
  height:56px;color:var(--accent-ink);position:relative;overflow:hidden;
  background:linear-gradient(168deg,
    color-mix(in srgb,var(--accent) 94%, white 8%) 0%,
    var(--accent) 46%,
    var(--accent-deep) 100%);
  box-shadow:
    0 1px 0 rgba(255,255,255,.45) inset,
    0 -10px 18px -10px rgba(0,0,0,.25) inset,
    0 16px 36px -14px var(--halo),
    0 0 0 1px color-mix(in srgb,var(--accent-deep) 70%, transparent);
}
.${s}-btn-primary::before{
  content:"";position:absolute;inset:0;pointer-events:none;
  background:linear-gradient(110deg, rgba(255,255,255,.34) 0%, rgba(255,255,255,0) 42%);opacity:.7;
}
.${s}-btn-primary > *{position:relative;z-index:1}
.${s}-btn-primary:hover{filter:brightness(1.03) saturate(1.04);transform:translateY(-1px);box-shadow:
    0 1px 0 rgba(255,255,255,.45) inset,
    0 -10px 18px -10px rgba(0,0,0,.25) inset,
    0 20px 42px -14px var(--halo),
    0 0 0 1px color-mix(in srgb,var(--accent-deep) 70%, transparent)}
.${s}-btn-ghost{
  height:50px;color:${FRAME.dark.ghostInk};background:${FRAME.dark.ghostBg};
  border:1px solid ${FRAME.dark.ghostHair};font-weight:600;font-size:14.5px;
  box-shadow:0 1px 0 var(--chip-sheen) inset;
  backdrop-filter:blur(8px);-webkit-backdrop-filter:blur(8px);
}
[data-theme="light"] .${s}-btn-ghost{color:${FRAME.light.ghostInk};background:${FRAME.light.ghostBg};border-color:${FRAME.light.ghostHair}}
.${s}-btn-ghost:hover{background:${FRAME.dark.ghostBgHover}}
[data-theme="light"] .${s}-btn-ghost:hover{background:${FRAME.light.ghostBgHover}}
.${s}-arrow{color:var(--accent);font-weight:700;transition:transform .2s ease}
.${s}-btn-ghost:hover .${s}-arrow{transform:translateX(3px)}

/* ===== ON-BRAND FIELD SLOT (code / PIN inputs on the dock) ===== */
.${s}-fieldslot{display:flex;flex-direction:column;gap:9px}
/* The app supplies the input; the slot styles bare inputs + the opt-in class so
   a plain <input> reads on the duotone dock (glass/edge, like the CTA + meta). */
.${s}-fieldslot input,
.${s}-fieldslot select,
.${s}-fieldslot textarea,
.${s}-fieldslot .${DUOTONE_FIELD_CLASS}{
  width:100%;box-sizing:border-box;height:52px;
  font-family:${BODY_FONT};font-size:16px;font-weight:600;letter-spacing:.1px;
  color:${FRAME.dark.heroInk};
  background:${FRAME.dark.chipBg};
  border:1px solid ${FRAME.dark.chipHair};border-radius:15px;
  padding:0 16px;outline:none;-webkit-appearance:none;appearance:none;
  box-shadow:0 1px 0 var(--chip-sheen) inset;
  backdrop-filter:blur(8px) saturate(120%);-webkit-backdrop-filter:blur(8px) saturate(120%);
  transition:border-color .18s ease, box-shadow .25s ease, background .2s ease;
}
.${s}-fieldslot textarea{height:auto;min-height:84px;padding:13px 16px;line-height:1.4;resize:vertical}
[data-theme="light"] .${s}-fieldslot input,
[data-theme="light"] .${s}-fieldslot select,
[data-theme="light"] .${s}-fieldslot textarea,
[data-theme="light"] .${s}-fieldslot .${DUOTONE_FIELD_CLASS}{
  color:${FRAME.light.heroInk};background:${FRAME.light.chipBg};border-color:${FRAME.light.chipHairSoft};
}
.${s}-fieldslot input::placeholder,
.${s}-fieldslot textarea::placeholder,
.${s}-fieldslot .${DUOTONE_FIELD_CLASS}::placeholder{color:${FRAME.dark.heroFaint};font-weight:500}
[data-theme="light"] .${s}-fieldslot input::placeholder,
[data-theme="light"] .${s}-fieldslot textarea::placeholder,
[data-theme="light"] .${s}-fieldslot .${DUOTONE_FIELD_CLASS}::placeholder{color:${FRAME.light.heroFaint}}
.${s}-fieldslot input:hover,
.${s}-fieldslot select:hover,
.${s}-fieldslot textarea:hover,
.${s}-fieldslot .${DUOTONE_FIELD_CLASS}:hover{border-color:color-mix(in srgb,var(--accent) 38%, ${FRAME.dark.chipHair})}
[data-theme="light"] .${s}-fieldslot input:hover,
[data-theme="light"] .${s}-fieldslot select:hover,
[data-theme="light"] .${s}-fieldslot textarea:hover,
[data-theme="light"] .${s}-fieldslot .${DUOTONE_FIELD_CLASS}:hover{border-color:color-mix(in srgb,var(--accent) 38%, ${FRAME.light.chipHairSoft})}
.${s}-fieldslot input:focus,
.${s}-fieldslot input:focus-visible,
.${s}-fieldslot select:focus,
.${s}-fieldslot select:focus-visible,
.${s}-fieldslot textarea:focus,
.${s}-fieldslot textarea:focus-visible,
.${s}-fieldslot .${DUOTONE_FIELD_CLASS}:focus,
.${s}-fieldslot .${DUOTONE_FIELD_CLASS}:focus-visible{
  border-color:var(--accent);
  box-shadow:0 1px 0 var(--chip-sheen) inset, 0 0 0 3px var(--halo);
}
.${s}-fieldslot input:disabled,
.${s}-fieldslot select:disabled,
.${s}-fieldslot textarea:disabled,
.${s}-fieldslot .${DUOTONE_FIELD_CLASS}:disabled{opacity:.55;cursor:default}
.${s}-fieldnote{
  margin:0;text-align:center;color:${FRAME.dark.footInk};
  font-family:${HERO_FONT};font-size:10px;font-weight:500;letter-spacing:.14em;text-transform:uppercase;
}
[data-theme="light"] .${s}-fieldnote{color:${FRAME.light.footInk}}

.${s}-foot{display:flex;align-items:center;justify-content:center;gap:8px;padding-top:7px;color:${FRAME.dark.footInk};font-size:11px;font-weight:500;letter-spacing:.04em}
[data-theme="light"] .${s}-foot{color:${FRAME.light.footInk}}
.${s}-seal{
  font-family:${HERO_FONT};font-weight:700;font-size:10px;letter-spacing:.04em;
  color:${FRAME.dark.footSealInk};padding:3px 8px;border-radius:7px;
  border:1px solid ${FRAME.dark.footSealHair};background:${FRAME.dark.footSealBg};
}
[data-theme="light"] .${s}-seal{color:${FRAME.light.footSealInk};border-color:${FRAME.light.footSealHair};background:${FRAME.light.footSealBg}}
.${s}-seal b{color:var(--accent)}

@media (max-height:860px){.${s}-dock{padding-top:16px}}
@media (prefers-reduced-motion:reduce){
  .${s}-stage *{animation:none !important}
  .${s}-name{opacity:1 !important;transform:none !important;transition:none !important}
}
`
}

export default DuotoneSplash
