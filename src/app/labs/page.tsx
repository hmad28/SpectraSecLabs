import Link from "next/link";
import { and, desc, eq, ilike, or } from "drizzle-orm";
import { CategoryBadge, DifficultyBadge } from "@/components/category-badge";
import { PublicHeader } from "@/components/public-header";
import { db } from "@/lib/db";
import { challenges } from "@/lib/db/schema";
import { challengeCategories, challengeDifficulties } from "@/lib/validation";

export default async function LabsPage({ searchParams }: { searchParams: Promise<{ category?: string; difficulty?: string; q?: string }> }) {
  const filters = await searchParams;
  const category = challengeCategories.includes(filters.category as never) ? filters.category : undefined;
  const difficulty = challengeDifficulties.includes(filters.difficulty as never) ? filters.difficulty : undefined;
  const search = typeof filters.q === "string" ? filters.q.trim().slice(0, 80) : "";
  const conditions = [eq(challenges.isPublished, true)];
  if (category) conditions.push(eq(challenges.category, category as never));
  if (difficulty) conditions.push(eq(challenges.difficulty, difficulty as never));
  if (search) conditions.push(or(ilike(challenges.title, `%${search}%`), ilike(challenges.description, `%${search}%`))!);
  const allChallenges = await db.select({
    id: challenges.id, title: challenges.title, slug: challenges.slug, description: challenges.description,
    category: challenges.category, difficulty: challenges.difficulty, points: challenges.points, solvedCount: challenges.solvedCount,
  }).from(challenges).where(and(...conditions)).orderBy(desc(challenges.createdAt));
  const totals = [
    ["Showing", allChallenges.length],
    ["Easy", allChallenges.filter((item) => item.difficulty === "easy").length],
    ["Medium", allChallenges.filter((item) => item.difficulty === "medium").length],
    ["High", allChallenges.filter((item) => item.difficulty === "hard").length],
  ] as const;
  const preservedDifficulty = difficulty ? `difficulty=${difficulty}` : "";
  const preservedSearch = search ? `q=${encodeURIComponent(search)}` : "";

  return (
    <>
      <PublicHeader active="labs" />
      <main className="section">
        <div className="wide-container">
          <div className="section-head reveal">
            <div><p className="eyebrow">MISSION BOARD</p><h1>Pilih target.<br />Ambil flag.</h1></div>
            <p>{allChallenges.length} challenge aktif dalam filter ini. High difficulty dipetakan sebagai HARD di schema supaya konsisten dengan admin panel.</p>
          </div>
          <div className="lab-summary-grid">
            {totals.map(([label, value], index) => <article key={label}><span>0{index + 1}</span><strong>{value}</strong><p>{label}</p></article>)}
          </div>
          <form className="lab-filter-panel" action="/labs">
            <label><span>Search</span><input className="input" name="q" placeholder="Search challenge, vuln, file..." defaultValue={search} /></label>
            <label><span>Category</span><select className="form-select" name="category" defaultValue={category ?? ""}><option value="">All tracks</option>{challengeCategories.map((item) => <option key={item} value={item}>{item.toUpperCase()}</option>)}</select></label>
            <label><span>Difficulty</span><select className="form-select" name="difficulty" defaultValue={difficulty ?? ""}><option value="">All levels</option>{challengeDifficulties.filter((item) => item !== "insane").map((item) => <option key={item} value={item}>{item === "hard" ? "HIGH" : item.toUpperCase()}</option>)}</select></label>
            <button className="btn btn-primary" type="submit">Apply</button>
            <Link className="btn btn-ghost" href="/labs">Reset</Link>
          </form>
          <div className="active-filter-line">
            <span>{category ? category.toUpperCase() : "ALL TRACKS"}</span>
            <span>{difficulty ? (difficulty === "hard" ? "HIGH" : difficulty.toUpperCase()) : "ALL LEVELS"}</span>
            {search ? <span>QUERY: {search}</span> : null}
            {category ? <Link href={`/labs?${[preservedDifficulty, preservedSearch].filter(Boolean).join("&")}`}>clear category</Link> : null}
          </div>
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
