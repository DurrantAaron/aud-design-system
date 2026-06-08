import React, { useRef } from 'react'

const BODY_FONT = "var(--aud-font-body, 'Barlow', 'Inter', system-ui, sans-serif)"

export interface TabItem {
  key: string
  label: React.ReactNode
  icon?: React.ReactNode
}

export interface AudTabsProps extends Omit<React.HTMLAttributes<HTMLDivElement>, 'onChange'> {
  tabs: TabItem[]
  /** The active tab's `key` (controlled). */
  value: string
  /** Called with the newly-selected tab's `key`. */
  onChange: (key: string) => void
  /** Tab density: sm tighter padding · md default. */
  size?: 'sm' | 'md'
}

/**
 * A horizontal, controlled tab strip. The active tab carries a 2px accent
 * underline and ink-coloured text; inactive tabs sit in `--aud-mid` and tint on
 * hover. Keyboard: roving tabindex with Left/Right arrows moving focus +
 * selection (ARIA `tablist` / `tab`). The underline slides on the snap easing.
 *
 * Controlled only — render the panel for `value` yourself. SSR-safe (no
 * window/document access) and honours reduced motion via `.aud-motion`.
 *
 * ```tsx
 * const [tab, setTab] = useState('overview')
 * <AudTabs
 *   value={tab}
 *   onChange={setTab}
 *   tabs={[
 *     { key: 'overview', label: 'Overview' },
 *     { key: 'history', label: 'History', icon: <Clock /> },
 *   ]}
 * />
 * {tab === 'overview' && <Overview />}
 * ```
 */
export function AudTabs({ tabs, value, onChange, size = 'md', style, ...rest }: AudTabsProps) {
  const refs = useRef<(HTMLButtonElement | null)[]>([])

  const pad = size === 'sm' ? '8px 10px' : '12px 14px'
  const fontSize = size === 'sm' ? '0.8125rem' : '0.875rem'

  const onKeyDown = (e: React.KeyboardEvent, index: number) => {
    if (e.key !== 'ArrowRight' && e.key !== 'ArrowLeft') return
    e.preventDefault()
    const delta = e.key === 'ArrowRight' ? 1 : -1
    const next = (index + delta + tabs.length) % tabs.length
    const nextTab = tabs[next]
    if (!nextTab) return
    onChange(nextTab.key)
    refs.current[next]?.focus()
  }

  return (
    <div
      role="tablist"
      className="aud-motion"
      style={{
        display: 'flex',
        alignItems: 'stretch',
        gap: 2,
        borderBottom: '1px solid var(--aud-rule, #D8D4CC)',
        fontFamily: BODY_FONT,
        ...style,
      }}
      {...rest}
    >
      {tabs.map((tab, i) => {
        const active = tab.key === value
        return (
          <Tab
            key={tab.key}
            ref={(el) => {
              refs.current[i] = el
            }}
            tab={tab}
            active={active}
            pad={pad}
            fontSize={fontSize}
            onSelect={() => onChange(tab.key)}
            onKeyDown={(e) => onKeyDown(e, i)}
          />
        )
      })}
    </div>
  )
}

const Tab = React.forwardRef<
  HTMLButtonElement,
  {
    tab: TabItem
    active: boolean
    pad: string
    fontSize: string
    onSelect: () => void
    onKeyDown: (e: React.KeyboardEvent) => void
  }
>(function Tab({ tab, active, pad, fontSize, onSelect, onKeyDown }, ref) {
  const [hover, setHover] = React.useState(false)

  return (
    <button
      ref={ref}
      type="button"
      role="tab"
      aria-selected={active}
      tabIndex={active ? 0 : -1}
      onClick={onSelect}
      onKeyDown={onKeyDown}
      onMouseEnter={() => setHover(true)}
      onMouseLeave={() => setHover(false)}
      className="aud-motion"
      style={{
        position: 'relative',
        display: 'inline-flex',
        alignItems: 'center',
        gap: 6,
        padding: pad,
        margin: 0,
        background: !active && hover ? 'var(--aud-overlay-hover, rgba(20,19,15,0.06))' : 'transparent',
        border: 'none',
        cursor: 'pointer',
        fontFamily: 'inherit',
        fontWeight: 600,
        fontSize,
        lineHeight: 1.2,
        color: active ? 'var(--aud-ink, #14130F)' : 'var(--aud-mid, #6B6960)',
        borderRadius: 'var(--aud-radius, 4px) var(--aud-radius, 4px) 0 0',
        transition:
          'color var(--aud-duration-fast, 120ms) var(--aud-ease-snap, cubic-bezier(0.2,0,0,1)), background var(--aud-duration-fast, 120ms) var(--aud-ease-snap, cubic-bezier(0.2,0,0,1))',
      }}
    >
      {tab.icon && (
        <span style={{ flex: 'none', display: 'flex', lineHeight: 0 }} aria-hidden="true">
          {tab.icon}
        </span>
      )}
      <span>{tab.label}</span>
      <span
        aria-hidden="true"
        style={{
          position: 'absolute',
          left: 0,
          right: 0,
          bottom: -1,
          height: 2,
          background: active ? 'var(--aud-accent, #C8A84B)' : 'transparent',
          transform: active ? 'scaleX(1)' : 'scaleX(0)',
          transformOrigin: 'center',
          transition:
            'transform var(--aud-duration-fast, 120ms) var(--aud-ease-snap, cubic-bezier(0.2,0,0,1)), background var(--aud-duration-fast, 120ms) var(--aud-ease-snap, cubic-bezier(0.2,0,0,1))',
        }}
      />
    </button>
  )
})

export default AudTabs
