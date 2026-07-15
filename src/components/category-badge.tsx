export function CategoryBadge({ category }: { category: string }) {
  return <span className={`badge badge-${category}`}>{category.toUpperCase()}</span>;
}

export function DifficultyBadge({ difficulty }: { difficulty: string }) {
  return <span className={`badge difficulty-${difficulty}`}>{difficulty === "hard" ? "HIGH" : difficulty.toUpperCase()}</span>;
}
