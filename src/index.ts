/**
 * @aud/brand — the AuD maker's-mark design system.
 *
 * Components render with self-contained inline styles, so they work in any
 * React app (Tailwind optional). For the brand fonts and the token variables,
 * import the CSS once in your app entry:
 *
 *   import '@aud/brand/fonts.css'
 *   import '@aud/brand/tokens.css'
 *
 * Then set your app's accent:  :root { --aud-accent: var(--aud-steel); }
 */
export { AudMark } from './components/AudMark'
export type { AudMarkProps } from './components/AudMark'

export { PoweredByAud } from './components/PoweredByAud'
export type { PoweredByAudProps } from './components/PoweredByAud'

export { AuditorWordmark } from './components/AuditorWordmark'
export type { AuditorWordmarkProps } from './components/AuditorWordmark'

export { SplashScreen } from './components/SplashScreen'
export type { SplashScreenProps, SplashAction } from './components/SplashScreen'

export { AppMark } from './components/AppMark'
export type { AppMarkProps } from './components/AppMark'

export {
  accents,
  neutrals,
  fonts,
} from './tokens'
export type { AccentName } from './tokens'
