export const difficultyBasePoints = {
  easy: 50,
  medium: 150,
  hard: 300,
  insane: 500,
} as const;

export const PIONEER_BONUS = 30;

export type Difficulty = keyof typeof difficultyBasePoints;

export type BadgeInput = {
  easy: number;
  medium: number;
  hard: number;
  insane: number;
  pioneers: number;
  hintless?: number;
  categories?: number;
  categoryTotal?: number;
};

type Badge = { label: string; requirement: string; weight: number; tone: "cyan" | "violet" | "yellow" | "red" };

const difficultyBadges: Record<Difficulty, Array<[number, Badge]>> = {
  easy: [[100, { label: "Sovereign", requirement: "100 easy", weight: 25, tone: "cyan" }], [50, { label: "Master Operator", requirement: "50 easy", weight: 20, tone: "cyan" }], [30, { label: "Hardened", requirement: "30 easy", weight: 15, tone: "cyan" }], [15, { label: "Field Operator", requirement: "15 easy", weight: 10, tone: "cyan" }], [5, { label: "Foothold", requirement: "5 easy", weight: 5, tone: "cyan" }]],
  medium: [[100, { label: "High Marshal", requirement: "100 medium", weight: 50, tone: "yellow" }], [50, { label: "Strategist", requirement: "50 medium", weight: 45, tone: "yellow" }], [30, { label: "Strike Leader", requirement: "30 medium", weight: 40, tone: "yellow" }], [15, { label: "Skirmisher", requirement: "15 medium", weight: 35, tone: "yellow" }], [5, { label: "Tactician", requirement: "5 medium", weight: 30, tone: "yellow" }]],
  hard: [[100, { label: "Warlord", requirement: "100 hard", weight: 75, tone: "red" }], [50, { label: "Annihilator", requirement: "50 hard", weight: 70, tone: "red" }], [30, { label: "Iron Sentinel", requirement: "30 hard", weight: 65, tone: "red" }], [15, { label: "Stormbreaker", requirement: "15 hard", weight: 60, tone: "red" }], [5, { label: "Breacher", requirement: "5 hard", weight: 55, tone: "red" }]],
  insane: [[100, { label: "Immortal", requirement: "100 insane", weight: 100, tone: "violet" }], [50, { label: "Apex", requirement: "50 insane", weight: 95, tone: "violet" }], [25, { label: "Void Walker", requirement: "25 insane", weight: 90, tone: "violet" }], [10, { label: "Mind Render", requirement: "10 insane", weight: 85, tone: "violet" }], [3, { label: "Edge Walker", requirement: "3 insane", weight: 80, tone: "violet" }]],
};

const pioneerBadges: Array<[number, Badge]> = [
  [25, { label: "Apex Hunter", requirement: "25 pioneer", weight: 88, tone: "red" }],
  [10, { label: "Spearhead", requirement: "10 pioneer", weight: 78, tone: "red" }],
  [5, { label: "Trailblazer", requirement: "5 pioneer", weight: 58, tone: "red" }],
  [1, { label: "Vanguard", requirement: "1 pioneer", weight: 28, tone: "red" }],
];

export function basePointsForDifficulty(difficulty: string) {
  return difficultyBasePoints[difficulty as Difficulty] ?? difficultyBasePoints.easy;
}

function firstQualified(count: number, badges: Array<[number, Badge]>) {
  return badges.find(([needed]) => count >= needed)?.[1] ?? null;
}

export function earnedBadges(input: BadgeInput) {
  const badges = [
    firstQualified(input.easy, difficultyBadges.easy),
    firstQualified(input.medium, difficultyBadges.medium),
    firstQualified(input.hard, difficultyBadges.hard),
    firstQualified(input.insane, difficultyBadges.insane),
    firstQualified(input.pioneers, pioneerBadges),
  ].filter(Boolean) as Badge[];
  if ((input.hintless ?? 0) >= 10) badges.push({ label: "Lone Wolf", requirement: "10 hintless", weight: 62, tone: "violet" });
  if ((input.categoryTotal ?? 0) > 0 && (input.categories ?? 0) >= (input.categoryTotal ?? 0)) badges.push({ label: "Polymath", requirement: "all categories", weight: 72, tone: "cyan" });
  return badges.sort((a, b) => b.weight - a.weight);
}

export function bestBadge(input: BadgeInput) {
  return earnedBadges(input)[0] ?? null;
}

