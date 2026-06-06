import React, { useId, useLayoutEffect, useRef, useState } from 'react'
import type { SplashAction } from './SplashScreen'
import { useFamily } from './FamilyProvider'

/**
 * ─── FONT REQUIREMENT ──────────────────────────────────────────────────────
 * EditorialSplash is set in **Fraunces** (display + masthead) and **Newsreader**
 * (body + actions). Unlike the rest of `@aud/brand` (which uses the self-hosted
 * Barlow/Bebas families), this concept needs these two serif faces. The
 * component injects the Google Fonts `<link>` ONCE per document (deduped by id),
 * so a consumer needs no extra setup. If you self-host instead, the families it
 * expects are `'Fraunces'` and `'Newsreader'`.
 *
 * Loaded sheet:
 *   https://fonts.googleapis.com/css2?family=Fraunces:ital,opsz,wght@…&family=Newsreader:ital,opsz,wght@…
 * ───────────────────────────────────────────────────────────────────────────
 */
const FONTS_LINK_ID = 'aud-editorial-fonts'
const FONTS_HREF =
  'https://fonts.googleapis.com/css2?family=Fraunces:ital,opsz,wght@0,9..144,300;0,9..144,400;0,9..144,500;0,9..144,600;0,9..144,700;1,9..144,400;1,9..144,500;1,9..144,600&family=Newsreader:ital,opsz,wght@0,6..72,400;0,6..72,500;1,6..72,400;1,6..72,500&display=swap'

/** The four function families, each carrying its own editorial ink. */
export type EditorialFamily = 'audits' | 'dashboards' | 'registers' | 'logs'

/** A tuned ink palette for one family in one theme. */
interface InkPalette {
  /** The live accent (rules, pips, seal glyph on dark). */
  accent: string
  /** A deeper variant — small caps / the italic title line on light. */
  deep: string
  /** A pale wash used in the embossed seal gradient. */
  tint: string
  /** Foreground colour used on the primary CTA slab. */
  onCta: string
  /** Optional glow behind the dark italic title line. */
  glow?: string
}

/**
 * Per-family editorial ink, tuned per theme — ported verbatim from the
 * `final-editorial.html` prototype's `ACCENTS` map. audits = warm gold,
 * dashboards = teal, registers = terracotta/coral, logs = deep green.
 */
const INKS: Record<EditorialFamily, { light: InkPalette; dark: InkPalette }> = {
  audits: {
    light: { accent: '#9C6B1E', deep: '#6E4A12', tint: '#EBDCBF', onCta: '#E9C77E' },
    dark: { accent: '#D6A24B', deep: '#E0AE5C', tint: '#2E2516', onCta: '#211B11', glow: 'rgba(214,162,75,.34)' },
  },
  dashboards: {
    light: { accent: '#2E7D78', deep: '#1E5C58', tint: '#CBE2DF', onCta: '#7CC4BE' },
    dark: { accent: '#5BB3AC', deep: '#6CC0B9', tint: '#15211F', onCta: '#0F1817', glow: 'rgba(91,179,172,.32)' },
  },
  registers: {
    light: { accent: '#B45B3E', deep: '#8A3F26', tint: '#EFD3C6', onCta: '#E8A287' },
    dark: { accent: '#D87B5B', deep: '#E08A6B', tint: '#2E1E17', onCta: '#211410', glow: 'rgba(216,123,91,.34)' },
  },
  logs: {
    light: { accent: '#3F7A55', deep: '#2A5B3C', tint: '#CFE0D2', onCta: '#7FBE96' },
    dark: { accent: '#6FB089', deep: '#7FBE96', tint: '#16251C', onCta: '#0F1813', glow: 'rgba(111,176,137,.32)' },
  },
}

/** The warm-ivory / ink-edition neutral chrome — shared across all families. */
const PAPER = {
  light: {
    paper: '#F4EEE2',
    paper2: '#EBE2D0',
    ink: '#1B1712',
    inkSoft: '#473F35',
    inkFaint: '#726755',
    rule: '#CDC2AB',
    ruleSoft: '#DCD1BD',
    ctaTop: '#322817',
    cta: '#221C13',
    cta2: '#191309',
    onCta: '#F8F2E6',
    grain: 'rgba(120,100,70,.06)',
    grainOp: '.5',
    grainBlend: 'multiply',
    vignette: 'rgba(58,44,22,.11)',
    sealHi: '#FBF6EC',
    sealLo: '#EBE2D0',
    behind: '#241E15',
  },
  dark: {
    paper: '#1E1A14',
    paper2: '#171410',
    ink: '#F2EAD9',
    inkSoft: '#C8BCA6',
    inkFaint: '#948871',
    rule: '#473F31',
    ruleSoft: '#352E24',
    ctaTop: '#F4EEDF',
    cta: '#EEE6D3',
    cta2: '#E2D7BE',
    onCta: '#211B11',
    grain: 'rgba(255,238,200,.05)',
    grainOp: '.6',
    grainBlend: 'screen',
    vignette: 'rgba(0,0,0,.5)',
    sealHi: '#2B251C',
    sealLo: '#15120D',
    behind: '#0E0C08',
  },
} as const

export interface EditorialSplashProps
  extends Omit<React.HTMLAttributes<HTMLDivElement>, 'title'> {
  /**
   * The app name — set as the dramatic display title. A multi-word name renders
   * as a two-line lockup (roman first part + italic accent last word), matching
   * the prototype's "Venue / Audit" treatment; a single word renders as one
   * auto-fit line. The title is measured and auto-fit (see {@link titleMax}).
   */
  appName: string
  /** The kicker eyebrow above the title (e.g. "Audits"). Rendered upper-cased. */
  category: string
  /** The standfirst paragraph under the title. Plain text — no HTML injection. */
  description?: React.ReactNode
  /**
   * Which function family the splash belongs to — selects the ink palette.
   * Falls back to the enclosing `<FamilyProvider>`, then "audits".
   */
  family?: EditorialFamily
  /**
   * Override the accent ink directly (the live accent for rules/pips/seal).
   * Use sparingly — the per-family ink is the intended path. When set, only the
   * live accent moves; the deep/tint/onCta stay on the family ink.
   */
  accent?: string
  /**
   * "light" (warm-ivory paper) or "dark" (the ink edition). Falls back to the
   * enclosing `<FamilyProvider>`'s mode, then "light".
   */
  theme?: 'light' | 'dark'
  /**
   * The seal glyph — the app's own icon node, drawn with `currentColor`. Sized
   * to 24px inside the embossed medallion. When omitted, the seal renders empty
   * (still embossed), so the lockup never breaks.
   */
  mark?: React.ReactNode
  /** Primary call to action — the embossed CTA slab. */
  primary: SplashAction
  /** Optional secondary action — the quiet "Enter with …" editorial link. */
  secondary?: SplashAction
  /**
   * Footer node, rendered in the colophon's right slot (replaces the default
   * "SECURE" mark). Pass `null` to hide the right slot. The left "Published by
   * AuD" maker's mark is always present.
   */
  footer?: React.ReactNode
  /** The masthead's right-hand issue marker (e.g. "No.01"). */
  issueNo?: React.ReactNode
  /** The masthead's centred provenance line. Defaults to "MADE IN AUSTRALIA". */
  provenance?: React.ReactNode
  /** Left byline term (e.g. "Volume I"). Shown only with {@link edition}. */
  volume?: React.ReactNode
  /** Right byline term (e.g. "Field Edition"). Shown only with {@link volume}. */
  edition?: React.ReactNode
  /** Dramatic ceiling for the auto-fit title, in px. Default 88. */
  titleMax?: number
  /** Legible floor for the auto-fit title, in px. Default 30. */
  titleMin?: number
  /**
   * The app's own field(s) — e.g. a CODE/PIN `<input>` for the suite's
   * passcode-authenticated apps. Rendered inside an editorially-styled field
   * slot (a fine-ruled input area). A plain `<input>` (and `<select>` /
   * `<textarea>`) passed in here inherits the on-brand styling automatically;
   * see {@link EDITORIAL_FIELD_CLASS} to opt a specific element in explicitly.
   * When omitted, the splash renders exactly as before — actions-only.
   */
  children?: React.ReactNode
  /**
   * Render `children` (the field slot) ABOVE the primary action, for CODE/PIN
   * apps where the input comes first. Default false — OAuth-first, the CTA slab
   * stays on top and the field slot sits below the actions (like the base
   * `SplashScreen`).
   */
  formMode?: boolean
  /** Alias for {@link EditorialSplashProps.formMode}. */
  actionsLast?: boolean
}

/**
 * Stable, documented class an app can put on its own input so it picks up the
 * editorial field styling explicitly. (Any plain `<input>` / `<select>` /
 * `<textarea>` inside the field slot already inherits the styling without it —
 * this is the opt-in escape hatch for wrapped or custom-className inputs.)
 *
 * ```tsx
 * import { EditorialSplash, EDITORIAL_FIELD_CLASS } from '@aud/brand'
 *
 * <EditorialSplash …formMode primary={…}>
 *   <input className={EDITORIAL_FIELD_CLASS} inputMode="numeric"
 *          placeholder="Team passcode" />
 * </EditorialSplash>
 * ```
 */
export const EDITORIAL_FIELD_CLASS = 'aud-editorial-field'

const TITLE_SAFETY = 0.985 // lines must use <= 98.5% of available width
const FIT_PRECISION = 0.25 // px — binary search convergence

/** Microsoft mark, kept here so the prototype's default CTA icon survives. */
function MsLogo() {
  return (
    <svg viewBox="0 0 21 21" width="15" height="15" aria-hidden="true" style={{ display: 'block' }}>
      <rect x="1" y="1" width="9" height="9" fill="#f25022" />
      <rect x="11" y="1" width="9" height="9" fill="#7fba00" />
      <rect x="1" y="11" width="9" height="9" fill="#00a4ef" />
      <rect x="11" y="11" width="9" height="9" fill="#ffb900" />
    </svg>
  )
}

/**
 * The luxury field-journal app splash — a masthead, an embossed seal, a measured
 * auto-fit display title, a standfirst, a byline, the CTA slab + secondary link,
 * and a colophon. Set in Fraunces + Newsreader on warm-ivory paper (light) or
 * the ink edition (dark), with per-family ink. Identity-only: there is no
 * scorecard. Ported faithfully from `concepts/final-editorial.html`.
 *
 * Fonts: the component injects the Fraunces + Newsreader Google Fonts `<link>`
 * once per document — see the FONT REQUIREMENT note at the top of this file.
 *
 * ```tsx
 * import { EditorialSplash, MsLogo } from '@aud/brand'
 * import { ClipboardCheck } from 'lucide-react'
 *
 * <EditorialSplash
 *   family="audits"
 *   category="Audits"
 *   appName="Venue Audit"
 *   description="Venue inspection & scoring, recorded with the care of a field journal."
 *   mark={<ClipboardCheck />}
 *   issueNo="No.01"
 *   volume="Volume I"
 *   edition="Field Edition"
 *   primary={{ label: 'Sign in with Microsoft', onClick: signIn }}
 *   secondary={{ label: 'Enter with a team passcode', onClick: passcode }}
 * />
 * ```
 *
 * For the suite's CODE/PIN apps, pass the field(s) as `children` and set
 * `formMode` to lift them above the CTA. A plain `<input>` reads on-brand
 * automatically inside the fine-ruled field slot:
 *
 * ```tsx
 * <EditorialSplash
 *   family="audits" category="Audits" appName="Venue Audit"
 *   primary={{ label: 'Enter', onClick: submit, loading }}
 *   formMode
 * >
 *   <label htmlFor="code">Team passcode</label>
 *   <input id="code" inputMode="numeric" autoComplete="one-time-code"
 *          value={code} onChange={(e) => setCode(e.target.value)}
 *          placeholder="••••••" />
 * </EditorialSplash>
 * ```
 */
export function EditorialSplash({
  appName,
  category,
  description,
  family,
  accent,
  theme,
  mark,
  primary,
  secondary,
  footer,
  issueNo = 'No.01',
  provenance = 'MADE IN AUSTRALIA',
  volume,
  edition,
  titleMax = 88,
  titleMin = 30,
  children,
  formMode,
  actionsLast,
  style,
  ...rest
}: EditorialSplashProps) {
  // Field slot ordering mirrors the base SplashScreen: formMode / actionsLast
  // puts the app's fields ABOVE the primary action (CODE/PIN-first); otherwise
  // they sit below the actions (OAuth-first default).
  const fieldsFirst = !!(formMode || actionsLast)
  // Family + theme follow the enclosing provider when not set explicitly.
  const ctx = useFamily()
  const resolvedFamily: EditorialFamily = family ?? (ctx?.key as EditorialFamily) ?? 'audits'
  const resolvedTheme = theme ?? ctx?.mode ?? 'light'

  const ink = INKS[resolvedFamily][resolvedTheme]
  const liveAccent = accent ?? ink.accent
  const p = PAPER[resolvedTheme]
  const isDark = resolvedTheme === 'dark'

  // Two-line lockup: roman first part + italic accent last word.
  const words = appName.trim().split(/\s+/)
  const single = words.length < 2
  const line1 = single ? appName.trim() : words.slice(0, -1).join(' ')
  const line2 = single ? '' : words[words.length - 1]

  // ── Title auto-fit — measured, never guessed ──────────────────────────────
  // Mirrors the prototype's binary search: shrink the display size until BOTH
  // lines fit within the column's content box * SAFETY. Short names stay at the
  // dramatic ceiling; long words are guaranteed onto one line with no overflow.
  const displayRef = useRef<HTMLHeadingElement | null>(null)
  const [titleSize, setTitleSize] = useState(titleMax)

  useLayoutEffect(() => {
    const el = displayRef.current
    if (!el) return

    const fit = () => {
      const avail = el.clientWidth
      if (!avail) return
      const lines = el.querySelectorAll<HTMLElement>('.line1,.line2')
      const fitsAt = (px: number) => {
        el.style.setProperty('--title-size', px + 'px')
        for (const ln of lines) {
          if (ln.scrollWidth > avail * TITLE_SAFETY) return false
        }
        return true
      }
      let lo = titleMin
      let hi = titleMax
      let best = titleMin
      while (hi - lo > FIT_PRECISION) {
        const mid = (lo + hi) / 2
        if (fitsAt(mid)) {
          best = mid
          lo = mid
        } else {
          hi = mid
        }
      }
      const final = Number(best.toFixed(2))
      el.style.setProperty('--title-size', final + 'px')
      setTitleSize(final)
    }

    fit()
    // Re-fit once the serif faces have loaded (metrics shift vs. fallback).
    const fonts = (document as Document & { fonts?: FontFaceSet }).fonts
    if (fonts?.ready) fonts.ready.then(fit).catch(() => {})

    // Re-fit on viewport resize (debounced like the prototype).
    let rt: ReturnType<typeof setTimeout>
    const onResize = () => {
      clearTimeout(rt)
      rt = setTimeout(fit, 100)
    }
    window.addEventListener('resize', onResize)
    return () => {
      clearTimeout(rt)
      window.removeEventListener('resize', onResize)
    }
    // Re-run whenever the measured content or bounds change.
  }, [appName, single, titleMax, titleMin, resolvedFamily, resolvedTheme])

  // Inject the Fraunces + Newsreader sheet once per document.
  useLayoutEffect(() => {
    if (typeof document === 'undefined') return
    if (document.getElementById(FONTS_LINK_ID)) return
    const link = document.createElement('link')
    link.id = FONTS_LINK_ID
    link.rel = 'stylesheet'
    link.href = FONTS_HREF
    document.head.appendChild(link)
  }, [])

  // Scope every rule to this instance so multiple splashes / themes coexist.
  const uid = useId().replace(/[:]/g, '')
  const scope = `aud-editorial-${uid}`

  // CTA depth: warm near-black slab on light; accent-filled slab on dark.
  const ctaTop = isDark ? ink.deep : p.ctaTop
  const ctaMid = isDark ? liveAccent : p.cta
  const ctaBot = isDark ? ink.deep : p.cta2
  const onCta = isDark ? ink.onCta : p.onCta

  const fonts = "'Newsreader', Georgia, serif"
  const display = "'Fraunces', Georgia, serif"

  return (
    <div
      className={scope}
      style={{ background: p.behind, color: p.ink, fontFamily: fonts, ...style }}
      {...rest}
    >
      <style>{`
.${scope}{
  min-height:100vh;width:100%;
  display:flex;align-items:center;justify-content:center;
  -webkit-font-smoothing:antialiased;text-rendering:optimizeLegibility;
}
.${scope} *{box-sizing:border-box}
.${scope} .stage{
  position:relative;width:100%;max-width:480px;min-height:100vh;
  display:flex;flex-direction:column;
  padding:44px 30px 28px;overflow:hidden;
  background:radial-gradient(125% 80% at 50% -12%, ${p.paper} 0%, ${p.paper} 50%, ${p.paper2} 100%);
}
.${scope} .stage::before{
  content:"";position:absolute;inset:0;pointer-events:none;
  opacity:${p.grainOp};mix-blend-mode:${p.grainBlend};
  background:
    radial-gradient(1px 1px at 20% 30%, ${p.grain} 50%, transparent 51%),
    radial-gradient(1px 1px at 70% 60%, ${p.grain} 50%, transparent 51%),
    radial-gradient(1px 1px at 40% 80%, ${p.grain} 50%, transparent 51%),
    radial-gradient(1px 1px at 88% 22%, ${p.grain} 50%, transparent 51%);
  background-size:7px 7px,11px 11px,9px 9px,13px 13px;
}
.${scope} .stage::after{
  content:"";position:absolute;inset:0;pointer-events:none;
  background:radial-gradient(142% 114% at 50% 38%, transparent 56%, ${p.vignette} 100%);
}

/* ===== MASTHEAD ===== */
.${scope} .masthead{position:relative;z-index:2}
.${scope} .rule-top{height:1.4px;background:${p.ink};opacity:.9;transform-origin:left center}
.${scope} .meta{
  display:flex;align-items:center;justify-content:space-between;
  padding:7px 1px 6px;font-family:${fonts};
  font-size:9px;letter-spacing:.28em;text-transform:uppercase;color:${p.inkSoft};
}
.${scope} .meta .m-left{font-family:${display};font-weight:600;letter-spacing:.2em;color:${p.ink}}
.${scope} .meta .m-mid{letter-spacing:.32em;color:${p.inkFaint}}
.${scope} .meta .m-right{color:${ink.deep};letter-spacing:.2em;display:inline-flex;align-items:center;gap:6px}
.${scope} .meta .m-right .pip{width:3px;height:3px;border-radius:50%;background:${liveAccent};display:inline-block;opacity:.95}
.${scope} .rule-bot{height:.6px;background:${p.rule};margin-top:1px;transform-origin:left center}

/* ===== HERO ===== */
.${scope} .hero{position:relative;z-index:2;flex:1;display:flex;flex-direction:column;justify-content:center;padding:4px 0 2px}

/* the seal / identity mark — embossed medallion (light) / debossed glow (dark) */
.${scope} .seal{
  width:52px;height:52px;border-radius:50%;
  color:${isDark ? liveAccent : ink.deep};
  display:flex;align-items:center;justify-content:center;
  margin-bottom:32px;position:relative;
  background:${
    isDark
      ? `radial-gradient(circle at 50% 36%, ${p.sealHi} 0%, ${p.sealLo} 78%, ${p.sealLo} 100%)`
      : `radial-gradient(circle at 50% 34%, ${p.sealHi} 0%, ${ink.tint} 60%, ${p.sealLo} 100%)`
  };
  box-shadow:${
    isDark
      ? 'inset 0 1px 1px rgba(255,238,200,.10), inset 0 -2px 3px rgba(0,0,0,.55), 0 8px 20px -10px rgba(0,0,0,.7)'
      : 'inset 0 1px 1px rgba(255,255,255,.85), inset 0 -1.5px 2px rgba(110,74,18,.22), 0 1px 0 rgba(255,255,255,.6), 0 6px 14px -8px rgba(80,52,14,.4)'
  };
}
.${scope} .seal::before{
  content:"";position:absolute;inset:0;border-radius:50%;
  border:1.25px solid ${isDark ? liveAccent : ink.deep};
  opacity:${isDark ? '.78' : '.92'};
  ${isDark ? `box-shadow:0 0 14px -2px ${liveAccent};` : ''}
}
.${scope} .seal::after{
  content:"";position:absolute;inset:5px;border-radius:50%;
  border:.6px solid ${isDark ? liveAccent : ink.deep};
  opacity:${isDark ? '.34' : '.42'};
}
.${scope} .seal svg{width:24px;height:24px;position:relative;z-index:1;
  filter:${isDark ? 'drop-shadow(0 0 6px rgba(0,0,0,.5))' : 'drop-shadow(0 .5px 0 rgba(255,255,255,.5))'}}

.${scope} .kicker{
  font-family:${fonts};font-size:10.5px;font-weight:500;
  letter-spacing:.46em;text-transform:uppercase;
  color:${isDark ? liveAccent : ink.deep};
  display:flex;align-items:center;gap:12px;margin-bottom:18px;
}
.${scope} .kicker .tick{width:24px;height:1px;background:${isDark ? liveAccent : ink.deep};opacity:${isDark ? '.6' : '.7'};display:inline-block}

/* DISPLAY — font-size is JS-driven via --title-size (measured auto-fit) */
.${scope} .display{
  font-family:${display};font-optical-sizing:auto;color:${p.ink};
  font-weight:400;font-size:var(--title-size,${titleMax}px);
  line-height:.86;letter-spacing:-.026em;margin:0 -2px;
}
.${scope} .display .line1,.${scope} .display .line2{
  display:block;width:max-content;max-width:100%;white-space:nowrap;
}
.${scope} .display .line1{font-weight:600;letter-spacing:-.03em}
.${scope} .display .line2{
  font-style:italic;font-weight:500;
  color:${isDark ? liveAccent : ink.deep};
  letter-spacing:-.012em;margin-top:.02em;padding-bottom:.04em;
  ${isDark ? `text-shadow:0 0 22px ${ink.glow ?? 'transparent'};` : ''}
}
.${scope} .display.single .line1{letter-spacing:-.026em}

.${scope} .standfirst{
  margin-top:28px;max-width:296px;font-family:${fonts};
  font-size:17px;line-height:1.5;color:${p.inkSoft};font-weight:400;
}
.${scope} .standfirst em{font-style:italic;color:${p.ink}}

.${scope} .byline{
  margin-top:20px;display:flex;align-items:center;gap:11px;font-family:${fonts};
  font-size:9.5px;letter-spacing:.3em;text-transform:uppercase;color:${p.inkFaint};
}
.${scope} .byline .dot{width:3px;height:3px;border-radius:50%;background:${liveAccent};display:inline-block}

/* ===== FIELD SLOT — the app's CODE/PIN input, set editorially ===== */
/* A fine-ruled input area: no boxy chrome, just a hairline baseline rule that
   warms to the live accent on focus — the masthead rule language, applied to a
   form field. Plain <input>/<select>/<textarea> the app passes in inherits this. */
.${scope} .field-slot{display:flex;flex-direction:column;gap:14px}
.${scope} .field-slot.above{margin-bottom:24px}
.${scope} .field-slot.below{margin-top:22px}
.${scope} .field-slot input,
.${scope} .field-slot select,
.${scope} .field-slot textarea,
.${scope} .field-slot .${EDITORIAL_FIELD_CLASS}{
  width:100%;display:block;margin:0;appearance:none;-webkit-appearance:none;
  background:transparent;color:${p.ink};
  font-family:${fonts};font-size:17px;font-weight:400;line-height:1.5;
  letter-spacing:.01em;
  border:none;border-bottom:1px solid ${p.rule};border-radius:0;
  padding:10px 2px;outline:none;
  transition:border-color .2s ease, box-shadow .2s ease;
}
.${scope} .field-slot textarea{resize:vertical;min-height:72px}
.${scope} .field-slot input::placeholder,
.${scope} .field-slot textarea::placeholder,
.${scope} .field-slot .${EDITORIAL_FIELD_CLASS}::placeholder{
  color:${p.inkFaint};font-style:italic;opacity:1;
}
.${scope} .field-slot input:focus,
.${scope} .field-slot select:focus,
.${scope} .field-slot textarea:focus,
.${scope} .field-slot .${EDITORIAL_FIELD_CLASS}:focus{
  border-bottom-color:${isDark ? liveAccent : ink.deep};
  box-shadow:0 1px 0 0 ${isDark ? liveAccent : ink.deep};
}
.${scope} .field-slot input:disabled,
.${scope} .field-slot select:disabled,
.${scope} .field-slot textarea:disabled,
.${scope} .field-slot .${EDITORIAL_FIELD_CLASS}:disabled{opacity:.55;cursor:default}
/* a label inside the slot reads as an editorial small-caps eyebrow */
.${scope} .field-slot label{
  font-family:${fonts};font-size:9.5px;font-weight:500;
  letter-spacing:.3em;text-transform:uppercase;color:${p.inkFaint};
  margin-bottom:-6px;
}

/* ===== ACTIONS ===== */
.${scope} .foot{position:relative;z-index:2}
.${scope} .actions{display:flex;flex-direction:column;align-items:stretch;gap:0}
.${scope} .btn-primary{
  width:100%;display:flex;align-items:center;justify-content:center;gap:11px;
  padding:18px;border:none;border-radius:3px;
  background:radial-gradient(120% 180% at 50% -40%, ${ctaTop} 0%, ${ctaMid} 46%, ${ctaBot} 100%);
  color:${onCta};font-family:${fonts};
  font-size:15.5px;font-weight:500;letter-spacing:.015em;cursor:pointer;
  box-shadow:${
    isDark
      ? 'inset 0 1px 0 rgba(255,255,255,.4), inset 0 -1px 0 rgba(0,0,0,.12), 0 1px 0 rgba(0,0,0,.5), 0 16px 30px -16px rgba(0,0,0,.8)'
      : 'inset 0 1px 0 rgba(255,247,228,.16), inset 0 -1px 0 rgba(0,0,0,.35), 0 2px 1px -1px rgba(110,74,18,.18), 0 14px 26px -16px rgba(40,28,10,.62)'
  };
  transition:transform .15s ease, box-shadow .15s ease, opacity .15s ease;
}
.${scope} .btn-primary:disabled{cursor:default;opacity:.55}
.${scope} .btn-primary:not(:disabled):active{transform:translateY(1px)}
.${scope} .btn-primary .ms{display:flex}

.${scope} .secondary-wrap{text-align:center;margin-top:18px}
.${scope} .link{
  font-family:${fonts};font-size:13.5px;color:${p.inkSoft};
  letter-spacing:.01em;text-decoration:none;cursor:pointer;
  background:none;border:none;padding:0;
}
.${scope} .link:disabled{cursor:default;opacity:.55}
.${scope} .link b{font-weight:500;color:${p.ink};font-style:italic;border-bottom:1px solid ${isDark ? liveAccent : ink.deep};padding-bottom:2px}

.${scope} .colophon{
  margin-top:24px;padding-top:13px;border-top:.6px solid ${p.rule};
  display:flex;align-items:center;justify-content:space-between;font-family:${fonts};
  font-size:9px;letter-spacing:.26em;text-transform:uppercase;color:${p.inkFaint};
}
.${scope} .colophon .maker{display:flex;align-items:baseline;gap:7px;color:${p.inkSoft}}
.${scope} .colophon .maker .aud{
  font-family:${display};font-weight:600;font-size:14px;letter-spacing:.01em;
  text-transform:none;color:${p.ink};
}
.${scope} .colophon .maker .aud i{font-style:italic;font-weight:500;color:${isDark ? liveAccent : ink.deep}}
.${scope} .colophon .secure{color:${isDark ? liveAccent : ink.deep};letter-spacing:.22em;display:inline-flex;align-items:center;gap:6px}
.${scope} .colophon .secure .pip{width:3px;height:3px;border-radius:50%;background:${liveAccent};display:inline-block;opacity:.9}

/* ===== ENTRANCE — tasteful editorial settle ===== */
@media (prefers-reduced-motion:no-preference){
  .${scope} .rule-top{animation:${scope}-wipe .9s cubic-bezier(.2,.7,.2,1) both}
  .${scope} .rule-bot{animation:${scope}-wipe .9s .06s cubic-bezier(.2,.7,.2,1) both}
  .${scope} .meta{animation:${scope}-fade .7s .14s ease both}
  .${scope} .seal{animation:${scope}-rise .9s .2s cubic-bezier(.2,.75,.2,1) both}
  .${scope} .kicker{animation:${scope}-rise .8s .3s cubic-bezier(.2,.75,.2,1) both}
  .${scope} .display .line1{animation:${scope}-rise .95s .38s cubic-bezier(.16,.8,.2,1) both}
  .${scope} .display .line2{animation:${scope}-rise .95s .5s cubic-bezier(.16,.8,.2,1) both}
  .${scope} .standfirst{animation:${scope}-rise .85s .64s cubic-bezier(.2,.75,.2,1) both}
  .${scope} .byline{animation:${scope}-fade .8s .76s ease both}
  .${scope} .field-slot.above{animation:${scope}-rise .85s .8s cubic-bezier(.2,.75,.2,1) both}
  .${scope} .btn-primary{animation:${scope}-rise .85s .86s cubic-bezier(.2,.75,.2,1) both}
  .${scope} .secondary-wrap{animation:${scope}-fade .8s .98s ease both}
  .${scope} .field-slot.below{animation:${scope}-rise .85s 1s cubic-bezier(.2,.75,.2,1) both}
  .${scope} .colophon{animation:${scope}-fade .9s 1.06s ease both}
}
@keyframes ${scope}-wipe{from{transform:scaleX(0)}to{transform:scaleX(1)}}
@keyframes ${scope}-fade{from{opacity:0}to{opacity:1}}
@keyframes ${scope}-rise{from{opacity:0;transform:translateY(14px)}to{opacity:1;transform:translateY(0)}}
`}</style>

      <div className="stage">
        {/* MASTHEAD */}
        <div className="masthead">
          <div className="rule-top" />
          <div className="meta">
            <span className="m-left">AuD</span>
            <span className="m-mid">{provenance}</span>
            <span className="m-right">
              <span className="pip" />
              <span>{issueNo}</span>
            </span>
          </div>
          <div className="rule-bot" />
        </div>

        {/* HERO */}
        <div className="hero">
          <div className="seal" aria-hidden={!mark}>
            {mark}
          </div>
          <div className="kicker">
            <span className="tick" />
            <span>{typeof category === 'string' ? category.toUpperCase() : category}</span>
          </div>
          <h1
            ref={displayRef}
            className={single ? 'display single' : 'display'}
            style={{ ['--title-size' as string]: `${titleSize}px` }}
          >
            <span className="line1">{line1}</span>
            {!single && <span className="line2">{line2}</span>}
          </h1>
          {description && <p className="standfirst">{description}</p>}
          {volume && edition && (
            <div className="byline">
              <span>{volume}</span>
              <span className="dot" />
              <span>{edition}</span>
            </div>
          )}
        </div>

        {/* ACTIONS */}
        <div className="foot">
          {/* App field(s) — above the primary in formMode/actionsLast. */}
          {children != null && fieldsFirst && (
            <div className="field-slot above">{children}</div>
          )}
          <div className="actions">
            <button
              type="button"
              className="btn-primary"
              onClick={primary.onClick}
              disabled={!!primary.disabled || !!primary.loading}
            >
              <span className="ms">{primary.loading ? <Spinner color={onCta} /> : primary.icon ?? <MsLogo />}</span>
              <span>{primary.loading ? primary.loadingLabel ?? primary.label : primary.label}</span>
            </button>
          </div>
          {secondary && (
            <div className="secondary-wrap">
              <button
                type="button"
                className="link"
                onClick={secondary.onClick}
                disabled={!!secondary.disabled || !!secondary.loading}
              >
                <SecondaryLabel label={secondary.loading ? secondary.loadingLabel ?? secondary.label : secondary.label} />
              </button>
            </div>
          )}
          {/* App field(s) — below the actions by default (OAuth-first). */}
          {children != null && !fieldsFirst && (
            <div className="field-slot below">{children}</div>
          )}
          <div className="colophon">
            <span className="maker">
              Published by&nbsp;
              <span className="aud">
                A<i>u</i>D
              </span>
            </span>
            {footer !== null && (footer ?? <DefaultSecure />)}
          </div>
        </div>
      </div>
    </div>
  )
}

/**
 * The secondary editorial link. If the label contains "with", the portion after
 * it is emphasised (italic + underline) like the prototype's "Enter with a
 * **team passcode**"; otherwise the whole label is emphasised.
 */
function SecondaryLabel({ label }: { label: string }) {
  const idx = label.toLowerCase().indexOf(' with ')
  if (idx === -1) {
    return <b>{label}</b>
  }
  const head = label.slice(0, idx + 6) // include " with "
  const tail = label.slice(idx + 6)
  return (
    <>
      {head}
      <b>{tail}</b>
    </>
  )
}

/** The default colophon-right "SECURE" mark, replaced by the `footer` prop. */
function DefaultSecure() {
  return (
    <span className="secure">
      <span className="pip" />
      <span>Secure</span>
    </span>
  )
}

/** A small spinner for the CTA's loading state, in the on-CTA ink. */
function Spinner({ color }: { color: string }) {
  return (
    <svg
      width="15"
      height="15"
      viewBox="0 0 16 16"
      aria-hidden="true"
      style={{ animation: 'aud-editorial-spin 0.8s linear infinite' }}
    >
      <style>{'@keyframes aud-editorial-spin{to{transform:rotate(360deg)}}'}</style>
      <circle cx="8" cy="8" r="6.5" fill="none" stroke={color} strokeOpacity="0.25" strokeWidth="2" />
      <path d="M8 1.5a6.5 6.5 0 0 1 6.5 6.5" fill="none" stroke={color} strokeWidth="2" strokeLinecap="round" />
    </svg>
  )
}

export { MsLogo }
export default EditorialSplash
