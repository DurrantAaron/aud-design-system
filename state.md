---
# state.md — aud-design-system — 2026-06-04 23:32 AEST
Active goal: Move the suite's login splashes to a family model — apps grouped into families, each family owning a colour scheme + light/dark base + one shared splash. @aud/brand now has the AppMark tile; next is the design-led family grouping (brief handed off, implementation HELD).
Decisions locked:
- @aud/brand is the single source of truth, consumed via git+https. Repo is PUBLIC now — the old "private + deploy-auth wiring is top priority" note is MOOT; apps install without credentials.
- AppMark shipped (v0.2.0, PR #2): the system-owned per-app tile — identical size/radius/glyph-scale + accent fill, icon-agnostic (apps pass their own glyph), `solid` (default) + `tint` variants.
- App identity = ICON-GLYPH tiles (each app keeps a recognisable glyph in an identical tile), NOT lettermark codes. Aaron's call.
- Direction shift: "one accent per app" → "family model" (group → scheme + light/dark → shared splash). App rollout is HELD pending the family design.
- Tentative accent slots (pending final grouping): Compliance-v2 → steel, precinct-ops → sage (matches the showcase splash demo).
- Glyph placeholders: venue-audit=clipboard-check, first-aid=cross, cleaning=sparkle, precinct-ops=gauge, compliance=shield-check (apps pass their own Lucide icon — easy to change).
Open questions:
- [CONFIRM] Decision 1 (foundational): how is a family defined — operator/precinct (recommended), function, or hybrid?
- [CONFIRM] Org tree: how do IVY / Merivale / GOM relate — nested or peers?
- [CONFIRM] Scope: just the 5 React apps, or also security-tracker / NTE-Dashboard / HeadsetIssuance / ctrllog?
- [CONFIRM] Within a family: 100% identical splashes, or sibling (same scheme/scaffold, per-app glyph)?
- [CONFIRM] Palette: stay on the 5 accents, or open new family schemes?
- SplashScreen is OAuth-first (button above content); PIN/code apps need fields-above-button — add a `formMode`/`actionsLast` option (known gap, not built).
Built/shipped since last update:
- 57fcb5c feat(splash): add SplashScreen sign-in scaffold (#1)
- 45e7c8c feat(app-mark): add AppMark — the per-app tile for splash/login (#2)
Next session starts with: Get Aaron's family-grouping axis (Decision 1) + org tree, lock the strawman into ~/aud-app-families-brief.md, then hand to Claude design to produce per-family schemes + one canonical splash each.
Out of scope right now:
- Touching the 5 apps' Login screens (rollout held until the family design lands).
- Deploy-auth wiring / repo-visibility flip (repo is public — moot).
- The form-login SplashScreen variant (`formMode`) — design first, then build.
- Python/non-splash apps (auscomply) and the clean-room `*-template` repos.
---
