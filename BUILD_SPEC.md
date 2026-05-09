# Project Homestead — Build Specification
**Version 1.1 | May 2026 | Internal Development**

---

## Table of Contents
1. [Product Overview](#1-product-overview)
2. [Learning Content & Curriculum](#2-learning-content--curriculum)
3. [Characters & World](#3-characters--world)
4. [Application Modes](#4-application-modes)
5. [Mastery & Progression System](#5-mastery--progression-system)
6. [Parent Corner](#6-parent-corner)
7. [Technical Architecture](#7-technical-architecture)
8. [MVP Scope (v0.1)](#8-mvp-scope-v01)
9. [Version Roadmap](#9-version-roadmap)
10. [Open Items](#10-open-items)
11. [Appendix A: Sprout Track Content List](#appendix-a-sprout-track-content-list)

---

## 1. Product Overview

### 1.1 Vision

Project Homestead is a single, growing educational application designed to accompany a child from ages 2 through 7+. Rooted in a warm homestead aesthetic and anchored by recurring animal characters, the app teaches foundational academic skills through recognition-first learning — not rote recitation.

**Core principle:** Children learn to recognize before they can recite. A child who can sing the alphabet has learned a song. A child who can identify a random "G" on a flashcard has begun to read. Every mode in Project Homestead builds genuine recognition and mastery.

> **Design Philosophy:** Low stimulation, high engagement. Calm palette, predictable structure, gentle audio. Engagement comes from mastery and narrative — not sensory overload. One element on screen at a time. Sounds are optional and soft. Rewards are quiet and warm.

### 1.2 Target Audience

| Audience | Age Range | Primary Use |
|---|---|---|
| Primary learner | 2–7 years | Daily learning sessions, guided by app |
| Parent / caregiver | Adult | Setup, progress review, session limits |
| Siblings | 2–10 years | Multiple child profiles on one device |

### 1.3 Platform Roadmap

| Version | Platform | Distribution | Primary Goal |
|---|---|---|---|
| MVP (v0.1) | Kindle Fire — browser PWA | USB sideload / local WiFi | Prove concept, gather family feedback |
| v1.0 | Android APK (Kindle Fire) | Amazon Appstore + sideload | First shareable release |
| v2.0 | Android + Google Play | Google Play Store | Public release, cloud sync |
| v3.0 | Desktop (Windows/Mac) | Steam + direct download | Expanded platform reach |

> **Tech Stack Note:** The frontend is built in React (JavaScript/JSX) for all platforms. All application logic — including the curriculum engine, mastery calculation, and spaced repetition — runs client-side throughout the product's lifetime. A backend (Supabase) is introduced at v2 solely for cross-device cloud sync and authentication. The same React codebase is wrapped with Capacitor (mobile APK, v1 and v2) and Tauri (desktop, v3) — no rebuild required per platform.

---

## 2. Learning Content & Curriculum

### 2.1 Content Tracks (Learning Tree)

Content is organized into five progressive tracks. A child advances by demonstrating mastery — not by time spent. The home screen visually represents a tree; new branches unlock as the child climbs.

| Track | Ages (approx.) | Core Content Areas |
|---|---|---|
| **Sprout** | 2–3 | ABCs (recognition), counting 1–10, basic shapes, core colors |
| **Seedling** | 3–4 | Full alphabet recognition, counting to 30, ROYGBIV, seasons |
| **Sapling** | 4–5 | Letter sounds/phonics, counting to 100, addition to 10, color mixing |
| **Branch** | 5–6 | Sight words, subtraction, telling time, money basics, matching games |
| **Canopy** | 6–7+ | Early reading, multiplication intro, fractions intro, advanced puzzles |

### 2.2 Colors

Ten colors total. ROYGBV forms the core rainbow sequence; four additional colors cover common real-world encounters.

| Color | Hex (approx.) | Teaching Note |
|---|---|---|
| Red | `#FF0000` | ROYGBV — barn door, apple |
| Orange | `#FF8C00` | ROYGBV — pumpkin, carrot |
| Yellow | `#FFD700` | ROYGBV — sun, hay, chick |
| Green | `#228B22` | ROYGBV — grass, leaves, frog |
| Blue | `#1E90FF` | ROYGBV — sky, water, bluebird |
| Purple | `#8B00FF` | ROYGBV — lavender flower, plum |
| Pink | `#FF69B4` | Extension — blossom, pig |
| Brown | `#8B4513` | Extension — fence, soil, horse |
| White | `#F5F5F5` | Extension — clouds, sheep wool, eggs |
| Black | `#1A1A1A` | Extension — crow, night sky, hooves |

### 2.3 Shapes

| Shape | Real-World Connection | Track |
|---|---|---|
| Circle | Sun, cookie, wheel | Sprout |
| Square | Window, cracker, tile | Sprout |
| Triangle | Pizza slice, tent, mountain | Sprout |
| Rectangle | Door, book, hay bale | Sprout |
| Star | Night sky, sheriff badge | Sprout |
| Heart | Valentine, apple core | Sprout |
| Oval / Ellipse | Egg, mirror, pond | Seedling |
| Diamond / Rhombus | Kite, gem, fence diamond | Seedling |
| Hexagon | Honeycomb cell — "bees build these!" | Seedling |
| Pentagon | Barn shape — native to homestead theme | Sapling |

### 2.4 Seasons

Seasons are introduced in the Seedling track and woven into the world aesthetic throughout the app. The home screen background reflects the current real-world season (with a manual override in parent settings).

| Season | Farm Association | Featured Colors / Shapes |
|---|---|---|
| Spring | Planting, baby animals, blossoms | Pink, green, yellow; oval (eggs), circle (sun) |
| Summer | Full harvest, sunshine, swimming hole | Red, orange, yellow; circle, star |
| Autumn / Fall | Harvest, leaves, pumpkins | Orange, red, brown; triangle (haystack), pentagon (barn) |
| Winter | Snow, rest, barn warmth | White, blue; rectangle (sled), diamond (snowflake) |

---

## 3. Characters & World

### 3.1 Setting

The app takes place on a warm, illustrated homestead farm — a single persistent world that serves as the home screen and the backdrop for all modes.

Key locations on the home screen map:

- **The Barn** — hub for shape and color learning
- **The Garden** — hub for counting and seasons
- **The Farmhouse** — hub for letters and reading
- **The Pasture** — hub for math (addition/subtraction) in later tracks
- **The Night Sky** (toggle) — stars, constellations, counting to 20+

### 3.2 Characters

| Character | Species | Role | Introduced |
|---|---|---|---|
| TBD ("Hen") | Hen / Chicken | Primary teacher — warm, maternal, patient. Guides Sprout and Seedling tracks. | MVP |
| TBD ("Billy") | Nigerian Dwarf Goat | Secondary teacher — clever, curious, playful. Guides Sapling through Canopy tracks. | v1.0 |
| Supporting cast (3–4) | Dog, cat, pig, duck (TBD) | Appear in story mode, matching games, daily curriculum. Do not teach. | v1.0 / v2 |

> **Art Guidance:** All characters use flat illustration style — minimal shading, consistent line weight, 3–4 expressive states (happy, thinking, encouraging, celebrating). Buildable in Canva or via AI generation tools with commercial licensing (e.g. Adobe Firefly). Characters introduced gradually — Hen only for MVP.

### 3.3 World Art Style

- Flat illustration, warm and muted palette — no neon or oversaturated colors
- Soft outlines, rounded shapes — nothing sharp or jarring
- Seasonal background variation — same world, four visual states
- One focal element per screen — no cluttered backgrounds during learning modes
- Asset format: SVG preferred for scalability; PNG fallback for Canva exports

---

## 4. Application Modes

All modes serve the same learning objectives. Modes are **formats** — different ways to practice the same skills. The content data model defines skills independently of the mode used to assess them.

### 4.1 Learn Mode

Guided, ordered introduction to new content. The teacher character narrates each item with name, sound (if applicable), and a real-world association. Child taps to advance. No wrong answers possible.

| Element | Specification |
|---|---|
| Sequence | Ordered (A→Z, 1→10, etc.) with teacher narration |
| Interaction | Tap to advance — passive, no assessment |
| Audio | Character voice says item name + association ("This is the letter B. B says buh. B is for Barn.") |
| Visual | Large centered item, simple background, character in corner |
| Pacing | Child-controlled — no auto-advance |
| Exit | Tap home icon; progress saved automatically |

### 4.2 Practice Mode (Flashcard Recognition)

The core assessment engine. A prompt is shown and the child selects the correct answer from 2–4 options. Difficulty scales with child progress.

| Element | Specification |
|---|---|
| Prompt types | Show item → name it (tap correct label); say name → find it (tap correct image); "which is different?" (odd one out) |
| Option count | 2 options (Sprout) → 3 options (Seedling) → 4 options (Sapling+) |
| Feedback — correct | Soft chime, character celebrates quietly, brief pause, next card |
| Feedback — incorrect | Gentle tone, "Let's try again" — same card re-presented, never skipped |
| Session length | Configurable 5–20 cards; respects parent session time limit |
| Randomization | Weighted random — items answered incorrectly appear more frequently (spaced repetition lite) |

### 4.3 Daily Curriculum — "Today on the Farm"

A structured 5–10 minute daily session generated fresh each day. Follows a predictable rhythm children can anticipate.

**Daily session structure:**
1. Good morning greeting from teacher character (10–15 sec)
2. Featured letter — learn segment + 1 practice card (90 sec)
3. Featured number — learn segment + counting activity (90 sec)
4. Featured shape — learn + real-world association (60 sec)
5. Featured color — learn + find-it activity (60 sec)
6. Bonus: seasonal element or matching mini-game (60 sec, track-dependent)
7. Daily reward — collectible item tied to theme

**Content selection algorithm (client-side TypeScript, full version in v1):**
- Prioritize items not seen in the past 3 days
- Include at least one item the child has struggled with recently
- Weight toward current track level, with one review item from prior track
- Never repeat the same featured letter/number two days in a row

### 4.4 Matching Games

Visual matching activities that reinforce recognition through play.

| Game Type | Description | Track |
|---|---|---|
| Pair match | Flip cards face-down, find matching pairs | Sprout+ |
| Sort & group | Drag items into correct barn stall, basket, or field | Seedling+ |
| Shadow match | Match an item to its silhouette | Seedling+ |
| Color sort | Sort illustrated farm objects by color into buckets | Sprout+ |
| Sequence fill | "What comes next?" — fill a gap in A B _ D or 1 2 _ 4 | Seedling+ |
| Spot the difference | Two farm scenes — identify what changed | Sapling+ |
| Trace | Finger-trace letter or number on screen | Sprout+ (v2) |

### 4.5 Story Mode — "Tales from the Homestead"

> **v2 Feature** — Designed here but not built until v2. Story episode data structure should be defined in the content schema from v1 onward.

Short illustrated storybook episodes (6–8 screens) where the child must answer learning questions to advance the story.

- Target: 2–3 episodes at v2 launch; 1 new episode per month thereafter
- Each episode embeds 3–5 learning interactions
- Episodes are illustrated static screens — no animation required, Canva-buildable
- Episodes unlock via mastery milestones, not time
- Sample: *"The Missing Eggs"* — the hen's eggs are hidden around the farm; child finds them by identifying colors, shapes, and letters on clues

### 4.6 Math Modes (Sapling+)

All math interactions are grounded in farm-world context.

| Mode | Description | Track |
|---|---|---|
| Addition to 10 | Count two groups of farm objects, tap the total | Sapling |
| Subtraction to 10 | Remove objects from a group, count what remains | Sapling |
| Addition to 20 | Expanded with visual number line on fence posts | Branch |
| Counting to 100 | Count objects in groups of 10; skip-counting intro | Sapling |
| Time (intro) | Analog clock face — what time do the chickens wake up? | Branch |
| Money (intro) | Farm stand — pennies, nickels, dimes; simple totals | Branch |

---

## 5. Mastery & Progression System

### 5.1 Mastery Loop

Every skill follows the same five-stage loop:

| Stage | Description | Child Experience |
|---|---|---|
| 1. Introduce | Learn mode — guided presentation of new item | "Meet the letter F!" |
| 2. Practice | Low-stakes repetition across multiple sessions | Flashcards, matching games, daily curriculum |
| 3. Challenge | Slightly harder — 4 options, faster pacing, multi-step | Same skills, higher bar |
| 4. Mastery Check | Unassisted 8-question assessment; must pass 80% (7/8) to advance | Framed as "Can you help Hen with something?" |
| 5. Maintenance | Mastered items resurface periodically to prevent decay | Appears in daily curriculum as review |

> **UX Note:** Mastery checks must feel like a game, not a test. The teacher character frames them as a mission or request — never an exam. The check can be retried after one additional practice session.

### 5.2 Reward System

Rewards are earned at three levels:

- **Daily reward** — one collectible per completed daily session (flower, feather, seed packet, etc.)
- **Skill reward** — badge or item when a skill is mastered (golden egg for number mastery, etc.)
- **Track reward** — significant unlock when a full track is completed (new character, seasonal home screen, new story episode)

All rewards are collectibles visible in a reward shelf. No in-app purchases. No ads.

### 5.3 Progress Tracking

| Metric | Description | Available From |
|---|---|---|
| Skills mastered | Count and list of individually mastered items per topic | MVP (localStorage) |
| Session history | Date, duration, mode, items practiced | v1 (IndexedDB) |
| Mastery timeline | When each skill was mastered and last reviewed | v1 |
| Struggle items | Items answered incorrectly 3+ times; surfaced in parent dashboard | v1 |
| Daily streak | Consecutive days with a completed daily session | v1 |
| Cross-device sync | Progress synced to cloud on login | v2 |
| Analytics dashboard | Charts, suggested focus areas, learning velocity | v3 |

---

## 6. Parent Corner

### 6.1 First Launch Onboarding

A parent gate is presented before any child profile is created. Gate uses a simple arithmetic question (e.g., "What is 4 + 7?") — not a PIN — to verify an adult.

**Onboarding flow:**
1. Parent gate — arithmetic question
2. Child profile creation — name, approximate age band, avatar (illustrated farm animals)
3. Session time limit — 10 / 15 / 20 / 30 minutes / No limit
4. Sound settings — On / Off / Sound effects only / Music only
5. Starting track — auto-recommend based on age, allow manual override
6. Optional: additional child profiles (up to 4 per device in v1)

### 6.2 Parent Corner (In-App)

Accessible at any time via a small icon on the home screen — always visible but gated behind the arithmetic check.

- Child profile switcher
- Progress summary — skills mastered, recent sessions, current track
- Struggle items — what to reinforce at home
- Settings — time limits, audio, seasonal override, track adjustment
- Daily streak display
- Reward shelf — all collectibles earned

### 6.3 Session Time Limits

When the configured session time approaches, the teacher character gives a 2-minute warning, then a 1-minute warning. At time, the current activity completes, the reward is given if earned, and a warm goodbye screen is shown. The app returns to the home screen — it does not lock the device.

---

## 7. Technical Architecture

### 7.1 Frontend — React

| Concern | Approach |
|---|---|
| Framework | React 18 with functional components and hooks |
| Language | TypeScript (typed from session 1) |
| Styling | Tailwind CSS (core utilities only — no compiler required) |
| Routing | React Router v6 — client-side routing |
| State management | React Context + useReducer for global app state |
| Audio | Web Audio API for sound effects; HTML5 `<audio>` for narration |
| Animations | CSS transitions only — no heavy animation libraries |
| Asset loading | Lazy loading for images; audio preloaded for active session |
| Offline support | Service Worker + Cache API — full offline capability |
| Packaging (mobile, v1+) | Capacitor — wraps React PWA into Android APK |
| Packaging (desktop, v3) | Tauri — wraps React PWA into native desktop app (Electron is the fallback if Tauri causes friction during v3) |

### 7.2 Application Logic — Client-Side Throughout

All application logic runs in the browser/webview. There is no application server at any point in the roadmap. The curriculum engine, mastery calculation, spaced repetition, daily session generation, multi-child profile management, and progress tracking all run client-side as TypeScript modules.

This decision is intentional and durable:

- The logic is deterministic and lightweight — no server resources are needed
- Eliminating a server eliminates an entire class of bugs (network failures, CORS, deployment, hosting)
- The app remains fully functional offline at every version
- The QA loop stays in one layer — bugs are reproduced and fixed in the browser, not triangulated across frontend and backend

| Concern | Approach |
|---|---|
| Curriculum engine | TypeScript module — selects daily content, weights spaced repetition, calculates mastery |
| Mastery calculation | TypeScript module — pass/fail logic, 80% threshold, retry rules |
| Storage (MVP) | localStorage — simple key/value, single profile |
| Storage (v1+) | IndexedDB via Dexie — multi-profile, structured queries, full schema |
| Storage (v2+) | IndexedDB remains the source of truth on-device; Supabase is added as a sync layer (see 7.3) |

### 7.3 Backend — Supabase (v2+, Sync Only)

A backend is introduced at v2 for one reason: cross-device cloud sync and the user authentication that enables it. The backend does not run application logic. It is a sync target.

| Concern | Approach |
|---|---|
| Provider | Supabase (hosted Postgres + auth + REST API + storage) |
| Authentication | Email + password via Supabase Auth; JWT tokens issued by Supabase |
| Database | Postgres, schema-mirrored from the client-side IndexedDB schema |
| Sync model | Client pushes events on session end; client pulls events on login or device switch |
| API style | Auto-generated PostgREST — no hand-written endpoints |
| Hosting | Supabase managed cloud (free tier sufficient for expected scale) |
| CORS | Configured to allow Capacitor app origin, Tauri app origin, and localhost in dev |

> **Alternative considered:** PocketBase (self-hosted single-binary Go server with SQLite, auth, and realtime built in) is a credible alternative if vendor lock-in becomes a concern. Either provides the sync surface the v2 product needs without requiring hand-written API code. FastAPI was evaluated and ruled out — the curriculum logic does not need a server, and writing custom endpoints adds maintenance cost without product benefit.

### 7.4 Data Schema (Core Tables)

The schema below applies to IndexedDB from v1 and to Supabase Postgres from v2. The shapes are defined from day one even when MVP uses localStorage.

| Table | Key Fields | Notes |
|---|---|---|
| `children` | id, name, age_band, avatar_id, created_at, current_track | One row per child profile |
| `skills` | id, topic, value, track, assess_weight | Static content — seeded at install; indigo assess_weight = 0.3 |
| `skill_events` | id, child_id, skill_id, result, mode, timestamp | Every assessment interaction logged |
| `mastery` | id, child_id, skill_id, mastered_at, last_reviewed_at, review_count | One row per child+skill when mastered |
| `sessions` | id, child_id, mode, started_at, ended_at, duration_sec | One row per learning session |
| `rewards` | id, child_id, reward_type, reward_id, earned_at | All collectibles earned |
| `daily_log` | id, child_id, date, completed, items_covered (JSON) | One row per child per calendar day |

### 7.5 Content Data Model

All learning content is defined as structured data (JSON files in v1, optionally seeded into Supabase in v2+) — not hardcoded in UI components. This enables content expansion without code changes.

Each skill object:

```json
{
  "id": "letter_G",
  "topic": "letters",
  "track": "sprout",
  "display_value": "G",
  "label": "the letter G",
  "association": "G is for Garden",
  "audio_key": "letter_G",
  "assess_weight": 1.0,
  "image_key": "letter_G"
}
```

`topic` enum: `letters | numbers | shapes | colors | seasons | math`
`track` enum: `sprout | seedling | sapling | branch | canopy`

### 7.6 Audio Strategy

| Audio Type | Source | Format | Notes |
|---|---|---|---|
| Narration (character voice) | Self-recorded (preferred) or ElevenLabs AI | MP3 / OGG | Evaluate ElevenLabs free tier first |
| Sound effects | Freesound.org (CC0 licensed) | MP3 / OGG | Soft chime (correct), gentle tone (try again), ambient farm sounds |
| Background music (optional) | Freesound.org or royalty-free libraries | MP3 / OGG | Soft, looping, instrumental. Off by default. |

> **Architecture requirement:** Audio must be abstracted to a key-based system — components reference `audio_key` strings, never direct file paths. This allows the audio source to change without refactoring components.

### 7.7 Asset Strategy

| Asset Type | Source | License |
|---|---|---|
| Character illustrations | Canva flat-style library OR Adobe Firefly | Commercial free (Canva Pro / Firefly) |
| Background scenes | Canva illustrated backgrounds, seasonal variants | Commercial free |
| Shape assets | SVG — Canva or inline SVG in code | Self-created |
| Color swatches | Self-created — colored rounded rectangles | Self-created |
| Letter / number assets | Google Fonts — Nunito or Fredoka One (rounded, child-friendly) | SIL Open Font License |
| Sound effects | Freesound.org — CC0 filter | CC0 — no attribution required |

---

## 8. MVP Scope (v0.1)

React PWA running in Kindle Fire Silk browser. No backend. All progress in localStorage.

### 8.1 MVP Includes

- Parental first-launch onboarding (single child profile, time limit, audio toggle)
- Home screen — homestead world map with 4 topic hubs
- Learn Mode — all Sprout track content (26 letters, numbers 1–10, 8 core shapes, 11 colors)
- Practice Mode — flashcard recognition, 2–3 answer options, weighted random selection
- Daily Curriculum — static session structure (curriculum algorithm stubbed as simple rotation)
- Basic mastery tracking — pass/fail per skill stored in localStorage
- Basic reward system — stars earned per session, displayed on home screen
- Parent session time limit — soft warning and graceful end
- Soft audio feedback — correct/incorrect tones (placeholder audio acceptable)
- Hen character — 3 expression states as static PNG/SVG assets

### 8.2 MVP Excludes

- Multiple child profiles (introduced in v1)
- Story Mode
- Matching games (beyond basic flashcard)
- Seedling+ content tracks
- Goat character
- Narration audio (placeholder tones acceptable)
- Cloud sync
- Seasonal background variation (single default season)
- Full curriculum engine (stubbed rotation acceptable; full engine arrives in v1)

### 8.3 MVP Success Criteria

- [ ] App loads reliably on Kindle Fire Silk browser
- [ ] Child can complete a full daily session without adult assistance
- [ ] Parent can configure session length and access parent corner
- [ ] Progress persists between sessions on same device
- [ ] No crashes during a 20-minute session

---

## 9. Version Roadmap

| Feature | MVP | v1.0 | v2.0 | v3.0 |
|---|---|---|---|---|
| Sprout track content | ✓ | ✓ | ✓ | ✓ |
| Seedling track content | — | ✓ | ✓ | ✓ |
| Sapling–Canopy tracks | — | — | ✓ | ✓ |
| Learn Mode | ✓ | ✓ | ✓ | ✓ |
| Practice Mode (flashcard) | ✓ | ✓ | ✓ | ✓ |
| Daily Curriculum | Basic stub | Full client-side engine | ✓ | ✓ |
| Matching games | — | ✓ | ✓ | ✓ |
| Story Mode | — | — | 2–3 episodes | Expanding library |
| Math modes | — | — | Addition/subtraction | Full Sapling–Canopy |
| Multiple child profiles | — | ✓ (4 max) | ✓ | ✓ |
| Storage | localStorage | IndexedDB (Dexie) | IndexedDB + Supabase sync | ✓ |
| Cloud sync | — | — | ✓ (Supabase) | ✓ |
| Parent dashboard | Basic | Moderate | Full | Full + analytics |
| Goat character | — | ✓ | ✓ | ✓ |
| Narration audio | Placeholder | Full set | ✓ | ✓ |
| Seasonal backgrounds | — | ✓ | ✓ | ✓ |
| Platform | Kindle PWA | Android APK (Capacitor) | Google Play (Capacitor) | Steam + desktop (Tauri) |
| Distribution | Sideload | Amazon Appstore | Google Play | Steam |

---

## 10. Open Items

| Item | Status | Decision Needed By |
|---|---|---|
| App name / brand name | Deferred — "Project Homestead" is dev name only | Before v1.0 submission |
| Character names (Hen, Goat) | Unnamed — TBD | Before v1.0 |
| Audio source | Pending ElevenLabs free tier evaluation | Before v1.0 audio implementation |
| Indigo assessment weight | Spec recommends 0.3 — confirm during testing | v1 QA |
| Supporting cast species | Dog, cat, pig, duck proposed — not final | Before v1.0 art production |
| Story episode titles/plots | One example outlined — full slate TBD | Before v2.0 |
| Sync provider final choice | Supabase is the default; PocketBase is the self-hosted alternative if lock-in becomes a concern | Before v2.0 sync work begins |
| Desktop packaging confirmation | Tauri is the default; Electron is the fallback if Tauri mobile/desktop tooling causes friction | Before v3.0 desktop work begins |

---

## Appendix A: Sprout Track Content List

### Letters (26)
A B C D E F G H I J K L M N O P Q R S T U V W X Y Z

Each letter includes: uppercase and lowercase forms, letter name, primary sound, farm/homestead word association.

### Numbers (Sprout: 1–10)
1 2 3 4 5 6 7 8 9 10

Each number includes: numeral, word form, counting activity (farm objects), one-to-one correspondence visual.

### Shapes (Sprout: 6 core)
Circle, Square, Triangle, Rectangle, Star, Heart

### Colors (All 11)
Red, Orange, Yellow, Green, Blue, Indigo *(assess_weight: 0.3)*, Violet/Purple, Pink, Brown, White, Black
