import Link from "next/link";
import { headers } from "next/headers";
import { notFound, redirect } from "next/navigation";
import { and, eq } from "drizzle-orm";
import { auth } from "@/lib/auth";
import { db } from "@/lib/db";
import { challengeFiles, challenges } from "@/lib/db/schema";
import { CategoryBadge, DifficultyBadge } from "@/components/category-badge";
import { SiteHeader } from "@/components/site-header";
import FlagSubmit from "./flag-submit";

export default async function ChallengePage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const session = await auth.api.getSession({ headers: await headers() }).catch(() => null);
  if (!session) redirect(`/login?redirect=${encodeURIComponent(`/labs/${slug}`)}`);
  const [challenge] = await db.select().from(challenges)
    .where(session.user.role === "admin" ? eq(challenges.slug, slug) : and(eq(challenges.slug, slug), eq(challenges.isPublished, true))).limit(1);
  if (!challenge) notFound();
  const files = await db.select().from(challengeFiles).where(eq(challengeFiles.challengeId, challenge.id));

  return (
    <>
      <SiteHeader active="labs" />
      <main className="section">
        <div className="container">
          <Link href="/labs" className="back-link">← Labs</Link>
          <div className="challenge-layout">
            <article className="challenge-body reveal">
              <div className="challenge-meta"><CategoryBadge category={challenge.category} /><DifficultyBadge difficulty={challenge.difficulty} /><span className="badge badge-violet">{challenge.points} PTS</span>{challenge.solvedCount === 0 ? <span className="badge badge-red">PIONEER +30</span> : null}</div>
              <h1>{challenge.title}</h1>
              <div className="challenge-description">{challenge.description}</div>
              {challenge.flagHint ? <aside className="hint"><strong>FLAG</strong><span>{challenge.flagHint}</span></aside> : null}
              <aside className={`pioneer-panel ${challenge.solvedCount === 0 ? "open" : "claimed"}`}><strong>{challenge.solvedCount === 0 ? "PIONEER SLOT OPEN" : "PIONEER CLAIMED"}</strong><span>{challenge.solvedCount === 0 ? "Solver pertama otomatis dapat +30 poin bonus." : "First blood sudah diambil. Solve berikutnya tetap dapat base points."}</span></aside>
              {files.length ? <section className="challenge-files"><h2>Target & artifacts</h2>{files.map((file) => <a key={file.id} className="file-row" href={file.url} target="_blank" rel="noreferrer"><span>{file.name}</span><span>{file.size > 0 ? `${Math.max(1, Math.round(file.size / 1024))} KB` : "OPEN"} ↗</span></a>)}</section> : null}
            </article>
            <FlagSubmit challengeId={challenge.id} solvedCount={challenge.solvedCount} />
          </div>
        </div>
      </main>
    </>
  );
}

