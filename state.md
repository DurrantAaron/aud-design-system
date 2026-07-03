---
# state.md — aud-design-system — 2026-07-03 17:03 AEST
Active goal: Turn the Kole Jain UI/UX video haul into the @aud/brand design system (tokens + components + iPhone-native layer), then apply it per-app.
Decisions locked:
- @aud/brand is the single home for design primitives; consume, don't copy. Everything token-derived (color-mix off --aud-accent + neutrals), sharp radius, instrument-panel restraint.
- Shipped as ONE consolidated revision (#25, v0.6.0), which superseded the stacked #22/#23/#24 (closed). On big asks, consolidate up front — don't drip-feed one PR at a time.
- Colour/font FINAL values are Aaron's to tune in-repo. Claude delivers token-driven structure, not taste calls (the rendered markups had colour/fonts off).
- Per-app application lives in each app's own repo, not in @aud/brand.
- NOT adopting (against the restraint brief): gloss/soft-glass, doodles/parallax, animated-text gimmicks, emoji-as-icons.
- IVY/Merivale de-identification is COMPLETE in tracked source: showcase App.tsx subtitle + AppMark/SplashScreen JSDoc fixed by #27; the last straggler ('The Ivy' in AudTable JSDoc) genericised to 'Demo Venue' this session. Public repo is clean of identifiable references in code.
- (carry) worktree-per-aspect / trunk-mirror model + worktree-guard hook still in force; state.md excepted.
Open questions:
- [CONFIRM] PR #28 (feat/strip-ivy-table — genericise last IVY JSDoc ref) is OPEN, no CI checks on repo, safe one-line change. Merge + clean up the worktree, or leave for eyeball first?
- [OPTIONAL] Two design render PNGs byte-match "ivy" — design/renders/family/cleaning-dashboard.png and design/renders/real-component/precinct-compliance.png. Likely compression noise, but they're rendered images on a public repo — worth an eyeball to confirm no visible "IVY Precinct" text.
- First consumer to apply the kit to: cleaning-audit (field/iPhone showcase) vs the dashboards (precinct-ops/compliance-v2 colour + chart skeleton). [CONFIRM]
- Aaron's colour/font tuning pass in-repo — still pending. [CONFIRM]
- Whether/when to do backlog batches E–I (per-app dashboards, field apps, presentation, docs) — full list at ~/knowledge/aud-design-backlog.md.
- Clean up the now-merged/superseded worktrees under ~/projects/_wt/ (design-tokens, primitives, motion-states, full, and this session's strip-ivy after #28 lands)? [CONFIRM]
- (carry) Wayfinder PR #5 still OPEN — additive beside @aud/brand vs SUPERSEDE canonical tokens; merge as-is or iterate? [CONFIRM]
Built/shipped since last update:
- 9690118 chore: de-identify IVY precinct name from public repo (#27)
- c392565 chore: stop tracking graphify-out/ (already gitignored) (#26)
Next session starts with: Decide PR #28 (merge or eyeball), then Aaron tunes colour/fonts in aud-design-system and picks the first consumer app (likely cleaning-audit) to wire in the kit + native.css.
Out of scope right now:
- Per-app application (dashboards, field apps), the presentation/marketing batch, and docs/governance batch — deferred to their own repos/sessions.
- Re-debating component APIs or the consolidated-vs-stacked decision.
- Claude making colour/font/aesthetic calls.
---
Previous wrap: 4b6f9d3
