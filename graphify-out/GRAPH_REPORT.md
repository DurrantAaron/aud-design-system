# Graph Report - aud-design-system-graphify-setup  (2026-06-08)

## Corpus Check
- 38 files · ~227,904 words
- Verdict: corpus is large enough that graph structure adds value.

## Summary
- 356 nodes · 480 edges · 23 communities (19 shown, 4 thin omitted)
- Extraction: 100% EXTRACTED · 0% INFERRED · 0% AMBIGUOUS
- Token cost: 0 input · 0 output

## Graph Freshness
- Built from commit: `7d1e481f`
- Run `git rev-parse HEAD` and compare to check if the graph is stale.
- Run `graphify update .` after code changes (no API cost).

## Community Hubs (Navigation)
- [[_COMMUNITY_Community 0|Community 0]]
- [[_COMMUNITY_Community 1|Community 1]]
- [[_COMMUNITY_Community 2|Community 2]]
- [[_COMMUNITY_Community 3|Community 3]]
- [[_COMMUNITY_Community 4|Community 4]]
- [[_COMMUNITY_Community 5|Community 5]]
- [[_COMMUNITY_Community 6|Community 6]]
- [[_COMMUNITY_Community 7|Community 7]]
- [[_COMMUNITY_Community 8|Community 8]]
- [[_COMMUNITY_Community 9|Community 9]]
- [[_COMMUNITY_Community 10|Community 10]]
- [[_COMMUNITY_Community 11|Community 11]]
- [[_COMMUNITY_Community 12|Community 12]]
- [[_COMMUNITY_Community 13|Community 13]]
- [[_COMMUNITY_Community 14|Community 14]]
- [[_COMMUNITY_Community 15|Community 15]]
- [[_COMMUNITY_Community 16|Community 16]]
- [[_COMMUNITY_Community 17|Community 17]]
- [[_COMMUNITY_Community 18|Community 18]]
- [[_COMMUNITY_Community 19|Community 19]]
- [[_COMMUNITY_Community 20|Community 20]]
- [[_COMMUNITY_Community 21|Community 21]]

## God Nodes (most connected - your core abstractions)
1. `AuD — Design System` - 17 edges
2. `FamilyKey` - 16 edges
3. `compilerOptions` - 15 edges
4. `compilerOptions` - 15 edges
5. `useTakeoverBody()` - 11 edges
6. `AuD — Brand & Design System Brief` - 11 edges
7. `exports` - 10 edges
8. `useFamily()` - 10 edges
9. `AuD — App Families & Unified Login Splash` - 10 edges
10. `EditorialMissionControl()` - 9 edges

## Surprising Connections (you probably didn't know these)
- `MissionControlApp` --references--> `FamilyKey`  [EXTRACTED]
  src/components/EditorialMissionControl.tsx → src/families.ts
- `MissionControlApp` --references--> `FamilyKey`  [EXTRACTED]
  src/components/MissionControlHub.tsx → src/families.ts
- `MissionControlApp` --references--> `FamilyKey`  [EXTRACTED]
  src/components/DuotoneMissionControl.tsx → src/families.ts
- `DuotoneSplash()` --calls--> `useFamily()`  [EXTRACTED]
  src/components/DuotoneSplash.tsx → src/components/FamilyProvider.tsx
- `DuotoneSplash()` --calls--> `useTakeoverBody()`  [EXTRACTED]
  src/components/DuotoneSplash.tsx → src/useTakeoverBody.ts

## Import Cycles
- None detected.

## Communities (23 total, 4 thin omitted)

### Community 0 - "Community 0"
Cohesion: 0.09
Nodes (34): AppMark(), AppMarkProps, AudMark(), AudMarkProps, duotoneFieldInputClass, DuotoneSplashProps, EditorialFamily, EditorialSplash() (+26 more)

### Community 1 - "Community 1"
Cohesion: 0.06
Nodes (34): author, default, description, devDependencies, @types/react, typescript, exports, ./fonts.css (+26 more)

### Community 2 - "Community 2"
Cohesion: 0.09
Nodes (21): FAMILY_ACCENTS, FAMILY_LABEL, FamilyAccent, GLYPHS, HomeView(), initials(), MissionControlApp, MissionControlHub() (+13 more)

### Community 3 - "Community 3"
Cohesion: 0.08
Nodes (25): 10. One-line summary, 1. What AuD is, 2. The mark (the everyday brand), 3. The AUDITOR wordmark (one deliberate easter egg), 4. Colour system, 5. Typography, 6. Light & dark, 7. Layout & feel guidance (+17 more)

### Community 4 - "Community 4"
Cohesion: 0.10
Nodes (20): MissionControlApp, chartPaths(), DEFAULT_SPARK, EditorialMissionControl(), EditorialMissionControlProps, FAMILY_LABEL, FAMILY_ROW_CLASS, GLYPHS (+12 more)

### Community 5 - "Community 5"
Cohesion: 0.09
Nodes (21): Accent discipline, AuD — Design System, Colour system, Components, Families, Hard don'ts, Install, Layout & feel (+13 more)

### Community 6 - "Community 6"
Cohesion: 0.10
Nodes (11): ACCENTED, AuditorWordmark(), AuditorWordmarkProps, LETTERS, FamilyProvider(), accentVar(), App(), APPS (+3 more)

### Community 7 - "Community 7"
Cohesion: 0.13
Nodes (14): DEFAULT_SPARK, DuotoneMissionControl(), DuotoneMissionControlProps, FAMILY_LABEL, FAMILY_ROW_CLASS, GLYPHS, initialsOf(), MCTokens (+6 more)

### Community 8 - "Community 8"
Cohesion: 0.11
Nodes (14): DuotoneMeta, DuotonePair, DuotoneSplash(), FAMILY_DUOTONES, FamilyPalette, FRAME, FrameTokens, scopedCss() (+6 more)

### Community 9 - "Community 9"
Cohesion: 0.10
Nodes (19): dependencies, react, react-dom, devDependencies, @types/node, @types/react, @types/react-dom, typescript (+11 more)

### Community 10 - "Community 10"
Cohesion: 0.11
Nodes (17): compilerOptions, baseUrl, esModuleInterop, isolatedModules, jsx, lib, module, moduleResolution (+9 more)

### Community 11 - "Community 11"
Cohesion: 0.12
Nodes (16): compilerOptions, esModuleInterop, forceConsistentCasingInFileNames, jsx, lib, module, moduleResolution, noEmit (+8 more)

### Community 12 - "Community 12"
Cohesion: 0.18
Nodes (10): Application map (app → family → accent → mode → auth), AuD — App Families & Unified Login Splash, `@aud/brand` additions the splashes imply, Decision 1 — how a family is defined, Glyph set (replaces the two-letter codes), Hard constraints (carried over), The four families, The model (+2 more)

### Community 13 - "Community 13"
Cohesion: 0.20
Nodes (9): Accessibility — verified (WCAG), App icons, AuD — Splash Visual Direction: "Warm Instrument", Cohesion: Sibling vs Identical, Glyph family, The house style ("Calibrated"), The idea, Usage (+1 more)

### Community 14 - "Community 14"
Cohesion: 0.36
Nodes (7): ACC, actionsHtml(), APPS, css(), FAMILY_MARKS, glyph(), render()

### Community 15 - "Community 15"
Cohesion: 0.53
Nodes (5): download(), fetch(), latin_url(), main(), Pick the woff2 url from the `/* latin */` block (not latin-ext).

### Community 16 - "Community 16"
Cohesion: 0.40
Nodes (4): Saved revisions (available, not wired into an app), Shipped / in use, Splash skin revisions, Wordmark — `WordmarkSplash`

### Community 17 - "Community 17"
Cohesion: 0.40
Nodes (4): APPS, BRAND_ADDITIONS, FAMILIES, RESERVE

## Knowledge Gaps
- **192 isolated node(s):** `ACC`, `APPS`, `FAMILY_MARKS`, `name`, `version` (+187 more)
  These have ≤1 connection - possible missing edges or undocumented components.
- **4 thin communities (<3 nodes) omitted from report** — run `graphify query` to explore isolated nodes.

## Suggested Questions
_Questions this graph is uniquely positioned to answer:_

- **Why does `FamilyKey` connect `Community 0` to `Community 2`, `Community 4`, `Community 6`, `Community 7`, `Community 8`?**
  _High betweenness centrality (0.021) - this node is a cross-community bridge._
- **Why does `useTakeoverBody()` connect `Community 7` to `Community 8`, `Community 0`, `Community 4`?**
  _High betweenness centrality (0.007) - this node is a cross-community bridge._
- **Why does `EditorialMissionControl()` connect `Community 4` to `Community 0`, `Community 2`, `Community 7`?**
  _High betweenness centrality (0.005) - this node is a cross-community bridge._
- **What connects `ACC`, `APPS`, `FAMILY_MARKS` to the rest of the system?**
  _193 weakly-connected nodes found - possible documentation gaps or missing edges._
- **Should `Community 0` be split into smaller, more focused modules?**
  _Cohesion score 0.08734693877551021 - nodes in this community are weakly interconnected._
- **Should `Community 1` be split into smaller, more focused modules?**
  _Cohesion score 0.058823529411764705 - nodes in this community are weakly interconnected._
- **Should `Community 2` be split into smaller, more focused modules?**
  _Cohesion score 0.08831908831908832 - nodes in this community are weakly interconnected._