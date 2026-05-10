# Project Homestead — Decisions Log

This is an append-only log of decisions made during the build and their rationale. Newest entries at the top.

---

## 2026-05-09 — Decision #12 amended: full-screen overlay rule

Decision #12 originally required pointer-events-none on full-screen
background images. Session 4a QA surfaced a related but distinct
bug: a full-screen flex content container at z-10 was overlaying a
home button also at z-10, swallowing its clicks. The background
image was correctly configured; the content layer was the culprit.

Amended rule: any full-screen layer (image or div) that sits over
interactive elements must either carry pointer-events-none OR sit
at a lower z-index than the interactive elements above it. When
positioning an interactive element absolutely on top of a content
layer, give the interactive element a z-index strictly greater
than the content layer's z-index — do not rely on equal z-index
plus DOM order.

Convention going forward: full-screen content layers use z-10.
Floating interactive overlays (home button, parent corner button,
session timer warnings) use z-20. Modal overlays use z-30+.

## 2026-05-09 — Topic hub uses sub-menu for mode selection

Hub tap (Barn, Garden, Farmhouse, Pasture) navigates to a TopicMenu
screen showing available modes for that topic, not directly into Learn
Mode. MVP shows Learn always; Practice unlocks per-topic once the child
has viewed every item in that topic in Learn Mode at least once.
Tracked in localStorage under learn*seen*<topic>. Future modes (Story,
Matching, Math) plug into the same sub-menu. Route shape:
/topic/:topic for the menu, /learn/:topic and /practice/:topic for
the modes.

## 2026-05-09 — Learn Mode is a single ordered run for MVP

Learn Mode for MVP presents the full topic in canonical order (A-Z,
1-10, etc.), child-paced, exit anytime, position not remembered between
sessions. No lesson chunking, no scoring, no progression within Learn.
Lesson structure (chunked lessons, review lessons, lesson scoring) is a
deferred design question — revisit in Session 11 when the full
curriculum engine is built. Building a chunking system now based on a
guess risks rework when the v1 engine arrives with a different model.

## 2026-05-09 — Audio: SpeechSynthesis for narration in MVP

useAudio uses the browser SpeechSynthesis API for character narration
in MVP. Quality is robotic and device-dependent — acceptable for
internal dev/QA only, not for any external user. The key-based audio
abstraction (Decision #3) preserves the swap path to recorded or
ElevenLabs narration in v1. Sound effects (correct_chime,
incorrect_tone) remain separate and use Web Audio API placeholder
tones per spec §8.1. useAudio.playNarration must no-op silently when
SpeechSynthesis is unavailable or voices have not loaded — verify
behavior on Kindle Fire Silk early in Session 4 QA; if Silk support is
broken, fall back to stub for that platform.

## 2026-05-08 — create-vite v5 used instead of latest

Session 1 used `npm create vite@5` rather than `npm create vite@latest`. The current latest (v9) uses a clack/prompts TTY-only flow that silently cancels when invoked from a non-interactive shell, which is how Claude Code calls it. v5's older interactive flow responds to piped stdin and completed the scaffold cleanly. The Vite version installed into the project is current — only the scaffolder (one-time use, not part of the build) was pinned to v5. Re-scaffolds should use the same incantation.

## 2026-05-08 — Stack version pins

Vite chosen over Create React App (CRA is deprecated). React 18.2, Tailwind 3.x, TypeScript 5.x, Dexie 3.x pinned as the project defaults. See ARCHITECTURE.md → Versions for the full table.

## 2026-05-08 — Offline capability scope

Decision #7 in ARCHITECTURE.md elevates "full offline capability via Service Worker + Cache API" to a hard MVP requirement, ahead of what the build spec strictly mandates. Rationale: deferring service worker setup to v1 risks subtle caching bugs that are hard to reproduce. This is an interpretation of the spec, not a direct transcription.

**7. Color roster reduced to 10; indigo and violet collapsed to single
purple entry.**
Indigo and violet removed from the color set. Purple (#800080) replaces
both. assess_weight is 1.0 for all colors — no special-cased weights
anywhere in the content data. ROYGBIV becomes ROYGBV.

**8. activeChildId hardcoded as "child_1" for MVP.**
HomeScreen and useProgress use a single named constant ACTIVE_CHILD_ID =
"child_1". This is the swap point for multi-profile support in Session 10
— do not spread this string elsewhere.

**9. HUB_CONFIG is module-level in HomeScreen.**
The four hub definitions (topic, label, icon, route) live as a
module-level constant in HomeScreen.tsx, not as props or context.
Content is static for MVP — revisit if hubs become dynamic in v1.

**10. tsconfig.app.json has resolveJsonModule: true.**
Required for typed JSON data imports (src/data/\*.json). Added in
Session 3. All content JSON imports are typed as a result.

**11. /learn route changed to /learn/:topic.**
React Router route updated in App.tsx so all four hub routes
(/learn/letters, /learn/numbers, /learn/shapes, /learn/colors)
resolve from a single parameterized route.

**12. Background image requires pointer-events-none.**
The homestead_default.png background uses absolute inset-0 positioning.
Without pointer-events-none on the img element it captures all pointer
events despite z-0, blocking hub and parent corner interaction.
All future full-screen background images must include pointer-events-none.
