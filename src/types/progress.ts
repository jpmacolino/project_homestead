export type SkillResult = {
  skillId: string;
  result: "correct" | "incorrect";
  mode: string;
  timestamp: number;
};

export type MasteryRecord = {
  skillId: string;
  masteredAt: number;
  lastReviewedAt: number;
  reviewCount: number;
};

export type ChildProgress = {
  childId: string;
  skillEvents: SkillResult[];
  mastery: MasteryRecord[];
};
