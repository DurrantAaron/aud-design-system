import React, { useState } from 'react'

const SURFACE = 'var(--aud-surface, #FAFAF8)'
const RULE = 'var(--aud-rule, #D8D4CC)'
const MID = 'var(--aud-mid, #6B6960)'
const ACCENT = 'var(--aud-accent, #C8A84B)'
const RADIUS = 'var(--aud-radius-lg, 6px)'
const SHADOW_LG = 'var(--aud-shadow-lg, 0 8px 24px rgba(20,19,15,0.12))'
const SMOOTH = 'var(--aud-ease-smooth, cubic-bezier(0.4,0,0.2,1))'
const DANGER = 'var(--aud-danger, #B14C3A)'
const ON_DANGER = 'var(--aud-surface, #FAFAF8)'
const TOUCH = 'var(--aud-touch-target, 44px)'
const SAFE_BOTTOM = 'var(--aud-safe-bottom, 0px)'
const BODY_FONT = "var(--aud-font-body, 'Barlow', 'Inter', system-ui, sans-serif)"

export interface TabBarItem {
  /** Stable identity; matched against `value` and passed to `onChange`. */
  key: string
  /** Short label under the icon. */
  label: React.ReactNode
  /** Icon node — size it to ~24px to sit above the label. */
  icon: React.ReactNode
  /** Optional badge node (count / dot) pinned to the icon's top-right. */
  badge?: React.ReactNode
}

export interface TabBarProps extends Omit<React.HTMLAttributes<HTMLElement>, 'onChange'> {
  /** 3–5 destinations. */
  items: TabBarItem[]
  /** The active item's `key`. */
  value: string
  /** Fired with the tapped item's `key`. */
  onChange: (key: string) => void
  /** Detached rounded bar with a shadow + margin. Default true. When false:
   *  a full-width bar with a top hairline rule. */
  floating?: boolean
}

/**
 * The bottom tab bar — the iOS-native primary navigation. Icons over small
 * labels; the active item glows in `--aud-accent`, the rest sit in `--aud-mid`.
 * Bottom padding via `--aud-safe-bottom` keeps the controls above the home
 * indicator, and every tab clears the `--aud-touch-target` floor.
 *
 * `floating` (default) renders a detached, rounded, shadowed bar with a small
 * margin; pass `floating={false}` for a full-width bar with a top hairline.
 * Renders as `<nav role="tablist">`; each tab is `role="tab"`.
 *
 * SSR-safe — interactivity is pure component state.
 *
 * ```tsx
 * const [tab, setTab] = useState('home')
 * <TabBar
 *   value={tab}
 *   onChange={setTab}
 *   items={[
 *     { key: 'home', label: 'Home', icon: <Home/> },
 *     { key: 'audits', label: 'Audits', icon: <List/>, badge: 3 },
 *     { key: 'me', label: 'Me', icon: <User/> },
 *   ]}
 * />
 * ```
 */
export function TabBar({
  items,
  value,
  onChange,
  floating = true,
  style,
  ...rest
}: TabBarProps) {
  return (
    <nav
      role="tablist"
      className="aud-motion aud-no-callout"
      style={{
        position: 'fixed',
        zIndex: 900,
        display: 'flex',
        alignItems: 'stretch',
        justifyContent: 'space-around',
        background: SURFACE,
        fontFamily: BODY_FONT,
        ...(floating
          ? {
              // Detached, rounded, shadowed bar with a small margin.
              left: 12,
              right: 12,
              bottom: `calc(12px + ${SAFE_BOTTOM})`,
              borderRadius: RADIUS,
              boxShadow: SHADOW_LG,
              border: `1px solid ${RULE}`,
            }
          : {
              // Full-width bar, top hairline, padded to clear the home indicator.
              left: 0,
              right: 0,
              bottom: 0,
              paddingBottom: SAFE_BOTTOM,
              borderTop: `1px solid ${RULE}`,
            }),
        ...style,
      }}
      {...rest}
    >
      {items.map((item) => (
        <Tab
          key={item.key}
          item={item}
          active={item.key === value}
          onSelect={() => onChange(item.key)}
        />
      ))}
    </nav>
  )
}

function Tab({
  item,
  active,
  onSelect,
}: {
  item: TabBarItem
  active: boolean
  onSelect: () => void
}) {
  const [press, setPress] = useState(false)
  const color = active ? ACCENT : MID

  return (
    <button
      type="button"
      role="tab"
      aria-selected={active}
      onClick={onSelect}
      onPointerDown={() => setPress(true)}
      onPointerUp={() => setPress(false)}
      onPointerLeave={() => setPress(false)}
      onPointerCancel={() => setPress(false)}
      style={{
        flex: 1,
        minHeight: TOUCH,
        minWidth: TOUCH,
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        gap: 3,
        padding: '8px 4px',
        margin: 0,
        background: 'transparent',
        border: 'none',
        cursor: 'pointer',
        color,
        opacity: press ? 0.6 : 1,
        transition: `color 120ms ${SMOOTH}, opacity 120ms ${SMOOTH}`,
        WebkitTapHighlightColor: 'transparent',
      }}
    >
      {/* Icon + optional badge */}
      <span
        style={{
          position: 'relative',
          display: 'inline-flex',
          alignItems: 'center',
          justifyContent: 'center',
          lineHeight: 0,
        }}
      >
        {item.icon}
        {item.badge != null && (
          <span
            style={{
              position: 'absolute',
              top: -4,
              left: '100%',
              transform: 'translateX(-50%)',
              minWidth: 16,
              height: 16,
              padding: '0 4px',
              boxSizing: 'border-box',
              display: 'inline-flex',
              alignItems: 'center',
              justifyContent: 'center',
              borderRadius: 999,
              background: DANGER,
              color: ON_DANGER,
              fontSize: '0.625rem',
              fontWeight: 700,
              lineHeight: 1,
            }}
          >
            {item.badge}
          </span>
        )}
      </span>
      <span
        style={{
          fontSize: '0.6875rem',
          fontWeight: active ? 600 : 500,
          letterSpacing: '0.01em',
          lineHeight: 1,
          color,
        }}
      >
        {item.label}
      </span>
    </button>
  )
}

export default TabBar
