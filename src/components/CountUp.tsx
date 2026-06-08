import React, { useEffect, useRef, useState } from 'react'

export interface CountUpProps extends React.HTMLAttributes<HTMLSpanElement> {
  /** Target value to animate to. */
  value: number
  /** Animation length in ms. Default 600. */
  duration?: number
  /** Custom formatter (overrides `decimals`). Receives the in-flight number. */
  format?: (n: number) => string
  /** Fixed decimal places when `format` is not supplied. Default 0. */
  decimals?: number
}

// ease-out cubic — fast off the mark, gentle landing (KPI headlines feel snappy).
function easeOut(t: number): number {
  return 1 - Math.pow(1 - t, 3)
}

/**
 * Animated number for KPI headlines — counts up (or down) to `value` whenever it
 * changes, via `requestAnimationFrame` with an ease-out. Render through `format`
 * or `toFixed(decimals)`.
 *
 * SSR-safe: renders the final value on the server and on first paint, then
 * animates from there in an effect. Honours `prefers-reduced-motion` (jumps
 * straight to the value) and cancels its rAF on unmount.
 *
 * ```tsx
 * <CountUp value={92} />
 * <CountUp value={1240.5} decimals={1} />
 * <CountUp value={revenue} format={(n) => `$${Math.round(n).toLocaleString()}`} />
 * ```
 */
export function CountUp({
  value,
  duration = 600,
  format,
  decimals = 0,
  style,
  ...rest
}: CountUpProps) {
  // Start at the final value so SSR + first paint match (no flash / hydration
  // mismatch); the entrance animation runs in the effect below.
  const [display, setDisplay] = useState(value)
  // The value we last animated FROM — so a mid-flight prop change tweens
  // from wherever the number currently sits.
  const fromRef = useRef(value)
  const rafRef = useRef<number | null>(null)

  useEffect(() => {
    if (typeof window === 'undefined') return

    const prefersReduced =
      window.matchMedia?.('(prefers-reduced-motion: reduce)').matches ?? false

    const from = fromRef.current
    const to = value

    if (prefersReduced || duration <= 0 || from === to) {
      setDisplay(to)
      fromRef.current = to
      return
    }

    let start: number | null = null
    const step = (now: number) => {
      if (start === null) start = now
      const t = Math.min(1, (now - start) / duration)
      const current = from + (to - from) * easeOut(t)
      setDisplay(current)
      if (t < 1) {
        rafRef.current = window.requestAnimationFrame(step)
      } else {
        setDisplay(to)
        fromRef.current = to
      }
    }

    rafRef.current = window.requestAnimationFrame(step)

    return () => {
      // Cancel in-flight frame; remember where we stopped so the next change
      // tweens from the visible number rather than snapping.
      if (rafRef.current != null) {
        window.cancelAnimationFrame(rafRef.current)
        rafRef.current = null
      }
      fromRef.current = value
    }
  }, [value, duration])

  const text = format ? format(display) : display.toFixed(decimals)

  return (
    <span style={style} {...rest}>
      {text}
    </span>
  )
}

export default CountUp
