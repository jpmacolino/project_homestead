# Claude Code Standing Orders — Project Homestead

ARCHITECTURE.md and DECISIONS.md are the project's sources of truth. Consult them when a task touches the stack, folder structure, naming conventions, or the rationale behind an existing decision. Do not re-litigate decisions already logged in DECISIONS.md without flagging them first.

Never add npm dependencies without proposing them first and waiting for approval.

All learning content lives in `src/data/*.json` — never hardcode letters, numbers, shapes, colors, or other curriculum content in components. Components receive skill objects as props.

Audio is referenced by key via the `useAudio` hook — never by file path. Components never import from `src/audio/` directly.

CSS transitions only — no animation libraries (Framer Motion, GSAP, React Spring, etc.) at any phase of the project.

After completing any task, update `DECISIONS.md` if a non-obvious decision was made, and update `ARCHITECTURE.md` if folder structure, naming, or the stack changed.

---

## Where to look

High-traffic references — consult these before asking or assuming:

- **Color roster, hex values, and `assess_weight` conventions** → `src/data/colors.json` and Decision #7 in `DECISIONS.md`
- **Z-index convention and full-screen overlay rule** → Decision #12 (amended 2026-05-09) in `DECISIONS.md`
- **Stack versions (React, Vite, Tailwind, TypeScript, Dexie)** → `ARCHITECTURE.md` → Versions
- **Audio key naming and abstraction** → `ARCHITECTURE.md` → Naming Conventions, and key decision #3
- **Topic routing shape (`/topic/:topic`, `/learn/:topic`, `/practice/:topic`)** → 2026-05-09 topic hub decision in `DECISIONS.md`
- **Practice unlock gating (`homestead.learn_seen.<topic>`)** → 2026-05-09 topic hub decision in `DECISIONS.md`
- **Known items deferred to specific triggers** → `OPEN_ITEMS.md`
