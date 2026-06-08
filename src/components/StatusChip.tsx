import React from 'react'

const BODY_FONT = "var(--aud-font-body, 'Barlow', 'Inter', system-ui, sans-serif)"
const ON_SOLID = '#FAFAF8'

export type StatusName = 'success' | 'warning' | 'danger' | 'info'
export type StatusChipVariant = 'tint' | 'solid' | 'outline'

export interface StatusChipProps extends React.HTMLAttributes<HTMLSpanElement> {
  /** Maps to the semantic tokens: success / warning / danger / info. */
  status: StatusName
  /** `tint` (default) soft fill + coloured text · `solid` filled · `outline` bordered. */
  variant?: StatusChipVariant
  /** Show the leading status dot. Defaults to true. */
  dot?: boolean
  /** Replace the dot with a custom leading icon (sized to the text). */
  icon?: React.ReactNode
  /** Compact padding + smaller text. */
  size?: 'sm' | 'md'
  children: React.ReactNode
}

/**
 * A status pill backed by the semantic colour tokens — one component instead of
 * re-rolling "Pass / Fail / Needs attention / Draft" per app. Flips with the
 * theme automatically (the tokens do the work).
 *
 * ```tsx
 * <StatusChip status="success">Pass</StatusChip>
 * <StatusChip status="danger" variant="solid">Fail</StatusChip>
 * <StatusChip status="warning" dot={false} icon={<Alert/>}>Needs attention</StatusChip>
 * ```
 */
export function StatusChip({
  status,
  variant = 'tint',
  dot = true,
  icon,
  size = 'md',
  children,
  style,
  ...rest
}: StatusChipProps) {
  const base = `var(--aud-${status})`
  const fg = `var(--aud-${status}-fg)`
  const tint = `var(--aud-${status}-tint)`

  const skin: React.CSSProperties =
    variant === 'solid'
      ? { background: base, color: ON_SOLID, border: '1px solid transparent' }
      : variant === 'outline'
        ? { background: 'transparent', color: fg, border: `1px solid ${base}` }
        : { background: tint, color: fg, border: '1px solid transparent' }

  // On a solid fill the dot needs contrast; elsewhere it's the base hue.
  const dotColor = variant === 'solid' ? ON_SOLID : base

  return (
    <span
      style={{
        display: 'inline-flex',
        alignItems: 'center',
        gap: size === 'sm' ? 5 : 6,
        padding: size === 'sm' ? '2px 8px' : '3px 10px',
        borderRadius: 999,
        fontFamily: BODY_FONT,
        fontWeight: 600,
        fontSize: size === 'sm' ? '0.6875rem' : '0.8125rem',
        lineHeight: 1.4,
        whiteSpace: 'nowrap',
        ...skin,
        ...style,
      }}
      {...rest}
    >
      {icon ?? (dot && (
        <span
          aria-hidden="true"
          style={{ width: 7, height: 7, borderRadius: '50%', background: dotColor, flex: 'none' }}
        />
      ))}
      {children}
    </span>
  )
}

export default StatusChip
