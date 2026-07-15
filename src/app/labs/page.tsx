import Link from "next/link";
import { and, desc, eq } from "drizzle-orm";
import { CategoryBadge, DifficultyBadge } from "@/components/category-badge";
import { SiteHeader } from "@/components/site-header";
import { db } from "@/lib/db";
import { challenges } from "@/lib/db/schema";
import { challengeCategories, challengeDifficulties } from "@/lib/validation";

export default async function LabsPage({ searchParams }: { searchParams: Promise<{ category?: string; difficulty?: string }> }) {
  const filters = await searchParams;
  const category = challengeCategories.includes(filters.category as never) ? filters.category : undefined;
  const difficulty = challengeDifficulties.includes(filters.difficulty as never) ? filters.difficulty : undefined;
  const conditions = [eq(challenges.isPublished, true)];
  if (category) conditions.push(eq(challenges.category, category as never));
  if (difficulty) conditions.push(eq(challenges.difficulty, difficulty as never));
  const allChallenges = await db.select({
    id: challenges.id, title: challenges.title, slug: challenges.slug, description: challenges.description,
    category: challenges.category, difficulty: challenges.difficulty, points: challenges.points, solvedCount: challenges.solvedCount,
  }).from(challenges).where(and(...conditions)).orderBy(desc(challenges.createdAt));

  return (
    <>
      <SiteHeader active="labs" />
      <main className="section">
        <div className="wide-container">
          <div className="section-head reveal">
            <div><p className="eyebrow">CHALLENGE ARCHIVE</p><h1>Pilih surface.<br />Temukan celah.</h1></div>
            <p>{allChallenges.length} challenge tersedia. Semua target dirancang untuk lingkungan legal dan scope yang jelas.</p>
          </div>
          <nav className="filter-bar" aria-label="Filter challenge">
            <Link href="/labs" data-active={!category}>ALL</Link>
            {challengeCategories.map((item) => <Link key={item} href={`/labs?category=${item}`} data-active={category === item}>{item.toUpperCase()}</Link>)}
          </nav>
          {allChallenges.length ? (
            <div className="challenge-grid reveal reveal-delay">
              {allChallenges.map((challenge, index) => (
                <Link key={challenge.id} href={`/labs/${challenge.slug}`} className="challenge-card">
                  <div className="challenge-meta"><CategoryBadge category={challenge.category} /><DifficultyBadge difficulty={challenge.difficulty} /></div>
                  <span className="card-index">{String(index + 1).padStart(2, "0")}</span>
                  <h3>{challenge.title}</h3>
                  <p>{challenge.description.slice(0, 116)}{challenge.description.length > 116 ? "..." : ""}</p>
                  <div className="challenge-footer"><strong>{challenge.points} PTS</strong><span>{challenge.solvedCount} SOLVES</span></div>
                </Link>
              ))}
            </div>
          ) : <div className="empty-state"><p>Belum ada challenge untuk filter ini.</p><Link href="/labs" className="btn btn-ghost empty-action">Reset Filter</Link></div>}
        </div>
      </main>
    </>
  );
}
