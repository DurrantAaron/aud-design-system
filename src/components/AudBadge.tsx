import React from 'react'

const BODY_FONT = "var(--aud-font-body, 'Barlow', 'Inter', system-ui, sans-serif)"
const ON_SOLID = '#FAFAF8'

export type AudBadgeStatus = 'danger' | 'success' | 'warning' | 'info' | 'neutral' | 'accent'
export type AudBadgeSize = 'sm' | 'md'

export interface AudBadgeProps extends React.HTMLAttributes<HTMLSpanElement> {
  /** The number shown in the pill. Clamped to `max`. Ignored when `dot` is set. */
  count?: number
  /** Cap before showing "N+". Defaults to 99 → "99+". */
  max?: number
  /** Render just a dot (no count) — for "has unread" without a number. */
  dot?: boolean
  /** Colour. `danger` (default) · `success` · `warning` · `info` · `neutral` (grey) · `accent`. */
  status?: AudBadgeStatus
  /** `sm` compact · `md` (default). */
  size?: AudBadgeSize
}

// Resolve the badge fill colour off the semantic / brand tokens.
function fillFor(status: AudBadgeStatus): string {
  if (status === 'accent') return 'var(--aud-accent, #C8A84B)'
  if (status === 'neutral') return 'var(--aud-mid, #6B6960)'
  return `var(--aud-${status})`
}

/**
 * A notification badge — a small count pill or bare dot backed by the semantic
 * colour tokens. Presentational only: the consumer positions it (typically
 * `position: absolute` over a tab icon or avatar, in a `position: relative`
 * wrapper). Flips with the theme automatically.
 *
 * ```tsx
 * <span style={{ position: 'relative' }}>
 *   <BellIcon />
 *   <AudBadge count={5} style={{ position: 'absolute', top: -4, right: -4 }} />
 * </span>
 * <AudBadge dot status="accent" />
 * <AudBadge count={250} max={99} status="info" />
 * ```
 */
export function AudBadge({
  count,
  max = 99,
  dot = false,
  status = 'danger',
  size = 'md',
  style,
  ...rest
}: AudBadgeProps) {
  const fill = fillFor(status)

  if (dot) {
    const d = size === 'sm' ? 7 : 9
    return (
      <span
        aria-hidden="true"
        style={{
          display: 'inline-block',
          width: d,
          height: d,
          borderRadius: '50%',
          background: fill,
          flex: 'none',
          ...style,
        }}
        {...rest}
      />
    )
  }

  const n = count ?? 0
  const label = n > max ? `${max}+` : `${n}`
  const dim = size === 'sm' ? 16 : 18
  const fontSize = size === 'sm' ? '0.625rem' : '0.6875rem'

  return (
    <span
      style={{
        display: 'inline-flex',
        alignItems: 'center',
        justifyContent: 'center',
        minWidth: dim,
        height: dim,
        padding: '0 5px',
        boxSizing: 'border-box',
        background: fill,
        color: ON_SOLID,
        fontFamily: BODY_FONT,
        fontWeight: 700,
        fontSize,
        lineHeight: 1,
        borderRadius: 999,
        whiteSpace: 'nowrap',
        flex: 'none',
        ...style,
      }}
      {...rest}
    >
      {label}
    </span>
  )
}

export default AudBadge
