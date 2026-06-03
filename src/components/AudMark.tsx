import React from 'react'

/**
 * The mark's font stack. Asks for the scoped `AuD-Bebas` family first (so an
 * app's global font rules can never repoint the mark), then degrades through
 * Bebas Neue and a condensed-sans fallback. If even those fail, the mark still
 * reads "AuD" with the `u` in accent — degraded but legible (the brief's rule).
 */
const MARK_FONT =
  "'AuD-Bebas', 'Bebas Neue', 'Oswald', 'Arial Narrow', sans-serif"

/** Default accent: the app's moving accent, falling back to brass (flagship). */
const DEFAULT_ACCENT = 'var(--aud-accent, #C8A84B)'

export interface AudMarkProps
  extends Omit<React.HTMLAttributes<HTMLSpanElement>, 'color'> {
  /**
   * Accent colour for the `u` — the one accentuated letter. Defaults to the
   * app's `--aud-accent` (brass when unset). Accepts any CSS colour or an
   * accent token, e.g. `accent={accents.steel}`.
   */
  accent?: string
  /** Accessible label, announced as a unit. Defaults to "AuD". */
  label?: string
}

/**
 * The AuD lettermark — the everyday maker's mark.
 *
 * The one colour rule (the whole trick): `A` and `D` inherit `currentColor`
 * (ink on light, near-white on dark), and `u` carries the accent. One
 * component works on any background, light or dark, with zero branching.
 *
 * Size is driven by the parent's `font-size` (via `className` or `style`).
 *
 * ```tsx
 * <AudMark className="text-2xl" />              // brass u, inherits text colour
 * <AudMark accent={accents.steel} />            // steel u
 * ```
 */
export function AudMark({
  accent = DEFAULT_ACCENT,
  label = 'AuD',
  style,
  ...rest
}: AudMarkProps) {
  return (
    <span
      role="img"
      aria-label={label}
      style={{
        fontFamily: MARK_FONT,
        letterSpacing: '-0.02em',
        lineHeight: 1,
        display: 'inline-block',
        whiteSpace: 'nowrap',
        fontWeight: 400,
        ...style,
      }}
      {...rest}
    >
      {/* A and D set no colour → inherit currentColor. Only u is accented. */}
      <span aria-hidden="true">A</span>
      <span aria-hidden="true" style={{ color: accent }}>
        u
      </span>
      <span aria-hidden="true">D</span>
    </span>
  )
}

export default AudMark
