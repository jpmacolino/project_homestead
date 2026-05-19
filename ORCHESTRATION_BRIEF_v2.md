# Project Homestead — Orchestration Brief v2

**May 2026 | Course 2 working spine | Supersedes `ORCHESTRATION_BRIEF.md`**

> This brief replaces the original orchestration brief written before Course 1. The original predated most of what Course 1 taught about Claude Code infrastructure (CLAUDE.md, subagents, hooks, slash commands, skills) and operated one rung below current capability. The original brief remains in the repo as historical record — do not delete it.

---

## 1. Project status

Project Homestead is a paused, healthy build resuming after ~8 days idle (last commit `977257c`, 2026-05-10). Sessions 1–4 landed cleanly. Learn Mode is end-to-end functional for all four Sprout topics.

**What works:** Scaffold, routing, data layer (letters, numbers, shapes, colors), `useProgress` localStorage hook, `useAudio` (SpeechSynthesis narration + Web Audio effects), `HomeScreen` with four hubs, `TopicMenuScreen` with Learn/Practice gating, `LearnScreen` ordered walkthrough, `HenCharacter` with three expression states.

**What's stubbed:** `PracticeScreen`, `DailyScreen`, `ParentCornerScreen` — three lines each, render only a heading.

**What's empty:** `src/services/` (no curriculum or mastery service modules yet), `src/audio/` (no audio files; SpeechSynthesis covers narration for MVP).

**What's mounted but unused:** `AppContext` is wired into `main.tsx` but no component reads from it. `useProgress` uses a hardcoded `ACTIVE_CHILD_ID = "child_1"`. This is intentional scaffolding for multi-profile support (planned v1).

**What's intentionally deferred:** Service Worker / PWA installability moved to v1, paired with Capacitor packaging (see §2.2 below). Multiple child profiles, Dexie, narration audio files — all v1.

---

## 2. Active decisions

### 2.1 Decisions from `DECISIONS.md` still in force

`DECISIONS.md` is the authoritative record. The entries most load-bearing for the next phase of build:

- **Color roster is 10, not 11.** Indigo and violet collapsed to a single purple entry (`#800080`). All `assess_weight` values are `1.0`. ROYGBV. *(Decision #7)*
- **Audio is key-based even when keys are no-ops.** `useAudio.playNarration(audioKey, text)` accepts a key parameter that is currently unused — narration goes through SpeechSynthesis with the text directly. The key is preserved so v1 can swap to recorded audio without refactoring callers. *(2026-05-09 audio entry)*
- **`TopicMenuScreen` is the route between hub and mode.** Hub tap → `/topic/:topic` → mode tile tap → `/learn/:topic` or `/practice/:topic`. Practice is locked per-topic until Learn for that topic is completed at least once. Tracked under `homestead.learn_seen.<topic>` in localStorage.
- **Z-index convention:** background layers `z-0` + `pointer-events-none`, content layers `z-10`, floating interactive overlays `z-20`, modals `z-30+`. Full-screen background `<img>` elements must always have `pointer-events-none`. *(Decision #12, amended)*
- **`HUB_CONFIG` lives in `src/data/hubs.ts`,** not inline in `HomeScreen`. Imported by both `HomeScreen` and `LearnScreen`. This corrects Decision #9 which described the intent but not the final file location.
- **Nunito loaded globally** via `index.html` and configured in `tailwind.config.js` as `font-family.display`. Components opt in via Tailwind's `font-display` utility.

### 2.2 New decisions logged in Session 0 audit

To be migrated into `DECISIONS.md` during Session 1, in canonical format:

- **Service Worker / PWA deferred to v1.** Pairs naturally with Capacitor packaging. The original elevation to a hard MVP requirement was made in DECISIONS.md on 2026-05-08, before any screens existed; revisited consciously and downgraded. Rationale: caching complexity not worth MVP risk; better paired with Capacitor's offline assumptions in v1; Kindle Fire test environment is on stable home WiFi.
- **`.vscode/CLAUDE.md` rule 5 is stale.** *"Indigo `assess_weight = 0.3`"* contradicts Decision #7. To be corrected when CLAUDE.md moves to repo root in Session 1.
- **`BUILD_SPEC.md` §8.1 says "8 core shapes"** but §2.3, Appendix A, and `shapes.json` all say 6. Spec error, not a code bug. Correct in BUILD_SPEC before v1.
- **`AppContext` and `ACTIVE_CHILD_ID` are not yet connected.** Acceptable until v1 multi-profile work. Decision logged so the next agent that touches either doesn't try to "fix" the apparent dead code.
- **`__devMarkAllLearnComplete` must come out before v1.** Currently exported from `useProgress` and attached to `window` in dev mode. Useful for QA right now. Removal is a v1 task, not MVP.

### 2.3 What this means for the v1 boundary

MVP is now: three remaining screens (Practice, Daily, Parent Corner) + onboarding flow. SW / Capacitor / multi-profile / narration audio files / Seedling content / matching games all start v1. The MVP-to-v1 transition is closer than the original brief suggested — roughly four more sessions, not eight.

---

## 3. CC infrastructure plan

The build pattern changes here. The original brief's *"paste ARCHITECTURE.md and DECISIONS.md into every prompt"* ritual is replaced by Claude Code's native infrastructure. Each capability has a natural target in the existing codebase.

### 3.1 CLAUDE.md (repo root)

**Move first, expand on review.** `.vscode/CLAUDE.md` moves to repo root (where CC's auto-load looks). The seven existing rules get reviewed in Session 1 — some survive, some merge, the stale indigo rule gets corrected.

**Pattern: reference, not inline.** CLAUDE.md is small and load-bearing. It points to authoritative deep sources using backticks: *"for the full color roster see `src/data/colors.json`"*, *"for rationale on indigo's removal see Decision #7 in `DECISIONS.md`"*, *"for the z-index convention see Decision #12 in `DECISIONS.md`"*. CC reads the referenced file when the task calls for it.

This is the explicit replacement for the old "paste docs into every prompt" pattern.

### 3.2 Slash commands

The original brief's prompt templates (§5.1–5.4) are the obvious starters. The ritual of "set context, then ask" collapses into a command:

- **`/new-component`** — replaces original §5.1. Asks for component name, props, events, and produces the scaffolded file in `src/components/`.
- **`/bug-fix`** — replaces original §5.3. Takes reproduction steps, identifies relevant files, fixes without refactoring unrelated code.
- **`/content-gen`** — replaces original §5.4. Generates content JSON for new tracks (Seedling letters, Sapling math items) following the schema.
- **`/decision-log`** — captures a decision into `DECISIONS.md` in the canonical format (date header, rationale, links to affected files). Automates the end-of-session ritual that has been by hand to date.

`/new-api-endpoint` (the original brief's §5.2) is parked until backend work begins in v2.

### 3.3 Skills

- **Content generation skill.** Original brief §5.4 is the textbook case. Takes a track and topic, produces a fully-formed JSON array matching the existing schema, validates against the `Skill` interface, ensures all `assess_weight` values follow the post-Decision-#7 rules. First use: Seedling content during v1.
- **`DECISIONS.md` formatter skill.** Maintains the appended-newest-on-top format, includes timestamps, links to affected files. Pairs with `/decision-log`.
- *Speculative — defer until needed:* a "homestead asset prompt" skill that produces consistent Midjourney prompts for new character expressions and hub icons matching the established flat-illustration style. Park until v1 art expansion.

### 3.4 Hooks

The audit surfaced four convention violations that have either bitten or could bite. Each is hook-shaped:

- **No direct `src/audio/` imports.** Enforces the key-based audio abstraction. Catches CLAUDE.md rule 4 violations at write time.
- **No hardcoded learning content in components.** Catches strings like `'A'`, `'red'`, or hex color values inline in JSX. Enforces CLAUDE.md rule 3.
- **No `__dev*` exports in production builds.** Currently `__devMarkAllLearnComplete` is exported from `useProgress`. A pre-build hook should flag this. Informational for MVP; should block before v1.
- **`pointer-events-none` on full-screen background images.** Decision #12 emerged from a real bug. Linting for `inset-0` + `<img>` without `pointer-events-none` catches it before it ships.

### 3.5 Subagents

Course 1 produced three subagents: **code-reviewer**, **test-writer** (pytest-specific, not portable), and **doc-writer**. Mapped to Homestead:

- **code-reviewer** (portable from Course 1) — runs on completed components, flags convention violations, suggests cleanup. Natural fit at end of each session.
- **doc-writer** (likely repurposable from Course 1) — natural job here: keep COMPONENT_MAP.md / ARCHITECTURE.md current, append to DECISIONS.md, reconcile spec drift like the §8.1 / §2.3 shape count. Worth a review pass to see how much of the Course 1 version transfers.
- **test-writer** (Course 1 version is pytest-specific, not transferable) — replaced by a new Vitest-flavored equivalent built when testing is introduced. Strong candidate to come in alongside Session 2 (Practice Mode), where weighted random and spaced repetition logic are testable as pure functions.
- **spec-reconciler** (new) — catches drift between BUILD_SPEC, ARCHITECTURE.md, DECISIONS.md, and the codebase. Would have surfaced the SW gap, the indigo staleness, and the shape count discrepancy in routine maintenance rather than via audit. Build when spec drift becomes a regular concern, likely v1.

### 3.6 Smoke-test stage

`npm run build && tsc --noEmit` is the baseline. Added to whatever runs at the end of an agent chain. Catches the "agent wrote code that doesn't compile and didn't notice" failure mode.

Vitest gets added around Session 2 (Practice Mode), where the curriculum/mastery logic is finally testable as pure functions rather than UI flows.

---

## 4. Build sequencing

The original brief decomposed 32 sessions across four phases up front. This brief details only what's actually next. Phase 2+ stays sketched.

### 4.1 Course 2 / MVP completion sessions

- **Session 1 — CLAUDE.md (root).** Move `.vscode/CLAUDE.md` to repo root. Review the seven existing rules; some survive, some merge, the stale indigo rule (rule 5) gets corrected. Add the "reference, don't inline" pointers to `ARCHITECTURE.md` and `DECISIONS.md`. Migrate the Session 0 audit's new decisions (§2.2) into `DECISIONS.md` proper. Commit. This is the only session that doesn't ship product code — it ships the infrastructure that the rest of Course 2 runs on.

- **Session 2 — Practice Mode.** First real product session under the new CLAUDE.md. Builds `FlashCard`, `usePracticeSession` (weighted random, spaced repetition lite), `PracticeScreen`. Likely the session where Vitest gets introduced and a Vitest-flavored test-writer subagent earns its keep. Also the first feedback loop on whether CLAUDE.md is doing its job — if agents still need lots of context pasted, the file needs more.

- **Session 3 — Daily Curriculum.** Builds the stubbed daily session engine (BUILD_SPEC §4.3). Static rotation for MVP per §8.1; full client-side curriculum engine is v1. Adds `SessionTimer` and parent session time limit. `/decision-log` likely earns its keep here.

- **Session 4 — Parent Corner + Onboarding.** `ParentGate` (arithmetic check), onboarding flow (name, age, time limit, audio), `ParentCornerScreen` (progress summary, struggle items — note: `getStruggleItems` is already implemented in `useProgress`, just needs a consumer).

- **Session 5 — MVP integration + QA.** Wire end-to-end, Kindle Fire smoke test, settings cleanup including the stale `settings.local.json` permissions list, formal MVP sign-off.

### 4.2 v1 sessions (sketched)

Service Worker + manifest + Capacitor packaging | Dexie migration | multi-child profiles (connects `AppContext` to `useProgress`, removes the `ACTIVE_CHILD_ID` const) | Seedling content | narration audio | matching games | Goat character. `__devMarkAllLearnComplete` removal happens in this phase. Spec-reconciler subagent likely built here.

### 4.3 v2 / v3 (further sketched)

Story Mode + Supabase sync + Google Play | Tauri desktop + Branch/Canopy content + parent analytics dashboard. As per `BUILD_SPEC.md` §9. Detail when v1 lands.

---

## 5. What we learned from the audit

Five things the audit surfaced that the original brief didn't anticipate:

1. **"Paste docs into every prompt" was doing the job CLAUDE.md is designed for.** The pattern survived because the file didn't exist where CC could find it (`.vscode/CLAUDE.md` is not on the auto-load path). Moving CLAUDE.md to root and trusting CC's auto-load replaces the ritual.

2. **The build outgrew the brief naturally and correctly.** `TopicMenuScreen` and Practice unlock gating weren't planned, but they're sound additions. The brief's session-by-session pre-decomposition was too rigid; this revision treats build sequencing as *"the next five sessions are clear; everything else is direction, not commitment."*

3. **Drift accumulates silently.** The SW gap, the stale indigo rule in `.vscode/CLAUDE.md`, the `§8.1` shape count error — none of these would have been caught by routine development. They needed an audit. This is what the spec-reconciler subagent is for, once it exists.

4. **Decisions deserve their own ritual.** `DECISIONS.md` has been kept by hand, well. Course 2's `/decision-log` and the doc-writer subagent automate the ritual, but the *practice* — capture the decision and rationale when made, not later — was already right.

5. **MVP is closer than the original brief framed it.** Three more screens. The original 32-session decomposition stretched MVP across eight sessions of frontend work. The reality is four more sessions.

---

*Brief revised at Session 0 of Course 2, 2026-05-18, after a state-of-the-build audit. The original `ORCHESTRATION_BRIEF.md` remains in the repo as historical record.*
