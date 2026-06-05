# AuD — Design System

<!-- The mark: A·u·D — A and D inherit currentColor, u carries the accent. -->

**AuD** is the maker's mark for Aaron Durrant's suite of operational audit/ops apps.
It's a quiet personal signature — like "Claude by Anthropic" or the Vercel triangle
in a footer — that appears across apps to signal a common author and a common
standard of craft. This repo is the **living system**: design tokens, self-hosted
brand fonts, React components, and a runnable showcase, packaged so every app in the
suite consumes one source of truth.

> **The feel, in one word: _military grade._** Precise, undecorated, built to last.
> Restraint is the signal — the system earns its character through discipline and
> spacing, not ornament. No gradients-on-white, no glow, no clutter.

Inside each app, the **host app's own brand stays primary** — AuD is only ever a small
corner mark and a "Powered by AuD" footer. It never competes with the app's own brand.

---

## The name (layered)

- **A**aron **D**urrant — the initials (capital A, capital D).
- **AuD** is pronounced exactly "audit" / reads as "auditor".
- **AUD** is the Australian dollar code — a quiet nod to being built in Australia.
  Story only; **never** a `$` symbol (that would read as a money brand and cheapen it).

---

## Install

Consumed from GitHub (private). It ships **TypeScript source** — your app's bundler
(Vite/Next/etc.) compiles it, so there's no build step here.

```bash
npm install github:DurrantAaron/aud-design-system
```

Then, once in your app entry (e.g. `main.tsx`):

```ts
import '@aud/brand/fonts.css'   // self-hosted Bebas / Barlow / Barlow Condensed / Share Tech Mono
import '@aud/brand/tokens.css'  // --aud-* custom properties + light/dark
```

Set the app's accent on your root (see [the five accents](#the-five-accents)):

```css
:root { --aud-accent: var(--aud-steel); } /* e.g. the control accent */
```

Requires `react >= 18` (peer dependency).

---

## Quick start

```tsx
import { AudMark, PoweredByAud, AuditorWordmark, accents } from '@aud/brand'

// In a header corner — inherits the surrounding text colour, u is the app accent:
<AudMark className="text-2xl" />

// In the footer:
<footer><PoweredByAud /></footer>

// Once per app, on the login/splash only:
<AuditorWordmark style={{ fontSize: '4rem' }} />

// Override the accent ad-hoc:
<AudMark accent={accents.brass} />
```

Components render with **self-contained inline styles**, so they work in any React
app — Tailwind is optional. Tailwind users can also add the preset:

```js
// tailwind.config.js
import audPreset from '@aud/brand/tailwind-preset'
export default { presets: [audPreset], content: ['./src/**/*.{ts,tsx}'] }
// → text-aud-ink, bg-aud-ground, text-aud-accent, font-aud-heading, rounded-aud, …
```

---

## The mark

The everyday brand: the lettermark **AuD**, set in **Bebas Neue**.

**The one colour rule (the whole trick):**

| Letter | Colour | Why |
|--------|--------|-----|
| `A`, `D` | `currentColor` | inherit the surface's text colour — ink on light, near-white on dark |
| `u` | the app accent (`--aud-accent`) | the **one** accentuated letter |

Because A/D use `currentColor`, **one component works on any background, light or
dark, with zero branching.** Exactly one letter is special — that restraint is the
military-grade signal, and it's what keeps the suite legible as a family. Never
accentuate more than the `u`.

Construction: three letters, baseline-aligned, set tight (`letter-spacing: -0.02em`),
no gaps. `A`/`D` uppercase, `u` lowercase.

The mark is **network-independent**: fonts are self-hosted, never CDN-loaded, so it
survives offline (these apps are offline-capable PWAs). If the font fails entirely,
the fallback condensed-sans still shows `AuD` with the `u` in accent — degraded but
legible.

---

## The AUDITOR wordmark (one deliberate easter egg)

The full word **AUDITOR** with the **U** and **I** in the accent. Conceptual — **not
a branding rule.**

- **U + I = "you & i"** — the auditor and the venue; the maker and the user.
- **UI = User Interface** — the craft layer; these are built to be used, not endured.
- **AuD** still sits at the front of the word — the wordmark *contains* the lettermark.

**Honest constraint:** the `D` sits between `U` and `I`, so they don't visually fuse
into "UI". The meaning is a *told story*, not self-evident — never rely on it to
communicate on its own.

**Rules:** lives in **exactly one place per app** (login / splash / an "about" line).
Never in running UI, never a recurring highlight. It sits *underneath* the AuD mark
in importance — AuD is the brand; AUDITOR is the signature flourish.

---

## Colour system

### Principle: constant neutrals, one moving accent

The suite reads as one family because the **neutrals never change** — same ground,
ink, type and layout across every app. **Only the accent shifts**, one per app. Think
NATO equipment markings: identical language, different unit colour.

### Shared neutrals (constant)

| Token | CSS var | Light | Role |
|---------|--------------------|----------|------|
| Ground | `--aud-ground` | `#F2F0EB` | primary background — warm off-white |
| Surface | `--aud-surface` | `#FAFAF8` | raised surfaces, cards |
| Ink | `--aud-ink` | `#14130F` | primary text; the A/D of the mark on light |
| Mid | `--aud-mid` | `#6B6960` | secondary / muted text, labels |
| Rule | `--aud-rule` | `#D8D4CC` | borders, dividers, hairlines |

### The five accents

| Accent | CSS var | Hex | Rationale |
|--------|---------|-----|-----------|
| **Brass** | `--aud-brass` | `#C8A84B` | the anchor / flagship — the signature |
| **Clay** | `--aud-clay` | `#C26B52` | warm red — "care" without the alarm of true red |
| **Steel** | `--aud-steel` | `#5E7C93` | muted night-blue — the control room / night shift |
| **Sage** | `--aud-sage` | `#7C8A5C` | desaturated olive — calm operations overview |
| **Eucalypt** | `--aud-eucalypt` | `#4F8A80` | muted teal — the most Australian note in the set |

All accents are **desaturated and warm**, tuned to sit on the off-white ground
without clashing. No neon.

### Accent discipline

The accent is reserved for: the `u` in the mark, the U/I in the wordmark,
active/selected states, key rule lines, and the single most important element on a
screen. **Never large fills.** If a screen is washed in accent colour, it's wrong.

---

## Typography

A tight, instrument-panel stack. **No generic faces** (no Inter/Roboto/Arial/system).
All four are self-hosted under [`/fonts`](./fonts) (SIL OFL, latin subset).

| Role | Typeface | CSS var | Notes |
|------|----------|---------|-------|
| Mark & display | **Bebas Neue** | `--aud-font-display` | the lettermark, the wordmark, big numerics |
| UI headings | **Barlow Condensed** | `--aud-font-heading` | section headers, screen titles (300/400/600) |
| Body | **Barlow** | `--aud-font-body` | running text (400/500/600/700) |
| Data / labels | **Share Tech Mono** | `--aud-font-mono` | codes, IDs, timestamps, field markings (`APP 01`, `POWERED BY`) |

Small labels are uppercase with generous letter-spacing (`0.2em`–`0.3em`). Body is
sentence case, comfortable line-height (~1.5).

> The brief leaves the mono open (Space Mono / DM Mono / Share Tech Mono). The
> original specimens use **Share Tech Mono** for the field markings, so the system
> standardises on it. To change it suite-wide, edit `--aud-font-mono` and swap the
> `/fonts` file.

---

## Light & dark

Both themes are required, and the switch is trivial — the neutrals are CSS variables:

- **Light** (default): Ground `#F2F0EB`, Ink `#14130F`.
- **Dark**: Dark Ground `#17160F`, text near-white `#F2F0EB`. Accents unchanged
  (tuned to work on both).
- **Auto** by `prefers-color-scheme`; force with `[data-theme="light"|"dark"]`.
- The mark needs **no theme logic** — `currentColor` handles A/D, the accent handles `u`.

Canonical dark values are Ground + Ink; dark Surface/Mid/Rule are *derived* to
complete the theme in the same warm register (see [`tokens/tokens.css`](./tokens/tokens.css)).

---

## Layout & feel

- **Generous negative space**, hairline rules (`--aud-rule`), sharp corners / small
  radii (2–6px, `--aud-radius`). Nothing pillowy.
- Composition reads like a spec sheet or instrument panel: labelled, gridded, precise.
- Micro-labels in mono uppercase act as "field markings".
- Motion (if any) is minimal and functional. Borders do the structural work; shadows
  are subtle or absent.

---

## Components

All accept standard `HTMLSpanElement` props (`className`, `style`, …) plus:

| Component | Props | Notes |
|-----------|-------|-------|
| `<AudMark />` | `accent?`, `label?` | the lettermark. Size via parent `font-size`. `accent` defaults to `--aud-accent`. |
| `<PoweredByAud />` | `accent?`, `lead?` | footer badge: muted uppercase lead + the mark, baseline-aligned, no wrap. |
| `<AuditorWordmark />` | `accent?`, `label?` | the wordmark. One place per app only. |

Token exports (`@aud/brand` or `@aud/brand/tokens`): `accents`, `neutrals`, `fonts`,
and type `AccentName`. Family exports: `familyPresets`, `reservedAccent`, and types
`FamilyKey`, `FamilyPreset` (see [Families](#families)).

---

## One accent per app

Each app sets one accent and consumes the package:

```css
/* flagship */ :root { --aud-accent: var(--aud-brass); }
/* care     */ :root { --aud-accent: var(--aud-clay); }
/* control  */ :root { --aud-accent: var(--aud-steel); }
/* ops      */ :root { --aud-accent: var(--aud-sage); }
/* cleaning */ :root { --aud-accent: var(--aud-eucalypt); }
```

Fix the mark or the footer badge once here, and every app picks it up.

---

## Families

Apps are grouped into four **function families**, each owning one accent + a base
light/dark mode. `familyPresets` is the single source of truth; `<FamilyProvider>`
applies a family to a subtree by setting `--aud-accent` and `data-theme` from one
key — so the mark, the splash and any accent-keyed CSS follow with no further wiring.

| Family | Accent | Base mode | Context |
|--------|--------|-----------|---------|
| `audits` | brass | light | field inspection, daytime |
| `dashboards` | steel | dark | control-room monitoring, low light |
| `registers` | clay | light | staffed service desks, daytime |
| `logs` | sage | dark | security / control logging, night shift |

`eucalypt` is held in reserve (`reservedAccent`) for a 5th family.

```tsx
import { FamilyProvider, SplashScreen, AppMark } from '@aud/brand'

// accent + light/dark both come from the family key — no theme/accent props:
<FamilyProvider family="registers">
  <SplashScreen
    mark={<AppMark><CrossIcon /></AppMark>}
    title="First Aid Register"
    formMode                                   {/* fields above the button */}
    fieldNote="REV 03 · ask your supervisor"   {/* mono micro-line under the fields */}
    primary={{ label: 'Continue' }}
  >
    <input aria-label="Access code" /* … */ />
  </SplashScreen>
</FamilyProvider>
```

`<SplashScreen>` is OAuth-first by default (primary button on top); pass `formMode`
(alias `actionsLast`) for PIN/code apps that need the fields above the button. Read
the raw preset values directly via `familyPresets[key]` when you need them in JS.
The full design rationale lives in
[`reference/originals/aud-family-model-splash-spec.md`](./reference/originals/aud-family-model-splash-spec.md).

---

## Showcase

A runnable Vite + React + Tailwind site that imports the package exactly as an app
would and renders every specimen (mark on light/dark, all five accents, the footer
badge, the AUDITOR splash, colour swatches, type specimens).

```bash
npm install
npm run showcase          # dev server
npm run showcase:build    # production build
```

---

## Repo structure

```
aud-design-system/
├─ README.md              ← you are here (the canonical brief)
├─ package.json           ← @aud/brand, exports map
├─ src/
│  ├─ index.ts            ← barrel
│  ├─ tokens.ts           ← accents / neutrals / fonts as TS constants
│  ├─ families.ts         ← familyPresets (the four function families)
│  └─ components/         ← AudMark, PoweredByAud, AuditorWordmark,
│                           SplashScreen, AppMark, FamilyProvider
├─ tokens/
│  ├─ tokens.css          ← :root --aud-* vars + light/dark
│  ├─ tokens.json         ← structured token data
│  └─ tailwind-preset.js  ← Tailwind preset (colours, fonts, radii)
├─ fonts/                 ← self-hosted woff2 + fonts.css + OFL licence
├─ showcase/              ← runnable Vite specimen site
├─ scripts/fetch-fonts.py ← re-fetch the brand fonts from Google Fonts
└─ reference/             ← original Drive sources (provenance)
```

---

## Hard don'ts

- No `$` / dollar-sign device — the Australian meaning is story, not symbol.
- No accentuating more than the `u` in the mark.
- No accent as a large fill or background wash.
- No CDN-loaded brand font in production (self-host so the mark survives offline).
- No theme-branching on the mark's colour (`currentColor` for A/D).
- The AUDITOR wordmark never repeats through the UI — one home only.
- No generic fonts (Inter/Roboto/Arial/system).
- No purple-gradient-on-white / generic "AI" aesthetic. Warm, restrained, instrument-grade.

---

## Licence

Code, tokens and docs: **MIT** ([`LICENSE`](./LICENSE)). Bundled fonts: **SIL OFL
1.1**, licensed separately ([`fonts/OFL.txt`](./fonts/OFL.txt), [`fonts/FONTS.md`](./fonts/FONTS.md)).

Provenance for the whole system lives in [`reference/`](./reference) — including the
three original mark concepts and the decision that picked the stencil.
