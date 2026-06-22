import React from 'react'
import { neutrals } from '../tokens'

/** Default accent: the app's moving accent, falling back to brass (flagship). */
const DEFAULT_ACCENT = 'var(--aud-accent, #C8A84B)'

export interface AppMarkProps extends React.HTMLAttributes<HTMLDivElement> {
  /**
   * The glyph inside the tile — the app's OWN icon node (e.g. a Lucide icon),
   * or a 2–3 character short code. AppMark ships no icon set: each app passes
   * its own glyph as a child, so the tile stays dependency-free and every app
   * keeps a recognisable symbol. Icons should draw with `currentColor` (Lucide
   * does) — the tile sets the colour and sizes any nested `<svg>` to ~52% of the
   * tile, so the family reads identically while the glyph stays unique.
   */
  children: React.ReactNode
  /** Tile colour. Defaults to the app's `--aud-accent` (brass when unset). */
  accent?: string
  /** Tile edge length in px. Default 56. */
  size?: number
  /**
   * `solid` (default): an accent-filled tile with a dark-ground glyph — the
   * recognisable "app launcher" icon for the splash / login. `tint`: a
   * transparent tile with a hairline rule and an accent glyph — quieter, for
   * in-app placements (a header corner) where a solid fill would shout. The
   * accent is never a large fill, so reach for `tint` once the tile grows past
   * icon scale.
   */
  variant?: 'solid' | 'tint'
  /** Neutral palette for the `tint` variant's rule. Default `dark`. */
  theme?: 'light' | 'dark'
  /** Accessible label for the tile. Defaults to "App". */
  label?: string
}

/**
 * The per-app tile — the one thing that makes each app's splash unique while the
 * suite still reads as one family.
 *
 * Every app renders an identically-constructed tile (same size, radius, glyph
 * scale and accent-fill rule) and changes only two things: the {@link accent}
 * and the glyph child. Think NATO equipment markings — identical language,
 * different unit colour. Construction is system-owned here so apps consume it
 * rather than hand-rolling a coloured square each time (which is how they drift).
 *
 * It ships no icon library: the app passes its own icon (or a short code) as the
 * child, and AppMark sizes/colours it. So `@aud/brand` never forces an icon
 * dependency on its consumers.
 *
 * ```tsx
 * import { AppMark, accents } from '@aud/brand'
 * import { ClipboardCheck } from 'lucide-react'
 *
 * // On a splash, as the SplashScreen `mark`:
 * <AppMark accent={accents.brass}><ClipboardCheck /></AppMark>
 *
 * // Short-code fallback when an app has no glyph yet:
 * <AppMark accent={accents.steel}>DEMO</AppMark>
 *
 * // Quieter, for a header corner:
 * <AppMark variant="tint" size={32} accent={accents.sage}><Gauge /></AppMark>
 * ```
 */
export function AppMark({
  children,
  accent = DEFAULT_ACCENT,
  size = 56,
  variant = 'solid',
  theme = 'dark',
  label = 'App',
  style,
  className,
  ...rest
}: AppMarkProps) {
  const n = neutrals[theme]
  const iconSize = Math.round(size * 0.52)

  // Per-instance glyph size, exposed as a CSS var the nested <svg> inherits.
  const glyphVar = { '--aud-app-mark-glyph': `${iconSize}px` } as React.CSSProperties

  const variantStyle: React.CSSProperties =
    variant === 'solid'
      ? {
          background: accent,
          // Dark glyph reads on all five (mid-luminance) accents — no branching.
          color: neutrals.dark.ground,
          border: 'none',
        }
      : {
          background: 'transparent',
          color: accent,
          border: `1px solid ${n.rule}`,
        }

  return (
    <div
      role="img"
      aria-label={label}
      className={['aud-app-mark', className].filter(Boolean).join(' ')}
      style={{
        ...glyphVar,
        width: size,
        height: size,
        flex: `0 0 ${size}px`,
        borderRadius: Math.round(size * 0.25),
        display: 'inline-flex',
        alignItems: 'center',
        justifyContent: 'center',
        fontFamily: "var(--aud-font-heading, 'Barlow Condensed', 'Oswald', sans-serif)",
        fontWeight: 600,
        fontSize: Math.round(size * 0.34),
        letterSpacing: '0.02em',
        lineHeight: 1,
        userSelect: 'none',
        ...variantStyle,
        ...style,
      }}
      {...rest}
    >
      {/* Sizes whatever <svg> the app hands in, at any tile size, with no per-app CSS. */}
      <style>{'.aud-app-mark svg{width:var(--aud-app-mark-glyph);height:var(--aud-app-mark-glyph)}'}</style>
      {children}
    </div>
  )
}

export default AppMark
