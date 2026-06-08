import React, { useState } from 'react'

const BODY_FONT = "var(--aud-font-body, 'Barlow', 'Inter', system-ui, sans-serif)"

export interface AudInputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  /** Label rendered above the field. */
  label?: React.ReactNode
  /** Quiet helper text below the field. Hidden when `error` or `warning` is set. */
  hint?: React.ReactNode
  /** Error message — turns the border danger and shows the message below. Takes precedence over `warning`. */
  error?: React.ReactNode
  /** Warning message — turns the border warning and shows the message below. */
  warning?: React.ReactNode
  /** Icon inside the field, leading edge (sized to the text). */
  leadingIcon?: React.ReactNode
  /** Icon inside the field, trailing edge (e.g. a clear/reveal button). */
  trailingIcon?: React.ReactNode
  /** Render a `<textarea>` instead of an `<input>`. */
  multiline?: boolean
  /** Textarea row count (only with `multiline`). Defaults to 3. */
  rows?: number
}

/**
 * The suite text field. Always renders at ≥16px so iOS Safari never zooms on
 * focus. Focus shows the accent ring (the `--aud-ring` token) + an accent
 * border; `error` flips it danger, `warning` flips it warning, with the message
 * rendered below. All native input attributes pass straight through
 * (`type`, `inputMode`, `enterKeyHint`, `autoComplete`, …).
 *
 * Focus state is driven by component state, so it is SSR-safe and injects no
 * global CSS. Sharp corners (the `--aud-radius` token).
 *
 * ```tsx
 * <AudInput label="Email" type="email" inputMode="email" enterKeyHint="next" />
 * <AudInput label="PIN" error="Wrong code" inputMode="numeric" />
 * <AudInput label="Notes" multiline rows={4} hint="Optional" />
 * ```
 */
export function AudInput({
  label,
  hint,
  error,
  warning,
  leadingIcon,
  trailingIcon,
  multiline = false,
  rows = 3,
  id,
  disabled,
  style,
  onFocus,
  onBlur,
  ...rest
}: AudInputProps) {
  const [focus, setFocus] = useState(false)

  // error wins over warning wins over focus for the border colour.
  const borderColor = error
    ? 'var(--aud-danger, #B14C3A)'
    : warning
      ? 'var(--aud-warning, #B5832E)'
      : focus
        ? 'var(--aud-accent, #C8A84B)'
        : 'var(--aud-rule, #D8D4CC)'

  const ring = focus && !disabled ? 'var(--aud-ring, 0 0 0 3px rgba(200,168,75,0.35))' : 'none'

  // Link label/message to the field; React.useId is SSR-safe.
  const reactId = React.useId()
  const fieldId = id ?? `aud-input-${reactId}`
  const messageId = `${fieldId}-msg`
  const message = error ?? warning ?? null
  const describedBy = message != null ? messageId : undefined

  const fieldStyle: React.CSSProperties = {
    flex: 1,
    width: '100%',
    minWidth: 0,
    background: 'transparent',
    border: 'none',
    outline: 'none',
    color: 'var(--aud-ink, #14130F)',
    fontFamily: BODY_FONT,
    fontSize: 'max(16px, 1rem)',
    lineHeight: 1.4,
    padding: 0,
    margin: 0,
    resize: multiline ? 'vertical' : undefined,
    ...style,
  }

  const sharedProps = {
    id: fieldId,
    disabled,
    'aria-invalid': error ? true : undefined,
    'aria-describedby': describedBy,
    onFocus: (e: React.FocusEvent<HTMLInputElement & HTMLTextAreaElement>) => {
      setFocus(true)
      ;(onFocus as ((e: React.FocusEvent<HTMLInputElement & HTMLTextAreaElement>) => void) | undefined)?.(e)
    },
    onBlur: (e: React.FocusEvent<HTMLInputElement & HTMLTextAreaElement>) => {
      setFocus(false)
      ;(onBlur as ((e: React.FocusEvent<HTMLInputElement & HTMLTextAreaElement>) => void) | undefined)?.(e)
    },
    style: fieldStyle,
  }

  return (
    <div
      style={{
        display: 'flex',
        flexDirection: 'column',
        gap: 4,
        fontFamily: BODY_FONT,
        opacity: disabled ? 'var(--aud-disabled-opacity, 0.45)' : 1,
      }}
    >
      {label != null && (
        <label
          htmlFor={fieldId}
          style={{
            fontSize: '0.8125rem',
            fontWeight: 600,
            color: 'var(--aud-ink, #14130F)',
          }}
        >
          {label}
        </label>
      )}

      <div
        style={{
          display: 'flex',
          alignItems: multiline ? 'flex-start' : 'center',
          gap: 8,
          padding: multiline ? '10px 12px' : '8px 12px',
          background: 'var(--aud-surface, #FAFAF8)',
          border: `1px solid ${borderColor}`,
          borderRadius: 'var(--aud-radius, 4px)',
          boxShadow: ring,
          transition:
            'border-color var(--aud-duration-fast, 120ms) var(--aud-ease-snap, cubic-bezier(0.2,0,0,1)), box-shadow var(--aud-duration-fast, 120ms) var(--aud-ease-snap, cubic-bezier(0.2,0,0,1))',
        }}
      >
        {leadingIcon != null && (
          <span aria-hidden="true" style={{ display: 'inline-flex', flex: 'none', color: 'var(--aud-mid, #6B6960)' }}>
            {leadingIcon}
          </span>
        )}

        {multiline ? (
          <textarea rows={rows} {...sharedProps} {...(rest as React.TextareaHTMLAttributes<HTMLTextAreaElement>)} />
        ) : (
          <input {...sharedProps} {...rest} />
        )}

        {trailingIcon != null && (
          <span aria-hidden="true" style={{ display: 'inline-flex', flex: 'none', color: 'var(--aud-mid, #6B6960)' }}>
            {trailingIcon}
          </span>
        )}
      </div>

      {message != null ? (
        <span
          id={messageId}
          style={{
            fontSize: '0.75rem',
            lineHeight: 1.4,
            color: error ? 'var(--aud-danger, #B14C3A)' : 'var(--aud-warning, #B5832E)',
          }}
        >
          {message}
        </span>
      ) : (
        hint != null && (
          <span style={{ fontSize: '0.75rem', lineHeight: 1.4, color: 'var(--aud-mid, #6B6960)' }}>
            {hint}
          </span>
        )
      )}
    </div>
  )
}

export default AudInput
