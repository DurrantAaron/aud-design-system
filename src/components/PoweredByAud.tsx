import React from 'react'
import { AudMark } from './AudMark'

const MONO_FONT =
  "var(--aud-font-mono, 'Share Tech Mono', 'DM Mono', ui-monospace, monospace)"

export interface PoweredByAudProps
  extends Omit<React.HTMLAttributes<HTMLSpanElement>, 'color'> {
  /** Accent colour for the mark's `u`. Defaults to the app's `--aud-accent`. */
  accent?: string
  /** The lead text. Defaults to "Powered by". */
  lead?: string
}

/**
 * The "Powered by AuD" footer badge.
 *
 * A muted, uppercase, letter-spaced lead — an instrument-panel field marking —
 * followed by the {@link AudMark} inline, baseline-aligned. One line, no wrap.
 * Drop it in a footer; it inherits the surrounding text colour, so it works on
 * light and dark with no branching.
 *
 * ```tsx
 * <footer><PoweredByAud /></footer>
 * ```
 */
export function PoweredByAud({
  accent,
  lead = 'Powered by',
  style,
  ...rest
}: PoweredByAudProps) {
  return (
    <span
      style={{
        display: 'inline-flex',
        alignItems: 'baseline',
        gap: '0.5em',
        whiteSpace: 'nowrap',
        ...style,
      }}
      {...rest}
    >
      <span
        style={{
          fontFamily: MONO_FONT,
          textTransform: 'uppercase',
          letterSpacing: '0.2em',
          fontSize: '0.6875rem',
          color: 'var(--aud-mid, #6B6960)',
        }}
      >
        {lead}
      </span>
      <AudMark accent={accent} style={{ fontSize: '1.15rem' }} label="AuD" />
    </span>
  )
}

export default PoweredByAud
