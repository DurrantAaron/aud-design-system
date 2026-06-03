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
    },
  },
}

module.exports = preset
