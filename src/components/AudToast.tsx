import React from 'react'
import type { StatusName } from './StatusChip'

const BODY_FONT = "var(--aud-font-body, 'Barlow', 'Inter', system-ui, sans-serif)"

export interface AudToastAction {
  label: React.ReactNode
  onClick?: () => void
}

export interface AudToastProps extends Omit<React.HTMLAttributes<HTMLDivElement>, 'title'> {
  /** Drives the accent bar + default glyph. Defaults to `info`. */
  status?: StatusName
  title: React.ReactNode
  description?: React.ReactNode
  /** Override the leading glyph (defaults to a per-status mark). */
  icon?: React.ReactNode
  /** A single inline action (e.g. "Undo", "Retry"). */
  action?: AudToastAction
  /** Show a dismiss button + wire its handler. */
  onClose?: () => void
}

// info/neutral share a glyph; success ✓, warning/danger !.
const GLYPHS: Record<StatusName, React.ReactNode> = {
  success: <path d="M4 8.5 7 11.5 12 5" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" fill="none" />,
  warning: <><path d="M8 4v5" stroke="currentColor" strokeWidth="2" strokeLinecap="round" /><circle cx="8" cy="12" r="1" fill="currentColor" /></>,
  danger: <><path d="M8 4v5" stroke="currentColor" strokeWidth="2" strokeLinecap="round" /><circle cx="8" cy="12" r="1" fill="currentColor" /></>,
  info: <><circle cx="8" cy="5" r="1" fill="currentColor" /><path d="M8 8v4" stroke="currentColor" strokeWidth="2" strokeLinecap="round" /></>,
  neutral: <><circle cx="8" cy="5" r="1" fill="currentColor" /><path d="M8 8v4" stroke="currentColor" strokeWidth="2" strokeLinecap="round" /></>,
}

const TOAST_CSS =
  '@keyframes aud-toast-in{from{opacity:0;transform:translateY(12px)}to{opacity:1;transform:none}}' +
  '@media (prefers-reduced-motion: reduce){.aud-toast{animation:none!important}}'

function tone(status: StatusName) {
  return status === 'neutral'
    ? { base: 'var(--aud-mid, #6B6960)', fg: 'var(--aud-ink, #14130F)' }
    : { base: `var(--aud-${status})`, fg: `var(--aud-${status}-fg)` }
}

/**
 * A toast — the dashboard's notification surface (success / warning / error /
 * info), and the "copy → confirmation slides up" micro-interaction. Slides up
 * on mount with the spring easing token; reuses the semantic colour tokens.
 *
 * Presentational only: positioning, stacking and auto-dismiss are the app's job
 * (drop it in a fixed bottom-right stack). Pair with `status="neutral"` for a
 * quiet "Saved" / "Synced" confirmation.
 *
 * ```tsx
 * <AudToast status="success" title="Audit synced" onClose={dismiss} />
 * <AudToast status="danger" title="Upload failed" description="Tap to retry."
 *   action={{ label: 'Retry', onClick: retry }} onClose={dismiss} />
 * ```
 */
export function AudToast({
  status = 'info',
  title,
  description,
  icon,
  action,
  onClose,
  style,
  ...rest
}: AudToastProps) {
  const t = tone(status)
  return (
    <div
      role="status"
      aria-live="polite"
      className="aud-toast"
      style={{
        display: 'flex',
        alignItems: 'flex-start',
        gap: 10,
        width: '100%',
        maxWidth: 380,
        padding: '12px 12px 12px 14px',
        background: 'var(--aud-surface, #FAFAF8)',
        color: 'var(--aud-ink, #14130F)',
        border: '1px solid var(--aud-rule, #D8D4CC)',
        borderLeft: `3px solid ${t.base}`,
        borderRadius: 'var(--aud-radius, 4px)',
        boxShadow: 'var(--aud-shadow-lg, 0 8px 24px rgba(20,19,15,0.12))',
        fontFamily: BODY_FONT,
        animation: 'aud-toast-in var(--aud-duration, 200ms) var(--aud-ease-spring, cubic-bezier(0.34,1.56,0.64,1)) both',
        ...style,
      }}
      {...rest}
    >
      <style>{TOAST_CSS}</style>

      <span style={{ flex: 'none', display: 'flex', color: t.base, marginTop: 1 }} aria-hidden="true">
        {icon ?? (
          <svg width="16" height="16" viewBox="0 0 16 16">{GLYPHS[status]}</svg>
        )}
      </span>

      <div style={{ flex: 1, minWidth: 0 }}>
        <div style={{ fontWeight: 600, fontSize: '0.875rem', lineHeight: 1.35 }}>{title}</div>
        {description && (
          <div style={{ fontSize: '0.8125rem', lineHeight: 1.45, color: 'var(--aud-mid, #6B6960)', marginTop: 2 }}>
            {description}
          </div>
        )}
      </div>

      {action && (
        <button
          type="button"
          onClick={action.onClick}
          style={{
            flex: 'none',
            background: 'transparent',
            border: 'none',
            padding: '2px 6px',
            cursor: 'pointer',
            fontFamily: BODY_FONT,
            fontWeight: 600,
            fontSize: '0.8125rem',
            color: t.base,
          }}
        >
          {action.label}
        </button>
      )}

      {onClose && (
        <button
          type="button"
          onClick={onClose}
          aria-label="Dismiss"
          style={{
            flex: 'none',
            background: 'transparent',
            border: 'none',
            padding: 2,
            cursor: 'pointer',
            color: 'var(--aud-mid, #6B6960)',
            display: 'flex',
            lineHeight: 0,
          }}
        >
          <svg width="14" height="14" viewBox="0 0 16 16" aria-hidden="true">
            <path d="M4 4l8 8M12 4l-8 8" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" />
          </svg>
        </button>
      )}
    </div>
  )
}

export default AudToast
