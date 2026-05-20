# Project Homestead — Session Working Notes

Last updated: 2026-05-19 (post-Session 1)

---

## Where we are

Session 1 complete and committed to main. CLAUDE.md moved to repo root,
SW/PWA deferral reconciled across DECISIONS.md and ARCHITECTURE.md,
`OPEN_ITEMS.md` created as a third tracking file. Ready for Session 2.

## What's queued next

- **Session 2: Practice Mode** — FlashCard, usePracticeSession (weighted
  random + spaced repetition lite), PracticeScreen. v2 brief §4.1.
- Likely introduces Vitest. Strong candidate for building a Vitest-flavored
  test-writer subagent alongside, since the practice/mastery logic is
  testable as pure functions.

## Open threads with Claude

- **Co-Authored-By trailer on CC commits.** CC adds
  `Co-Authored-By: Claude Sonnet 4.6` by default. Decide whether to add
  a CLAUDE.md rule against it, or leave as-is. Currently leaving as-is.
- **Format drift in DECISIONS.md.** Parked for the spec-reconciler subagent
  in v1; tracked in OPEN_ITEMS.md. No action this session.

## Recent context Claude should know

- Branch strategy: staying on `main` going forward. Feature branches
  reserved for big adds only, kept up for practice.
- `OPEN_ITEMS.md` created post-Session 1 alongside `DECISIONS.md` and
  `ARCHITECTURE.md`. Items have triggers, not vague "somedays."
- v2 orchestration brief is the active brief. v1 retained in repo as
  historical record.
- New ritual: at the end of each design chat, Claude outputs the next
  version of this file for paste-in.

---

## Session-close ritual

At the end of every design chat with Claude, before the chat closes:

1. Claude outputs an updated version of this file in a paste-ready block.
2. Joseph replaces the contents of `SESSION_NOTES.md` with the new version
   and commits it (or updates the in-Claude file).
3. The new version becomes the first thing pasted into the next chat.

This file is the bookmark between sessions. It should fit on one screen.
If it grows past that, prune — older context belongs in DECISIONS.md,
ARCHITECTURE.md, or OPEN_ITEMS.md, not here.
