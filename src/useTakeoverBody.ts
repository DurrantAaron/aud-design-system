import { useEffect } from 'react'

/**
 * While a full-screen takeover (splash / mission-control hub) is mounted:
 *
 *  1. Paint `html` + `body` to the takeover's backdrop colour, so an iOS
 *     standalone PWA never flashes a white band behind a translucent status
 *     bar or during overscroll.
 *  2. Lock document scroll + overscroll (`overflow:hidden` +
 *     `overscroll-behavior:none` on html and body) so iOS standalone can't
 *     rubber-band-scroll and visibly *elongate* the `100dvh` stage. The stage
 *     is exactly the viewport, so there is nothing to scroll — this stops the
 *     bounce that makes the card appear to stretch when you drag.
 *
 * Everything is restored on unmount, so the rest of the app (which DOES scroll)
 * is unaffected.
 */
export function useTakeoverBody(bgColor: string): void {
  useEffect(() => {
    if (typeof document === 'undefined') return
    const html = document.documentElement
    const body = document.body
    const prev = {
      htmlBg: html.style.backgroundColor,
      bodyBg: body.style.backgroundColor,
      htmlOverflow: html.style.overflow,
      bodyOverflow: body.style.overflow,
      htmlOverscroll: html.style.overscrollBehavior,
      bodyOverscroll: body.style.overscrollBehavior,
    }
    html.style.backgroundColor = bgColor
    body.style.backgroundColor = bgColor
    html.style.overflow = 'hidden'
    body.style.overflow = 'hidden'
    html.style.overscrollBehavior = 'none'
    body.style.overscrollBehavior = 'none'
    return () => {
      html.style.backgroundColor = prev.htmlBg
      body.style.backgroundColor = prev.bodyBg
      html.style.overflow = prev.htmlOverflow
      body.style.overflow = prev.bodyOverflow
      html.style.overscrollBehavior = prev.htmlOverscroll
      body.style.overscrollBehavior = prev.bodyOverscroll
    }
  }, [bgColor])
}
