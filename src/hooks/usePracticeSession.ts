import { useCallback, useEffect, useRef, useState } from 'react';
import { ACTIVE_CHILD_ID, HUB_CONFIG, type TopicKey } from '../data/hubs';
import { useProgress, type PracticeResult } from './useProgress';
import type { Skill } from '../data/types';

export type PracticeCard = {
  target: Skill;
  options: Skill[];
};

export type GenerationHistory = {
  targets: string[];
  lastDistractors: string[] | null;
};

export function calculateWeight(result: PracticeResult | undefined): number {
  if (!result) return 1.0;
  const w = 1.0 + result.incorrect * 0.5 - result.correct * 0.25;
  return Math.max(0.25, Math.min(4.0, w));
}

function fisherYates<T>(arr: T[], rand: () => number): T[] {
  const copy = [...arr];
  for (let i = copy.length - 1; i > 0; i--) {
    const j = Math.floor(rand() * (i + 1));
    [copy[i], copy[j]] = [copy[j], copy[i]];
  }
  return copy;
}

function weightedPick<T>(items: T[], weights: number[], rand: () => number): T {
  const total = weights.reduce((a, b) => a + b, 0);
  let r = rand() * total;
  for (let i = 0; i < items.length; i++) {
    r -= weights[i];
    if (r <= 0) return items[i];
  }
  return items[items.length - 1];
}

export function generateCard(
  skills: Skill[],
  practiceResults: Record<string, PracticeResult>,
  history: GenerationHistory,
  rand: () => number = Math.random
): PracticeCard {
  // Defensive: relax to "not last 1" for topics with ≤ 3 skills
  const historyLimit = skills.length <= 3 ? 1 : 2;
  const recentTargets = new Set(history.targets.slice(-historyLimit));

  let eligible = skills.filter(s => !recentTargets.has(s.id));
  if (eligible.length === 0) eligible = [...skills];

  const eligibleWeights = eligible.map(s => calculateWeight(practiceResults[s.id]));
  const target = weightedPick(eligible, eligibleWeights, rand);

  const nonTarget = skills.filter(s => s.id !== target.id);
  const count = Math.min(3, nonTarget.length);
  let distractors = fisherYates(nonTarget, rand).slice(0, count);

  // Anti-repetition: re-roll one distractor if the set exactly matches the previous card's
  if (history.lastDistractors !== null && nonTarget.length > count) {
    const prevSet = new Set(history.lastDistractors);
    const sameSet =
      distractors.length === history.lastDistractors.length &&
      distractors.every(d => prevSet.has(d.id));
    if (sameSet) {
      const currentIds = new Set(distractors.map(d => d.id));
      const available = nonTarget.filter(s => !currentIds.has(s.id));
      if (available.length > 0) {
        const replacement = available[Math.floor(rand() * available.length)];
        const idx = Math.floor(rand() * count);
        distractors = [...distractors];
        distractors[idx] = replacement;
      }
    }
  }

  return {
    target,
    options: fisherYates([target, ...distractors], rand),
  };
}

function appendToHistory(history: GenerationHistory, card: PracticeCard): GenerationHistory {
  const distractorIds = card.options
    .filter(o => o.id !== card.target.id)
    .map(o => o.id);
  return {
    targets: [...history.targets, card.target.id].slice(-2),
    lastDistractors: distractorIds,
  };
}

export function usePracticeSession(topic: TopicKey): {
  currentCard: PracticeCard | null;
  recordAttempt: (skillId: string, wasCorrectFirstTap: boolean) => void;
  advance: () => void;
} {
  const hub = HUB_CONFIG.find(h => h.topic === topic);
  const skills: Skill[] = hub?.data ?? [];

  const { recordPracticeAttempt, getPracticeResults } = useProgress(ACTIVE_CHILD_ID);

  const historyRef = useRef<GenerationHistory>({ targets: [], lastDistractors: null });
  const [currentCard, setCurrentCard] = useState<PracticeCard | null>(null);

  useEffect(() => {
    if (skills.length === 0) return;
    const card = generateCard(skills, getPracticeResults(), historyRef.current);
    historyRef.current = appendToHistory(historyRef.current, card);
    setCurrentCard(card);
  }, []); // eslint-disable-line react-hooks/exhaustive-deps -- intentional mount-only init

  const recordAttempt = useCallback(
    (skillId: string, wasCorrectFirstTap: boolean): void => {
      recordPracticeAttempt(skillId, wasCorrectFirstTap);
    },
    [recordPracticeAttempt]
  );

  const advance = useCallback((): void => {
    if (skills.length === 0) return;
    const card = generateCard(skills, getPracticeResults(), historyRef.current);
    historyRef.current = appendToHistory(historyRef.current, card);
    setCurrentCard(card);
  }, [skills, getPracticeResults]);

  return { currentCard, recordAttempt, advance };
}
