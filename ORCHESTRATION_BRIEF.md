# Project Homestead — Orchestration Brief
**How to Execute the Build Spec Systematically Using Claude Code**
**Version 2.0 | May 2026 | Internal Development Use**

---

## 1. Purpose of This Document

This brief is the companion to the Project Homestead Build Specification. Where the build spec defines *what* to build, this document defines *how* to build it — specifically how to structure work for Claude Code, how to keep architectural coherence across a long multi-session build, and how to maintain the small set of project documents that keep Claude Code's output consistent over time.

The workflow assumed by this brief is specific: a single human (the project lead) collaborating with Claude Code, where Claude Code writes 100% of the code and the human role is specification, QA, testing, and product judgment. Graphics and audio production may involve an additional family member but are not part of the coding loop. This is a deliberate, modern, AI-assisted workflow — not a generic team workflow.

Claude Code performs best when each task is:

- **Tightly scoped** — one task, one concern
- **Fully self-contained** — relevant context provided in the prompt
- **Architecturally consistent** — grounded in decisions already made
- **Verifiable** — has a clear definition of "done" the human can test

Without this structure, long builds drift: components make conflicting assumptions, architectural decisions get re-litigated in every session, and the codebase becomes incoherent. This brief prevents that.

---

## 2. Claude Code Project Setup

### 2.1 Create a Dedicated Claude Project

Before writing a single line of code, create a new Claude Project (not a regular chat). All build sessions happen inside this project. This is critical because:

- Project memory persists across sessions — architectural decisions made in session 1 are available in session 20
- Files uploaded to the project (build spec, architecture doc, content JSON) are available to every session without re-uploading
- Context accumulates — the project becomes the living brain of the build

> **⚠ Do Not Build in Regular Chats**
> Regular chats have no memory across sessions. Every task launched from a regular chat requires you to manually re-inject all context. Use the dedicated Claude Project for all Homestead build work.

### 2.2 Project Knowledge Files

The previous version of this brief proposed seven living documents (ARCHITECTURE.md, SCHEMA.sql, COMPONENT_MAP.md, API_CONTRACTS.md, OPEN_ITEMS.md, CONTENT_SEED.json, plus a session log). For a single-developer-plus-Claude-Code workflow, that overhead is too high — most of those documents exist to keep multiple humans in sync with each other, a problem this workflow doesn't have.

The lean version is three files. They are the only project knowledge files you need to maintain:

| File | Purpose | When Created |
|---|---|---|
| `BUILD_SPEC.md` | Full product and technical specification (this document's companion) | Before session 1 |
| `ARCHITECTURE.md` | Living document: stack decisions, folder structure, naming conventions | Session 1 |
| `DECISIONS.md` | Append-only log of decisions made and their rationale | Session 1, updated as decisions arise |
| `src/data/*.json` | Content data — letters, numbers, shapes, colors, etc. | Session 2 onward |

What was deliberately cut, and why:

- **SCHEMA.sql** — there is no SQL database in v1. The IndexedDB schema lives in code (Dexie's TypeScript schema definition). When Supabase is added in v2, the schema lives in Supabase migrations, not a separate file.
- **COMPONENT_MAP.md** — TypeScript types and the component files themselves are the source of truth. Claude Code can read `src/components/` directly when it needs to know what exists.
- **API_CONTRACTS.md** — there is no hand-written API. Supabase auto-generates its REST surface from the database schema in v2.
- **Session log template** — git commit history serves the same purpose. Every session ends with a commit that describes what was done.

### 2.3 ARCHITECTURE.md — Starter Template

Create this file in session 1 and keep it updated. Every task prompt should reference it.

```markdown
# Project Homestead — Architecture

## Stack
- Frontend: React 18, TypeScript, Tailwind CSS (core utilities), React Router v6
- State: React Context + useReducer
- Storage (MVP): localStorage
- Storage (v1+): IndexedDB via Dexie
- Storage sync (v2+): Supabase (Postgres + Auth + auto-generated REST)
- Mobile packaging (v1+): Capacitor (React → Android APK)
- Desktop packaging (v3): Tauri (React → native desktop, Electron as fallback)

## Folder Structure
homestead/
  src/
    components/    # Reusable UI components
    screens/       # Top-level screen components (Home, Learn, Practice, etc.)
    context/       # React Context providers
    hooks/         # Custom hooks
    services/      # Pure logic modules (curriculum engine, mastery calc)
    data/          # Content JSON (letters, numbers, shapes, colors)
    audio/         # Audio file references (key-based)
    assets/        # Images, SVGs
    db/            # Dexie schema and IndexedDB access (v1+)
    sync/          # Supabase client and sync logic (v2+)
  public/

## Naming Conventions
- Components: PascalCase (FlashCard, DailySession)
- Hooks: camelCase with "use" prefix (useChildProfile, useSession)
- Services: camelCase (curriculumEngine, masteryCalculator)
- DB tables (Dexie + Supabase): snake_case plural (skill_events, daily_log)
- Content IDs: topic_value format (letter_G, color_red, shape_triangle)

## Key Decisions
- All application logic runs client-side at every version. The curriculum engine, mastery calculation, and daily session generation never move to a server.
- Supabase (v2+) is a sync layer only — it stores events and syncs them across devices. It does not run business logic.
- Audio is referenced by key, never by hardcoded path
- All content is defined as JSON data, never hardcoded in components
- Indigo assess_weight = 0.3 (all other skills 1.0)
```

---

## 3. Task Strategy

### 3.1 Core Principle: One Task, One Concern

The most common mistake in AI-assisted multi-session builds is giving a single task too much scope. A task asked to "build the practice mode" will make hundreds of silent decisions about state shape, component structure, audio handling, and data flow — decisions that may conflict with what was built yesterday.

Instead: decompose every task to its smallest coherent unit. "Build the FlashCard component" is a good task. "Build the FlashCard component — it receives a skill object as a prop, displays the display_value, calls onCorrect() or onIncorrect() on tap, and has 3 expression states matching the Hen character" is a great task.

### 3.2 Anatomy of a Good Task Prompt

Every task prompt should contain these sections:

```
## Context
You are building Project Homestead, a homeschool educational app for children ages 2–7.
Stack: React 18 + TypeScript frontend, IndexedDB (Dexie) storage, no backend in v1.
Refer to ARCHITECTURE.md for folder structure and naming conventions.

## Your Task
[One sentence. Exactly one thing to build or modify.]

## Inputs / Dependencies
[What this component receives as props, what data it reads, what shape it expects]

## Outputs / Interface
[What this component renders, what events it emits, what it returns]

## Constraints
[Specific rules — Tailwind only, no new dependencies, etc.]

## Definition of Done
[Specific, verifiable checklist — confirm each item before finishing]

## Files to Create / Modify
[Exact file paths — never let the task decide where things go]
```

### 3.3 Context Injection Pattern

At the start of each session, paste this header before the task description. Update the "Session state" field each time.

```
--- PROJECT HOMESTEAD CONTEXT ---
Build phase: [MVP | v1 | v2 | v3]
Session number: [N]
Session state: [What was completed last session, what is in progress]
Architecture doc: [Paste current ARCHITECTURE.md content here]
Recent decisions: [Paste relevant entries from DECISIONS.md here]
--- END CONTEXT ---

[Your task prompt here]
```

> **Why paste docs each time?**
> Claude Code does not automatically read project knowledge files mid-task. Always paste the relevant sections of ARCHITECTURE.md and recent DECISIONS.md entries directly into the task prompt. The project knowledge files are your source of truth — copy from them into each prompt.

---

## 4. Build Phases & Session Sequencing

Work is organized into four phases matching the version roadmap. Within each phase, sessions are ordered so that foundational work (data, state, routing) always precedes dependent work (UI components, game logic).

### Phase 1 — MVP (v0.1)

#### Session 1: Project Scaffold

| Task | Output Files |
|---|---|
| Create Vite + React + TypeScript app with Tailwind | `package.json`, Tailwind config, base structure |
| Set up React Router with stub screens | `src/screens/` — Home, Learn, Practice, Daily, ParentCorner |
| Create global Context + useReducer | `src/context/AppContext.tsx` |
| Create ARCHITECTURE.md and DECISIONS.md | Project root |

#### Session 2: Content Data Layer

| Task | Output Files |
|---|---|
| Generate all 26 letters as content JSON | `src/data/letters.json` |
| Generate numbers 1–10 as content JSON | `src/data/numbers.json` |
| Generate 8 shapes + 11 colors as content JSON | `src/data/shapes.json`, `src/data/colors.json` |
| Create localStorage persistence hook (MVP only) | `src/hooks/useProgress.ts` |

#### Session 3: Home Screen

| Task | Output Files |
|---|---|
| HomeScreen layout — 4 topic hubs + parent corner button | `src/screens/HomeScreen.tsx` |
| HenCharacter component — 3 expression states | `src/components/HenCharacter.tsx` |
| TopicHub component — reusable hub card | `src/components/TopicHub.tsx` |

#### Session 4: Learn Mode

| Task | Output Files |
|---|---|
| LearnScreen — ordered presentation of skill items | `src/screens/LearnScreen.tsx` |
| SkillCard component — displays item + association | `src/components/SkillCard.tsx` |
| Audio hook — key-based audio trigger (placeholder tones) | `src/hooks/useAudio.ts` |

#### Session 5: Practice Mode (Flashcard)

| Task | Output Files |
|---|---|
| FlashCard component — prompt + N answer options | `src/components/FlashCard.tsx` |
| PracticeSession logic — weighted random, spaced repetition lite | `src/hooks/usePracticeSession.ts` |
| PracticeScreen — orchestrates session flow | `src/screens/PracticeScreen.tsx` |

#### Session 6: Daily Curriculum (Stubbed)

| Task | Output Files |
|---|---|
| DailyCurriculum stub — simple rotation, MVP only | `src/services/dailyCurriculum.ts` |
| DailyScreen — session flow with character narration prompts | `src/screens/DailyScreen.tsx` |
| SessionTimer component — soft warnings + graceful end | `src/components/SessionTimer.tsx` |

#### Session 7: Parent Corner + Onboarding

| Task | Output Files |
|---|---|
| ParentGate component — math question verification | `src/components/ParentGate.tsx` |
| OnboardingFlow — first-launch setup (name, age, time limit, audio) | `src/screens/OnboardingScreen.tsx` |
| ParentCornerScreen — progress summary + settings | `src/screens/ParentCornerScreen.tsx` |

#### Session 8: MVP Integration + QA

| Task | Output Files |
|---|---|
| Wire all screens and navigation end-to-end | Review all screen files |
| Kindle Fire Silk browser compatibility audit | Fix list in DECISIONS.md |
| localStorage persistence verification across sessions | Verify `useProgress.ts` |

### Phase 2 — v1.0 (Android APK, Full Client-Side App)

Phase 2 begins after MVP is validated on Kindle Fire. No backend is introduced in this phase. The full curriculum engine, multi-child profiles, and IndexedDB persistence all run client-side.

#### Session 9: IndexedDB Schema (Dexie)

| Task | Output Files |
|---|---|
| Dexie schema definition matching the spec data model | `src/db/schema.ts` |
| Migration from localStorage to IndexedDB | `src/db/migrate.ts` |
| Database seeder from content JSON files | `src/db/seed.ts` |
| Replace `useProgress` with Dexie-backed equivalent | `src/hooks/useProgress.ts` |

#### Session 10: Multi-Child Profile Support

| Task | Output Files |
|---|---|
| Child profile data layer (Dexie queries) | `src/db/children.ts` |
| Profile switcher UI in Parent Corner | `src/components/ProfileSwitcher.tsx` |
| Active-profile context and routing | `src/context/AppContext.tsx` updates |
| Update onboarding to support adding additional profiles | `src/screens/OnboardingScreen.tsx` |

#### Session 11: Full Curriculum Engine

| Task | Output Files |
|---|---|
| Spaced repetition selection algorithm | `src/services/curriculumEngine.ts` |
| Mastery calculation service — 80% threshold, retry logic | `src/services/masteryCalculator.ts` |
| Daily log + streak calculation | `src/services/dailyLog.ts` |
| Replace stub `dailyCurriculum.ts` with full engine | `src/services/dailyCurriculum.ts` |

#### Session 12: Seedling Track Content + Goat Character

| Task | Output Files |
|---|---|
| Seedling track content JSON — full alphabet, counting to 30, ROYGBIV, seasons | `src/data/` updated |
| GoatCharacter component — 3 expression states | `src/components/GoatCharacter.tsx` |
| Track gating — children advance into Seedling on Sprout completion | `src/services/trackProgression.ts` |

#### Session 13: Matching Games

| Task | Output Files |
|---|---|
| Pair match game | `src/screens/PairMatchScreen.tsx` |
| Sort & group game | `src/screens/SortGroupScreen.tsx` |
| Matching game session integration into daily curriculum | `src/services/dailyCurriculum.ts` updates |

#### Session 14: Seasonal Backgrounds

| Task | Output Files |
|---|---|
| Seasonal background system — auto-detect + manual override | `src/components/SeasonalBackground.tsx` |
| Parent setting for seasonal override | `src/screens/ParentCornerScreen.tsx` updates |

#### Session 15: Capacitor Packaging

| Task | Output Files |
|---|---|
| Integrate Capacitor into the project | `capacitor.config.ts`, updated `package.json` |
| Android build configuration for Kindle Fire | `android/` folder |
| APK build and sideload test instructions | `DEPLOY.md` |

### Phase 3 — v2.0 (Google Play + Story Mode + Cloud Sync)

Phase 3 assumes Phase 2 is complete and tested. Major additions: Story Mode, Supabase sync, Google Play distribution, Sapling+ content.

| Session Block | Scope |
|---|---|
| Sessions 16–17 | Story Mode data model + episode player component |
| Sessions 18–19 | 2–3 story episodes (illustrated screens + embedded interactions) |
| Session 20 | Supabase project setup + Postgres schema (mirroring Dexie schema) |
| Sessions 21–22 | Cloud sync — Supabase Auth integration, push-on-session-end, pull-on-login |
| Sessions 23–24 | Sapling track content — letter sounds, addition/subtraction, counting to 100 |
| Session 25 | Google Play packaging, store listing assets, submission prep |

> **Note on Supabase integration:** The curriculum engine and mastery calculation remain client-side. Supabase is used only as a sync layer — it stores `skill_events`, `mastery`, `sessions`, `rewards`, and `daily_log` rows and serves them back to the client on login or device switch. No business logic moves to the server.

### Phase 4 — v3.0 (Desktop / Steam)

| Session Block | Scope |
|---|---|
| Session 26 | Tauri integration — wrap React app, test on Windows and Mac (Electron is the fallback if Tauri causes friction) |
| Session 27 | Branch + Canopy track content (sight words, multiplication intro, fractions) |
| Session 28 | Parent analytics dashboard — charts, struggle items, learning velocity |
| Session 29 | Steam submission prep — build, store page, Steamworks integration |

---

## 5. Reusable Prompt Templates

Copy and fill these templates for common task types. Replace all `[bracketed]` values before sending.

### 5.1 New Component

```
--- PROJECT HOMESTEAD CONTEXT ---
Build phase: [MVP | v1 | v2 | v3]
[Paste ARCHITECTURE.md here]
[Paste relevant DECISIONS.md entries here]
--- END CONTEXT ---

Create a new React component: [ComponentName]

File location: src/components/[ComponentName].tsx

Props this component receives:
- [propName]: [type] — [description]
- [propName]: [type] — [description]

What it renders:
[Describe the visual output in concrete terms]

Events it emits:
- [onEventName]([args]) — called when [condition]

Constraints:
- TypeScript with explicit prop types
- Tailwind CSS only — no inline styles, no CSS files
- No new npm packages without explicit approval
- Audio triggered via useAudio hook with key — never direct file path
- Accessible: include aria-label on interactive elements

Definition of done:
[ ] Component renders correctly with sample props
[ ] All events fire correctly
[ ] No console errors
[ ] No TypeScript errors
[ ] Matches flat illustration low-stimulation design language
```

### 5.2 New Service Module (Pure Logic)

```
--- PROJECT HOMESTEAD CONTEXT ---
Build phase: [v1 | v2 | v3]
[Paste ARCHITECTURE.md here]
[Paste relevant DECISIONS.md entries here]
--- END CONTEXT ---

Create a service module: [moduleName]

File: src/services/[moduleName].ts

Purpose:
[One paragraph — what this module computes or decides]

Inputs:
[Type definitions for what the module receives]

Outputs:
[Type definitions for what the module returns]

Algorithm:
[Step-by-step description of the logic]

Constraints:
- Pure functions where possible — no side effects beyond the documented outputs
- TypeScript with explicit types on all exports
- No direct DB calls — accept data as input, return data as output
- No new npm packages without explicit approval

Definition of done:
[ ] All exported functions have TypeScript signatures
[ ] Algorithm produces correct output for sample inputs
[ ] No console errors
[ ] No TypeScript errors
```

### 5.3 Bug Fix Session

```
--- PROJECT HOMESTEAD CONTEXT ---
Build phase: [phase]
[Paste ARCHITECTURE.md]
[Paste relevant component/module code]
--- END CONTEXT ---

Bug: [One sentence description]

Reproduction steps:
1. [Step]
2. [Step]

Expected behavior: [What should happen]
Actual behavior: [What is happening]

Relevant files: [file paths]

Fix the bug. Do not refactor unrelated code. After fixing, explain what caused
the bug in one paragraph.

Definition of done:
[ ] Bug no longer reproduces
[ ] No new console errors introduced
[ ] No TypeScript errors introduced
[ ] Behavior matches expected
```

### 5.4 Content Data Generation

```
Generate a complete JSON array for all [26 letters | numbers 1-10 | 8 shapes | 11 colors].

Each object must have exactly these fields:
{
  "id": "letter_A",          // topic_value format, lowercase
  "topic": "letters",         // letters | numbers | shapes | colors | seasons | math
  "track": "sprout",          // sprout | seedling | sapling | branch | canopy
  "display_value": "A",       // what shows on screen
  "label": "the letter A",    // spoken/displayed name
  "association": "A is for Acorn — found in the orchard!",
  "audio_key": "letter_A",    // filename key without extension
  "assess_weight": 1.0,       // 0.3 for indigo only, 1.0 for all others
  "image_key": "letter_A"     // filename key without extension
}

Rules:
- All associations must reference the homestead/farm world
- Indigo must have assess_weight: 0.3
- All other items must have assess_weight: 1.0
- Output valid JSON only — no markdown, no commentary
```

---

## 6. Quality Gates

Before advancing from one phase to the next, all items in the relevant quality gate must be checked off. Do not start Phase 2 until Phase 1 gate passes.

### 6.1 Phase 1 (MVP) Gate

- App loads on Kindle Fire Silk browser without errors
- Child can complete a full Daily Curriculum session unassisted
- Practice mode presents items in weighted random order (not strict sequence)
- Correct and incorrect audio feedback plays (even if placeholder tones)
- Progress persists in localStorage across browser restarts
- Parent corner is accessible and gated behind arithmetic check
- Session time limit triggers warning and graceful end
- HenCharacter displays correct expression state for each interaction
- No console errors during a 20-minute simulated session

### 6.2 Phase 2 (v1.0) Gate

- IndexedDB (Dexie) replaces localStorage cleanly with no data loss
- Multiple child profiles can be created, switched, and tracked independently
- Full curriculum engine generates non-repeating daily content across 7 days
- Mastery check correctly enforces 80% threshold and retry logic
- Seedling track content is reachable after Sprout completion
- Capacitor APK installs and runs on Kindle Fire
- App functions fully offline — no network required at any point

### 6.3 Phase 3 (v2.0) Gate

- Story Mode player renders episode screens and embedded interactions correctly
- Supabase Auth creates accounts and issues JWT tokens correctly
- Progress syncs correctly when logging in on a second device
- Curriculum engine still runs entirely client-side (no business logic moved to Supabase)
- Google Play APK passes Play Store review requirements

### 6.4 Phase 4 (v3.0) Gate

- Tauri build runs on Windows and Mac (or Electron fallback if Tauri caused friction)
- Branch and Canopy content is reachable via track progression
- Parent analytics dashboard displays charts, struggle items, and learning velocity
- Steam submission package meets Steamworks requirements

---

## 7. Keeping Project Knowledge Current

The three project knowledge files (`BUILD_SPEC.md`, `ARCHITECTURE.md`, `DECISIONS.md`) plus the content JSON files are only useful if they stay accurate. Follow these maintenance rules:

| Document | Update Trigger | When |
|---|---|---|
| `BUILD_SPEC.md` | Product scope or major architectural shift | Rare — only when the product itself changes |
| `ARCHITECTURE.md` | Stack, folder structure, or naming convention changes | After any session that changes architecture |
| `DECISIONS.md` | Any decision worth remembering — append-only | As decisions are made; never delete entries |
| `src/data/*.json` | New content added or corrected | As part of content generation tasks |

> **⚠ Re-upload After Updates**
> When you update any project knowledge file, re-upload it to the Claude Project immediately. Claude Code uses the version in the project — stale files produce stale output.

---

## 8. The QA Loop

Because the human role is QA rather than coding, the QA loop is the single most important habit in this workflow. After every task:

1. **Read the generated code before testing.** Not to find bugs — to build a mental model of what's there. Spend 60 seconds skimming each new file. This is what makes the workflow scale.
2. **Run the app and reproduce the task's "definition of done" checklist.** Each item, in order. Don't trust that "no console errors" was actually verified — verify it yourself.
3. **If a bug appears, capture exact reproduction steps before describing it.** "It doesn't work" produces worse fixes than "When I tap the second answer option after a correct first answer, the score increments by 2 instead of 1."
4. **Commit at the end of each session with a descriptive message.** This is the session log. Future-you and future-Claude can read git log to understand the build's history.
5. **Append to DECISIONS.md when something non-obvious is decided.** "We chose X over Y because Z" — these are the entries that prevent re-litigation in later sessions.
