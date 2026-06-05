import React, { createContext, useContext } from 'react'
import { familyPresets } from '../families'
import type { FamilyKey, FamilyPreset } from '../families'

/** The resolved family in context: the preset plus the key and active mode. */
export interface FamilyContextValue extends FamilyPreset {
  key: FamilyKey
}

const FamilyContext = createContext<FamilyContextValue | null>(null)

/**
 * Read the nearest {@link FamilyProvider}'s preset (accent + mode). Returns
 * `null` outside a provider, so consumers can fall back to their own defaults.
 */
export function useFamily(): FamilyContextValue | null {
  return useContext(FamilyContext)
}

export interface FamilyProviderProps extends React.HTMLAttributes<HTMLDivElement> {
  /** Which function family this subtree belongs to. */
  family: FamilyKey
  /**
   * Override the family's base mode. Defaults to the preset's mode (field/day
   * families are light, control-room/night families are dark).
   */
  mode?: 'light' | 'dark'
  children?: React.ReactNode
}

/**
 * Sets the family's accent and theme for everything inside it — from one family
 * key. Renders a wrapper `<div>` that assigns `--aud-accent` (so the mark, the
 * badge and any accent-keyed CSS follow) and `data-theme` (so `tokens.css`
 * swaps the neutral palette). Components that read `--aud-accent` or the
 * `useFamily()` context — like `<SplashScreen>` — pick up the family with no
 * further wiring.
 *
 * ```tsx
 * <FamilyProvider family="audits">
 *   <SplashScreen mark={<AppMark><ClipboardCheck/></AppMark>} title="Venue Audit" … />
 * </FamilyProvider>
 * ```
 */
export function FamilyProvider({
  family,
  mode,
  style,
  children,
  ...rest
}: FamilyProviderProps) {
  const preset = familyPresets[family]
  const resolvedMode = mode ?? preset.mode

  const value: FamilyContextValue = { key: family, ...preset, mode: resolvedMode }

  // Assign the family accent as the moving --aud-accent for this subtree.
  const accentVar = { '--aud-accent': preset.accentVar } as React.CSSProperties

  return (
    <FamilyContext.Provider value={value}>
      <div
        data-theme={resolvedMode}
        data-aud-family={family}
        style={{ ...accentVar, ...style }}
        {...rest}
      >
        {children}
      </div>
    </FamilyContext.Provider>
  )
}

export default FamilyProvider
