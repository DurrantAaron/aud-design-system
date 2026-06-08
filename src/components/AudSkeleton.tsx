import React from 'react'

export interface AudSkeletonProps extends React.HTMLAttributes<HTMLDivElement> {
  /** `text` = a text-line bar · `block` = a rectangle · `circle` = avatar/icon. */
  variant?: 'text' | 'block' | 'circle'
  width?: number | string
  height?: number | string
  /** Render N stacked text lines (the last is shortened). `text` variant only. */
  lines?: number
  /** Corner radius. Defaults to the sharp brand radius (or a circle for `circle`). */
  radius?: number | string
}

// Keyframes + a reduced-motion opt-out (inline styles can't express @media,
// so the sweep is class-targeted and stilled when the user prefers no motion).
const SHIMMER_CSS =
  '@keyframes aud-skeleton-shimmer{0%{background-position:200% 0}100%{background-position:-200% 0}}' +
  '@media (prefers-reduced-motion: reduce){.aud-skel{animation:none!important}}'

// Warm-neutral sweep: rule → a touch lighter → rule.
function barStyle(radius: React.CSSProperties['borderRadius']): React.CSSProperties {
  return {
    borderRadius: radius,
    background:
      'linear-gradient(90deg, var(--aud-rule, #D8D4CC) 25%, color-mix(in srgb, var(--aud-rule, #D8D4CC) 55%, var(--aud-surface, #FAFAF8)) 50%, var(--aud-rule, #D8D4CC) 75%)',
    backgroundSize: '200% 100%',
    animation: 'aud-skeleton-shimmer 1.4s linear infinite',
  }
}

/**
 * A shimmer placeholder for content that's loading — the missing half of
 * "design every state". Warm-neutral sweep, sharp brand corners. Pair it with
 * the real layout so content slots in without a jump.
 *
 * ```tsx
 * <AudSkeleton variant="text" lines={3} />
 * <AudSkeleton variant="circle" width={40} />
 * <AudSkeleton variant="block" height={120} />
 * ```
 */
export function AudSkeleton({
  variant = 'text',
  width,
  height,
  lines = 1,
  radius,
  className,
  style,
  ...rest
}: AudSkeletonProps) {
  const r =
    radius ?? (variant === 'circle' ? '50%' : 'var(--aud-radius, 4px)')

  if (variant === 'text' && lines > 1) {
    return (
      <div
        role="status"
        aria-busy="true"
        aria-live="polite"
        className={className}
        style={{ display: 'flex', flexDirection: 'column', gap: 8, width: width ?? '100%', ...style }}
        {...rest}
      >
        <style>{SHIMMER_CSS}</style>
        {Array.from({ length: lines }).map((_, i) => (
          <div
            key={i}
            className="aud-skel"
            style={{
              ...barStyle(r),
              height: height ?? '0.7em',
              // Last line is shorter, like real ragged text.
              width: i === lines - 1 ? '60%' : '100%',
            }}
          />
        ))}
      </div>
    )
  }

  const dims: React.CSSProperties =
    variant === 'circle'
      ? { width: width ?? 40, height: height ?? width ?? 40 }
      : variant === 'block'
        ? { width: width ?? '100%', height: height ?? 80 }
        : { width: width ?? '100%', height: height ?? '0.7em' }

  return (
    <div
      role="status"
      aria-busy="true"
      aria-live="polite"
      className={['aud-skel', className].filter(Boolean).join(' ')}
      style={{ ...barStyle(r), ...dims, ...style }}
      {...rest}
    >
      <style>{SHIMMER_CSS}</style>
    </div>
  )
}

export default AudSkeleton
