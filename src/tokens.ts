/**
 * Programmatic access to the AuD token values.
 *
 * These mirror tokens/tokens.json and tokens/tokens.css. Prefer the CSS
 * variables (--aud-*) in styling; use these constants when you need the raw
 * value in JS/TS (charts, canvas, inline styles, tests).
 */

/** The five fixed accents. Exactly one becomes an app's --aud-accent. */
export const accents = {
  brass: '#C8A84B', // flagship / signature
  clay: '#C26B52', // warm "care" red
  steel: '#5E7C93', // muted night-blue
  sage: '#7C8A5C', // desaturated olive
  eucalypt: '#4F8A80', // muted teal
} as const

export type AccentName = keyof typeof accents

/** Constant neutrals. Light is canonical; dark surface/mid/rule are derived. */
export const neutrals = {
  light: {
    ground: '#F2F0EB',
    surface: '#FAFAF8',
    ink: '#14130F',
    mid: '#6B6960',
    rule: '#D8D4CC',
  },
  dark: {
    ground: '#17160F',
    surface: '#211F17',
    ink: '#F2F0EB',
    mid: '#8E8B7F',
    rule: '#2E2C22',
  },
} as const

/** The brand type stack. */
export const fonts = {
  display: "'Bebas Neue', 'Oswald', 'Anton', 'Arial Narrow', sans-serif",
  heading: "'Barlow Condensed', 'Oswald', 'Arial Narrow', sans-serif",
  body: "'Barlow', 'Inter', system-ui, sans-serif",
  mono: "'Share Tech Mono', 'DM Mono', ui-monospace, monospace",
  /** The mark's own scoped family — never repointed by app globals. */
  mark: "'AuD-Bebas', 'Bebas Neue', 'Oswald', 'Arial Narrow', sans-serif",
} as const
