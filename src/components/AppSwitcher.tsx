import React, { useEffect, useRef, useState } from 'react'

const SANS_FONT =
  "var(--aud-font-sans, -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif)"

/** One app in the suite the switcher lets you jump between. */
export interface AppSwitcherApp {
  /** Stable id, e.g. "cleaning-dashboard". Matches {@link AppSwitcherProps.currentId}. */
  id: string
  /** Display name, e.g. "IVY Cleaning". */
  name: string
  /** Secondary line under the name, e.g. "Cost Tracker". */
  subtitle: string
  /**
   * Where this app lives. Each app in the suite is its own origin/deployment
   * with its own session, so picking a row is a full navigation
   * (`window.location.href = url`), not client-side routing.
   */
  url: string
  /** Tile colour for this app's glyph square. */
  accent: string
  /**
   * Optional glyph for the tile — a small icon node (e.g. a lucide icon) shown
   * instead of the letter `glyph`. Sized/coloured by the caller. Falls back to
   * the `glyph` letters when omitted.
   */
  icon?: React.ReactNode
}

export interface AppSwitcherProps {
  /** Every app in the suite, INCLUDING the one currently open. */
  apps: AppSwitcherApp[]
  /** Which `apps[].id` is the current app — highlighted, not a link. */
  currentId: string
  /** The glyph tile's letters. Defaults to "IVY" (the shared precinct mark). */
  glyph?: string
}

const ChevronDown = () => (
  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.25" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
    <path d="m6 9 6 6 6-6" />
  </svg>
)

const Check = () => (
  <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
    <path d="M20 6 9 17l-5-5" />
  </svg>
)

/**
 * The corner control for a suite of sibling dashboards — click the app glyph
 * to jump to another dashboard in the family. Lives in each app's existing
 * header slot (it renders only the clickable row + its dropdown, not a
 * wrapping landing page) so switching never leaves the app you're in for
 * anything more than the click.
 *
 * Self-contained (inline styles, one dark palette) so it renders identically
 * in every consuming app regardless of that app's own Tailwind config —
 * the whole point is that the suite reads as one thing.
 *
 * ```tsx
 * <AppSwitcher
 *   currentId="app-a"
 *   apps={[
 *     { id: 'app-a', name: 'Suite A', subtitle: 'Cost Tracker', url: 'https://app-a.example.com/', accent: '#C8A84B' },
 *     { id: 'app-b', name: 'Suite B', subtitle: 'Compliance', url: 'https://app-b.example.com/', accent: 'oklch(0.72 0.15 185)' },
 *     { id: 'app-c', name: 'Suite C', subtitle: 'Guard Costs', url: 'https://app-c.example.com/', accent: '#5A6B93' },
 *   ]}
 * />
 * ```
 */
export function AppSwitcher({ apps, currentId, glyph = 'IVY' }: AppSwitcherProps) {
  const [open, setOpen] = useState(false)
  const rootRef = useRef<HTMLDivElement>(null)
  const current = apps.find((a) => a.id === currentId) ?? apps[0]

  useEffect(() => {
    if (!open) return
    function onPointerDown(e: PointerEvent) {
      if (rootRef.current && !rootRef.current.contains(e.target as Node)) setOpen(false)
    }
    function onKeyDown(e: KeyboardEvent) {
      if (e.key === 'Escape') setOpen(false)
    }
    document.addEventListener('pointerdown', onPointerDown)
    document.addEventListener('keydown', onKeyDown)
    return () => {
      document.removeEventListener('pointerdown', onPointerDown)
      document.removeEventListener('keydown', onKeyDown)
    }
  }, [open])

  if (!current) return null

  return (
    <div ref={rootRef} style={{ position: 'relative', fontFamily: SANS_FONT }}>
      <button
        type="button"
        onClick={() => setOpen((v) => !v)}
        aria-haspopup="menu"
        aria-expanded={open}
        style={{
          display: 'flex',
          alignItems: 'center',
          gap: '0.625rem',
          width: '100%',
          padding: 0,
          border: 'none',
          background: 'transparent',
          cursor: 'pointer',
          color: 'inherit',
          textAlign: 'left',
        }}
      >
        <span
          style={{
            width: '1.75rem',
            height: '1.75rem',
            borderRadius: '0.375rem',
            background: current.accent,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            flexShrink: 0,
          }}
        >
          {current.icon ?? (
            <span style={{ fontSize: '0.6875rem', fontWeight: 900, color: '#fff' }}>{glyph}</span>
          )}
        </span>
        <span style={{ minWidth: 0, flex: 1 }}>
          <span style={{ display: 'block', fontSize: '0.8125rem', fontWeight: 700, color: 'oklch(0.92 0.005 260)', lineHeight: 1.3 }}>
            {current.name}
          </span>
          <span style={{ display: 'block', fontSize: '0.6875rem', color: 'oklch(0.65 0.01 260)', lineHeight: 1.3 }}>
            {current.subtitle}
          </span>
        </span>
        <span style={{ color: 'oklch(0.55 0.01 260)', flexShrink: 0, transform: open ? 'rotate(180deg)' : undefined, transition: 'transform 150ms ease-out' }}>
          <ChevronDown />
        </span>
      </button>

      {open && (
        <div
          role="menu"
          aria-label="Switch dashboard"
          style={{
            position: 'absolute',
            top: 'calc(100% + 0.5rem)',
            left: 0,
            minWidth: '15rem',
            zIndex: 50,
            borderRadius: '0.625rem',
            border: '1px solid oklch(0.3 0.01 260)',
            background: 'oklch(0.17 0.012 260)',
            boxShadow: '0 12px 32px rgba(0,0,0,0.45)',
            padding: '0.375rem',
          }}
        >
          {apps.map((app) => {
            const isCurrent = app.id === current.id
            const row = (
              <span style={{ display: 'flex', alignItems: 'center', gap: '0.625rem', width: '100%' }}>
                <span
                  style={{
                    width: '1.5rem',
                    height: '1.5rem',
                    borderRadius: '0.3125rem',
                    background: app.accent,
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    flexShrink: 0,
                  }}
                >
                  {app.icon ?? (
                    <span style={{ fontSize: '0.5625rem', fontWeight: 900, color: '#fff' }}>{glyph}</span>
                  )}
                </span>
                <span style={{ minWidth: 0, flex: 1 }}>
                  <span style={{ display: 'block', fontSize: '0.8125rem', fontWeight: 600, color: 'oklch(0.92 0.005 260)', lineHeight: 1.3 }}>
                    {app.name}
                  </span>
                  <span style={{ display: 'block', fontSize: '0.6875rem', color: 'oklch(0.65 0.01 260)', lineHeight: 1.3 }}>
                    {app.subtitle}
                  </span>
                </span>
                {isCurrent && (
                  <span style={{ color: app.accent, flexShrink: 0 }}>
                    <Check />
                  </span>
                )}
              </span>
            )
            const commonStyle: React.CSSProperties = {
              display: 'flex',
              alignItems: 'center',
              width: '100%',
              padding: '0.5rem 0.625rem',
              borderRadius: '0.4375rem',
              textDecoration: 'none',
              cursor: isCurrent ? 'default' : 'pointer',
              background: isCurrent ? 'rgba(255,255,255,0.06)' : 'transparent',
            }
            return isCurrent ? (
              <div key={app.id} role="menuitem" aria-current="true" style={commonStyle}>
                {row}
              </div>
            ) : (
              <a
                key={app.id}
                href={app.url}
                role="menuitem"
                style={commonStyle}
                onMouseEnter={(e) => (e.currentTarget.style.background = 'rgba(255,255,255,0.05)')}
                onMouseLeave={(e) => (e.currentTarget.style.background = 'transparent')}
              >
                {row}
              </a>
            )
          })}
        </div>
      )}
    </div>
  )
}

export default AppSwitcher
