import React from 'react'
import { AudButton } from './AudButton'

const BODY_FONT = "var(--aud-font-body, 'Barlow', 'Inter', system-ui, sans-serif)"
const HEADING_FONT = "var(--aud-font-heading, 'Barlow Condensed', 'Oswald', sans-serif)"
const MONO_FONT = "var(--aud-font-mono, 'Share Tech Mono', ui-monospace, monospace)"

export interface ErrorStateAction {
  label: React.ReactNode
  onClick?: () => void
  icon?: React.ReactNode
}

export interface AudErrorStateProps extends Omit<React.HTMLAttributes<HTMLDivElement>, 'title'> {
  /** Defaults to a danger-tinted alert glyph. Pass your own to override. */
  icon?: React.ReactNode
  title?: React.ReactNode
  description?: React.ReactNode
  /** Primary recovery action — usually "Try again". */
  action?: ErrorStateAction
  /** Quieter secondary action — e.g. "Go back". */
  secondaryAction?: ErrorStateAction
  /** Raw technical detail (stack / message), shown in a muted mono block for debugging. */
  details?: string
}

const DefaultIcon = () => (
  <svg width="26" height="26" viewBox="0 0 24 24" fill="none" aria-hidden="true">
    <path d="M12 8v5" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
    <circle cx="12" cy="16.5" r="1.2" fill="currentColor" />
    <path d="M10.3 3.8 2.5 18a2 2 0 0 0 1.7 3h15.6a2 2 0 0 0 1.7-3L13.7 3.8a2 2 0 0 0-3.4 0Z" stroke="currentColor" strokeWidth="1.6" strokeLinejoin="round" />
  </svg>
)

/**
 * The error half of "design every state" — the sibling of {@link EmptyState}.
 * Same centred layout, a danger-tinted glyph, a recovery action, and an
 * optional collapsible technical-detail block.
 *
 * ```tsx
 * <AudErrorState
 *   title="Couldn't load audits"
 *   description="Check your connection and try again."
 *   action={{ label: 'Try again', onClick: refetch }}
 *   details={error.message}
 * />
 * ```
 */
export function AudErrorState({
  icon,
  title = 'Something went wrong',
  description,
  action,
  secondaryAction,
  details,
  style,
  ...rest
}: AudErrorStateProps) {
  return (
    <div
      role="alert"
      style={{
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        textAlign: 'center',
        gap: 12,
        padding: '40px 24px',
        maxWidth: 360,
        margin: '0 auto',
        fontFamily: BODY_FONT,
        color: 'var(--aud-ink, #14130F)',
        ...style,
      }}
      {...rest}
    >
      <div
        style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          width: 48,
          height: 48,
          borderRadius: 'var(--aud-radius, 4px)',
          background: 'var(--aud-danger-tint, #F3E1DB)',
          color: 'var(--aud-danger, #B14C3A)',
          marginBottom: 4,
        }}
      >
        {icon ?? <DefaultIcon />}
      </div>

      <h2
        style={{
          margin: 0,
          fontFamily: HEADING_FONT,
          fontWeight: 600,
          fontSize: '1.375rem',
          lineHeight: 'var(--aud-leading-tight, 1.1)',
          letterSpacing: 'var(--aud-tracking-tight, -0.025em)',
        }}
      >
        {title}
      </h2>

      {description && (
        <p style={{ margin: 0, fontSize: '0.875rem', lineHeight: 1.5, color: 'var(--aud-mid, #6B6960)' }}>
          {description}
        </p>
      )}

      {(action || secondaryAction) && (
        <div style={{ display: 'flex', gap: 10, marginTop: 8, flexWrap: 'wrap', justifyContent: 'center' }}>
          {action && (
            <AudButton variant="primary" icon={action.icon} onClick={action.onClick}>
              {action.label}
            </AudButton>
          )}
          {secondaryAction && (
            <AudButton variant="ghost" icon={secondaryAction.icon} onClick={secondaryAction.onClick}>
              {secondaryAction.label}
            </AudButton>
          )}
        </div>
      )}

      {details && (
        <details style={{ marginTop: 8, width: '100%', textAlign: 'left' }}>
          <summary style={{ cursor: 'pointer', fontSize: '0.75rem', color: 'var(--aud-mid, #6B6960)' }}>
            Technical details
          </summary>
          <pre
            style={{
              margin: '6px 0 0',
              padding: 10,
              borderRadius: 'var(--aud-radius, 4px)',
              background: 'var(--aud-surface, #FAFAF8)',
              border: '1px solid var(--aud-rule, #D8D4CC)',
              fontFamily: MONO_FONT,
              fontSize: '0.6875rem',
              lineHeight: 1.5,
              color: 'var(--aud-mid, #6B6960)',
              whiteSpace: 'pre-wrap',
              wordBreak: 'break-word',
              overflowX: 'auto',
            }}
          >
            {details}
          </pre>
        </details>
      )}
    </div>
  )
}

export default AudErrorState
