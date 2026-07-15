import Image from "next/image";
import Link from "next/link";
import { count, eq } from "drizzle-orm";
import { PublicHeader } from "@/components/public-header";
import { db } from "@/lib/db";
import { challenges, solves, users } from "@/lib/db/schema";
import { challengeBlueprints, challengeTracks } from "@/lib/challenge-blueprints";

export default async function Home() {
  const [[challengeCount], [playerCount], [solveCount], latestChallenges] = await Promise.all([
    db.select({ value: count() }).from(challenges).where(eq(challenges.isPublished, true)),
    db.select({ value: count() }).from(users),
    db.select({ value: count() }).from(solves),
    db.select({
      title: challenges.title,
      slug: challenges.slug,
      category: challenges.category,
      difficulty: challenges.difficulty,
      points: challenges.points,
    }).from(challenges).where(eq(challenges.isPublished, true)).limit(4),
  ]);

  const missionQueue = latestChallenges.length
    ? latestChallenges.map((challenge) => ({ ...challenge, href: `/labs/${challenge.slug}` }))
    : challengeBlueprints.slice(0, 4).map((challenge) => ({
      title: challenge.title,
      category: challenge.category,
      difficulty: challenge.difficulty,
      points: challenge.points,
      href: `/labs?category=${challenge.category}`,
    }));

  const stats = [
    ["Published labs", String(challengeCount?.value ?? 0)],
    ["Registered players", String(playerCount?.value ?? 0)],
    ["Verified solves", String(solveCount?.value ?? 0)],
    ["Challenge tracks", String(challengeTracks.length)],
  ] as const;

  return (
    <>
      <PublicHeader />
      <main>
        <section className="hero">
          <Image className="hero-media" src="/images/spectrasec-hero-terminal.svg" alt="Terminal operasi SpectraSec Labs" fill priority sizes="100vw" />
          <div className="container hero-inner hero-grid reveal">
            <div>
              <p className="eyebrow">SPECTRASEC LABS</p>
              <h1>SpectraSec<br /><span>Labs.</span></h1>
              <p className="hero-copy">Target legal. Flag jelas. Fokus ke solve.</p>
              <div className="hero-actions">
                <Link href="/labs" className="btn btn-primary">Open Labs <span>→</span></Link>
                <Link href="/register" className="btn btn-ghost">Join</Link>
              </div>
              <div className="hero-metrics" aria-label="Platform metrics">
                {stats.map(([label, value]) => <span key={label}><strong>{value}</strong>{label}</span>)}
              </div>
            </div>

            <aside className="ops-panel" aria-label="Mission queue">
              <div className="ops-panel-top"><span>QUEUE</span><strong>{missionQueue.length}</strong></div>
              <div className="queue-list">
                {missionQueue.map((challenge, index) => (
                  <Link href={challenge.href} className="queue-item" key={`${challenge.category}-${challenge.title}`}>
                    <span>{String(index + 1).padStart(2, "0")}</span>
                    <strong>{challenge.title}</strong>
                    <em>{challenge.category.toUpperCase()} · {challenge.points}PTS</em>
                  </Link>
                ))}
              </div>
            </aside>
          </div>
          <div className="hero-status"><span><i className="signal-dot" />ONLINE</span><span>NEON POSTGRES</span><span>UPLOAD FILES</span></div>
        </section>

        <section className="section">
          <div className="wide-container">
            <div className="section-head">
              <div><p className="eyebrow">TRACKS</p><h2>8 attack surfaces.</h2></div>
              <p>5 challenge per track.</p>
            </div>
            <div className="track-grid">
              {challengeTracks.map((track, index) => (
                <Link className="track-card" href={`/labs?category=${track.category}`} key={track.category}>
                  <span className="card-index">{String(index + 1).padStart(2, "0")} / {track.accent}</span>
                  <h3>{track.label}</h3>
                  <p>{track.focus}</p>
                </Link>
              ))}
            </div>
          </div>
        </section>

        <section className="section">
          <div className="wide-container cta-band">
            <div><p className="eyebrow">START</p><h2>Open a lab.</h2></div>
            <div><div className="hero-actions"><Link href="/labs" className="btn btn-primary">Buka Labs</Link><Link href="/leaderboard" className="btn btn-ghost">Leaderboard</Link></div></div>
          </div>
        </section>
      </main>
    </>
  );
}

