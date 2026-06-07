# AuD — Splash Visual Direction: "Warm Instrument"

Design direction · 2026-06-05 · pairs with `@aud/brand` `<SplashScreen atmosphere>`

## The idea

The suite's splash/login is the first impression of a *published* app, so it has to do two
things at once: feel like **precision operational equipment** (the brand's "instrument-panel /
discipline, not ornament" soul) **and** feel **warm + premium** enough that a stranger on the
App Store trusts it. The reference points are Teenage Engineering, Leica, a premium car's gauge
cluster on ignition — technical *and* consumer-beloved.

This sits on top of the existing decisions, unchanged:
- **Family is the unit of identity** (Audits·brass·light, Dashboards·steel·dark, Registers·clay·light, Logs·sage·dark). Colour signals the **family**; the **glyph** signals the **app**.
- **One mark, warm neutrals, one moving accent.** Ground is a *warm* near-black `#17160F` / cream `#F2F0EB` — never cold slate.

## The house style ("Calibrated")

Applied via the opt-in `atmosphere` prop on `<SplashScreen>`:

| Layer | Treatment |
|-------|-----------|
| Ground depth | A warm **accent glow** behind the centre (16% dark / 10% light) so it reads *lit, not flat* |
| Texture | A **faint edge-faded technical grid** (3–4% ink), masked to dissolve at the edges |
| Frame | Four thin **corner registration ticks** — a tamed instrument frame, not full rulers |
| Mark | The app's `AppMark` tile (accent fill + glyph) with a hairline border so the shape always separates |
| Eyebrow | The **family name** with a small accent **pip** — neutral text (no accent small-text) |
| CTA | Filled accent button with subtle depth (border + inner highlight + soft shadow); **contrast-safe fill** |
| Secondary | A **tinted, clearly-tappable** surface (not a ghost outline that reads as disabled) |
| Telemetry | **One** honest mono line: `SECURE CONNECTION · BUILT IN AUSTRALIA` — warmth + trust, never a cipher |
| Footer | `PoweredByAud` |

### What this deliberately is NOT
Killed during review as the cold/"cosplay-of-an-instrument" failure mode: floor-to-ceiling
ruler ticks, fake `ENC AES-256 / SYS-04 / REV 04` telemetry strips, stacked redundant brand
cues, and purple/AI gradients.

## Accessibility — verified (WCAG)

Both themes were designed to parity and the tokens checked numerically (not by eye):

- Title / subtitle / telemetry / secondary label clear **AA (≥4.5:1)** in light **and** dark.
- **Steel** is mid-luminance and fails AA with dark ink (4.13). The component **auto-lifts** any
  mid-tone accent fill toward white until the label clears 4.5:1 (`contrastSafeFill`) → steel CTA = `#6E899E` (4.95). Brass/clay/sage/eucalypt already pass and are untouched.
- Accent **pip/marks** on cream use `accent + 25% ink` to clear 3:1 (pale brass fails raw).
- The **tile** carries a hairline (`accent + 16% black`) so a pale brass tile still separates on cream.

## Cohesion: Sibling vs Identical

Both render from the same scaffold; the only difference is the tile glyph (see
`renders/identical-vs-sibling.png`).
- **Sibling (recommended):** each app shows its **own** glyph — distinct yet clearly one family.
- **Identical:** every app in a family shows the **family mark** — maximum cohesion, but apps
  are harder to tell apart on a lock screen. Use only where that's desired.

## Glyph family

Bespoke monoline set (24px grid, `currentColor`, 1.75 stroke), in `design/glyphs/`. Per app +
4 family marks. They draw with `currentColor`, so they drop straight into `<AppMark>`.

| App | Glyph | App | Glyph |
|-----|-------|-----|-------|
| Venue Audit | clipboard + check | Headset Issuance | headset |
| Cleaning Audit | mop | Security Tracker | log timeline |
| Precinct Compliance | shield + check | Control Log | crosshair |
| Cleaning Dashboard | droplet + level | First Aid Register | medical cross |
| Precinct Ops | radar | _Family marks_ | circle-check · gauge · ledger · log-lines |

## App icons

Home-screen icon = the family-accent tile + app glyph + a subtle grid texture & sheen
("warm instrument" carried onto the icon). Colour = family, glyph = app, so the row reads as
one suite (see `renders/home-screen.png`). A clean solid-accent fill is the small-size fallback.

## Usage

```tsx
import { SplashScreen, AppMark, FamilyProvider, accents } from '@aud/brand'
import '@aud/brand/fonts.css'   // full set — needed for the title face
import '@aud/brand/tokens.css'

<FamilyProvider family="dashboards">
  <SplashScreen
    atmosphere
    mark={<AppMark accent={accents.steel}><GaugeGlyph/></AppMark>}
    eyebrow="DASHBOARDS"
    title="Precinct Compliance"
    subtitle="Checklist analytics"
    accent={accents.steel}
    status={<>SECURE CONNECTION · BUILT IN AUSTRALIA</>}
    primary={{ label: 'Sign in with Microsoft', icon: <MsLogo/>, onClick }}
    secondary={{ label: 'Continue with static data', onClick: guest }}
  />
</FamilyProvider>
```

`atmosphere` is **opt-in** — existing splashes (e.g. Compliance-v2) render exactly as before
until they pass the flag. Run the live demo: `npm run showcase` → open `/atmos.html`.
