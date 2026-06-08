/**
 * AuD Tailwind preset.
 *
 * Usage in a consuming app's tailwind.config.js:
 *
 *   import audPreset from '@aud/brand/tailwind-preset'
 *   export default { presets: [audPreset], content: [...] }
 *
 * Also import the CSS once (so the custom properties + @font-face exist):
 *   import '@aud/brand/tokens.css'
 *   import '@aud/brand/fonts.css'
 *
 * Neutrals resolve through CSS variables, so a single `data-theme="dark"`
 * (or system dark) flips the whole palette with no Tailwind reconfig.
 * The five accents are exposed as fixed colours; `aud-accent` is the moving
 * one (var-backed) that each app points at its chosen accent.
 */
const preset = {
  theme: {
    extend: {
      colors: {
        // Neutrals — var-backed so themes flip for free.
        'aud-ground': 'var(--aud-ground)',
        'aud-surface': 'var(--aud-surface)',
        'aud-ink': 'var(--aud-ink)',
        'aud-mid': 'var(--aud-mid)',
        'aud-rule': 'var(--aud-rule)',
        // The moving accent (defaults to brass; override --aud-accent per app).
        'aud-accent': 'var(--aud-accent)',
        // The five fixed accents (constant hexes).
        'aud-brass': '#C8A84B',
        'aud-clay': '#C26B52',
        'aud-steel': '#5E7C93',
        'aud-sage': '#7C8A5C',
        'aud-eucalypt': '#4F8A80',
        // Semantic status colours — var-backed so they flip with the theme.
        // base / -fg (text on tint) / -tint (chip fill). Meaning, not decoration.
        'aud-success': 'var(--aud-success)',
        'aud-success-fg': 'var(--aud-success-fg)',
        'aud-success-tint': 'var(--aud-success-tint)',
        'aud-warning': 'var(--aud-warning)',
        'aud-warning-fg': 'var(--aud-warning-fg)',
        'aud-warning-tint': 'var(--aud-warning-tint)',
        'aud-danger': 'var(--aud-danger)',
        'aud-danger-fg': 'var(--aud-danger-fg)',
        'aud-danger-tint': 'var(--aud-danger-tint)',
        'aud-info': 'var(--aud-info)',
        'aud-info-fg': 'var(--aud-info-fg)',
        'aud-info-tint': 'var(--aud-info-tint)',
      },
      fontFamily: {
        'aud-display': ['Bebas Neue', 'Oswald', 'Anton', 'Arial Narrow', 'sans-serif'],
        'aud-heading': ['Barlow Condensed', 'Oswald', 'Arial Narrow', 'sans-serif'],
        'aud-body': ['Barlow', 'Inter', 'system-ui', 'sans-serif'],
        'aud-mono': ['Share Tech Mono', 'DM Mono', 'ui-monospace', 'monospace'],
        // The mark's own scoped family — never repointed by app globals.
        'aud-mark': ['AuD-Bebas', 'Bebas Neue', 'Oswald', 'Arial Narrow', 'sans-serif'],
      },
      fontSize: {
        'aud-xs': '0.6875rem',
        'aud-sm': '0.8125rem',
        'aud-xl': '1.75rem',
        'aud-2xl': '2.5rem',
        'aud-3xl': '4rem',
      },
      letterSpacing: {
        'aud-label': '0.2em',
        'aud-wide': '0.3em',
        'aud-mark': '-0.02em',
        // Display tightening — pair with leading-aud-tight on large text.
        'aud-tight': '-0.025em',
      },
      lineHeight: {
        'aud-tight': '1.1',
        'aud-body': '1.5',
      },
      borderRadius: {
        'aud-sm': '2px',
        'aud': '4px',
        'aud-lg': '6px',
      },
      borderWidth: {
        'aud-hairline': '1px',
      },
      boxShadow: {
        // Restrained, warm-tinted elevation; floating UI casts more than cards.
        'aud-sm': '0 1px 2px rgba(20, 19, 15, 0.06)',
        'aud': '0 2px 8px rgba(20, 19, 15, 0.08)',
        'aud-lg': '0 8px 24px rgba(20, 19, 15, 0.12)',
        'aud-overlay': '0 12px 40px rgba(20, 19, 15, 0.18)',
        // Accent-tinted focus ring — inherits each app's --aud-accent.
        'aud-ring': '0 0 0 3px color-mix(in srgb, var(--aud-accent) 35%, transparent)',
      },
      backgroundImage: {
        // Scrim for legible text over imagery (fail photos, share burn-in).
        'aud-scrim':
          'linear-gradient(to top, rgba(20,19,15,0.85) 0%, rgba(20,19,15,0.45) 35%, rgba(20,19,15,0) 70%)',
      },
    },
  },
}

module.exports = preset
