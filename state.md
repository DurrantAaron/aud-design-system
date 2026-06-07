---
# state.md — aud-design-system — 2026-06-07 17:06 AEST
Active goal: Splash-skin system for the suite is shipped + saved; the still-open strategic decision is the "Wayfinder" colour direction (additive vs supersede). The latest run productionised the sign-in splashes (full-bleed) and saved a Wordmark skin revision.
Decisions locked:
- THREE selectable splash skins, all drop-in (same props: appName/family/theme/formMode+children/primary/secondary): `DuotoneSplash`, `EditorialSplash`, and NEW `WordmarkSplash`. Hubs: `DuotoneMissionControl`, `EditorialMissionControl`.
- `DuotoneSplash` is now FULL-BLEED (#16): the duotone colour fills the screen edge-to-edge (no framed card), top chrome removed (brand chip + SECURE pill + meta), foot = plain "powered by AuD".
- iOS-standalone correctness baked into every takeover: absolute stage in a fixed-height `overflow:hidden` outer; `min-height:0`; safe-area-inset padding; `useTakeoverBody(bg)` paints html/body + locks document scroll (overscroll-behavior:none) so iOS can't rubber-band-elongate the 100dvh stage; wordmark/title auto-fit. (Root cause earlier: a `height:100dvh` stage that is a FLEX ITEM in a min-height wrapper inflates to content instead of clamping.)
- `startAutoUpdate()` exported (PWA): installed apps reload to a new deploy on foreground-return — no icon re-add (needs no-cache `/` + `/index.html` headers, which both apps now have).
- `WordmarkSplash` (#17) = the early AUDITOR/CLEANSE/FIRSTAID stencil wordmark + instrument chrome (REV·SECURE, grid, accent glow, corner ticks, BUILT IN AUSTRALIA). SAVED AS A REVISION (#18, design/REVISIONS.md + design/revisions/wordmark-splash.png) — NOT wired into any app (Aaron's call). Codenames kept as-is.
- Per-app theme is set by each app, not here: Precinct Ops = dark, First Aid = light.
- (carry, Wayfinder) "Wayfinder" remains an ADDITIVE proposal under proposals/wayfinder/ in open PR #5 — does NOT modify canonical @aud/brand. Per-app map: VA amber #BE8A2E · CL green #3F8B5C · FA coral #C8483E · CO blue #2E6FAE · SE indigo #5A4F9C · GS plum #9E4A80.
Open questions:
- (carry) Wayfinder: additive (beside @aud/brand) vs SUPERSEDE (rewrite canonical tokens the 3 live apps pull)? Merge PR #5 as-is or iterate? [CONFIRM]
- (carry) Pre-existing IVY leak on main: showcase/src/App.tsx has "…· IVY Precinct" — de-identify in a separate PR (PUBLIC repo). [CONFIRM]
- ⚠️ CONCURRENT EDITS: another actor/session also commits here (e.g. #15 hub launcher-scroll fix → bd032e6, and the Wayfinder PR #5). Always `git pull` before branching; my splash bumps are forward of bd032e6 so they merge clean.
- Wire `WordmarkSplash` into an app to trial it live? (currently saved-only) [CONFIRM]
Built/shipped since last update (all merged to main):
- #11 iOS standalone safe-area + body paint; #12 iPhone-fit (absolute stage); #13 Editorial fit + startAutoUpdate; #14 scroll-lock (useTakeoverBody); #16 full-bleed DuotoneSplash; #17 WordmarkSplash skin; #18 wordmark saved as revision. (#15 hub-scroll was the concurrent session.)
Next session starts with: Decide Wayfinder additive-vs-supersede (PR #5), or wire WordmarkSplash into a pilot app — and de-identify the showcase IVY string.
Out of scope right now:
- Wayfinder per-app rollout into live apps.
- Editorial skin is phone-ready but unused by any live app.
---
Previous wrap: b32c163
