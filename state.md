---
# state.md — aud-design-system — 2026-06-06 06:17 AEST
Active goal: Family model + unified splash is shipped in @aud/brand; next horizon is wiring FamilyProvider into the live apps.
Decisions locked:
- Apps group BY FUNCTION into 4 families: Audits/brass·light, Dashboards/steel·dark, Registers/clay·light, Logs/sage·dark. Eucalypt reserved for a 5th. Grouping axis is settled — don't re-debate (resolves last wrap's Decision 1).
- @aud/brand is PUBLIC: employer/venue/app names (Merivale, ivy Precinct, Sydney, GOM, AusComply) stay OUT. The repo's de-identified files win over Drive drafts.
- SplashScreen stays OAuth-first by default; formMode/actionsLast is opt-in for PIN/code apps. theme now follows the enclosing FamilyProvider (defaults dark when none).
- GOM-specific docs do NOT belong in this public repo — they go with gom-venue-audit.
- Within a family: sibling splashes (same scheme/scaffold, per-app glyph via AppMark) — identical mode also supported.
Open questions:
- [CONFIRM] Pre-existing leak on main: showcase/src/App.tsx has "AusComply checklist analytics · IVY Precinct" — fix in a separate de-identification PR?
- [CONFIRM] Move the two GOM files (GOM-Venue-Audit-Quick-Tour.html, aud-mark-gom-audit-spec.md) into the gom-venue-audit repo?
- Which live app adopts FamilyProvider first? (Venue Audit / First Aid are the obvious candidates.)
Built/shipped since last update:
- d1b2ed2 feat(families): add app-family model + FamilyProvider, splash formMode/fieldNote (#3)
Next session starts with: de-identify the showcase IVY/AusComply leak (separate quick PR), then wire FamilyProvider into the first consuming app.
Out of scope right now:
- The GOM quick-tour + gom-audit-spec files (belong with gom-venue-audit, not here).
- The per-app glyph set (spec lists glyphs; AppMark still takes short-codes/icons — not built).
- Overwriting the de-identified originals with the Drive drafts.
---
Previous wrap: b4a886f
