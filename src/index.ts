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

// --- UI primitives (consume the design tokens) ---
export { AudButton } from './components/AudButton'
export type { AudButtonProps, AudButtonVariant, AudButtonSize } from './components/AudButton'

export { StatusChip } from './components/StatusChip'
export type { StatusChipProps, StatusChipVariant, StatusName } from './components/StatusChip'

export { EmptyState } from './components/EmptyState'
export type { EmptyStateProps, EmptyStateAction } from './components/EmptyState'

export { PoweredByAud } from './components/PoweredByAud'
export type { PoweredByAudProps } from './components/PoweredByAud'

export { AuditorWordmark } from './components/AuditorWordmark'
export type { AuditorWordmarkProps } from './components/AuditorWordmark'

export { SplashScreen } from './components/SplashScreen'
export type { SplashScreenProps, SplashAction } from './components/SplashScreen'

export { AppMark } from './components/AppMark'
export type { AppMarkProps } from './components/AppMark'

export { EditorialSplash, MsLogo, EDITORIAL_FIELD_CLASS } from './components/EditorialSplash'
export type { EditorialSplashProps, EditorialFamily } from './components/EditorialSplash'

export { WordmarkSplash } from './components/WordmarkSplash'
export type { WordmarkSplashProps } from './components/WordmarkSplash'

export {
  DuotoneSplash,
  DUOTONE_FIELD_CLASS,
  duotoneFieldInputClass,
} from './components/DuotoneSplash'
export type { DuotoneSplashProps, DuotoneMeta } from './components/DuotoneSplash'

export { DuotoneMissionControl } from './components/DuotoneMissionControl'
export type {
  DuotoneMissionControlProps,
  MissionControlOps,
  MissionControlApp,
} from './components/DuotoneMissionControl'

// The OS-style hub. Its App/Ops shapes mirror the ones above, so only the
// component + its own Props type are re-exported (avoids a duplicate-name clash).
export { MissionControlHub } from './components/MissionControlHub'
export type { MissionControlHubProps } from './components/MissionControlHub'

// EditorialMissionControl reuses the shared MissionControlOps / MissionControlApp
// shapes already exported above, so only its own component + props are re-exported.
export { EditorialMissionControl } from './components/EditorialMissionControl'
export type { EditorialMissionControlProps } from './components/EditorialMissionControl'

export { FamilyProvider, useFamily } from './components/FamilyProvider'
export type { FamilyProviderProps, FamilyContextValue } from './components/FamilyProvider'

export {
  accents,
  neutrals,
  semantic,
  fonts,
} from './tokens'
export type { AccentName, SemanticName } from './tokens'

export { familyPresets, reservedAccent } from './families'
export type { FamilyKey, FamilyPreset } from './families'

// PWA helper: keep an installed (Home Screen / standalone) app on the latest
// deploy automatically — no remove/re-add of the icon needed.
export { startAutoUpdate } from './autoUpdate'
export type { AutoUpdateOptions } from './autoUpdate'
