/**
 * The AuD family model — function-grouped app families.
 *
 * Family is the unit of visual identity: each family owns ONE of the five
 * {@link accents} and a base light/dark mode. Apps in a family share one login
 * splash scaffold; only the mark + title move. See the design spec under
 * `reference/originals/aud-family-model-splash-spec.md`.
 *
 * Single source of truth for the presets — `<FamilyProvider>` reads from here,
 * and apps can read `familyPresets[family]` directly for raw accent/mode values.
 */
import { accents } from './tokens'
import type { AccentName } from './tokens'

/** The four function families. Eucalypt is held in reserve for a 5th. */
export type FamilyKey = 'audits' | 'dashboards' | 'registers' | 'logs'

export interface FamilyPreset {
  /** Display name — used for eyebrows/labels. Never a venue/operator name. */
  name: string
  /** Which of the five accents this family owns. */
  accentName: AccentName
  /** The accent hex (mirrors `accents[accentName]`). */
  accent: string
  /** The CSS custom-property reference, for assigning to `--aud-accent`. */
  accentVar: string
  /** Base mode — tracks work context (field/day = light, control-room/night = dark). */
  mode: 'light' | 'dark'
}

/**
 * The four family presets as tokens. Mode tracks work context, not aesthetics:
 * field/daytime families are light, control-room/night families are dark.
 */
export const familyPresets: Record<FamilyKey, FamilyPreset> = {
  audits: {
    name: 'Audits',
    accentName: 'brass',
    accent: accents.brass,
    accentVar: 'var(--aud-brass)',
    mode: 'light',
  },
  dashboards: {
    name: 'Dashboards',
    accentName: 'steel',
    accent: accents.steel,
    accentVar: 'var(--aud-steel)',
    mode: 'dark',
  },
  registers: {
    name: 'Registers',
    accentName: 'clay',
    accent: accents.clay,
    accentVar: 'var(--aud-clay)',
    mode: 'light',
  },
  logs: {
    name: 'Logs & Trackers',
    accentName: 'sage',
    accent: accents.sage,
    accentVar: 'var(--aud-sage)',
    mode: 'dark',
  },
}

/** The accent held in reserve for a future 5th family. */
export const reservedAccent: AccentName = 'eucalypt'
