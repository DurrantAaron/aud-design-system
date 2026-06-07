---
# state.md — aud-design-system — 2026-06-07 18:04 AEST
Active goal: Concurrent Claude sessions on this repo are now collision-proof (worktree-per-aspect); the live open design call remains the Wayfinder colour direction (PR #5), with glyph + splash work now isolated in their own worktrees.
Decisions locked:
- [NEW] Trunk-mirror model: ~/projects/aud-design-system stays on clean `main`; ALL work happens in ~/projects/_wt/<aspect> on `feat/<aspect>` branches. One aspect → one branch → one PR. This RESOLVES the prior "concurrent edits clobber each other" problem.
- [NEW] `worktree-guard` PreToolUse hook (in ~/.claude, backed up in mempalace repo) enforces it across every ~/projects repo: blocks Edit/Write to a primary checkout sitting on main/master. `state.md` excepted (wrap convention). Fails open on uncertainty.
- [NEW] ~/projects/_wt/ is the canonical worktree location (not ~/worktrees/). Glyph design provenance lives in main under design/; shipped glyphs (src/glyphs) were already in main.
- THREE drop-in splash skins (same props): `DuotoneSplash` (FULL-BLEED, #16), `EditorialSplash`, `WordmarkSplash` (#17, saved-only, NOT wired into any app). Hubs: `DuotoneMissionControl`, `EditorialMissionControl`. Per-app theme set by each app, not here.
- (carry) Wayfinder remains an ADDITIVE proposal under proposals/wayfinder/ in open PR #5 — does NOT modify canonical @aud/brand. Per-app map: VA #BE8A2E · CL #3F8B5C · FA #C8483E · CO #2E6FAE · SE #5A4F9C · GS #9E4A80.
Open questions:
- (carry) Wayfinder: additive (beside @aud/brand) vs SUPERSEDE canonical tokens? Merge PR #5 as-is or iterate? [CONFIRM]
- (carry) ⚠️ Pre-existing IVY leak on main: showcase/src/App.tsx has "…· IVY Precinct" — de-identify in a separate PR (this repo is PUBLIC). [CONFIRM]
- (carry) Wire `WordmarkSplash` into an app to trial it live? (currently saved-only) [CONFIRM]
- [NEW] ~9 other already-merged remote branches still on origin (feat/wordmark-splash, feat/splash-fullbleed, fix/ios-overscroll, fix/ios-standalone, fix/splash-fit, feat/app-mark, feat/editorial-fit-autoupdate, docs/wordmark-revision, state/wrap-20260607) — sweep them too? [CONFIRM]
- [NEW] atmos showcase harness on feat/splash predates recent SplashScreen changes — prop sanity-check when splash work resumes. [CONFIRM]
- [NEW] finalists.png + home-screen.png filed with the splash/atmosphere renders; move to glyphs if mis-sorted. [CONFIRM]
Built/shipped since last update:
- 4df09e9 feat(design): glyph provenance — generator, source SVGs, direction doc + renders (#20)
Next session starts with: cd into ~/projects/_wt/aud-glyphs or ~/projects/_wt/aud-splash (NEVER the trunk checkout) and continue that aspect — feat/splash already carries the rescued atmosphere provenance, ready to PR. Or resolve Wayfinder (PR #5) / de-identify the showcase IVY string.
Out of scope right now:
- Other repos' stale-branch cleanup (pending the CONFIRM above)
- Regenerating glyphs (generator landed; no rebuild needed)
- proposal/wayfinder rollout into live apps; Editorial skin live rollout
---
Previous wrap: 1b2a567
