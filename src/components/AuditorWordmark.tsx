import React from 'react'

const MARK_FONT =
  "'AuD-Bebas', 'Bebas Neue', 'Oswald', 'Arial Narrow', sans-serif"

const DEFAULT_ACCENT = 'var(--aud-accent, #C8A84B)'

/** AUDITOR, with the U (index 1) and I (index 3) carrying the accent. */
const LETTERS = 'AUDITOR'.split('')
const ACCENTED = new Set([1, 3]) // U and I — "you & i" / UI

export interface AuditorWordmarkProps
  extends Omit<React.HTMLAttributes<HTMLSpanElement>, 'color'> {
  /** Accent colour for the U and I. Defaults to the app's `--aud-accent`. */
  accent?: string
  /** Accessible label. Defaults to "AUDITOR". */
  label?: string
}

/**
 * The AUDITOR wordmark — the one deliberate easter egg.
 *
 * The full word AUDITOR with the **U** and **I** accented: "you & i" (the
 * auditor and the venue) and "UI" (the craft layer). The AuD lettermark still
 * sits at the front of the word.
 *
 * Conceptual, not a branding rule. Lives in **exactly one place per app**
 * (login / splash / an "about" line) — never in running UI, never a recurring
 * highlight. The meaning is a told story; it does no communicating on its own.
 *
 * ```tsx
 * <AuditorWordmark className="text-7xl" />   // on a splash, once per app
 * ```
 */
export function AuditorWordmark({
  accent = DEFAULT_ACCENT,
  label = 'AUDITOR',
  style,
  ...rest
}: AuditorWordmarkProps) {
  return (
    <span
      role="img"
      aria-label={label}
      style={{
        fontFamily: MARK_FONT,
        letterSpacing: '-0.01em',
        lineHeight: 1,
        display: 'inline-block',
        whiteSpace: 'nowrap',
        fontWeight: 400,
        ...style,
      }}
      {...rest}
    >
      {LETTERS.map((ch, i) => (
        <span
          key={i}
          aria-hidden="true"
          style={ACCENTED.has(i) ? { color: accent } : undefined}
        >
          {ch}
        </span>
      ))}
    </span>
  )
}

export default AuditorWordmark
