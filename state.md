---
# state.md — aud-design-system — 2026-06-09 00:18 AEST
Active goal: Turn the Kole Jain UI/UX video haul into the @aud/brand design system (tokens + components + iPhone-native layer), then apply it per-app.
Decisions locked:
- @aud/brand is the single home for design primitives; consume, don't copy. Everything token-derived (color-mix off --aud-accent + neutrals), sharp radius, instrument-panel restraint.
- Shipped as ONE consolidated revision (#25, v0.6.0), which superseded the stacked #22/#23/#24 (closed). On big asks, consolidate up front — don't drip-feed one PR at a time.
- Colour/font FINAL values are Aaron's to tune in-repo. Claude delivers token-driven structure, not taste calls (the rendered markups had colour/fonts off).
- Per-app application lives in each app's own repo, not in @aud/brand.
- NOT adopting (against the restraint brief): gloss/soft-glass, doodles/parallax, animated-text gimmicks, emoji-as-icons.
- (carry) worktree-per-aspect / trunk-mirror model + worktree-guard hook still in force; state.md excepted.
Open questions:
- First consumer to apply the kit to: cleaning-audit (field/iPhone showcase) vs the dashboards (precinct-ops/compliance-v2 colour + chart skeleton). [CONFIRM]
- Aaron's colour/font tuning pass in-repo — still pending. [CONFIRM]
- Whether/when to do backlog batches E–I (per-app dashboards, field apps, presentation, docs) — full list at ~/knowledge/aud-design-backlog.md.
- Clean up the 4 now-merged/superseded worktrees under ~/projects/_wt/ (design-tokens, primitives, motion-states, full)? [CONFIRM]
- (carry) Wayfinder PR #5 still OPEN — additive beside @aud/brand vs SUPERSEDE canonical tokens; merge as-is or iterate? [CONFIRM]
- (carry) ⚠️ Pre-existing IVY leak on main: showcase/src/App.tsx has "…· IVY Precinct" — de-identify (repo is PUBLIC). [CONFIRM]
Built/shipped since last update:
- 9a49f99 Merge pull request #25 from DurrantAaron/feat/design-system-full
- a66fb3d feat: complete design-system layer — colour depth, component kit, iPhone-native, motion
- 9de5658 feat(motion+states): motion tokens, AudSkeleton/AudToast/AudErrorState, syncing chip
- 1bc85dc feat(components): AudButton, StatusChip, EmptyState primitives
- 7ad0696 feat(tokens): semantic colours, elevation, interaction states + heading tightening
- bb6278f feat: add graphify code knowledge graph + auto-rebuild (tooling only) (#21)
Next session starts with: Aaron tunes colour/fonts in aud-design-system, then pick the first consumer app (likely cleaning-audit) and wire in the kit + native.css.
Out of scope right now:
- Per-app application (dashboards, field apps), the presentation/marketing batch, and docs/governance batch — deferred to their own repos/sessions.
- Re-debating component APIs or the consolidated-vs-stacked decision.
- Claude making colour/font/aesthetic calls.
---
Previous wrap: 7d1e481
