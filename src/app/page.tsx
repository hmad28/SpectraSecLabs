import Image from "next/image";
import Link from "next/link";
import { count, desc, eq } from "drizzle-orm";
import { PublicHeader } from "@/components/public-header";
import { db } from "@/lib/db";
import { challenges, solves, users } from "@/lib/db/schema";
import { challengeBlueprints, challengeTracks } from "@/lib/challenge-blueprints";

const playbook = [
  ["01", "Recon", "Baca scope, petakan surface, dan kumpulkan indikator sebelum menyerang."],
  ["02", "Exploit", "Kerjakan target legal dengan payload terkontrol dan catatan yang bisa diaudit."],
  ["03", "Prove", "Submit flag, simpan bukti, dan cek apakah solve sudah masuk leaderboard."],
  ["04", "Write", "Ubah temuan jadi writeup singkat supaya knowledge komunitas ikut naik."],
] as const;

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
    }).from(challenges).where(eq(challenges.isPublished, true)).orderBy(desc(challenges.createdAt)).limit(4),
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
              <p className="eyebrow">AUTHORIZED CTF RANGE · COMMUNITY OPS</p>
              <h1>SpectraSec<br /><span>Labs.</span></h1>
              <p className="hero-copy">Arena latihan cyber security untuk komunitas yang butuh target legal, leaderboard jelas, dan challenge yang makin naik dari fundamental sampai high impact.</p>
              <div className="hero-actions">
                <Link href="/labs" className="btn btn-primary">Masuk Mission Board <span>→</span></Link>
                <Link href="/register" className="btn btn-ghost">Buat Operator ID</Link>
              </div>
              <div className="hero-metrics" aria-label="Platform metrics">
                {stats.map(([label, value]) => <span key={label}><strong>{value}</strong>{label}</span>)}
              </div>
            </div>

            <aside className="ops-panel" aria-label="Mission queue">
              <div className="ops-panel-top"><span>LIVE QUEUE</span><strong>{missionQueue.length} ACTIVE</strong></div>
              <div className="terminal-lines">
                <code>$ connect spectra-range</code>
                <code>scope: legal / isolated / logged</code>
                <code>tracks: web crypto forensic osint reversing pwn misc</code>
              </div>
              <div className="queue-list">
                {missionQueue.map((challenge, index) => (
                  <Link href={challenge.href} className="queue-item" key={`${challenge.category}-${challenge.title}`}>
                    <span>{String(index + 1).padStart(2, "0")}</span>
                    <strong>{challenge.title}</strong>
                    <em>{challenge.category.toUpperCase()} · {challenge.difficulty.toUpperCase()} · {challenge.points}PTS</em>
                  </Link>
                ))}
              </div>
            </aside>
          </div>
          <div className="hero-status"><span><i className="signal-dot" />RANGE ONLINE</span><span>NEON DB READY</span><span>UPLOADTHING ENABLED</span></div>
        </section>

        <section aria-label="Platform statistics">
          <div className="wide-container proof-grid">
            {stats.map(([label, value], index) => <article className="proof-card" key={label}><span>0{index + 1}</span><strong>{value}</strong><p>{label}</p></article>)}
          </div>
        </section>

        <section className="section">
          <div className="wide-container">
            <div className="section-head">
              <div><p className="eyebrow">ATTACK MATRIX</p><h2>40 seeded labs.<br />8 attack surfaces.</h2></div>
              <p>Setiap track disiapkan 5 challenge: 2 easy, 2 medium, dan 1 high yang dipetakan sebagai hard di schema platform.</p>
            </div>
            <div className="track-grid">
              {challengeTracks.map((track, index) => (
                <Link className="track-card" href={`/labs?category=${track.category}`} key={track.category}>
                  <span className="card-index">{String(index + 1).padStart(2, "0")} / {track.accent}</span>
                  <h3>{track.label}</h3>
                  <p>{track.focus}</p>
                  <strong>5 missions</strong>
                </Link>
              ))}
            </div>
          </div>
        </section>

        <section className="section section-split">
          <div className="container">
            <div className="section-head">
              <div><p className="eyebrow">OPERATOR FLOW</p><h2>Dari signal<br />ke solve.</h2></div>
              <p>Flow latihan dibuat singkat supaya member baru bisa langsung mulai, tapi tetap cukup rapi untuk writeup dan audit challenge.</p>
            </div>
            <div className="playbook-grid">
              {playbook.map(([index, title, copy]) => <article className="playbook-card" key={title}><span>{index}</span><h3>{title}</h3><p>{copy}</p></article>)}
            </div>
          </div>
        </section>

        <section className="section">
          <div className="wide-container cta-band">
            <div><p className="eyebrow">ENTER THE RANGE</p><h2>Mulai dari easy.<br />Naik sampai hard.</h2></div>
            <div><p>Challenge, dashboard user, leaderboard, dan admin panel sudah diarahkan untuk deployment Vercel free tier dengan Neon dan UploadThing.</p><div className="hero-actions"><Link href="/labs" className="btn btn-primary">Buka Labs</Link><Link href="/leaderboard" className="btn btn-ghost">Cek Leaderboard</Link></div></div>
          </div>
        </section>
      </main>
    </>
  );
}
