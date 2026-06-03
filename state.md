---
# state.md — aud-design-system — 2026-06-01 13:50 AEST
Active goal: AuD maker's-mark shipped suite-wide as the installable @aud/brand design system; remaining work is wiring CI auth now that the repo is private again, then promoting the two staging apps to prod.
Decisions locked:
- @aud/brand is the single source of truth; apps consume it via a `git+https://github.com/DurrantAaron/aud-design-system.git` dependency — NOT the `github:` shorthand (npm resolves that to `git+ssh`, which fails in CI).
- Footer treatment only — `<PoweredByAud/>` in the app shell, NO header corner mark (design call). Canonical size: mark ~18px (1.15rem), Share Tech Mono "POWERED BY" lead. Accent colours only the `u`; each app's own brand stays primary.
- `fonts-mark.css` (Bebas + Share Tech Mono, ~27KB) is the lean import for mark-only apps; full `fonts.css` only if an app adopts the whole type system.
- Per-app accents: brass=venue-audit, clay=first-aid, steel=control-log, sage=ops-dashboard, eucalypt=cleaning-audit.
- Repo is PRIVATE again (was briefly public to unblock CI). Before going private, the public README/showcase/tokens/brief were scrubbed of the employer name and all specific app/repo/URL references; personal "AuD = Aaron Durrant" identity kept.
Open questions:
- [TODO — TOP PRIORITY] Deploy auth for the now-PRIVATE dep. The 4 consuming apps install over git+https, which needs credentials for a private repo → their Vercel + GitHub-Actions builds will FAIL on the next deploy until wired. Already-live deploys are unaffected. Plan: a read-only GitHub Actions deploy key (automatable) + a Vercel token/env + install-command per app (manual, 4 projects). Or flip back public.
- [TODO] Promote precinct-ops-dashboard (#13, sage) and gom-venue-audit migration (#90, brass) from `staging` → `main` to reach prod — both are merged to staging only.
- [CONFIRM] Mono = Share Tech Mono (vs Space Mono / DM Mono) — one-line `--aud-font-mono` swap if changing.
Built/shipped since last update:
- 85c5988 docs: generalise away specific app/tool references for the public repo
- 884f099 docs: generalise away employer references for the now-public repo
- 2122e07 add fonts-mark.css — lean 2-font import for mark-only apps (Bebas + Share Tech Mono); bump 0.1.1
Next session starts with: Wire deploy auth so the 4 apps can install the now-private @aud/brand — GitHub Actions deploy key (auto) + Vercel env per app (manual) — then promote precinct (#13) and GOM (#90) staging→main.
Out of scope right now:
- The 3 non-canonical web apps (cleaning-dashboard, Compliance-v2, security-tracker) + ctrllog (no app built yet).
- Publishing @aud/brand to npm (git install only for now).
- CI workflows inside the design-system repo itself.
---
Previous wrap: 62ad1a1
