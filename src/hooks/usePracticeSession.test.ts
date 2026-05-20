import { describe, it, expect } from 'vitest';
import { generateCard, calculateWeight } from './usePracticeSession';
import type { GenerationHistory, PracticeCard } from './usePracticeSession';
import type { PracticeResult } from './useProgress';
import type { Skill } from '../data/types';

// Mulberry32 seeded PRNG — no external deps
function seeded(seed: number): () => number {
  let s = seed;
  return () => {
    s = (s + 0x6d2b79f5) | 0;
    let t = Math.imul(s ^ (s >>> 15), 1 | s);
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

function makeSkill(id: string): Skill {
  return {
    id,
    topic: 'letters',
    track: 'sprout',
    display_value: id,
    label: id,
    association: id,
    audio_key: id,
    assess_weight: 1.0,
    image_key: id,
  };
}

function makeSkills(n: number): Skill[] {
  return Array.from({ length: n }, (_, i) => makeSkill(`skill_${i}`));
}

const empty: GenerationHistory = { targets: [], lastDistractors: null };

// ---------------------------------------------------------------------------
// 1. Weight calculation
// ---------------------------------------------------------------------------

describe('calculateWeight', () => {
  it('clamps at floor 0.25 for correct:4, incorrect:0', () => {
    // 1.0 + 0*0.5 - 4*0.25 = 0.0 → clamped to 0.25
    expect(calculateWeight({ correct: 4, incorrect: 0, last_seen: 0 })).toBe(0.25);
  });

  it('clamps at ceiling 4.0 for correct:0, incorrect:8', () => {
    // 1.0 + 8*0.5 - 0 = 5.0 → clamped to 4.0
    expect(calculateWeight({ correct: 0, incorrect: 8, last_seen: 0 })).toBe(4.0);
  });

  it('returns exactly 1.0 for correct:2, incorrect:1', () => {
    // 1.0 + 1*0.5 - 2*0.25 = 1.0 + 0.5 - 0.5 = 1.0
    expect(calculateWeight({ correct: 2, incorrect: 1, last_seen: 0 })).toBe(1.0);
  });

  it('returns 1.0 when result is undefined', () => {
    expect(calculateWeight(undefined)).toBe(1.0);
  });
});

// ---------------------------------------------------------------------------
// 2. Weighted selection bias
// ---------------------------------------------------------------------------

describe('generateCard — weighted selection bias', () => {
  it('selects high-weight skill significantly more often than low-weight skill', () => {
    const skills = makeSkills(6);
    const results: Record<string, PracticeResult> = {
      [skills[0].id]: { correct: 0, incorrect: 8, last_seen: 0 }, // weight 4.0
      [skills[1].id]: { correct: 4, incorrect: 0, last_seen: 0 }, // weight 0.25
    };
    const counts: Record<string, number> = {};
    for (let i = 0; i < 1000; i++) {
      const card = generateCard(skills, results, empty, seeded(i));
      counts[card.target.id] = (counts[card.target.id] ?? 0) + 1;
    }
    const highCount = counts[skills[0].id] ?? 0;
    const lowCount = counts[skills[1].id] ?? 0;
    // Expected ratio ≈ 4.0 / 0.25 = 16× — require at least 5× for a generous tolerance
    expect(highCount).toBeGreaterThan(lowCount * 5);
  });
});

// ---------------------------------------------------------------------------
// 3. Target anti-repetition (last 2 excluded for topics > 3 skills)
// ---------------------------------------------------------------------------

describe('generateCard — target anti-repetition', () => {
  it('never picks a target that appears in the last 2 history entries', () => {
    const skills = makeSkills(10);
    const history: GenerationHistory = {
      targets: [skills[0].id, skills[1].id],
      lastDistractors: null,
    };
    for (let i = 0; i < 100; i++) {
      const card = generateCard(skills, {}, history, seeded(i));
      expect(card.target.id).not.toBe(skills[0].id);
      expect(card.target.id).not.toBe(skills[1].id);
    }
  });
});

// ---------------------------------------------------------------------------
// 4. Distractor count — exactly 4 options for normal topics
// ---------------------------------------------------------------------------

describe('generateCard — distractor count', () => {
  it('returns exactly 4 options for a topic with ≥4 skills', () => {
    const skills = makeSkills(10);
    for (let i = 0; i < 50; i++) {
      const card = generateCard(skills, {}, empty, seeded(i));
      expect(card.options).toHaveLength(4);
    }
  });
});

// ---------------------------------------------------------------------------
// 5. Target is always in options
// ---------------------------------------------------------------------------

describe('generateCard — target in options', () => {
  it('target skill always appears in the options array', () => {
    const skills = makeSkills(10);
    for (let i = 0; i < 50; i++) {
      const card = generateCard(skills, {}, empty, seeded(i));
      expect(card.options.some(o => o.id === card.target.id)).toBe(true);
    }
  });
});

// ---------------------------------------------------------------------------
// 6. No duplicate options
// ---------------------------------------------------------------------------

describe('generateCard — no duplicate options', () => {
  it('all 4 options are distinct skills', () => {
    const skills = makeSkills(10);
    for (let i = 0; i < 50; i++) {
      const card = generateCard(skills, {}, empty, seeded(i));
      const ids = card.options.map(o => o.id);
      expect(new Set(ids).size).toBe(ids.length);
    }
  });
});

// ---------------------------------------------------------------------------
// 7. Distractor anti-repetition
// ---------------------------------------------------------------------------

describe('generateCard — distractor anti-repetition', () => {
  it('distractor set always differs by at least one skill from the previous set', () => {
    const skills = makeSkills(10);
    const prevDistractors = [skills[1].id, skills[2].id, skills[3].id];
    const history: GenerationHistory = {
      targets: [],
      lastDistractors: prevDistractors,
    };
    const prevSet = new Set(prevDistractors);

    for (let i = 0; i < 200; i++) {
      const card: PracticeCard = generateCard(skills, {}, history, seeded(i));
      const distractorIds = card.options
        .filter(o => o.id !== card.target.id)
        .map(o => o.id);
      const allInPrev = distractorIds.every(id => prevSet.has(id));
      expect(allInPrev).toBe(false);
    }
  });
});

// ---------------------------------------------------------------------------
// 8. Defensive small-topic handling (≤ 3 skills → relax to "not last 1")
// ---------------------------------------------------------------------------

describe('generateCard — small topic defensive handling', () => {
  it('with 3 skills and history [skillA, skillB] only excludes the last 1 target', () => {
    const skills = makeSkills(3); // skill_0, skill_1, skill_2
    const history: GenerationHistory = {
      targets: [skills[0].id, skills[1].id], // last 1 = skill_1
      lastDistractors: null,
    };
    for (let i = 0; i < 20; i++) {
      const card = generateCard(skills, {}, history, seeded(i));
      // With the relaxed constraint, only skill_1 (the most recent) is excluded
      expect(card.target.id).not.toBe(skills[1].id);
      // Card must be structurally valid
      expect(card.target).toBeDefined();
      expect(card.options.length).toBeGreaterThan(0);
      expect(card.options.some(o => o.id === card.target.id)).toBe(true);
    }
  });
});
