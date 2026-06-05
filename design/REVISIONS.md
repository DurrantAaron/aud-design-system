# Splash direction — how we got here (revisions trail)

A multi-phase design sprint, each phase rendered and reviewed before the next.

## 1 · Atmosphere bake-off (10 directions)
Ten distinct "warm instrument" treatments generated and rendered on one controlled layout, so
the comparison was purely about atmosphere (`renders/atmosphere-bakeoff.png`):

`instrument-grid · minimal-premium · blueprint · telemetry-boot · topographic · accent-frame ·
spotlight-vignette · embossed-equipment · data-edge · registration-seal`

Finalists: **v01 instrument-grid · v03 blueprint · v07 spotlight-vignette · v09 data-edge**
(`renders/finalists.png`, dark + light).

## 2 · Adversarial critique (4 finalists × 4 lenses)
Each finalist scored 1–10 by an independent critic for App-Store first impression, hierarchy/CTA
dominance, accessibility, and cohesion-at-scale.

| Finalist | appstore | hierarchy | a11y | cohesion | avg |
|----------|:--:|:--:|:--:|:--:|:--:|
| **v09 data-edge** | 5 | 6 | 6 | 6 | **5.75** |
| v03 blueprint | 5 | 7 | 5 | 5 | 5.50 |
| v01 instrument-grid | 5 | 5 | 4 | 6 | 5.00 |
| v07 spotlight-vignette | 5 | 7 | 4 | 4 | 5.00 |

**Universal findings (all four shared them):**
1. **Light mode was broken** — text + CTA failed contrast on cream; designed dark-first.
2. CTA didn't dominate; **secondary read as disabled**.
3. The cold **Microsoft logo** clashed with the warm palette.
4. **Over-clustered / fake telemetry** read as "instrument cosplay," and v09's full-height
   rulers + cipher strings were the single biggest publish-blocker.
5. Redundant brand cues; top dead-zone.

## 3 · Synthesis → "Calibrated" house style
Took **v09's calm-centre structure** (highest cohesion + a11y), **v01's warm glow + corner
ticks**, and fixed every universal finding: light designed first, contrast solved numerically,
secondary tinted, MS logo contained in a chip, telemetry cut to one honest line, edges tamed to
corner ticks. See `DESIGN-DIRECTION.md` and the family in `renders/family/`.

## 4 · Glyph family
13 bespoke monoline glyphs, 2 takes each, drawn to one strict system; the cleaner take chosen per
icon (`renders/glyph-family.png`). First-aid hand-drawn after one generation failed.

## 5 · App icons
Four icon treatments mocked across all nine apps; **textured-accent** chosen (colour pop +
instrument texture), solid-accent kept as the small-size fallback (`renders/home-screen.png`).

## 6 · Productionised + verified
Atmosphere shipped as an **opt-in `atmosphere` prop** on `<SplashScreen>` (+ `eyebrow`, `status`,
auto-contrast-safe CTA fill). `tsc` clean; rendered from the **real component** via the showcase
to confirm parity (`renders/real-component/`).
