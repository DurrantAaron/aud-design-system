---
# state.md — aud-design-system — 2026-06-06 07:20 AEST
Active goal: Settle the venue-ops suite's cross-app colour/theme direction — the fresh "Wayfinder" proposal vs the adopted @aud/brand family model — then roll the chosen one out.
Decisions locked:
- This session designed a FRESH scheme ("Wayfinder") at Aaron's request — set @aud/brand aside as the *basis* but kept its proven STRUCTURE: constant neutrals + one accent per app + light/dark.
- One accent per app (colour alone distinguishes apps). Launcher (precinct-ops-dashboard) is a NEUTRAL HUB showing every line accent at once — no accent of its own.
- This pass is SPEC/DECISIONS ONLY — no app code changes.
- Wayfinder saved ADDITIVELY under proposals/wayfinder/ — does NOT modify canonical @aud/brand (src/, tokens/, fonts/ untouched), so live apps consuming @aud/brand are unaffected. Lives in open PR #5.
- Wayfinder per-app map: VA amber #BE8A2E · CL green #3F8B5C · FA coral #C8483E · CO blue #2E6FAE · SE indigo #5A4F9C · GS plum #9E4A80. Type = Space Grotesk + IBM Plex Sans + IBM Plex Mono.
Open questions:
- [CONFIRM] "a revision of something new": current state is ADDITIVE (Wayfinder beside @aud/brand). Alternative = promote it to a v2 that SUPERSEDES @aud/brand (rewrites the canonical tokens 3 live apps pull) — deliberately not done silently. Which does Aaron want?
- Open levers before any rollout: neutral temperature (cool-fresh vs re-warm), colour confidence (line bars vs strict accent-only), per-app hue swaps (security↔guest, cleaning→teal), final name ("Wayfinder" is a placeholder).
- Merge PR #5 as-is (version-controls the exploration) or iterate first?
- [CONFIRM] Pre-existing leak on main: showcase/src/App.tsx has "AusComply checklist analytics · IVY Precinct" — still unfixed; de-identify in a separate PR? (PUBLIC repo)
- [CONFIRM] Move the two GOM files (GOM-Venue-Audit-Quick-Tour.html, aud-mark-gom-audit-spec.md) into the gom-venue-audit repo? (still open)
Built/shipped since last update:
- (nothing merged to main this session) — work is in open PR #5, branch proposal/wayfinder: proposals/wayfinder/ (README spec + specimen.html + render), commit 9e2e29c. Additive; canonical @aud/brand untouched.
Next session starts with: Decide additive-vs-supersede for Wayfinder and lock the open levers, then either merge PR #5 or iterate the proposal.
Out of scope right now:
- App code changes / per-app rollout (separate session, pilot app first in a worktree).
- Non-UI projects (auscomply, mempalace, gridfinity) and the parked NTE dashboard.
- precinct-ops-dashboard has no Tailwind/brand yet; guest-screening-tool isn't a git repo yet — flagged for rollout, not actioned.
- FamilyProvider rollout into live apps (prior wrap's goal) — parked behind the scheme-direction decision.
---
Previous wrap: 2e8a93b
