export type LearnerProfile = {
  confidence: number;
  valuationSkill: number;
  behaviorDiscipline: number;
};

export function recommendPath(profile: LearnerProfile): string[] {
  const ordered = [
    { id: "business-models", score: 10 - profile.confidence },
    { id: "fair-value", score: 10 - profile.valuationSkill },
    { id: "investor-psychology", score: 10 - profile.behaviorDiscipline },
    { id: "portfolio-management", score: 7 - Math.min(profile.confidence, profile.behaviorDiscipline) }
  ];

  return ordered.sort((a, b) => b.score - a.score).map((item) => item.id);
}
