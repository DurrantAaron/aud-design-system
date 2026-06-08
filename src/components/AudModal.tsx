import React, { useEffect } from 'react'
import { AudButton } from './AudButton'

const HEADING_FONT = "var(--aud-font-heading, 'Barlow Condensed', 'Oswald', 'Arial Narrow', sans-serif)"
const BODY_FONT = "var(--aud-font-body, 'Barlow', 'Inter', system-ui, sans-serif)"

export interface ModalAction {
  label: React.ReactNode
  onClick?: () => void
  loading?: boolean
}

export interface AudModalProps extends Omit<React.HTMLAttributes<HTMLDivElement>, 'title'> {
  /** Drives mount/unmount — renders `null` when false. */
  open: boolean
  /** Called on Esc, backdrop click (if enabled), or the ✕ button. */
  onClose: () => void
  title?: React.ReactNode
  description?: React.ReactNode
  children?: React.ReactNode
  /** Bottom-right safe / non-destructive action — a `primary` AudButton. */
  primaryAction?: ModalAction
  /** Bottom-right quiet action — a `ghost` AudButton. */
  secondaryAction?: ModalAction
  /** Dismiss when the backdrop (not the panel) is clicked. Default true. */
  closeOnBackdrop?: boolean
  /** Panel max-width: sm 360 · md 480 · lg 640. Default md. */
  size?: 'sm' | 'md' | 'lg'
}

const SIZES: Record<NonNullable<AudModalProps['size']>, number> = {
  sm: 360,
  md: 480,
  lg: 640,
}

const MODAL_CSS =
  '@keyframes aud-modal-backdrop{from{opacity:0}to{opacity:1}}' +
  '@keyframes aud-modal-panel{from{opacity:0;transform:scale(0.96)}to{opacity:1;transform:none}}'

/**
 * The suite modal — a centred dialog over a fading ink backdrop. The panel
 * scales + fades in on the spring easing token; Esc and (optionally) a backdrop
 * click both close it. The footer pins its actions bottom-RIGHT, where the
 * PRIMARY button is the safe / non-destructive choice.
 *
 * Renders `null` when `!open`. SSR-safe: the keydown listener only attaches on
 * the client. Honours reduced motion via the global `.aud-motion` rule.
 *
 * ```tsx
 * <AudModal
 *   open={open}
 *   onClose={() => setOpen(false)}
 *   title="Discard changes?"
 *   description="Your edits to this audit haven't been saved."
 *   primaryAction={{ label: 'Keep editing', onClick: () => setOpen(false) }}
 *   secondaryAction={{ label: 'Discard', onClick: discard }}
 * >
 *   <p>Anything you typed will be lost.</p>
 * </AudModal>
 * ```
 */
export function AudModal({
  open,
  onClose,
  title,
  description,
  children,
  primaryAction,
  secondaryAction,
  closeOnBackdrop = true,
  size = 'md',
  style,
  ...rest
}: AudModalProps) {
  useEffect(() => {
    if (!open || typeof document === 'undefined') return
    const onKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose()
    }
    document.addEventListener('keydown', onKeyDown)
    return () => document.removeEventListener('keydown', onKeyDown)
  }, [open, onClose])

  if (!open) return null

  return (
    <div
      className="aud-motion"
      role="presentation"
      onClick={closeOnBackdrop ? onClose : undefined}
      style={{
        position: 'fixed',
        inset: 0,
        zIndex: 1000,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        padding: 24,
        background: 'var(--aud-overlay-scrim, rgba(20,19,15,0.55))',
        fontFamily: BODY_FONT,
        animation: 'aud-modal-backdrop var(--aud-duration, 200ms) var(--aud-ease-smooth, cubic-bezier(0.4,0,0.2,1)) both',
      }}
    >
      <style>{MODAL_CSS}</style>

      <div
        role="dialog"
        aria-modal="true"
        className="aud-motion"
        onClick={(e) => e.stopPropagation()}
        style={{
          position: 'relative',
          display: 'flex',
          flexDirection: 'column',
          width: '100%',
          maxWidth: SIZES[size],
          maxHeight: '90dvh',
          background: 'var(--aud-surface, #FAFAF8)',
          color: 'var(--aud-ink, #14130F)',
          border: '1px solid var(--aud-rule, #D8D4CC)',
          borderRadius: 'var(--aud-radius-lg, 6px)',
          boxShadow: 'var(--aud-shadow-overlay, 0 12px 40px rgba(20,19,15,0.18))',
          animation: 'aud-modal-panel var(--aud-duration, 200ms) var(--aud-ease-spring, cubic-bezier(0.34,1.56,0.64,1)) both',
          ...style,
        }}
        {...rest}
      >
        {(title || description) && (
          <div
            style={{
              flex: 'none',
              display: 'flex',
              alignItems: 'flex-start',
              gap: 12,
              padding: '18px 20px 14px',
            }}
          >
            <div style={{ flex: 1, minWidth: 0 }}>
              {title && (
                <h2
                  style={{
                    margin: 0,
                    fontFamily: HEADING_FONT,
                    fontWeight: 600,
                    fontSize: '1.25rem',
                    lineHeight: 1.2,
                    letterSpacing: '0.01em',
                    color: 'var(--aud-ink, #14130F)',
                  }}
                >
                  {title}
                </h2>
              )}
              {description && (
                <p
                  style={{
                    margin: title ? '6px 0 0' : 0,
                    fontSize: '0.875rem',
                    lineHeight: 1.45,
                    color: 'var(--aud-mid, #6B6960)',
                  }}
                >
                  {description}
                </p>
              )}
            </div>

            <button
              type="button"
              onClick={onClose}
              aria-label="Close"
              style={{
                flex: 'none',
                marginTop: -2,
                marginRight: -4,
                background: 'transparent',
                border: 'none',
                padding: 4,
                cursor: 'pointer',
                color: 'var(--aud-mid, #6B6960)',
                display: 'flex',
                lineHeight: 0,
                borderRadius: 'var(--aud-radius, 4px)',
              }}
            >
              <svg width="16" height="16" viewBox="0 0 16 16" aria-hidden="true">
                <path d="M4 4l8 8M12 4l-8 8" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" />
              </svg>
            </button>
          </div>
        )}

        {children != null && (
          <div
            style={{
              flex: '1 1 auto',
              overflowY: 'auto',
              maxHeight: '70dvh',
              padding: title || description ? '0 20px 4px' : '20px 20px 4px',
              fontSize: '0.875rem',
              lineHeight: 1.5,
              color: 'var(--aud-ink, #14130F)',
            }}
          >
            {children}
          </div>
        )}

        {(primaryAction || secondaryAction) && (
          <div
            style={{
              flex: 'none',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'flex-end',
              gap: 8,
              padding: '14px 20px 18px',
            }}
          >
            {secondaryAction && (
              <AudButton
                variant="ghost"
                onClick={secondaryAction.onClick}
                loading={secondaryAction.loading}
              >
                {secondaryAction.label}
              </AudButton>
            )}
            {primaryAction && (
              <AudButton
                variant="primary"
                onClick={primaryAction.onClick}
                loading={primaryAction.loading}
              >
                {primaryAction.label}
              </AudButton>
            )}
          </div>
        )}
      </div>
    </div>
  )
}

export default AudModal
