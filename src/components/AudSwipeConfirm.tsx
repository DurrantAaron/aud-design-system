import React, { useCallback, useEffect, useRef, useState } from 'react'

const BODY_FONT = "var(--aud-font-body, 'Barlow', 'Inter', system-ui, sans-serif)"
const ACCENT = 'var(--aud-accent, #C8A84B)'
// Dark ink reads on all five mid-luminance accents (same call as AudButton).
const ON_ACCENT = 'var(--aud-ground, #17160F)'

// Thumb is square-ish; the track is taller than the 44px tap minimum.
const TRACK_H = 48
const THUMB = TRACK_H - 8
const PAD = 4
// Release past this fraction of the travel commits the action.
const CONFIRM_AT = 0.9

export interface AudSwipeConfirmProps extends React.HTMLAttributes<HTMLDivElement> {
  /** Resting prompt. Default "Slide to confirm". */
  label?: React.ReactNode
  /** Shown once the gesture commits. Default "Confirmed". */
  confirmedLabel?: React.ReactNode
  /** Fired once when the thumb is released past ~90% of the track. */
  onConfirm: () => void
  /** Greys the control out and ignores pointer input. */
  disabled?: boolean
  /** Override the thumb / fill / ring colour. Defaults to `--aud-accent`. */
  accent?: string
}

/**
 * Slide-to-confirm for irreversible actions — the deliberate, hard-to-fat-finger
 * alternative to a destructive button. A pill track with a draggable thumb
 * (chevron ››); dragging right reveals an accent fill behind it, and releasing
 * past ~90% commits and snaps to the end (showing `confirmedLabel`). Anything
 * short of that springs back to the start.
 *
 * Pointer Events with pointer capture, so it works for touch and mouse alike.
 * SSR-safe (geometry is measured in effects/handlers) and honours
 * `prefers-reduced-motion` by dropping the snap/spring transition.
 *
 * ```tsx
 * <AudSwipeConfirm label="Slide to delete" onConfirm={destroy} />
 * <AudSwipeConfirm confirmedLabel="Sent" onConfirm={send} disabled={busy} />
 * ```
 */
export function AudSwipeConfirm({
  label = 'Slide to confirm',
  confirmedLabel = 'Confirmed',
  onConfirm,
  disabled = false,
  accent = ACCENT,
  style,
  onPointerDown,
  onPointerMove,
  onPointerUp,
  ...rest
}: AudSwipeConfirmProps) {
  const trackRef = useRef<HTMLDivElement | null>(null)
  // Current thumb offset in px (0 .. max), and whether a drag is in flight.
  const [x, setX] = useState(0)
  const [dragging, setDragging] = useState(false)
  const [confirmed, setConfirmed] = useState(false)
  const [reduced, setReduced] = useState(false)
  // Pointer-down origin: the gesture's start clientX and the thumb's start x.
  const start = useRef<{ pointer: number; offset: number } | null>(null)

  useEffect(() => {
    if (typeof window === 'undefined') return
    const mq = window.matchMedia('(prefers-reduced-motion: reduce)')
    const apply = () => setReduced(mq.matches)
    apply()
    mq.addEventListener('change', apply)
    return () => mq.removeEventListener('change', apply)
  }, [])

  const maxTravel = useCallback(() => {
    const el = trackRef.current
    if (!el) return 0
    return Math.max(0, el.clientWidth - THUMB - PAD * 2)
  }, [])

  const handleDown = useCallback(
    (e: React.PointerEvent<HTMLDivElement>) => {
      onPointerDown?.(e)
      if (disabled || confirmed) return
      e.currentTarget.setPointerCapture?.(e.pointerId)
      start.current = { pointer: e.clientX, offset: x }
      setDragging(true)
    },
    [disabled, confirmed, x, onPointerDown],
  )

  const handleMove = useCallback(
    (e: React.PointerEvent<HTMLDivElement>) => {
      onPointerMove?.(e)
      if (!start.current) return
      const max = maxTravel()
      const next = Math.min(max, Math.max(0, start.current.offset + (e.clientX - start.current.pointer)))
      setX(next)
    },
    [maxTravel, onPointerMove],
  )

  const handleUp = useCallback(
    (e: React.PointerEvent<HTMLDivElement>) => {
      onPointerUp?.(e)
      if (!start.current) return
      e.currentTarget.releasePointerCapture?.(e.pointerId)
      start.current = null
      setDragging(false)
      const max = maxTravel()
      if (max > 0 && x >= max * CONFIRM_AT) {
        setX(max)
        setConfirmed(true)
        onConfirm()
      } else {
        setX(0)
      }
    },
    [maxTravel, x, onConfirm, onPointerUp],
  )

  const pct = (() => {
    const max = maxTravel()
    return max > 0 ? x / max : 0
  })()

  // While dragging, follow the finger instantly; on release, snap/spring —
  // unless the user has asked for reduced motion.
  const motion = dragging || reduced
    ? 'none'
    : `left var(--aud-duration, 200ms) var(--aud-ease-spring, cubic-bezier(0.34,1.56,0.64,1)), width var(--aud-duration, 200ms) var(--aud-ease-spring, cubic-bezier(0.34,1.56,0.64,1))`

  return (
    <div
      ref={trackRef}
      role="button"
      aria-label={typeof label === 'string' ? label : undefined}
      aria-disabled={disabled || undefined}
      onPointerDown={handleDown}
      onPointerMove={handleMove}
      onPointerUp={handleUp}
      onPointerCancel={handleUp}
      style={{
        position: 'relative',
        display: 'flex',
        alignItems: 'center',
        width: '100%',
        height: TRACK_H,
        minHeight: 44,
        padding: PAD,
        boxSizing: 'border-box',
        background: 'var(--aud-surface, #FAFAF8)',
        border: '1px solid var(--aud-rule, #D8D4CC)',
        borderRadius: TRACK_H / 2,
        opacity: disabled ? 'var(--aud-disabled-opacity, 0.45)' : 1,
        cursor: disabled || confirmed ? 'default' : 'grab',
        touchAction: 'none',
        userSelect: 'none',
        overflow: 'hidden',
        fontFamily: BODY_FONT,
        ...style,
      }}
      {...rest}
    >
      {/* Accent fill that grows behind the thumb as it travels. */}
      <div
        aria-hidden="true"
        style={{
          position: 'absolute',
          top: PAD,
          left: PAD,
          bottom: PAD,
          width: confirmed ? `calc(100% - ${PAD * 2}px)` : `${x + THUMB}px`,
          background: accent,
          borderRadius: (TRACK_H - PAD * 2) / 2,
          transition: motion,
          opacity: 0.18 + pct * 0.82,
        }}
      />

      {/* Centred label — fades to confirmed copy on commit. */}
      <span
        style={{
          position: 'absolute',
          left: 0,
          right: 0,
          textAlign: 'center',
          fontSize: '0.8125rem',
          fontWeight: 600,
          letterSpacing: '0.02em',
          color: confirmed ? ON_ACCENT : 'var(--aud-mid, #6B6960)',
          pointerEvents: 'none',
          // Hide the resting prompt as the thumb passes over it.
          opacity: confirmed ? 1 : 1 - pct * 0.9,
          transition: dragging ? 'none' : 'opacity var(--aud-duration, 200ms) var(--aud-ease-snap, cubic-bezier(0.2,0,0,1))',
        }}
      >
        {confirmed ? confirmedLabel : label}
      </span>

      {/* Draggable thumb. */}
      <div
        aria-hidden="true"
        style={{
          position: 'absolute',
          top: PAD,
          left: PAD + x,
          width: THUMB,
          height: THUMB,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          background: accent,
          color: ON_ACCENT,
          borderRadius: '50%',
          boxShadow: 'var(--aud-shadow-sm, 0 1px 2px rgba(20,19,15,0.06))',
          transition: motion,
        }}
      >
        {confirmed ? <CheckIcon /> : <ChevronsIcon />}
      </div>
    </div>
  )
}

function ChevronsIcon() {
  return (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" aria-hidden="true">
      <path d="M7 6l6 6-6 6M13 6l6 6-6 6" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  )
}

function CheckIcon() {
  return (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" aria-hidden="true">
      <path d="M5 13l4 4L19 7" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  )
}

export default AudSwipeConfirm
