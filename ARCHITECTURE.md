# Project Homestead — Architecture
**MVP Phase | v0.1 | May 2026**

---

## Stack

- **Frontend:** React 18, TypeScript, Tailwind CSS (core utilities), React Router v6
- **Build tool:** Vite
- **State:** React Context + useReducer (global app state)
- **Audio:** Web Audio API (sound effects); HTML5 `<audio>` (character narration)
- **Animation:** CSS transitions only — no animation libraries permitted at any phase
- **Offline:** Service Worker + Cache API — full offline capability required from MVP onward
- **Storage (MVP):** localStorage — single child profile, key/value pairs
- **Storage (v1+):** IndexedDB via Dexie — multi-profile, structured queries, full schema
- **Storage sync (v2+):** Supabase (Postgres + Auth + auto-generated PostgREST)
- **Mobile packaging (v1+):** Capacitor — wraps React PWA into Android APK
- **Desktop packaging (v3):** Tauri — wraps React PWA into native desktop app (Electron is the documented fallback if Tauri causes friction)

### Versions

The build spec pins React 18 and React Router v6 explicitly. The packages below are not pinned in the spec; the choices below are the selected defaults. Update this subsection if a version is changed during the build.

| Package | Pinned Version | Rationale |
|---|---|---|
| React | ^18.2 | Spec pins major version as React 18; ^18.2 is the current stable patch. |
| React Router | ^6.x | Spec explicitly states "React Router v6." |
| Vite | ^5.x | Chosen over Create React App (CRA), which is deprecated. The orchestration brief specifies Vite explicitly in Phase 1 Session 1. Current stable major. |
| TypeScript | ^5.x | Spec mandates TypeScript from session 1 but does not pin a minor version. 5.x is the current stable major. |
| Tailwind CSS | ^3.x | Spec says "core utilities only — no compiler required." Tailwind v3 via PostCSS plugin with Vite satisfies this. v4 is excluded as insufficiently mature at project start. |
| Dexie | ^3.x | Stable major; no breaking changes pending. Used from v1 onward; not installed for MVP. |

---

## Folder Structure

```
homestead/
  src/
    components/    # Reusable UI components shared across screens (FlashCard, HenCharacter, TopicHub, SessionTimer, ParentGate, etc.)
    screens/       # Top-level routed screen components — one file per route (HomeScreen, LearnScreen, PracticeScreen, DailyScreen, OnboardingScreen, ParentCornerScreen)
    context/       # React Context providers and useReducer definitions — all global app state (active child, session config, audio preferences) lives here
    hooks/         # Custom React hooks that bridge components to services and storage (useAudio, useProgress, usePracticeSession, useChildProfile, useSession)
    services/      # Pure TypeScript logic modules with no React dependencies — the curriculum engine, mastery calculator, and daily session generator live here
    data/          # Static content JSON files (letters.json, numbers.json, shapes.json, colors.json) — loaded at runtime, never imported directly by components
    audio/         # Audio file assets accessed only via key string — no component ever imports a file path from this directory directly
    assets/        # Static images and SVG files; SVG is preferred for scalability, PNG accepted for Canva exports only
    db/            # Dexie schema definition, IndexedDB access helpers, migration and seeder scripts (v1+ only; not present in MVP)
    sync/          # Supabase client initialization and sync event logic — push-on-session-end, pull-on-login (v2+ only; not present in MVP or v1)
  public/          # Static files served at the root URL — favicon, manifest.json, service worker entry point, and precache manifest
```

---

## Naming Conventions

- **Components:** PascalCase — `FlashCard`, `DailySession`, `HenCharacter`
- **Hooks:** camelCase with `use` prefix — `useChildProfile`, `useSession`, `useAudio`
- **Services:** camelCase — `curriculumEngine`, `masteryCalculator`
- **DB tables** (Dexie + Supabase): snake_case plural — `skill_events`, `daily_log`, `children`
- **Content IDs:** `topic_value` format — `letter_G`, `color_red`, `shape_triangle`
- **Audio keys:** match content ID format; system sounds use descriptive keys — `letter_G`, `correct_chime`, `incorrect_tone`
- **File names:** match the exported symbol — `FlashCard.tsx` exports `FlashCard`; `curriculumEngine.ts` exports `curriculumEngine`

---

## Key Decisions

### Carried from the orchestration brief

**1. All application logic runs client-side at every version.**
The curriculum engine, mastery calculation, daily session generation, and multi-child profile management never move to a server. This is a durable architectural commitment, not a temporary shortcut. Rationale: the logic is deterministic and lightweight; eliminating a server eliminates an entire class of bugs (network failures, CORS, deployment, hosting); the QA loop stays in one layer — bugs are reproduced and fixed in the browser.

**2. Supabase (v2+) is a sync layer only — it does not run business logic.**
It stores `skill_events`, `mastery`, `sessions`, `rewards`, and `daily_log` rows and returns them to the client on login or device switch. No hand-written endpoints. No server-side curriculum logic. PocketBase (self-hosted, single-binary Go server with SQLite) is the documented alternative if Supabase vendor lock-in becomes a concern before v2 sync work begins.

**3. Audio is referenced by key string, never by hardcoded file path.**
All components and hooks accept an `audio_key` string and resolve it through the `useAudio` hook. This decouples every component from the audio source so that placeholder tones in MVP can be swapped for self-recorded or ElevenLabs AI narration in v1+ without touching any component code. No component ever imports from `src/audio/` directly.

**4. All learning content is defined as JSON data, never hardcoded in components.**
Skills, letters, numbers, shapes, colors, and seasons live in `src/data/*.json`. Components receive skill objects as props. The content data model (including `assess_weight`, `audio_key`, `image_key`, and `association`) is defined once and consumed everywhere. Content expansion requires only a data change — no code change.

**5. Indigo `assess_weight` is 0.3; all other skills are 1.0.**
Indigo is included in the ROYGBIV sequence for completeness but is not rigorously assessed. It is genuinely difficult for young children to distinguish from blue and violet. This value lives in the content data (`src/data/colors.json`), not in the curriculum logic — the engine does not special-case indigo; it reads the weight from the data.

---

### Additional decisions implied by the build spec

**6. CSS transitions only — no animation libraries at any phase.**
The build spec prohibits heavy animation libraries (section 7.1). This is the technical enforcement of the product's "low stimulation, high engagement" design principle. If a component requires motion, it uses Tailwind's `transition-*` utilities or a hand-written `@keyframes` block in the global stylesheet. Framer Motion, GSAP, React Spring, and equivalent libraries are not permitted at any version. This decision holds even in v3 (desktop) where performance headroom increases.

**7. Full offline capability is a hard architectural requirement from MVP onward, implemented via Service Worker + Cache API.**
The MVP distribution is Kindle Fire USB sideload and local WiFi — no reliable internet access can be assumed during a child's session. The Service Worker is configured in Session 1 as part of the Vite PWA plugin setup, not deferred to v1. All content JSON, active-session audio files, character assets, and the application shell must be precached. This requirement is verified in the Phase 2 quality gate: "App functions fully offline — no network required at any point." A service worker that is skipped in MVP and backfilled later risks subtle caching bugs that are hard to reproduce.

**8. SVG is the preferred asset format; PNG is accepted only for Canva character exports.**
The app ships across Kindle Fire (low-DPI), Android phones (variable DPI), and eventually desktop (high-DPI). SVG scales cleanly across all targets without per-resolution asset sets. All shape assets and any assets created in code are inline SVG or `.svg` files in `src/assets/`. Character illustrations and background scenes produced in Canva may export as PNG and are placed in `src/assets/` with a filename suffix of `_canva.png` to distinguish them from SVG sources. Google Fonts (Nunito or Fredoka One, SIL Open Font License) are used for all letter and number display — no rasterized font assets.
