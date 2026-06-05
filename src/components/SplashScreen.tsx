import React, { useState } from 'react'
import { neutrals, fonts } from '../tokens'
import { PoweredByAud } from './PoweredByAud'
import { useFamily } from './FamilyProvider'

const DEFAULT_ACCENT = 'var(--aud-accent, #C8A84B)'

// --- Contrast helpers: keep the accent CTA legible across all five accents. ---
const _lum = (hex: string): number => {
  const h = hex.replace('#', '')
  const n = h.length === 3 ? h.split('').map((c) => c + c).join('') : h
  const v = [0, 2, 4]
    .map((i) => parseInt(n.slice(i, i + 2), 16) / 255)
    .map((c) => (c <= 0.03928 ? c / 12.92 : Math.pow((c + 0.055) / 1.055, 2.4)))
  return 0.2126 * v[0] + 0.7152 * v[1] + 0.0722 * v[2]
}
const _contrast = (a: string, b: string): number => {
  const L1 = _lum(a), L2 = _lum(b)
  return (Math.max(L1, L2) + 0.05) / (Math.min(L1, L2) + 0.05)
}
const _mixWhite = (hex: string, p: number): string => {
  const h = hex.replace('#', '')
  const ch = [0, 2, 4].map((i) => parseInt(h.slice(i, i + 2), 16))
  const r = ch.map((c) => Math.round(c * (1 - p) + 255 * p))
  return '#' + r.map((c) => c.toString(16).padStart(2, '0')).join('')
}
/**
 * Lift a mid-luminance accent (e.g. steel) toward white until dark-ink text on
 * it clears WCAG AA (4.5:1). No-op for non-hex accents (CSS vars) or accents
 * that already pass — so brass/clay/sage/eucalypt are untouched, steel is fixed.
 */
function contrastSafeFill(accent: string, onAccent: string): string {
  if (!/^#[0-9a-fA-F]{6}$/.test(accent)) return accent
  let fill = accent
  for (let p = 0.04; p <= 0.2 && _contrast(onAccent, fill) < 4.5; p += 0.04) {
    fill = _mixWhite(accent, p)
  }
  return fill
}

export interface SplashAction {
  /** Button label. */
  label: string
  onClick?: () => void
  /** Leading icon (e.g. a Microsoft logo). Hidden while `loading`. */
  icon?: React.ReactNode
  /** Swaps in a spinner + `loadingLabel`, and disables the button. */
  loading?: boolean
  /** Label shown while `loading`. Defaults to `label`. */
  loadingLabel?: string
  disabled?: boolean
}

export interface SplashScreenProps
  extends Omit<React.HTMLAttributes<HTMLDivElement>, 'title'> {
  /** Brand tile / logo above the title — app-provided (an icon, a lettermark tile…). */
  mark?: React.ReactNode
  /**
   * Optional mono kicker above the title — typically the family name
   * (AUDITS, DASHBOARDS…). Rendered with a small accent pip. Best with `atmosphere`.
   */
  eyebrow?: React.ReactNode
  title: React.ReactNode
  subtitle?: React.ReactNode
  /** Primary call to action — a filled button in the app accent. */
  primary: SplashAction
  /** Optional secondary action — a ghost button under an "or" divider. */
  secondary?: SplashAction
  /** Divider label between the two actions. Defaults to "or". */
  dividerLabel?: string
  /** Inline error message under the primary action. */
  error?: string
  /** Accent for the primary fill and the footer mark. Defaults to `--aud-accent`. */
  accent?: string
  /**
   * Neutral palette. Defaults to the enclosing `<FamilyProvider>`'s mode, or
   * "dark" when there is none.
   */
  theme?: 'light' | 'dark'
  /**
   * Opt into the "warm instrument" atmosphere: a faint edge-faded technical
   * grid, a warm accent glow behind the centre, four corner registration ticks,
   * a tinted (clearly tappable) secondary button, and a contrast-safe CTA fill.
   * Default false — existing consumers render exactly as before.
   */
  atmosphere?: boolean
  /**
   * Render the `children` (fields) ABOVE the actions, for PIN/code apps where
   * the inputs come first. Default false — OAuth-first, button on top.
   */
  actionsLast?: boolean
  /** Alias for {@link SplashScreenProps.actionsLast}. */
  formMode?: boolean
  /** A mono micro-line under the fields — a hint, env tag, or revision marker. */
  fieldNote?: React.ReactNode
  /** A mono telemetry line pinned just above the footer (e.g. "SECURE · BUILT IN AUSTRALIA"). */
  status?: React.ReactNode
  /** Footer node. Defaults to <PoweredByAud accent />; pass `null` to hide it. */
  footer?: React.ReactNode
  /** Extra content next to the actions (e.g. a passcode form). */
  children?: React.ReactNode
}

/**
 * The shared sign-in / splash scaffold.
 *
 * A centred brand mark, title + subtitle, a primary action, an optional
 * secondary action under an "or" divider, and the "Powered by AuD" mark pinned
 * at the bottom. Self-contained inline styles (Tailwind optional) on the brand
 * neutrals, so every app's splash reads as one family — only the `accent` and
 * the app-provided `mark` move.
 *
 * Pass `atmosphere` for the publish-grade "warm instrument" treatment.
 *
 * ```tsx
 * <SplashScreen
 *   atmosphere
 *   mark={<AppMark accent={accents.steel}><Gauge/></AppMark>}
 *   eyebrow="DASHBOARDS"
 *   title="Precinct Compliance"
 *   subtitle="Checklist analytics"
 *   accent={accents.steel}
 *   status={<>SECURE CONNECTION · BUILT IN AUSTRALIA</>}
 *   primary={{ label: 'Sign in with Microsoft', icon: <MsLogo/>, onClick, loading }}
 *   secondary={{ label: 'Continue with static data', onClick: guest }}
 * />
 * ```
 */
export function SplashScreen({
  mark,
  eyebrow,
  title,
  subtitle,
  primary,
  secondary,
  dividerLabel = 'or',
  error,
  accent = DEFAULT_ACCENT,
  theme,
  atmosphere = false,
  actionsLast,
  formMode,
  fieldNote,
  status,
  footer,
  children,
  style,
  ...rest
}: SplashScreenProps) {
  // Theme follows the enclosing family (if any), then the explicit prop, then dark.
  const family = useFamily()
  const resolvedTheme = theme ?? family?.mode ?? 'dark'
  const fieldsFirst = !!(actionsLast || formMode)
  const n = neutrals[resolvedTheme]
  const dark = resolvedTheme === 'dark'
  // Dark ink on the accent fill reads on all five (mid-luminance) accents.
  const onAccent = neutrals.dark.ground
  // Auto-lift the CTA fill so the label clears AA even on mid-tone accents (steel).
  const primaryFill = contrastSafeFill(accent, onAccent)
  const errorColor = dark ? '#F0857C' : '#B23B30'
  // Accent pip: vivid on dark, darkened toward ink on light so it clears 3:1 on cream.
  const pip = dark
    ? accent
    : `color-mix(in srgb, ${accent}, ${n.ink} 25%)`

  const eyebrowEl = eyebrow ? (
    <div
      style={{
        display: 'flex',
        alignItems: 'center',
        gap: 8,
        fontFamily: fonts.mono,
        fontSize: '0.6875rem',
        letterSpacing: '0.4em',
        textTransform: 'uppercase',
        color: n.mid,
      }}
    >
      <span aria-hidden="true" style={{ width: 6, height: 6, borderRadius: 1, background: pip }} />
      {eyebrow}
    </div>
  ) : null

  // The app-provided fields (children) + an optional mono micro-line under them.
  const fields =
    children || fieldNote ? (
      <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
        {children}
        {fieldNote && (
          <p
            style={{
              margin: 0,
              fontFamily: fonts.mono,
              fontSize: '0.6875rem',
              letterSpacing: '0.04em',
              lineHeight: 1.5,
              textAlign: 'center',
              color: n.mid,
            }}
          >
            {fieldNote}
          </p>
        )}
      </div>
    ) : null

  const actions = (
    <>
      <SplashButton variant="primary" action={primary} fill={primaryFill} onAccent={onAccent} n={n} atmosphere={atmosphere} dark={dark} />

      {error && (
        <p style={{ margin: 0, fontSize: '0.75rem', textAlign: 'center', color: errorColor }}>{error}</p>
      )}

      {secondary && (
        <>
          <div style={{ display: 'flex', alignItems: 'center', gap: 8, fontSize: '0.75rem', color: n.mid }}>
            <span style={{ flex: 1, height: 1, background: n.rule }} />
            <span>{dividerLabel}</span>
            <span style={{ flex: 1, height: 1, background: n.rule }} />
          </div>
          <SplashButton variant="ghost" action={secondary} fill={primaryFill} onAccent={onAccent} n={n} atmosphere={atmosphere} dark={dark} />
        </>
      )}
    </>
  )

  // Atmosphere CSS — scoped to .aud-splash-atmos; theming via per-instance vars.
  const atmosCss = `
    @keyframes aud-splash-spin{to{transform:rotate(360deg)}}
    .aud-splash-atmos{position:absolute;inset:0;pointer-events:none;overflow:hidden}
    .aud-splash-atmos .g{position:absolute;inset:0;
      background-image:linear-gradient(var(--aud-grid) 1px,transparent 1px),linear-gradient(90deg,var(--aud-grid) 1px,transparent 1px);
      background-size:30px 30px;
      -webkit-mask-image:radial-gradient(circle at 50% 42%,#000,transparent 78%);
              mask-image:radial-gradient(circle at 50% 42%,#000,transparent 78%)}
    .aud-splash-atmos .gl{position:absolute;inset:0;background:radial-gradient(circle at 50% 38%,var(--aud-glow),transparent 60%)}
    .aud-splash-atmos .t{position:absolute;width:13px;height:13px;border:0 solid var(--aud-tick)}
    .aud-splash-atmos .t.tl{top:20px;left:20px;border-top-width:1.5px;border-left-width:1.5px}
    .aud-splash-atmos .t.tr{top:20px;right:20px;border-top-width:1.5px;border-right-width:1.5px}
    .aud-splash-atmos .t.bl{bottom:20px;left:20px;border-bottom-width:1.5px;border-left-width:1.5px}
    .aud-splash-atmos .t.br{bottom:20px;right:20px;border-bottom-width:1.5px;border-right-width:1.5px}`

  const atmosVars = {
    '--aud-grid': dark ? 'rgba(242,240,235,0.03)' : 'rgba(20,19,15,0.04)',
    '--aud-glow': `color-mix(in srgb, ${accent} ${dark ? 16 : 10}%, transparent)`,
    '--aud-tick': dark ? 'rgba(242,240,235,0.20)' : 'rgba(20,19,15,0.22)',
  } as React.CSSProperties

  return (
    <div
      style={{
        minHeight: '100vh',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        padding: 24,
        position: 'relative',
        background: n.ground,
        color: n.ink,
        fontFamily: fonts.body,
        overflow: 'hidden',
        ...style,
      }}
      {...rest}
    >
      <style>{atmosCss}</style>

      {atmosphere && (
        <div className="aud-splash-atmos" style={atmosVars} aria-hidden="true">
          <div className="g" />
          <div className="gl" />
          <span className="t tl" /><span className="t tr" /><span className="t bl" /><span className="t br" />
        </div>
      )}

      <div style={{ position: 'relative', zIndex: 1, width: '100%', maxWidth: 360, display: 'flex', flexDirection: 'column', gap: 24 }}>
        <div style={{ textAlign: 'center', display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 12 }}>
          {mark}
          {eyebrowEl}
          <div>
            <h1
              style={{
                margin: 0,
                fontFamily: fonts.heading,
                fontWeight: 600,
                fontSize: '1.5rem',
                lineHeight: 1.1,
                letterSpacing: '0.01em',
                color: n.ink,
              }}
            >
              {title}
            </h1>
            {subtitle && (
              <p style={{ margin: '6px 0 0', fontSize: '0.875rem', lineHeight: 1.4, color: n.mid }}>
                {subtitle}
              </p>
            )}
          </div>
        </div>

        <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
          {fieldsFirst ? (
            <>
              {fields}
              {actions}
            </>
          ) : (
            <>
              {actions}
              {fields}
            </>
          )}
        </div>
      </div>

      {status && (
        <div
          style={{
            position: 'absolute',
            left: 0,
            right: 0,
            bottom: 56,
            zIndex: 1,
            textAlign: 'center',
            fontFamily: fonts.mono,
            fontSize: '0.625rem',
            letterSpacing: '0.22em',
            color: n.mid,
          }}
        >
          {status}
        </div>
      )}

      {footer !== null && (
        <div
          style={{
            position: 'absolute',
            left: 0,
            right: 0,
            bottom: 24,
            zIndex: 1,
            display: 'flex',
            justifyContent: 'center',
            color: n.mid,
          }}
        >
          {footer ?? <PoweredByAud accent={accent} />}
        </div>
      )}
    </div>
  )
}

function SplashButton({
  variant,
  action,
  fill,
  onAccent,
  n,
  atmosphere,
  dark,
}: {
  variant: 'primary' | 'ghost'
  action: SplashAction
  fill: string
  onAccent: string
  n: { ground: string; surface: string; ink: string; mid: string; rule: string }
  atmosphere: boolean
  dark: boolean
}) {
  const [hover, setHover] = useState(false)
  const { label, onClick, icon, loading, loadingLabel, disabled } = action
  const isDisabled = !!disabled || !!loading

  const base: React.CSSProperties = {
    width: '100%',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
    padding: '12px 16px',
    borderRadius: 12,
    fontFamily: fonts.body,
    fontWeight: 600,
    fontSize: '0.875rem',
    cursor: isDisabled ? 'default' : 'pointer',
    opacity: isDisabled ? 0.5 : 1,
    transition: 'opacity 120ms ease, filter 120ms ease, color 120ms ease, border-color 120ms ease',
  }

  // Tinted, clearly-tappable secondary surface when atmosphere is on.
  const ghostBg = dark ? 'rgba(242,240,235,0.05)' : 'rgba(20,19,15,0.035)'
  const ghostBd = dark ? 'rgba(242,240,235,0.22)' : 'rgba(20,19,15,0.20)'
  const ghostInk = dark ? '#D7D3C6' : '#3A372F'

  const variantStyle: React.CSSProperties =
    variant === 'primary'
      ? {
          background: fill,
          color: onAccent,
          border: `1px solid color-mix(in srgb, ${fill} 78%, #000)`,
          boxShadow: atmosphere
            ? `0 2px 10px color-mix(in srgb, ${fill} 30%, transparent), inset 0 1px 0 rgba(255,255,255,0.28)`
            : 'none',
          filter: hover && !isDisabled ? 'brightness(1.06)' : 'none',
        }
      : atmosphere
        ? {
            background: ghostBg,
            color: hover && !isDisabled ? n.ink : ghostInk,
            border: `1px solid ${ghostBd}`,
          }
        : {
            background: 'transparent',
            color: hover && !isDisabled ? n.ink : n.mid,
            border: `1px solid ${n.rule}`,
          }

  return (
    <button
      type="button"
      onClick={onClick}
      disabled={isDisabled}
      onMouseEnter={() => setHover(true)}
      onMouseLeave={() => setHover(false)}
      style={{ ...base, ...variantStyle }}
    >
      {loading ? <Spinner color={variant === 'primary' ? onAccent : n.mid} /> : icon}
      <span>{loading ? loadingLabel ?? label : label}</span>
    </button>
  )
}

function Spinner({ color }: { color: string }) {
  return (
    <svg width="16" height="16" viewBox="0 0 16 16" aria-hidden="true" style={{ animation: 'aud-splash-spin 0.8s linear infinite' }}>
      <circle cx="8" cy="8" r="6.5" fill="none" stroke={color} strokeOpacity="0.25" strokeWidth="2" />
      <path d="M8 1.5a6.5 6.5 0 0 1 6.5 6.5" fill="none" stroke={color} strokeWidth="2" strokeLinecap="round" />
    </svg>
  )
}

export default SplashScreen
