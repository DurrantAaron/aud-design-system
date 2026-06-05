# AuD — App Families & Unified Login Splash

Design spec · v1 · 2026-06-06

**Source of truth:** `@aud/brand` (DurrantAaron/aud-design-system, v0.2.0)

> This is the original design spec for the family model and the unified splash.
> It pairs with the interactive prototype [`aud-families-splash.standalone.html`](./aud-families-splash.standalone.html)
> and its data layer [`aud-families-splash.data.jsx`](./aud-families-splash.data.jsx).
> The `@aud/brand` additions this spec implies (`FamilyProvider`, `familyPresets`,
> `SplashScreen` `formMode`/`fieldNote`) are implemented in the living system under `/src`.

-----

## The model

**Family is the unit of visual identity. The app is the unit of function. The mark is the unit of authorship.**

- Apps are grouped into **families**.
- Each family owns **one accent** + a base light/dark **mode**.
- Apps in a family share one login splash scaffold; only the mark + title change.
- The AuD lettermark stays a small footer mark — the family scheme is what's primary on screen.

-----

## Decision 1 — how a family is defined

**Chosen axis: by function** (the job the app does).

**Rationale:** one operator runs everything, so grouping by operator collapses to a single scheme and signals nothing. Function gives a staffer one visual language per task type, suite-wide, and collapses 9 apps into 4 schemes — inside the 5-accent budget.

Directions considered:

- **A · By function (CHOSEN)** — Audits · Dashboards · Registers · Logs → 4 families.
  - **+** Scales cleanly; mode falls out of work-context (field = light, control-room = dark).
  - **−** The two cleaning apps split across families (audit vs dashboard).
- **B · By operator** — one company → one family → 1 scheme. No differentiation.
- **C · By context/shift** — day-field (light) vs control-room (dark) → 2 families. Too blunt.

> **Note:** real venue/operator names stay **out** of the shared package and the splash. Eyebrows use the family name (AUDITS, REGISTERS).

-----

## The four families

| Family | Accent | Base mode | Note | Context |
|--------|--------|-----------|------|---------|
| **Audits** | Brass | Light | Field inspection in daylight; brass is the flagship anchor of the suite. | On-site, handheld, daytime |
| **Dashboards** | Steel | Dark | Control-room monitoring, often after dark; steel is the night-shift signal. | Wall display / desk, low light |
| **Registers** | Clay | Light | Staffed point-of-service desks; clay is the warm "care & record" note. | Reception / care desk, daytime |
| **Logs & Trackers** | Sage | Dark | Security & control logging on the night shift; sage holds the line quietly. | Patrol / control point, low light |
| _Reserve_ | _Eucalypt_ | — | Held for a 5th family. | — |

**Palette policy (Decision 2):** constant warm neutrals stay shared across the suite (that's what makes it one family of families); each family owns one accent; light/dark is the second distinguishing lever. Open a new scheme only if families outgrow the 5 accents.

**Mode policy (Decision 3):** mode tracks work context — field/day = light, control-room/night = dark.

-----

## Application map (app → family → accent → mode → auth)

| App | Family | Accent · Mode | Auth |
|-----|--------|---------------|------|
| Venue Audit | Audits | Brass · Light | Microsoft OAuth + team passcode |
| Cleaning Audit | Audits | Brass · Light | Name + access code |
| Precinct Compliance | Dashboards | Steel · Dark | Microsoft OAuth + static data |
| Cleaning Dashboard | Dashboards | Steel · Dark | Access code |
| Precinct Ops | Dashboards | Steel · Dark | 6-digit access code |
| First Aid Register | Registers | Clay · Light | PIN + role |
| Headset Issuance | Registers | Clay · Light | Name + access code |
| Security Tracker | Logs & Trackers | Sage · Dark | Access code |
| Control Log | Logs & Trackers | Sage · Dark | Access code (planned, not built) |

-----

## The unified splash (Decision 4 + 5)

**Suite standard = the Venue Audit splash, applied everywhere:**

- Primary: "Sign in with Microsoft"
- Secondary: "Use team passcode"

Every app's login page is the same two-action layout. Apps not yet wired to OAuth still present the identical page (the passcode path covers them). Only accent + mark change.

**Decision 4 (identical vs sibling)** — shown side by side in the prototype:

- **Identical** — same splash, only the title differs (max family cohesion).
- **Sibling** — same scheme + scaffold, each app keeps its own glyph via `<AppMark>`.

**Decision 5 (form vs OAuth layout)** — `<SplashScreen>` is OAuth-first (button on top). PIN/code apps need fields **above** the button → add a `formMode` / `actionsLast` flag.

Three login layout patterns trialled (cross-referenced from the live apps):

- **Separated** — Venue Audit: centred stack, OAuth → divider → team code.
- **Header + card** — First Aid: glyph + eyebrow + title above a card holding one big code box.
- **All-in-box** — Cleaning: side glyph + labelled fields inside a single card.

-----

## Typeface trial (cross-referenced from the app repos)

- **AuD Brand** — the `@aud/brand` spec: Bebas Neue (mark) · Barlow Condensed (display) · Barlow (body) · Share Tech Mono. Self-hosted.
- **DM Sans** — what the audit / register apps ship today (DM Sans, DM Mono).
- **Syne + DM Sans** — the compliance dashboard's combo: Syne display, DM Sans body, DM Mono.

The AuD lettermark is **never** trialable — the maker's mark is always Bebas. (The shipped PWAs self-host fonts per the brief; CDN fonts are for trialling only.)

-----

## Glyph set (replaces the two-letter codes)

Monoline, geometric, single 24px grid, stroke = `currentColor` (inherits the family accent in `<AppMark>`).

| App | Glyph | App | Glyph |
|-----|-------|-----|-------|
| Venue Audit | clipboard + check | First Aid Register | medical cross |
| Cleaning Audit | mop | Headset Issuance | headset |
| Precinct Compliance | shield + check | Security Tracker | log timeline |
| Cleaning Dashboard | droplet + level | Control Log | crosshair |
| Precinct Ops | radar | | |

Family marks (used in identical mode): Audits = circle-check · Dashboards = gauge · Registers = ledger · Logs = log-lines.

-----

## `@aud/brand` additions the splashes imply

| Kind | Signature | Note |
|------|-----------|------|
| NEW | `<FamilyProvider family="audits">` | Sets `--aud-accent` + `data-theme` for the subtree from one family key. |
| NEW | `familyPresets: Record<FamilyKey, {accent, mode}>` | The 4 presets as tokens; eucalypt reserved. |
| ADD | `formMode` / `actionsLast?: boolean` on `<SplashScreen>` | Renders field children **above** the primary action. |
| ADD | `fieldNote?: ReactNode` on `<SplashScreen>` | A mono micro-line under the fields (hint / env / rev). |
| HAVE | glyph slot on `<AppMark>` | Already takes any child (family glyph in identical mode, app glyph in sibling). |

-----

## Hard constraints (carried over)

- AuD mark stays a small footer mark; family scheme is primary.
- Accent is never a large fill / background wash — one accentuated letter in the mark.
- No CDN fonts in the shipped PWAs (self-host); no generic fonts (Inter/Roboto/Arial/system).
- No purple-gradient "AI" aesthetic. Warm, restrained, instrument-grade.
- Light + dark both required; the mark needs no theme branching (`currentColor` handles it).
- **`@aud/brand` is public — employer/venue/app names stay out of the shared package.**
