# Project Homestead — Decisions Log

This is an append-only log of decisions made during the build and their rationale. Newest entries at the top.

---

## 2026-05-08 — create-vite v5 used instead of latest

Session 1 used `npm create vite@5` rather than `npm create vite@latest`. The current latest (v9) uses a clack/prompts TTY-only flow that silently cancels when invoked from a non-interactive shell, which is how Claude Code calls it. v5's older interactive flow responds to piped stdin and completed the scaffold cleanly. The Vite version installed into the project is current — only the scaffolder (one-time use, not part of the build) was pinned to v5. Re-scaffolds should use the same incantation.

## 2026-05-08 — Stack version pins

Vite chosen over Create React App (CRA is deprecated). React 18.2, Tailwind 3.x, TypeScript 5.x, Dexie 3.x pinned as the project defaults. See ARCHITECTURE.md → Versions for the full table.

## 2026-05-08 — Offline capability scope

Decision #7 in ARCHITECTURE.md elevates "full offline capability via Service Worker + Cache API" to a hard MVP requirement, ahead of what the build spec strictly mandates. Rationale: deferring service worker setup to v1 risks subtle caching bugs that are hard to reproduce. This is an interpretation of the spec, not a direct transcription.
