import { useEffect, useState } from 'react'

/**
 * Native-feel helpers for installed PWAs. All three are SSR-safe: they return a
 * deterministic value on the server / first render and update in an effect, and
 * every media-query hook removes its listener on unmount.
 */

// Shared SSR-safe media-query subscription. Returns `false` on the server and on
// first client render, then flips to the live match in an effect.
function useMediaQuery(query: string): boolean {
  const [matches, setMatches] = useState(false)

  useEffect(() => {
    if (typeof window === 'undefined' || !window.matchMedia) return
    const mq = window.matchMedia(query)
    const onChange = () => setMatches(mq.matches)
    onChange()
    mq.addEventListener('change', onChange)
    return () => mq.removeEventListener('change', onChange)
  }, [query])

  return matches
}

/**
 * `true` when the app is running as an installed PWA (Home Screen / standalone),
 * covering both the standard `display-mode: standalone` and iOS Safari's
 * legacy `navigator.standalone`. Subscribes to display-mode changes.
 *
 * ```ts
 * const standalone = useStandalone()
 * // hide an in-app "Add to Home Screen" hint when already installed
 * ```
 */
export function useStandalone(): boolean {
  const [standalone, setStandalone] = useState(false)

  useEffect(() => {
    if (typeof window === 'undefined') return
    const mq = window.matchMedia?.('(display-mode: standalone)')
    const compute = () =>
      setStandalone(
        (mq?.matches ?? false) || (navigator as unknown as { standalone?: boolean }).standalone === true,
      )
    compute()
    mq?.addEventListener('change', compute)
    return () => mq?.removeEventListener('change', compute)
  }, [])

  return standalone
}

/**
 * `true` when the user has asked for reduced motion
 * (`prefers-reduced-motion: reduce`). Use it to skip non-essential animation.
 *
 * ```ts
 * const reduced = useReducedMotion()
 * const transition = reduced ? 'none' : 'transform 200ms'
 * ```
 */
export function useReducedMotion(): boolean {
  return useMediaQuery('(prefers-reduced-motion: reduce)')
}

/**
 * The four safe-area inset strings as CSS `var(--aud-safe-*)` references (each
 * with an `env(safe-area-inset-*)` fallback), ready to drop into inline styles.
 * Constant strings, so it is trivially SSR-safe.
 *
 * ```tsx
 * const safe = useSafeArea()
 * <header style={{ paddingTop: safe.top }} />
 * ```
 */
export function useSafeArea(): { top: string; right: string; bottom: string; left: string } {
  return {
    top: 'var(--aud-safe-top, env(safe-area-inset-top, 0px))',
    right: 'var(--aud-safe-right, env(safe-area-inset-right, 0px))',
    bottom: 'var(--aud-safe-bottom, env(safe-area-inset-bottom, 0px))',
    left: 'var(--aud-safe-left, env(safe-area-inset-left, 0px))',
  }
}
