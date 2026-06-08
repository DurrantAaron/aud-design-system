import React, { useEffect, useRef, useState } from 'react'

const SURFACE = 'var(--aud-surface, #FAFAF8)'
const INK = 'var(--aud-ink, #14130F)'
const RULE = 'var(--aud-rule, #D8D4CC)'
const MID = 'var(--aud-mid, #6B6960)'
const RADIUS = 'var(--aud-radius-lg, 6px)'
const SHADOW = 'var(--aud-shadow-overlay, 0 12px 40px rgba(20,19,15,0.18))'
const SPRING = 'var(--aud-ease-spring, cubic-bezier(0.34,1.56,0.64,1))'
const SMOOTH = 'var(--aud-ease-smooth, cubic-bezier(0.4,0,0.2,1))'
const SLOW = 'var(--aud-duration-slow, 320ms)'
const SAFE_BOTTOM = 'var(--aud-safe-bottom, 0px)'
const BODY_FONT = "var(--aud-font-body, 'Barlow', 'Inter', system-ui, sans-serif)"
const HEADING_FONT = "var(--aud-font-heading, 'Barlow', 'Inter', system-ui, sans-serif)"

// Released past this fraction of the sheet's height (or a fast downward flick)
// dismisses; anything less springs back.
const DISMISS_FRACTION = 0.3
const FLICK_VELOCITY = 0.6 // px per ms

export interface BottomSheetProps
  extends Omit<React.HTMLAttributes<HTMLDivElement>, 'title'> {
  /** Whether the sheet is mounted + shown. Renders nothing when false. */
  open: boolean
  /** Called on backdrop click, drag-to-dismiss, or Escape. */
  onClose: () => void
  /** Header title; a grab-handle sits above it. */
  title?: React.ReactNode
  /** Sheet body — scrolls internally past ~90dvh. */
  children?: React.ReactNode
  /** Tapping the backdrop closes the sheet. Default true. */
  closeOnBackdrop?: boolean
}

/**
 * A bottom sheet — the iOS "drawer up from the bottom" surface. A backdrop
 * fades in while the sheet springs up from below; the content clears the home
 * indicator via `--aud-safe-bottom`. The grab-handle + header are draggable:
 * drag down past ~30% of the sheet's height (or flick) to dismiss, otherwise it
 * springs back. Pointer Events drive the drag, so touch and mouse both work.
 *
 * SSR-safe (all window/document/pointer work is in effects + handlers), and the
 * animated root carries `aud-motion` so reduced-motion users get no transition.
 *
 * ```tsx
 * const [open, setOpen] = useState(false)
 * <BottomSheet open={open} onClose={() => setOpen(false)} title="Filters">
 *   <p>Sheet content…</p>
 * </BottomSheet>
 * ```
 */
export function BottomSheet({
  open,
  onClose,
  title,
  children,
  closeOnBackdrop = true,
  style,
  ...rest
}: BottomSheetProps) {
  // Mounted while open OR while playing the slide-down close (none here — we
  // hard-unmount on !open per the brief), so we just track the entrance.
  const [shown, setShown] = useState(false)
  // Live drag offset in px (0 = at rest). Null when not dragging.
  const [dragY, setDragY] = useState<number | null>(null)
  const sheetRef = useRef<HTMLDivElement | null>(null)
  const dragRef = useRef<{ startY: number; lastY: number; lastT: number; v: number } | null>(null)

  // Trigger the entrance transform on the next frame after mount.
  useEffect(() => {
    if (!open) {
      setShown(false)
      setDragY(null)
      dragRef.current = null
      return
    }
    if (typeof window === 'undefined') {
      setShown(true)
      return
    }
    const id = window.requestAnimationFrame(() => setShown(true))
    return () => window.cancelAnimationFrame(id)
  }, [open])

  // Escape closes.
  useEffect(() => {
    if (!open || typeof document === 'undefined') return
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose()
    }
    document.addEventListener('keydown', onKey)
    return () => document.removeEventListener('keydown', onKey)
  }, [open, onClose])

  if (!open) return null

  const onPointerDown = (e: React.PointerEvent) => {
    // Only react to the primary button / a touch contact.
    if (e.button != null && e.button !== 0) return
    e.currentTarget.setPointerCapture?.(e.pointerId)
    const now = typeof performance !== 'undefined' ? performance.now() : Date.now()
    dragRef.current = { startY: e.clientY, lastY: e.clientY, lastT: now, v: 0 }
    setDragY(0)
  }

  const onPointerMove = (e: React.PointerEvent) => {
    const d = dragRef.current
    if (!d) return
    const now = typeof performance !== 'undefined' ? performance.now() : Date.now()
    const dt = now - d.lastT
    if (dt > 0) d.v = (e.clientY - d.lastY) / dt
    d.lastY = e.clientY
    d.lastT = now
    // Only allow dragging downward; clamp upward to 0.
    setDragY(Math.max(0, e.clientY - d.startY))
  }

  const onPointerUp = (e: React.PointerEvent) => {
    const d = dragRef.current
    dragRef.current = null
    e.currentTarget.releasePointerCapture?.(e.pointerId)
    if (!d) return
    const offset = Math.max(0, e.clientY - d.startY)
    const height = sheetRef.current?.offsetHeight ?? 0
    const pastThreshold = height > 0 && offset > height * DISMISS_FRACTION
    const flicked = d.v > FLICK_VELOCITY
    if (pastThreshold || flicked) {
      onClose()
    } else {
      // Spring back to rest.
      setDragY(null)
    }
  }

  const dragging = dragY !== null
  // Translate: entrance (100% off-screen until shown) + live drag offset.
  const translate = !shown
    ? 'translateY(100%)'
    : dragging
      ? `translateY(${dragY}px)`
      : 'translateY(0)'

  return (
    <div
      role="dialog"
      aria-modal="true"
      className="aud-motion"
      style={{
        position: 'fixed',
        inset: 0,
        zIndex: 1000,
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'flex-end',
      }}
    >
      {/* Backdrop */}
      <div
        aria-hidden="true"
        onClick={closeOnBackdrop ? onClose : undefined}
        className="aud-motion"
        style={{
          position: 'absolute',
          inset: 0,
          background: 'var(--aud-overlay-scrim, rgba(20,19,15,0.4))',
          opacity: shown ? 1 : 0,
          transition: `opacity ${SLOW} ${SMOOTH}`,
          cursor: closeOnBackdrop ? 'pointer' : 'default',
        }}
      />

      {/* Sheet */}
      <div
        ref={sheetRef}
        className="aud-motion"
        style={{
          position: 'relative',
          width: '100%',
          maxHeight: '90dvh',
          display: 'flex',
          flexDirection: 'column',
          background: SURFACE,
          color: INK,
          fontFamily: BODY_FONT,
          borderTopLeftRadius: RADIUS,
          borderTopRightRadius: RADIUS,
          boxShadow: SHADOW,
          transform: translate,
          transition: dragging
            ? 'none'
            : `transform ${SLOW} ${shown ? SPRING : SMOOTH}`,
          touchAction: 'none',
          ...style,
        }}
        {...rest}
      >
        {/* Grab-handle + header: the draggable region. */}
        <div
          onPointerDown={onPointerDown}
          onPointerMove={onPointerMove}
          onPointerUp={onPointerUp}
          onPointerCancel={onPointerUp}
          style={{
            flexShrink: 0,
            cursor: 'grab',
            touchAction: 'none',
            userSelect: 'none',
            padding: '8px 20px 0',
          }}
        >
          {/* Grab-handle bar */}
          <div
            aria-hidden="true"
            style={{
              width: 36,
              height: 4,
              borderRadius: 999,
              background: RULE,
              margin: '0 auto 4px',
            }}
          />
          {title != null && (
            <h2
              style={{
                margin: 0,
                padding: '8px 0 12px',
                fontFamily: HEADING_FONT,
                fontWeight: 600,
                fontSize: '1.0625rem',
                lineHeight: 1.2,
                letterSpacing: '0.01em',
                color: INK,
                borderBottom: `1px solid ${RULE}`,
              }}
            >
              {title}
            </h2>
          )}
        </div>

        {/* Scrollable body, padded to clear the home indicator. */}
        <div
          className="aud-scroll"
          style={{
            flex: '1 1 auto',
            overflowY: 'auto',
            WebkitOverflowScrolling: 'touch',
            overscrollBehavior: 'contain',
            padding: '16px 20px',
            paddingBottom: `calc(16px + ${SAFE_BOTTOM})`,
            color: MID,
          }}
        >
          {children}
        </div>
      </div>
    </div>
  )
}

export default BottomSheet
