import React from 'react'
import { AudButton } from './AudButton'

const BODY_FONT = "var(--aud-font-body, 'Barlow', 'Inter', system-ui, sans-serif)"
const HEADING_FONT = "var(--aud-font-heading, 'Barlow Condensed', 'Oswald', sans-serif)"

export interface EmptyStateAction {
  label: React.ReactNode
  onClick?: () => void
  icon?: React.ReactNode
}

export interface EmptyStateProps extends Omit<React.HTMLAttributes<HTMLDivElement>, 'title'> {
  /**
   * `first-run` — nothing exists yet; point at the main action.
   * `no-results` — a search / filter returned nothing; acknowledge + offer an exit.
   */
  variant?: 'first-run' | 'no-results'
  /** Illustration or icon above the title. */
  icon?: React.ReactNode
  title: React.ReactNode
  description?: React.ReactNode
  /** Primary action — e.g. "New audit" (first-run) or "Clear filters" (no-results). */
  action?: EmptyStateAction
  /** Secondary / quieter action — e.g. an exit. */
  secondaryAction?: EmptyStateAction
  /** No-results typo hints, rendered as a small suggestion line. */
  suggestions?: string[]
}

/**
 * The two empty states every list/search screen needs, in one component:
 * `first-run` (draw attention to the main action) and `no-results` (acknowledge
 * the empty search + offer suggestions and a way out).
 *
 * ```tsx
 * <EmptyState
 *   variant="first-run"
 *   icon={<ClipboardIcon/>}
 *   title="No audits yet"
 *   description="Start your first venue audit to see it here."
 *   action={{ label: 'New audit', icon: <Plus/>, onClick: create }}
 * />
 *
 * <EmptyState
 *   variant="no-results"
 *   title="No notes match “moppd”"
 *   suggestions={['mopped', 'mop']}
 *   secondaryAction={{ label: 'Clear search', onClick: reset }}
 * />
 * ```
 */
export function EmptyState({
  variant = 'first-run',
  icon,
  title,
  description,
  action,
  secondaryAction,
  suggestions,
  style,
  ...rest
}: EmptyStateProps) {
  return (
    <div
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
      {icon && (
        <div style={{ color: 'var(--aud-mid, #6B6960)', display: 'flex', marginBottom: 4 }}>{icon}</div>
      )}

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

      {suggestions && suggestions.length > 0 && (
        <p style={{ margin: 0, fontSize: '0.8125rem', lineHeight: 1.5, color: 'var(--aud-mid, #6B6960)' }}>
          Did you mean{' '}
          {suggestions.map((s, i) => (
            <React.Fragment key={s}>
              {i > 0 && (i === suggestions.length - 1 ? ' or ' : ', ')}
              <span style={{ color: 'var(--aud-accent, #C8A84B)', fontWeight: 600 }}>{s}</span>
            </React.Fragment>
          ))}
          ?
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
    </div>
  )
}

export default EmptyState
