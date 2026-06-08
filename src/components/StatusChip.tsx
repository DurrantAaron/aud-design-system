import React from 'react'

const BODY_FONT = "var(--aud-font-body, 'Barlow', 'Inter', system-ui, sans-serif)"
const ON_SOLID = '#FAFAF8'

export type StatusName = 'success' | 'warning' | 'danger' | 'info' | 'neutral'
export type StatusChipVariant = 'tint' | 'solid' | 'outline'

export interface StatusChipProps extends React.HTMLAttributes<HTMLSpanElement> {
  /** success / warning / danger / info map to the semantic tokens; `neutral` is a quiet grey (pending / syncing / draft). */
  status: StatusName
  /** `tint` (default) soft fill + coloured text · `solid` filled · `outline` bordered. */
  variant?: StatusChipVariant
  /** Show the leading status dot. Defaults to true. */
  dot?: boolean
  /** Pulse the dot — for in-progress states like "Syncing…". Implies `dot`. */
  pulse?: boolean
  /** Replace the dot with a custom leading icon (sized to the text). */
  icon?: React.ReactNode
  /** Compact padding + smaller text. */
  size?: 'sm' | 'md'
  /** Render with a dashed edge — signals a tentative / guessed / unverified value
   *  (e.g. an AI-suggested name awaiting confirmation). Forces the `outline` look. */
  tentative?: boolean
  children: React.ReactNode
}

// neutral has no --aud-neutral-* tokens; resolve it off the shared neutrals.
function palette(status: StatusName) {
  if (status === 'neutral') {
    return {
      base: 'var(--aud-mid, #6B6960)',
      fg: 'var(--aud-mid, #6B6960)',
      tintBg: 'var(--aud-surface, #FAFAF8)',
      tintBorder: 'var(--aud-rule, #D8D4CC)',
    }
  }
  return {
    base: `var(--aud-${status})`,
    fg: `var(--aud-${status}-fg)`,
    tintBg: `var(--aud-${status}-tint)`,
    tintBorder: 'transparent',
  }
}

/**
 * A status pill backed by the semantic colour tokens — one component instead of
 * re-rolling "Pass / Fail / Needs attention / Draft" per app. Flips with the
 * theme automatically (the tokens do the work). Use `status="neutral" pulse`
 * for the offline-outbox "Syncing…" state.
 *
 * ```tsx
 * <StatusChip status="success">Pass</StatusChip>
 * <StatusChip status="danger" variant="solid">Fail</StatusChip>
 * <StatusChip status="neutral" pulse>Syncing…</StatusChip>
 * ```
 */
export function StatusChip({
  status,
  variant = 'tint',
  dot = true,
  pulse = false,
  icon,
  size = 'md',
  tentative = false,
  children,
  style,
  ...rest
}: StatusChipProps) {
  const p = palette(status)
  const v = tentative ? 'outline' : variant

  const skin: React.CSSProperties =
    v === 'solid'
      ? { background: p.base, color: ON_SOLID, border: '1px solid transparent' }
      : v === 'outline'
        ? { background: 'transparent', color: p.fg, border: `1px ${tentative ? 'dashed' : 'solid'} ${p.base}` }
        : { background: p.tintBg, color: p.fg, border: `1px solid ${p.tintBorder}` }

  // On a solid fill the dot needs contrast; elsewhere it's the base hue.
  const dotColor = v === 'solid' ? ON_SOLID : p.base

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
      {pulse && <style>{'@keyframes aud-chip-pulse{0%,100%{opacity:1}50%{opacity:0.3}}'}</style>}
      {icon ?? ((dot || pulse) && (
        <span
          aria-hidden="true"
          style={{
            width: 7,
            height: 7,
            borderRadius: '50%',
            background: dotColor,
            flex: 'none',
            animation: pulse ? 'aud-chip-pulse 1.2s ease-in-out infinite' : undefined,
          }}
        />
      ))}
      {children}
    </span>
  )
}

export default StatusChip
