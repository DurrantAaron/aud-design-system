# AuD — Brand & Design System Brief

A complete specification for the **AuD** visual identity and design system. This is the source-of-truth brief: hand it to a designer or design tool and everything needed to build the system, the mark, the colour family, and the application rules is here.

-----

## 1. What AuD is

**AuD** is the maker's mark for a suite of operational audit/ops apps built by Aaron Durrant. It is a personal signature — like "Claude by Anthropic" or the Vercel triangle in a footer — that appears quietly across apps to signal a common author and a common standard of craft.

Inside those apps, **the host app's own brand always stays primary.** AuD is a small corner mark and a "Powered by AuD" footer only. AuD never competes with the app's own brand on its own surfaces.

### The name — layered meaning

- **A**aron **D**urrant — the initials (capital A, capital D).
- **AuD** is pronounced exactly "audit" / reads as "auditor" — nothing is lost when spoken.
- **AUD** is the Australian dollar code — a quiet nod to being built in Australia. Kept as *story only*, never expressed as a `$` symbol (a dollar sign would read as a money brand and cheapen it).

### The feel — one word

**Military grade.** Precise, undecorated, built to last. Restraint is the signal. The system earns its character through discipline and spacing, not ornament. No gradients-on-white, no glow, no clutter.

-----

## 2. The mark (the everyday brand)

The core lettermark is **AuD**, set in **Bebas Neue** (condensed stencil sans).

### Construction

- Three letters, baseline-aligned, set tight: letter-spacing `-0.02em`, no gaps.
- `A` and `D` are uppercase.
- `u` is lowercase — it is the only accentuated character, and it carries the accent colour.

### The one colour rule (critical)

- **`A` and `D` = `currentColor`** — they inherit whatever text colour the surface already uses (ink on light, near-white on dark).
- **`u` = the app's accent colour** (fixed).

This single rule means **one component works on any background, light or dark, with zero branching.** Drop it on a light header, it's ink + accent. Drop it on a dark header, it's near-white + accent. No theme logic needed.

### Why one letter

The whole power of the mark is that exactly **one** letter is special. That restraint is the military-grade signal and it's what keeps the suite legible as a family. Never accentuate more than the `u` in the mark itself.

### Usage of the mark

- Small lettermark in a corner of an app header/nav.
- A **"Powered by AuD"** badge in the footer — the words "Powered by" in small, uppercase, letter-spaced (`0.2em`), muted/secondary colour, followed by the AuD mark inline.
- The mark is independent of network — when built into an app, the font is **self-hosted, never CDN-loaded**, so the mark survives offline.

-----

## 3. The AUDITOR wordmark (one deliberate easter egg)

A secondary, conceptual piece — **not a branding rule.** The full word **AUDITOR** with the **U** and **I** carrying the brass accent.

### Meaning (a told story, layered)

- **U + I = "you & i"** — the auditor and the venue; the maker and the user. The relationship the tool sits between.
- **UI = User Interface** — the craft layer; these are built to be used, not endured.
- **AuD** still sits at the front of the word — the wordmark *contains* the lettermark.

### Honest constraint

In `A-U-D-I-T-O-R` the `D` sits between the `U` and the `I`, so they do **not** visually fuse into "UI". The meaning is a **told story, not self-evident.** This is perfect as a private signature with depth, but it does no communicating on its own — never rely on it to carry a message to a viewer who hasn't been told.

### Rules

- Lives in **exactly one place per app** — the login screen, splash, or an "about" line. Seen once, not on every screen.
- Never leaks into running UI. Never becomes a recurring highlight rule.
- Accent stays the **app accent colour** (brass on the flagship) — no new colour, no new rule.
- It sits *underneath* the AuD mark in importance. AuD is the brand; AUDITOR is the signature flourish.

-----

## 4. Colour system

### Principle: constant neutrals, one moving accent

The suite reads as one family because the **neutrals never change** — same ground, ink, type and layout across every app. **Only the accent shifts**, one per app. Think NATO equipment markings: identical language, different unit colour.

### Shared neutrals (constant across all apps)

| Token | Hex | Role |
|-------------|---------|------------------------------------------------------------------|
| Ground | `#F2F0EB`| Primary background — warm off-white (the Anthropic-register paper)|
| Surface | `#FAFAF8`| Raised surfaces, cards |
| Ink | `#14130F`| Primary text, the `A`/`D` of the mark on light |
| Mid | `#6B6960`| Secondary/muted text, labels |
| Rule | `#D8D4CC`| Borders, dividers, hairlines |
| Dark Ground | `#17160F`| Primary background in dark theme |

All accents are **desaturated and warm**, tuned to sit on the off-white ground without clashing or shouting. No neon. Subtlety is the brief.

### Per-app accents

| Accent name | Hex | Rationale |
|------------|---------|------------------------------------------------------|
| **Brass** |`#C8A84B`| The anchor / flagship colour. The signature. |
| **Clay** |`#C26B52`| Warm red — reads "care" without the alarm of true red.|
| **Steel** |`#5E7C93`| Muted night-blue for the control room / night shift. |
| **Sage** |`#7C8A5C`| Desaturated olive green — calm operations overview. |
| **Eucalypt**|`#4F8A80`| Muted teal — the most Australian note in the set. |

### Accent discipline

The accent is reserved for: the `u` in the mark, the U/I in the AUDITOR wordmark, active/selected states, key rule lines, and the single most important element on a screen. **Never large fills.** Restraint = the military-grade signal. If a screen is washed in accent colour, it's wrong.

-----

## 5. Typography

A tight, instrument-panel stack. Avoid generic faces (no Inter, Roboto, Arial, system default).

| Role | Typeface | Notes |
|-----------------------|---------------------------------------------------------------------|------------------------------------------------------------------------------------------------|
| Mark & display | **Bebas Neue** | The lettermark, the AUDITOR wordmark, big numerics. Condensed, stencil, military-issue feel. |
| UI headings | **Barlow Condensed** | Section headers, screen titles. Condensed, institutional, pairs with Bebas. Weights 300/400/600.|
| Body | **Barlow** (regular, non-condensed) | Running text, descriptions. Keeps the family coherent. |
| Data / technical labels|A monospace (e.g. **Space Mono** / **DM Mono** / **Share Tech Mono**)| Codes, IDs, timestamps, metadata, fine labels. Equal-width = disciplined, instrument-like. |

Type treatment: small labels are uppercase with generous letter-spacing (`0.2em`–`0.3em`). Body is sentence case, comfortable line-height (~1.5).

-----

## 6. Light & dark

Both themes are required. The system is built so the switch is trivial:

- **Light:** Ground `#F2F0EB`, Ink `#14130F`, accents as listed.
- **Dark:** Dark Ground `#17160F`, text near-white (`#F2F0EB`), accents unchanged (they're tuned to work on both).
- The mark needs no theme logic — `currentColor` handles A/D, accent handles the `u`.

-----

## 7. Layout & feel guidance

- **Generous negative space**, hairline rules (`#D8D4CC`), sharp corners or very small radii (2–6px). Nothing pillowy.
- Composition reads like a spec sheet or instrument panel: labelled, gridded, precise.
- Micro-labels in mono uppercase act as "field markings" (e.g. `APP 01`, `REV 03`, `POWERED BY`).
- Motion (if any) is minimal and functional — one clean reveal, no decorative animation.
- Borders and dividers do the structural work; shadows are subtle or absent.

-----

## 8. Application across the suite

1. **AuD mark** appears on every app — header corner + "Powered by AuD" footer — in that app's accent.
2. **AUDITOR wordmark** appears once per app, on login/splash, in that app's accent.
3. **Neutrals identical** across all five apps; **only the accent changes** per the table in §4.
4. The host app's branding stays primary; AuD is the quiet maker's mark.

### The five accents

- Brass — flagship
- Clay
- Steel
- Sage
- Eucalypt

-----

## 9. Hard don'ts

- No `$` / dollar-sign device. The Australian meaning is story, not symbol.
- No accentuating more than the `u` in the mark.
- No accent used as a large fill or background wash.
- No CDN-loaded brand font in production apps (self-host so the mark survives offline).
- No theme-branching on the mark's colour (use `currentColor` for A/D).
- AUDITOR wordmark never repeats through the UI — one home only.
- No generic fonts (Inter/Roboto/Arial/system).
- No purple-gradient-on-white / generic "AI" aesthetic. This is warm, restrained, instrument-grade.

-----

## 10. One-line summary

**AuD** — a warm, restrained, military-grade maker's mark: the lettermark `A`**`u`**`D` (one accentuated letter, `currentColor` + accent), a constant neutral system with one moving per-app accent, Bebas/Barlow typography, and a single "you & i / UI" AUDITOR wordmark easter egg on each app's splash.
