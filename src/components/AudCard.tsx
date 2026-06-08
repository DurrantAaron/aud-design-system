import React, { useState } from 'react'

export type AudCardVariant = 'outline' | 'fill' | 'tint'
export type AudCardElevation = 'none' | 'sm' | 'base' | 'lg'

export interface AudCardProps extends React.HTMLAttributes<HTMLDivElement> {
  /** `outline` = surface + 1px rule · `fill` = surface, no border · `tint` = accent-tinted surface, no border. */
  variant?: AudCardVariant
  /** Drop shadow. `none` (default) · `sm` barely-raised · `base` raised · `lg` menus/popovers. */
  elevation?: AudCardElevation
  /** Inner padding. Number → px. Defaults to 16. */
  padding?: number | string
  /** Adds hover/press affordance (token overlays) for clickable cards. Pair with `onClick`/`role`. */
  interactive?: boolean
}

// elevation → shadow token
function shadowFor(elevation: AudCardElevation): string | undefined {
  switch (elevation) {
    case 'sm':
      return 'var(--aud-shadow-sm, 0 1px 2px rgba(20,19,15,0.06))'
    case 'base':
      return 'var(--aud-shadow, 0 2px 8px rgba(20,19,15,0.08))'
    case 'lg':
      return 'var(--aud-shadow-lg, 0 8px 24px rgba(20,19,15,0.12))'
    case 'none':
    default:
      return undefined
  }
}

/**
 * The suite surface primitive — a sharp-cornered card backed by the
 * surface / rule / shadow tokens, so it flips with the theme automatically.
 * `outline` is the default (a defined edge instead of a shadow). Set
 * `interactive` for clickable cards to get the token hover/press overlay.
 *
 * Interaction is driven by component state (hover / press), so it is SSR-safe
 * and injects no global CSS.
 *
 * ```tsx
 * <AudCard>Plain card</AudCard>
 * <AudCard variant="tint" elevation="sm">Tinted, raised</AudCard>
 * <AudCard interactive onClick={open}>Tap me</AudCard>
 * ```
 */
export function AudCard({
  variant = 'outline',
  elevation = 'none',
  padding = 16,
  interactive = false,
  children,
  style,
  onMouseEnter,
  onMouseLeave,
  onMouseDown,
  onMouseUp,
  ...rest
}: AudCardProps) {
  const [hover, setHover] = useState(false)
  const [press, setPress] = useState(false)

  let skin: React.CSSProperties
  switch (variant) {
    case 'fill':
      skin = { background: 'var(--aud-surface, #FAFAF8)', border: '1px solid transparent' }
      break
    case 'tint':
      skin = {
        background: 'var(--aud-surface-tint, #F4F1E9)',
        border: '1px solid transparent',
      }
      break
    case 'outline':
    default:
      skin = {
        background: 'var(--aud-surface, #FAFAF8)',
        border: '1px solid var(--aud-rule, #D8D4CC)',
      }
      break
  }

  // Overlay the token hover/press tint over the base background for interactive cards.
  const overlay = interactive
    ? press
      ? 'var(--aud-overlay-press, rgba(20,19,15,0.12))'
      : hover
        ? 'var(--aud-overlay-hover, rgba(20,19,15,0.06))'
        : undefined
    : undefined

  const background = overlay
    ? `linear-gradient(${overlay}, ${overlay}), ${skin.background as string}`
    : skin.background

  return (
    <div
      onMouseEnter={(e) => { if (interactive) setHover(true); onMouseEnter?.(e) }}
      onMouseLeave={(e) => { if (interactive) { setHover(false); setPress(false) } onMouseLeave?.(e) }}
      onMouseDown={(e) => { if (interactive) setPress(true); onMouseDown?.(e) }}
      onMouseUp={(e) => { if (interactive) setPress(false); onMouseUp?.(e) }}
      style={{
        ...skin,
        background,
        padding,
        borderRadius: 'var(--aud-radius, 4px)',
        boxShadow: shadowFor(elevation),
        color: 'var(--aud-ink, #14130F)',
        cursor: interactive ? 'pointer' : undefined,
        transition: 'background 120ms ease, box-shadow 120ms ease, border-color 120ms ease',
        ...style,
      }}
      {...rest}
    >
      {children}
    </div>
  )
}

export default AudCard
