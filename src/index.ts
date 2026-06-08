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

export { AudErrorState } from './components/AudErrorState'
export type { AudErrorStateProps, ErrorStateAction } from './components/AudErrorState'

export { AudSkeleton } from './components/AudSkeleton'
export type { AudSkeletonProps } from './components/AudSkeleton'

export { AudToast } from './components/AudToast'
export type { AudToastProps, AudToastAction } from './components/AudToast'

// --- Surfaces, inputs & data ---
export { AudCard } from './components/AudCard'
export type { AudCardProps, AudCardVariant, AudCardElevation } from './components/AudCard'

export { AudBadge } from './components/AudBadge'
export type { AudBadgeProps, AudBadgeStatus, AudBadgeSize } from './components/AudBadge'

export { AudInput } from './components/AudInput'
export type { AudInputProps } from './components/AudInput'

export { AudModal } from './components/AudModal'
export type { AudModalProps, ModalAction } from './components/AudModal'

export { AudTabs } from './components/AudTabs'
export type { AudTabsProps, TabItem } from './components/AudTabs'

export { AudTable } from './components/AudTable'
export type { AudTableProps, AudColumn } from './components/AudTable'

export { CountUp } from './components/CountUp'
export type { CountUpProps } from './components/CountUp'

// --- Mobile / iPhone-native layer (pair with @aud/brand/native.css) ---
export { BottomSheet } from './components/BottomSheet'
export type { BottomSheetProps } from './components/BottomSheet'

export { TabBar } from './components/TabBar'
export type { TabBarProps, TabBarItem } from './components/TabBar'

export { AudSwipeConfirm } from './components/AudSwipeConfirm'
export type { AudSwipeConfirmProps } from './components/AudSwipeConfirm'

export { useStandalone, useReducedMotion, useSafeArea } from './native'

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
  motion,
  chart,
} from './tokens'
export type { AccentName, SemanticName } from './tokens'

export { familyPresets, reservedAccent } from './families'
export type { FamilyKey, FamilyPreset } from './families'

// PWA helper: keep an installed (Home Screen / standalone) app on the latest
// deploy automatically — no remove/re-add of the icon needed.
export { startAutoUpdate } from './autoUpdate'
export type { AutoUpdateOptions } from './autoUpdate'
