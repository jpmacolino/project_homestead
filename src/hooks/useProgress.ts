import { useCallback, useEffect, useState } from "react";
import type { ChildProgress, MasteryRecord, SkillResult } from "../types/progress";

const KEY_PREFIX = "homestead_progress_";

function storageKey(childId: string): string {
  return `${KEY_PREFIX}${childId}`;
}

function loadProgress(childId: string): ChildProgress {
  try {
    const raw = localStorage.getItem(storageKey(childId));
    if (raw) return JSON.parse(raw) as ChildProgress;
  } catch {
    // corrupted storage — start fresh
  }
  return { childId, skillEvents: [], mastery: [] };
}

function saveProgress(progress: ChildProgress): void {
  localStorage.setItem(storageKey(progress.childId), JSON.stringify(progress));
}

export function useProgress(childId: string) {
  const [progress, setProgress] = useState<ChildProgress>(() =>
    loadProgress(childId)
  );

  // Reload when childId changes (e.g. switching active child profile)
  useEffect(() => {
    setProgress(loadProgress(childId));
  }, [childId]);

  const persist = useCallback((updated: ChildProgress): void => {
    saveProgress(updated);
    setProgress(updated);
  }, []);

  const recordSkillEvent = useCallback(
    (event: SkillResult): void => {
      persist({
        ...progress,
        skillEvents: [...progress.skillEvents, event],
      });
    },
    [progress, persist]
  );

  const markMastered = useCallback(
    (skillId: string): void => {
      const now = Date.now();
      const existing = progress.mastery.find((m) => m.skillId === skillId);

      const updatedMastery: MasteryRecord[] = existing
        ? progress.mastery.map((m) =>
            m.skillId === skillId
              ? { ...m, lastReviewedAt: now, reviewCount: m.reviewCount + 1 }
              : m
          )
        : [
            ...progress.mastery,
            { skillId, masteredAt: now, lastReviewedAt: now, reviewCount: 1 },
          ];

      persist({ ...progress, mastery: updatedMastery });
    },
    [progress, persist]
  );

  const isMastered = useCallback(
    (skillId: string): boolean => {
      return progress.mastery.some((m) => m.skillId === skillId);
    },
    [progress.mastery]
  );

  const getMasteryRecord = useCallback(
    (skillId: string): MasteryRecord | undefined => {
      return progress.mastery.find((m) => m.skillId === skillId);
    },
    [progress.mastery]
  );

  const getStruggleItems = useCallback(
    (threshold: number): string[] => {
      // Group events per skill, preserving chronological order
      const bySkill = new Map<string, SkillResult[]>();
      for (const event of progress.skillEvents) {
        const bucket = bySkill.get(event.skillId) ?? [];
        bucket.push(event);
        bySkill.set(event.skillId, bucket);
      }

      const struggles: string[] = [];
      for (const [skillId, events] of bySkill) {
        if (events.length < threshold) continue;
        const lastN = events.slice(-threshold);
        if (lastN.every((e) => e.result === "incorrect")) {
          struggles.push(skillId);
        }
      }
      return struggles;
    },
    [progress.skillEvents]
  );

  const resetProgress = useCallback((): void => {
    persist({ childId, skillEvents: [], mastery: [] });
  }, [childId, persist]);

  return {
    recordSkillEvent,
    markMastered,
    isMastered,
    getMasteryRecord,
    getStruggleItems,
    resetProgress,
  };
}
