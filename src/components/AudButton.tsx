import React, { useState } from 'react'

const ACCENT = 'var(--aud-accent, #C8A84B)'
const BODY_FONT = "var(--aud-font-body, 'Barlow', 'Inter', system-ui, sans-serif)"
// Dark ink reads on all five mid-luminance accents; light ink reads on danger.
const ON_ACCENT = 'var(--aud-ground, #17160F)'
const ON_DANGER = '#FAFAF8'

export type AudButtonVariant = 'primary' | 'secondary' | 'ghost' | 'danger'
export type AudButtonSize = 'sm' | 'md'

export interface AudButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  /** Visual weight. `primary` = accent fill · `secondary` = surface + rule · `ghost` = quiet until hover · `danger` = destructive. */
  variant?: AudButtonVariant
  size?: AudButtonSize
  /** Swaps in a spinner + `loadingLabel` and disables the button. */
  loading?: boolean
  /** Label shown while `loading`. Defaults to the button's children. */
  loadingLabel?: React.ReactNode
  /** Leading icon (hidden while loading). Size it to the text line-height. */
  icon?: React.ReactNode
  /** Trailing icon (e.g. a chevron). */
  iconRight?: React.ReactNode
  /** Stretch to the container width. */
  block?: boolean
  /** Override the accent fill / focus-ring colour. Defaults to `--aud-accent`. */
  accent?: string
}

/**
 * The suite button. Implements the four states the brief insists on —
 * default · hover · active (press) · disabled — plus a loading spinner and an
 * accent-tinted keyboard focus ring (the `--aud-ring` token). Sharp corners
 * (the `--aud-radius` token), never pillowy.
 *
 * States are driven by component state (hover / press / focus), so it is
 * SSR-safe and injects no global CSS.
 *
 * ```tsx
 * <AudButton onClick={save}>Save</AudButton>
 * <AudButton variant="ghost">Cancel</AudButton>
 * <AudButton variant="danger" icon={<Trash/>}>Delete</AudButton>
 * <AudButton loading loadingLabel="Saving…">Save</AudButton>
 * ```
 */
export function AudButton({
  variant = 'primary',
  size = 'md',
  loading = false,
  loadingLabel,
  icon,
  iconRight,
  block = false,
  accent = ACCENT,
  disabled,
  children,
  style,
  onMouseDown,
  onMouseUp,
  onMouseLeave,
  onMouseEnter,
  onFocus,
  onBlur,
  ...rest
}: AudButtonProps) {
  const [hover, setHover] = useState(false)
  const [press, setPress] = useState(false)
  const [focus, setFocus] = useState(false)
  const isDisabled = !!disabled || loading

  const pad = size === 'sm' ? '6px 14px' : '10px 20px'
  const fontSize = size === 'sm' ? '0.8125rem' : '0.875rem'

  const base: React.CSSProperties = {
    display: block ? 'flex' : 'inline-flex',
    width: block ? '100%' : undefined,
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
    padding: pad,
    fontFamily: BODY_FONT,
    fontWeight: 600,
    fontSize,
    lineHeight: 1.2,
    borderRadius: 'var(--aud-radius, 4px)',
    cursor: isDisabled ? 'default' : 'pointer',
    opacity: isDisabled ? 'var(--aud-disabled-opacity, 0.45)' : 1,
    transition: 'background 120ms ease, color 120ms ease, border-color 120ms ease, filter 120ms ease, box-shadow 120ms ease',
    boxShadow: focus && !isDisabled ? 'var(--aud-ring, 0 0 0 3px rgba(94,124,147,0.35))' : 'none',
    userSelect: 'none',
    ...style,
  }

  const live = !isDisabled
  let skin: React.CSSProperties

  switch (variant) {
    case 'primary':
      skin = {
        background: accent,
        color: ON_ACCENT,
        border: '1px solid transparent',
        filter: live && press ? 'brightness(0.9)' : live && hover ? 'brightness(1.06)' : 'none',
      }
      break
    case 'danger':
      skin = {
        background: 'var(--aud-danger, #B14C3A)',
        color: ON_DANGER,
        border: '1px solid transparent',
        filter: live && press ? 'brightness(0.9)' : live && hover ? 'brightness(1.06)' : 'none',
      }
      break
    case 'secondary':
      skin = {
        background: press
          ? 'var(--aud-overlay-press, rgba(20,19,15,0.12))'
          : hover
            ? 'var(--aud-overlay-hover, rgba(20,19,15,0.06))'
            : 'var(--aud-surface, #FAFAF8)',
        color: 'var(--aud-ink, #14130F)',
        border: '1px solid var(--aud-rule, #D8D4CC)',
      }
      break
    case 'ghost':
    default:
      skin = {
        background: live && press
          ? 'var(--aud-overlay-press, rgba(20,19,15,0.12))'
          : live && hover
            ? 'var(--aud-overlay-hover, rgba(20,19,15,0.06))'
            : 'transparent',
        color: 'var(--aud-ink, #14130F)',
        border: '1px solid transparent',
      }
      break
  }

  return (
    <button
      type="button"
      disabled={isDisabled}
      aria-busy={loading || undefined}
      onMouseEnter={(e) => { setHover(true); onMouseEnter?.(e) }}
      onMouseLeave={(e) => { setHover(false); setPress(false); onMouseLeave?.(e) }}
      onMouseDown={(e) => { setPress(true); onMouseDown?.(e) }}
      onMouseUp={(e) => { setPress(false); onMouseUp?.(e) }}
      onFocus={(e) => { setFocus(true); onFocus?.(e) }}
      onBlur={(e) => { setFocus(false); onBlur?.(e) }}
      style={{ ...base, ...skin }}
      {...rest}
    >
      <style>{'@keyframes aud-btn-spin{to{transform:rotate(360deg)}}'}</style>
      {loading ? <Spinner /> : icon}
      <span>{loading && loadingLabel != null ? loadingLabel : children}</span>
      {!loading && iconRight}
    </button>
  )
}

function Spinner() {
  return (
    <svg width="15" height="15" viewBox="0 0 16 16" aria-hidden="true" style={{ animation: 'aud-btn-spin 0.8s linear infinite' }}>
      <circle cx="8" cy="8" r="6.5" fill="none" stroke="currentColor" strokeOpacity="0.3" strokeWidth="2" />
      <path d="M8 1.5a6.5 6.5 0 0 1 6.5 6.5" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
    </svg>
  )
}

export default AudButton
