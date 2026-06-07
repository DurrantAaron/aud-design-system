import React, { useId, useLayoutEffect, useRef, useState } from 'react'
import type { SplashAction } from './SplashScreen'
import { useFamily } from './FamilyProvider'
import { useTakeoverBody } from '../useTakeoverBody'
import { familyPresets } from './../families'
import type { FamilyKey } from '../families'

/**
 * One Google Fonts <link> for the wordmark skin: Bebas Neue (the stencil
 * wordmark), Share Tech Mono (telemetry labels / REV / footer), Barlow (body +
 * buttons). Injected once per document (id-guarded).
 */
const FONTS_LINK_ID = 'aud-wordmark-fonts'
const FONTS_HREF =
  'https://fonts.googleapis.com/css2?family=Bebas+Neue&family=Barlow:wght@400;500;600&family=Share+Tech+Mono&display=swap'

const DISPLAY = "'AuD-Bebas', 'Bebas Neue', 'Oswald', 'Arial Narrow', sans-serif"
const MONO = "'Share Tech Mono', ui-monospace, monospace"
const BODY = "'Barlow', system-ui, sans-serif"

/** Family-owned accent + a calibrated light/dark "instrument" palette. */
const ACCENTS: Record<FamilyKey, string> = {
  audits: '#C8A84B', // brass
  dashboards: '#5E7C93', // steel
  registers: '#C26B52', // clay
  logs: '#7C8A5C', // sage
}

interface Ground {
  ground: string
  ink: string
  mid: string
  sub: string
  tick: string
  gridA: number
  glowA: number
  secBg: string
  secBd: string
  secInk: string
  fieldBg: string
  fieldBd: string
}

const GROUND: Record<'light' | 'dark', Ground> = {
  light: {
    ground: '#F2F0EB',
    ink: '#14130F',
    mid: '#5F5B50',
    sub: '#4E4A41',
    tick: 'rgba(20,19,15,.22)',
    gridA: 0.04,
    glowA: 0.1,
    secBg: 'rgba(20,19,15,.035)',
    secBd: 'rgba(20,19,15,.20)',
    secInk: '#3A372F',
    fieldBg: '#FFFFFF',
    fieldBd: 'rgba(20,19,15,.16)',
  },
  dark: {
    ground: '#17160F',
    ink: '#F2F0EB',
    mid: '#9B9788',
    sub: '#B9B5A6',
    tick: 'rgba(242,240,235,.20)',
    gridA: 0.03,
    glowA: 0.16,
    secBg: 'rgba(242,240,235,.05)',
    secBd: 'rgba(242,240,235,.22)',
    secInk: '#D7D3C6',
    fieldBg: 'rgba(242,240,235,.05)',
    fieldBd: 'rgba(242,240,235,.16)',
  },
}

export interface WordmarkSplashProps
  extends Omit<React.HTMLAttributes<HTMLDivElement>, 'title'> {
  /** App name — used for the accessible label + as the wordmark fallback. */
  appName: string
  /**
   * The big stencil word (e.g. "AUDITOR", "FIRSTAID", "PRECINCT"). Defaults to
   * `appName` upper-cased with spaces removed.
   */
  wordmark?: string
  /** Letter indices (0-based) in the wordmark to paint in the accent. */
  accentLetters?: number[]
  /** Tracked label under the rule (e.g. "VENUE AUDIT"). Defaults to `appName`. */
  subtitle?: string
  /** Function family — selects the accent + base mode. */
  family?: FamilyKey
  /** Override the accent colour. Defaults to the family accent. */
  accent?: string
  /** light | dark. Defaults to the family's base mode. */
  theme?: 'light' | 'dark'
  /** Top-right revision tag. Default "REV 01". */
  rev?: string
  /** Footer version tag. Default "v1.0". */
  version?: string
  /** Footer provenance. Default "BUILT IN AUSTRALIA". */
  region?: string
  /** Primary action (the accent-filled button). */
  primary: SplashAction
  /** Optional secondary action under an "or" divider (e.g. Continue as guest). */
  secondary?: SplashAction
  /** Render passcode/PIN fields above the buttons (children slot). */
  formMode?: boolean
  /** A small caption under the fields. */
  fieldNote?: string
  /** App-supplied field(s) — rendered in the on-brand field slot. */
  children?: React.ReactNode
}

/** steel is mid-luminance and fails AA with dark ink, so lift the CTA fill. */
function ctaFill(accent: string, family?: FamilyKey): string {
  return family === 'dashboards' ? '#6E899E' : accent
}

export function WordmarkSplash({
  appName,
  wordmark,
  accentLetters = [],
  subtitle,
  family,
  accent,
  theme,
  rev = 'REV 01',
  version = 'v1.0',
  region = 'BUILT IN AUSTRALIA',
  primary,
  secondary,
  formMode,
  fieldNote,
  children,
  style,
  ...rest
}: WordmarkSplashProps) {
  const ctx = useFamily()
  const resolvedFamily: FamilyKey = family ?? ctx?.key ?? 'audits'
  const resolvedTheme: 'light' | 'dark' =
    theme ?? ctx?.mode ?? familyPresets[resolvedFamily].mode
  const accentColor = accent ?? ctx?.accent ?? ACCENTS[resolvedFamily]
  const g = GROUND[resolvedTheme]
  const cta = ctaFill(accentColor, resolvedFamily)

  const word = (wordmark ?? appName.toUpperCase().replace(/\s+/g, '')).toUpperCase()
  const accSet = new Set(accentLetters)
  const sub = subtitle ?? appName

  const rawId = useId()
  const scope = `aud-wm-${rawId.replace(/[^a-zA-Z0-9_-]/g, '')}`

  useLayoutEffect(() => {
    if (typeof document === 'undefined') return
    if (document.getElementById(FONTS_LINK_ID)) return
    const link = document.createElement('link')
    link.id = FONTS_LINK_ID
    link.rel = 'stylesheet'
    link.href = FONTS_HREF
    document.head.appendChild(link)
  }, [])

  // Paint the page ground + lock scroll while mounted (iOS standalone correctness).
  useTakeoverBody(g.ground)

  // Auto-fit the wordmark so long names never clip the screen width.
  const wordRef = useRef<HTMLHeadingElement>(null)
  const [fitted, setFitted] = useState(false)
  useLayoutEffect(() => {
    const el = wordRef.current
    if (!el) return
    setFitted(false)
    const fit = () => {
      let fs = 96
      el.style.fontSize = fs + 'px'
      let guard = 80
      while (guard-- > 0 && fs > 40 && el.scrollWidth > el.clientWidth + 0.5) {
        fs -= 2
        el.style.fontSize = fs + 'px'
      }
      setFitted(true)
    }
    fit()
    if (typeof document !== 'undefined' && document.fonts?.ready) {
      document.fonts.ready.then(fit).catch(() => {})
    }
    window.addEventListener('resize', fit)
    return () => window.removeEventListener('resize', fit)
  }, [word, resolvedTheme])

  const vars = {
    '--ground': g.ground,
    '--ink': g.ink,
    '--mid': g.mid,
    '--sub': g.sub,
    '--accent': accentColor,
    '--cta': cta,
    '--cta-bd': `color-mix(in srgb, ${cta} 78%, #000)`,
    '--tick': g.tick,
    '--sec-bg': g.secBg,
    '--sec-bd': g.secBd,
    '--sec-ink': g.secInk,
    '--field-bg': g.fieldBg,
    '--field-bd': g.fieldBd,
    '--grid-a': `${g.gridA * 100}%`,
    '--glow-a': `${g.glowA * 100}%`,
  } as React.CSSProperties

  return (
    <div
      data-theme={resolvedTheme}
      data-aud-family={resolvedFamily}
      style={{
        ...vars,
        position: 'relative',
        height: '100dvh',
        width: '100%',
        overflow: 'hidden',
        background: g.ground,
        color: g.ink,
        fontFamily: BODY,
        WebkitFontSmoothing: 'antialiased',
        ...style,
      }}
      {...rest}
    >
      <style>{scopedCss(scope)}</style>

      <div className={`${scope}-stage`} role="img" aria-label={appName}>
        {/* corner registration ticks */}
        <span className={`${scope}-tk ${scope}-tl`} />
        <span className={`${scope}-tk ${scope}-tr`} />
        <span className={`${scope}-tk ${scope}-bl`} />
        <span className={`${scope}-tk ${scope}-br`} />

        {/* top telemetry row */}
        <div className={`${scope}-top`}>
          <span className={`${scope}-aud`}>
            A<i>u</i>D
          </span>
          <span className={`${scope}-rev`}>{rev} · SECURE</span>
        </div>

        {/* hero — the wordmark */}
        <div className={`${scope}-hero`}>
          <h1
            ref={wordRef}
            className={`${scope}-word${fitted ? ` ${scope}-word-fit` : ''}`}
            aria-hidden="true"
          >
            {word.split('').map((ch, i) => (
              <span key={i} style={accSet.has(i) ? { color: 'var(--accent)' } : undefined}>
                {ch}
              </span>
            ))}
          </h1>
          <span className={`${scope}-rule`} />
          <div className={`${scope}-sub`}>{sub}</div>
        </div>

        {/* actions */}
        <div className={`${scope}-actions`}>
          {formMode && (children || fieldNote) && (
            <div className={`${scope}-fieldslot`}>
              {children}
              {fieldNote && <p className={`${scope}-fieldnote`}>{fieldNote}</p>}
            </div>
          )}
          <WordmarkButton variant="primary" action={primary} scope={scope} />
          {secondary && (
            <>
              <div className={`${scope}-divider`}>
                <span className={`${scope}-line`} />
                <span>or</span>
                <span className={`${scope}-line`} />
              </div>
              <WordmarkButton variant="ghost" action={secondary} scope={scope} />
            </>
          )}
        </div>

        {/* footer telemetry */}
        <div className={`${scope}-foot`}>
          <div className={`${scope}-status`}>
            SECURE <span className={`${scope}-dot`}>·</span> {version}{' '}
            <span className={`${scope}-dot`}>·</span> {region}
          </div>
          <div className={`${scope}-powered`}>
            POWERED BY{' '}
            <span className={`${scope}-aud ${scope}-aud-sm`}>
              A<i>u</i>D
            </span>
          </div>
        </div>
      </div>
    </div>
  )
}

function WordmarkButton({
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
  return (
    <button
      type="button"
      className={`${scope}-btn ${scope}-btn-${variant}`}
      onClick={onClick}
      disabled={isDisabled}
      style={{ opacity: isDisabled ? 0.55 : 1, cursor: isDisabled ? 'default' : 'pointer' }}
    >
      {!loading && icon}
      <span>{loading ? loadingLabel ?? label : label}</span>
    </button>
  )
}

function scopedCss(s: string): string {
  return `
@keyframes ${s}-fadeUp{from{opacity:0;transform:translateY(10px)}to{opacity:1;transform:none}}

.${s}-stage{
  position:absolute;inset:0;margin-inline:auto;max-width:520px;min-height:0;
  display:flex;flex-direction:column;overflow:hidden;background:var(--ground);
  padding:max(22px, env(safe-area-inset-top)) max(26px, env(safe-area-inset-right)) max(22px, env(safe-area-inset-bottom)) max(26px, env(safe-area-inset-left));
}
/* edge-faded grid */
.${s}-stage::before{content:"";position:absolute;inset:0;pointer-events:none;z-index:0;
  background-image:
    linear-gradient(color-mix(in srgb,var(--ink) var(--grid-a),transparent) 1px,transparent 1px),
    linear-gradient(90deg,color-mix(in srgb,var(--ink) var(--grid-a),transparent) 1px,transparent 1px);
  background-size:30px 30px;
  -webkit-mask-image:radial-gradient(circle at 50% 42%,#000,transparent 78%);
          mask-image:radial-gradient(circle at 50% 42%,#000,transparent 78%)}
/* warm accent glow */
.${s}-stage::after{content:"";position:absolute;inset:0;pointer-events:none;z-index:0;
  background:radial-gradient(circle at 50% 40%, color-mix(in srgb,var(--accent) var(--glow-a),transparent), transparent 60%)}

.${s}-tk{position:absolute;width:13px;height:13px;border:0 solid var(--tick);z-index:1}
.${s}-tl{top:18px;left:18px;border-top-width:1.5px;border-left-width:1.5px}
.${s}-tr{top:18px;right:18px;border-top-width:1.5px;border-right-width:1.5px}
.${s}-bl{bottom:18px;left:18px;border-bottom-width:1.5px;border-left-width:1.5px}
.${s}-br{bottom:18px;right:18px;border-bottom-width:1.5px;border-right-width:1.5px}

.${s}-top{position:relative;z-index:2;flex:0 0 auto;display:flex;align-items:center;justify-content:space-between}
.${s}-aud{font-family:${DISPLAY};font-size:17px;letter-spacing:.06em;color:var(--ink);line-height:1}
.${s}-aud i{color:var(--accent);font-style:normal}
.${s}-aud-sm{font-size:14px;vertical-align:-1px}
.${s}-rev{font-family:${MONO};font-size:10.5px;letter-spacing:.34em;color:var(--mid);text-transform:uppercase}

.${s}-hero{position:relative;z-index:2;flex:1 1 auto;min-height:0;display:flex;flex-direction:column;align-items:center;justify-content:center;gap:14px;text-align:center;
  animation:${s}-fadeUp .8s .05s cubic-bezier(.2,.8,.2,1) both}
.${s}-word{
  margin:0;font-family:${DISPLAY};font-weight:400;line-height:.9;letter-spacing:.005em;
  color:var(--ink);font-size:84px;white-space:nowrap;
  opacity:0;transition:opacity .35s ease}
.${s}-word-fit{opacity:1}
.${s}-rule{display:block;width:58px;height:2px;background:var(--accent);border-radius:2px;opacity:.9}
.${s}-sub{font-family:${MONO};font-size:12px;letter-spacing:.42em;text-transform:uppercase;color:var(--sub)}

.${s}-actions{position:relative;z-index:2;flex:0 0 auto;width:100%;max-width:330px;margin:0 auto;display:flex;flex-direction:column;gap:11px;
  animation:${s}-fadeUp .8s .18s cubic-bezier(.2,.8,.2,1) both}
.${s}-btn{width:100%;display:flex;align-items:center;justify-content:center;gap:10px;padding:15px 16px;border-radius:13px;
  font-family:${BODY};font-weight:600;font-size:14.5px;letter-spacing:.01em;border:1px solid transparent;transition:transform .16s ease, filter .2s ease}
.${s}-btn:active{transform:translateY(1px) scale(.995)}
.${s}-btn-primary{background:var(--cta);color:#17160F;border-color:var(--cta-bd);
  box-shadow:0 2px 10px color-mix(in srgb,var(--cta) 30%,transparent), inset 0 1px 0 rgba(255,255,255,.28)}
.${s}-btn-primary:hover{filter:brightness(1.03) saturate(1.03)}
.${s}-btn-ghost{background:var(--sec-bg);color:var(--sec-ink);border-color:var(--sec-bd)}

.${s}-divider{display:flex;align-items:center;gap:9px;font-family:${MONO};font-size:11px;letter-spacing:.2em;color:var(--mid)}
.${s}-divider .${s}-line{flex:1;height:1px;background:var(--sec-bd)}

.${s}-fieldslot{display:flex;flex-direction:column;gap:9px}
.${s}-fieldslot input,.${s}-fieldslot select,.${s}-fieldslot textarea{
  width:100%;box-sizing:border-box;height:52px;font-family:${BODY};font-size:16px;font-weight:500;
  color:var(--ink);background:var(--field-bg);border:1px solid var(--field-bd);border-radius:12px;padding:0 15px;outline:none;-webkit-appearance:none;appearance:none;
  transition:border-color .16s ease, box-shadow .2s ease}
.${s}-fieldslot input::placeholder{color:var(--mid)}
.${s}-fieldslot input:focus,.${s}-fieldslot select:focus,.${s}-fieldslot textarea:focus{
  border-color:var(--accent);box-shadow:0 0 0 3px color-mix(in srgb,var(--accent) 26%,transparent)}
.${s}-fieldnote{margin:0;text-align:center;font-family:${MONO};font-size:10px;letter-spacing:.16em;text-transform:uppercase;color:var(--mid)}

.${s}-foot{position:relative;z-index:2;flex:0 0 auto;display:flex;flex-direction:column;align-items:center;gap:8px;padding-top:14px}
.${s}-status{font-family:${MONO};font-size:10px;letter-spacing:.24em;text-transform:uppercase;color:var(--mid)}
.${s}-status .${s}-dot{color:var(--accent)}
.${s}-powered{font-family:${MONO};font-size:10px;letter-spacing:.24em;text-transform:uppercase;color:var(--mid);display:flex;align-items:center;gap:7px}

@media (prefers-reduced-motion:reduce){
  .${s}-stage *{animation:none !important}
  .${s}-word{opacity:1 !important}
}
`
}

export default WordmarkSplash
