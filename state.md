---
# state.md — aud-design-system — 2026-07-05 12:10 AEST
Active goal: Turn the Kole Jain UI/UX video haul into the @aud/brand design system (tokens + components + iPhone-native layer), then apply it per-app.
Decisions locked:
- @aud/brand is the single home for design primitives; consume, don't copy. Everything token-derived (color-mix off --aud-accent + neutrals), sharp radius, instrument-panel restraint.
- Shipped as ONE consolidated revision (#25, v0.6.0), which superseded the stacked #22/#23/#24 (closed). On big asks, consolidate up front — don't drip-feed one PR at a time.
- Colour/font FINAL values are Aaron's to tune in-repo. Claude delivers token-driven structure, not taste calls (the rendered markups had colour/fonts off).
- Per-app application lives in each app's own repo, not in @aud/brand.
- NOT adopting (against the restraint brief): gloss/soft-glass, doodles/parallax, animated-text gimmicks, emoji-as-icons.
- Client-venue de-identification is COMPLETE at HEAD: showcase App.tsx subtitle + AppMark/SplashScreen JSDoc fixed by #27; the last straggler (a real venue name in AudTable JSDoc) genericised to 'Demo Venue' via #28 (merged). Historical commits are accepted as-is rather than rewritten (Aaron's call, 2026-07-05: repo stays public, no filter-repo — 7 consumer apps pin/pull it via unauthenticated git URLs).
- (carry) worktree-per-aspect / trunk-mirror model + worktree-guard hook still in force; state.md excepted.
Open questions:
- First consumer to apply the kit to: cleaning-audit (field/iPhone showcase) vs the dashboards (precinct-ops/compliance-v2 colour + chart skeleton). [CONFIRM]
- Aaron's colour/font tuning pass in-repo — still pending. [CONFIRM]
- Whether/when to do backlog batches E–I (per-app dashboards, field apps, presentation, docs) — full list at ~/knowledge/aud-design-backlog.md.
- Clean up the now-merged/superseded worktrees under ~/projects/_wt/ (design-tokens, primitives, motion-states, full, and the strip-table JSDoc one — its PR merged)? [CONFIRM]
- (carry) Wayfinder PR #5 still OPEN — additive beside @aud/brand vs SUPERSEDE canonical tokens; merge as-is or iterate? [CONFIRM]
Built/shipped since last update:
- 9690118 chore: de-identify client venue name from public repo (#27)
- c392565 chore: stop tracking graphify-out/ (already gitignored) (#26)
- 2026-07-05 system-audit sweep: PNG eyeball DONE — both render PNGs viewed, no visible venue text (byte-match was compression noise); this state.md de-identified (it was the last human-readable venue reference at HEAD).
Next session starts with: Aaron tunes colour/fonts in aud-design-system and picks the first consumer app (likely cleaning-audit) to wire in the kit + native.css.
Out of scope right now:
- Per-app application (dashboards, field apps), the presentation/marketing batch, and docs/governance batch — deferred to their own repos/sessions.
- Re-debating component APIs or the consolidated-vs-stacked decision.
- Claude making colour/font/aesthetic calls.
---
Previous wrap: 4b6f9d3
