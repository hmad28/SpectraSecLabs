import Image from "next/image";
import Link from "next/link";
import { count, eq } from "drizzle-orm";
import { SiteHeader } from "@/components/site-header";
import { db } from "@/lib/db";
import { challenges, solves, users } from "@/lib/db/schema";

const categories = [
  ["Web", "SQLi, XSS, SSRF, dan eksploitasi aplikasi web."],
  ["Crypto", "Kriptografi klasik, modern, dan kesalahan implementasi."],
  ["Forensic", "Analisis file, memori, metadata, dan network capture."],
  ["OSINT", "Investigasi terukur dari sumber informasi publik."],
  ["Reversing", "Bedah binary dan pahami logika aplikasi."],
  ["PWN", "Memory corruption, ROP, dan binary exploitation."],
  ["Misc", "Steganografi, scripting, dan puzzle eksperimental."],
] as const;

export default async function Home() {
  const [[challengeCount], [playerCount], [solveCount]] = await Promise.all([
    db.select({ value: count() }).from(challenges).where(eq(challenges.isPublished, true)),
    db.select({ value: count() }).from(users),
    db.select({ value: count() }).from(solves),
  ]);
  const stats = [
    ["01", String(challengeCount?.value ?? 0), "Published labs"],
    ["02", String(playerCount?.value ?? 0), "Registered players"],
    ["03", String(solveCount?.value ?? 0), "Verified solves"],
    ["04", "7", "Security tracks"],
  ];

  return (
    <>
      <SiteHeader />
      <main>
        <section className="hero">
          <Image className="hero-media" src="/images/spectrasec-hero.webp" alt="Security researcher di pusat operasi keamanan" fill priority sizes="100vw" />
          <div className="container hero-inner reveal">
            <p className="eyebrow">CTF PLATFORM · ETHICAL BY DEFAULT</p>
            <h1>Break systems.<br /><span>Build judgment.</span></h1>
            <p className="hero-copy">Ruang latihan cyber security untuk komunitas SpectraSec. Uji pemahaman, dokumentasikan proses, dan tumbuh lewat challenge legal dari fundamental sampai advanced.</p>
            <div className="hero-actions">
              <Link href="/register" className="btn btn-primary">Mulai Belajar <span>→</span></Link>
              <Link href="/labs" className="btn btn-ghost">Lihat Challenge</Link>
            </div>
          </div>
          <div className="hero-status"><span><i className="signal-dot" />LABS ONLINE</span><span>BASED IN INDONESIA</span><span>RESPONSIBLE DISCLOSURE</span></div>
        </section>

        <section aria-label="Platform statistics">
          <div className="wide-container proof-grid">
            {stats.map(([index, value, label]) => <article className="proof-card" key={index}><span>{index}</span><strong>{value}</strong><p>{label}</p></article>)}
          </div>
        </section>

        <section className="section">
          <div className="wide-container">
            <div className="section-head">
              <div><p className="eyebrow">ATTACK SURFACES</p><h2>Tujuh jalur.<br />Satu mindset.</h2></div>
              <p>Setiap track menguji cara berpikir yang berbeda. Konsep tetap didahulukan sebelum tools, dan seluruh praktik dibatasi pada target yang disediakan.</p>
            </div>
            <div className="category-grid">
              {categories.map(([name, description], index) => (
                <Link className="category-card" href={`/labs?category=${name.toLowerCase()}`} key={name}>
                  <span className="card-index">0{index + 1}</span><h3>{name}</h3><p>{description}</p>
                </Link>
              ))}
            </div>
          </div>
        </section>

        <section className="section" style={{ borderTop: "1px solid var(--color-line)" }}>
          <div className="container section-head">
            <div><p className="eyebrow">ENTER THE LAB</p><h2>Belajar dengan bukti.</h2></div>
            <div><p>Selesaikan challenge, kumpulkan poin, dan ukur progresmu di leaderboard komunitas.</p><div className="hero-actions"><Link href="/register" className="btn btn-primary">Buat Akun Gratis</Link><Link href="/leaderboard" className="btn btn-ghost">Leaderboard</Link></div></div>
          </div>
        </section>
      </main>
    </>
  );
}
