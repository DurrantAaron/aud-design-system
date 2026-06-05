# reference/

Provenance for the AuD design system. These are the **original source files** the
system was built from — preserved verbatim so the design intent (and the road not
taken) stays on the record. The living system in the repo root supersedes them;
when they disagree, the root (`/tokens`, `/src`, root `README.md`) wins.

Originally authored in Google Drive under **Brand Guidelines** (owner:
aaron.durrant@gmail.com), pulled in on 2026-06-01.

## originals/

| File | What it is |
|------|------------|
| [`aud-design-system-brief.md`](./originals/aud-design-system-brief.md) | **The source-of-truth brief.** Everything: the mark, the AUDITOR wordmark, the colour system, typography, light/dark, layout, hard don'ts. The root `README.md` is the canonical, install-aware version of this. |
| [`aud-brand-concepts.html`](./originals/aud-brand-concepts.html) | The three original mark directions — **A** Stencil (Bebas + gold), **B** Precision (Space Mono + blue), **C** Classified (Barlow Heavy + offset red box) — and the decision table. **Concept A won.** This is *why* the brand is what it is. |
| [`aud-colour-family.html`](./originals/aud-colour-family.html) | The five app cards (one accent each), the family strip, and the shared-neutral palette with the "constant neutrals, one moving accent" principle written out. |
| [`aud-bc-recoloured.html`](./originals/aud-bc-recoloured.html) | Concepts B and C re-rendered in the five family accents, light and dark — a pure comparison so the colour logic could be judged on the other two letterforms. Not a switch; A stayed the master mark. |
| [`aud-auditor-wordmark.html`](./originals/aud-auditor-wordmark.html) | The AUDITOR wordmark exploration — the "you & i / UI" easter egg, in-context on a login/splash, plus the honest "does U+I actually read?" test. |
| [`aud-family-model-splash-spec.md`](./originals/aud-family-model-splash-spec.md) | **The App Families & Unified Splash spec (v1, 2026-06-06).** Groups the apps into four function families (Audits/Brass · Dashboards/Steel · Registers/Clay · Logs/Sage, eucalypt reserved), each owning one accent + a base light/dark mode, and defines the shared login splash. Implemented in `/src` as `FamilyProvider`, `familyPresets`, and the `SplashScreen` `formMode`/`fieldNote` props. |
| [`aud-families-splash.standalone.html`](./originals/aud-families-splash.standalone.html) | The interactive prototype for the spec above — the four families, identical-vs-sibling splashes, and the form-vs-OAuth layout, side by side. Self-contained (fonts inlined). |
| [`aud-families-splash.data.jsx`](./originals/aud-families-splash.data.jsx) | The data layer behind the prototype — the `FAMILIES` map, the app inventory, and the `@aud/brand` additions the splashes imply. |

The HTML specimens reference Google Fonts over a CDN (they were quick studies). The
shipped system **self-hosts** every font under `/fonts` — see the root `README.md`
"Hard don'ts". The runnable `/showcase` is the modern, self-hosted replacement for
these static specimens.

> Note on the mono: the brief lists Space Mono / DM Mono / Share Tech Mono as
> options. These specimens use **Share Tech Mono** for the instrument-panel field
> markings, so the shipped system standardises on Share Tech Mono as the brand mono.
