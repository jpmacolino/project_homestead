# Project Homestead — Open Items

Tracked but not yet actionable. Each item has a trigger that tells us
when to revisit. Newest at top. Resolved items move out with a one-line
note in DECISIONS.md or a commit reference.

---

## DECISIONS.md format drift

Two competing entry formats: dated `## YYYY-MM-DD` headers vs numbered
`**N. Title.**`. Numbered entries are referenced by number from CLAUDE.md,
ARCHITECTURE.md, and the v2 brief — do not renumber.
**Trigger:** spec-reconciler subagent built (v1).

## \_\_devMarkAllLearnComplete export

Currently exported from useProgress and attached to window in dev mode.
Useful for QA now; must come out before v1.
**Trigger:** start of v1 phase.

## BUILD_SPEC.md §8.1 "8 core shapes" error

§2.3, Appendix A, and shapes.json all say 6. §8.1 is wrong.
Logged in DECISIONS.md 2026-05-18. Not a code fix.
**Trigger:** dedicated spec-reconciliation pass before v1.

## .vscode/settings.local.json permissions list

Stale permissions list noted in v2 brief Session 5 plan.
**Trigger:** Session 5 (MVP integration + QA).

## Learn Mode celebration auto-return timing

Currently 4 seconds. May need to lengthen to let celebration
narration finish before navigating.
**Trigger:** real-child testing before v1.
