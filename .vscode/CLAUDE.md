# Claude Code Standing Orders — Project Homestead

Always read ARCHITECTURE.md and DECISIONS.md before starting any task.

Never add npm dependencies without proposing them first and waiting for approval.

All learning content lives in src/data/\*.json — never hardcode letters, numbers, shapes, colors, or other curriculum content in components.

Audio is referenced by key via the useAudio hook — never by file path. Components never import from src/audio/ directly.

Indigo's assess_weight is 0.3; all other skills are 1.0.

CSS transitions only — no animation libraries (Framer Motion, GSAP, React Spring, etc.) at any phase.

After completing any task, update DECISIONS.md if a non-obvious decision was made, and update ARCHITECTURE.md if folder structure, naming, or stack changed.
