# Project Homestead — Decisions Log

This is an append-only log of decisions made during the build and their rationale. Newest entries at the top.

---

## 2026-05-18 — Service Worker / PWA installability deferred to v1

Decision #7 in ARCHITECTURE.md previously elevated "full offline
capability via Service Worker + Cache API" to a hard MVP requirement.
Revisited consciously and downgraded: SW setup, manifest, and PWA
installability all move to v1, where they pair naturally with Capacitor
packaging.

Rationale: caching complexity is not worth MVP risk; offline assumptions
are easier to get right alongside Capacitor's native packaging in v1;
the MVP test environment (Kindle Fire on stable home WiFi) does not
require offline support to validate the product. The original elevation
was made 2026-05-08 before any screens existed and the risk profile has
since clarified.

ARCHITECTURE.md decision #7 has been amended in the same change to
remove the contradiction. Service Worker work is now a v1 session, not
an MVP requirement.

## 2026-05-18 — Spec drift flagged: BUILD_SPEC §8.1 shape count

BUILD_SPEC.md §8.1 lists "8 core shapes" as MVP scope. §2.3, Appendix A,
and src/data/shapes.json all agree on 6 shapes (Circle, Square,
Triangle, Rectangle, Star, Heart). The code and the rest of the spec
are correct; §8.1 is a spec error.

Logged here so the next agent that reads §8.1 doesn't try to "fix"
shapes.json to match. BUILD_SPEC.md to be corrected in a dedicated
spec-reconciliation pass before v1 — not part of the MVP build.

## 2026-05-09 — Session 4 close-out notes

Learn Mode shipped end-to-end. Three notes for future sessions:

- colors.json has 10 entries, not the 11 listed in BUILD_SPEC §2.4 /
  Appendix A. This matches Decision #7 (indigo + violet collapsed
  to purple). The roster is correct; the spec is the document that
  is out of date. BUILD_SPEC will be reconciled before v1.

- Nunito font is now loaded globally via index.html and configured
  in tailwind.config.js as font-family.display. Components use
  Tailwind's font-display utility class to opt in.

- Learn Mode celebration auto-return is set to 4 seconds. Validated
  during dev QA; revisit with real children before v1 — may need
  to lengthen to allow the celebration narration to finish before
  navigation.

## 2026-05-09 — colors.json extended with color_hex field

Each entry in src/data/colors.json now includes a `color_hex` string
field (e.g. `"color_hex": "#EF4444"`). Required by SkillCard to render
the color swatch via inline style — Tailwind cannot generate dynamic
color classes at runtime. The Skill interface in src/data/types.ts
declares `color_hex` as optional (`color_hex?: string`) so that
letters, numbers, and shapes data remain compatible without the field.

Purple is `#800080` per Decision #7 (indigo/violet collapsed to one
entry). White uses `#FFFFFF`; the card's amber-50 background provides
enough contrast contrast for the swatch to read as distinctly white.
The 10-color roster is confirmed correct per Decision #7.

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
