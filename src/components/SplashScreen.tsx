import React, { useState } from 'react'
import { neutrals, fonts } from '../tokens'
import { PoweredByAud } from './PoweredByAud'
import { useFamily } from './FamilyProvider'

const DEFAULT_ACCENT = 'var(--aud-accent, #C8A84B)'

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
   * Render the `children` (fields) ABOVE the actions, for PIN/code apps where
   * the inputs come first. Default false — OAuth-first, button on top.
   */
  actionsLast?: boolean
  /** Alias for {@link SplashScreenProps.actionsLast}. */
  formMode?: boolean
  /** A mono micro-line under the fields — a hint, env tag, or revision marker. */
  fieldNote?: React.ReactNode
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
 * ```tsx
 * <SplashScreen
 *   mark={<MyTile>IVY</MyTile>}
 *   title="Precinct Compliance"
 *   subtitle="AusComply checklist analytics · IVY Precinct"
 *   accent={accents.steel}
 *   primary={{ label: 'Sign in with Microsoft', icon: <MsLogo/>, onClick, loading }}
 *   secondary={{ label: 'Continue with static data', onClick: guest }}
 * />
 * ```
 */
export function SplashScreen({
  mark,
  title,
  subtitle,
  primary,
  secondary,
  dividerLabel = 'or',
  error,
  accent = DEFAULT_ACCENT,
  theme,
  actionsLast,
  formMode,
  fieldNote,
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
  // Dark ink on the accent fill reads on all five (mid-luminance) accents.
  const onAccent = neutrals.dark.ground
  const errorColor = resolvedTheme === 'dark' ? '#F0857C' : '#B23B30'

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
      <SplashButton variant="primary" action={primary} accent={accent} onAccent={onAccent} n={n} />

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
          <SplashButton variant="ghost" action={secondary} accent={accent} onAccent={onAccent} n={n} />
        </>
      )}
    </>
  )

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
        ...style,
      }}
      {...rest}
    >
      <style>{'@keyframes aud-splash-spin{to{transform:rotate(360deg)}}'}</style>

      <div style={{ width: '100%', maxWidth: 360, display: 'flex', flexDirection: 'column', gap: 24 }}>
        <div style={{ textAlign: 'center', display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 12 }}>
          {mark}
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

      {footer !== null && (
        <div
          style={{
            position: 'absolute',
            left: 0,
            right: 0,
            bottom: 24,
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
  accent,
  onAccent,
  n,
}: {
  variant: 'primary' | 'ghost'
  action: SplashAction
  accent: string
  onAccent: string
  n: { ground: string; surface: string; ink: string; mid: string; rule: string }
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

  const variantStyle: React.CSSProperties =
    variant === 'primary'
      ? {
          background: accent,
          color: onAccent,
          border: 'none',
          filter: hover && !isDisabled ? 'brightness(1.06)' : 'none',
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
