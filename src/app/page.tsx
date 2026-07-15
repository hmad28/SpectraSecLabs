import Link from "next/link";

const featuredChallenges = [
  { name: "SQL Injection 101", cat: "Web", diff: "Easy", pts: 100, solved: 0 },
  { name: "Caesar's Revenge", cat: "Crypto", diff: "Easy", pts: 100, solved: 0 },
  { name: "Memory Dump", cat: "Forensic", diff: "Medium", pts: 250, solved: 0 },
];

const categories = [
  { name: "Web", desc: "SQLi, XSS, SSRF — serangan aplikasi web", icon: "🌐" },
  { name: "Crypto", desc: "Kriptografi modern sampai klasik", icon: "🔐" },
  { name: "Forensic", desc: "Analisis memori, file, network", icon: "🔍" },
  { name: "OSINT", desc: "Reconnaissance dari sumber publik", icon: "🕵️" },
  { name: "Reversing", desc: "Reverse engineering binary & app", icon: "⚙️" },
  { name: "PWN", desc: "Binary exploitation, ROP chains", icon: "💥" },
  { name: "Misc", desc: "Stego, coding, puzzle — sisanya", icon: "🎲" },
];

export default function Home() {
  return (
    <>
      {/* N5 Floating Pill Nav */}
      <nav
        style={{
          position: "fixed", top: "var(--space-md)", left: "50%", zIndex: 20,
          transform: "translateX(-50%)",
          display: "inline-flex", alignItems: "center", gap: "var(--space-md)",
          padding: "0.5rem 0.875rem",
          background: "color-mix(in oklch, var(--color-panel) 82%, transparent)",
          backdropFilter: "blur(14px) saturate(120%)",
          border: "1px solid var(--color-rule)",
          borderRadius: "var(--radius-pill)",
          boxShadow: "0 8px 24px -12px oklch(0% 0 0 / 0.18)",
        }}
      >
        <Link href="/" style={{ fontFamily: "var(--font-display)", fontWeight: 800, fontSize: 15 }}>
          SL<span style={{ color: "var(--color-accent)" }}>·</span>Labs
        </Link>
        <div style={{ display: "flex", gap: "var(--space-sm)", alignItems: "center" }}>
          <Link href="/labs" style={{ fontSize: 13, color: "var(--color-muted)", transition: "color .15s" }}>Labs</Link>
          <Link href="/leaderboard" style={{ fontSize: 13, color: "var(--color-muted)", transition: "color .15s" }}>Peringkat</Link>
        </div>
        <div style={{ display: "flex", gap: "var(--space-2xs)" }}>
          <Link href="/login" className="btn btn-ghost" style={{ minHeight: 32, fontSize: 12, padding: "0 12px" }}>Masuk</Link>
          <Link href="/register" className="btn btn-primary" style={{ minHeight: 32, fontSize: 12, padding: "0 12px" }}>Daftar</Link>
        </div>
      </nav>

      {/* ─── ECO: Hero rail ─── */}
      <section
        style={{
          minHeight: "100vh",
          display: "flex", alignItems: "center",
          padding: "120px 0 80px",
          borderBottom: "1px solid var(--color-rule)",
        }}
      >
        <div className="container" style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "var(--space-3xl)", alignItems: "center" }}>
          <div>
            <span
              style={{
                display: "inline-flex", alignItems: "center", gap: "var(--space-2xs)",
                marginBottom: "var(--space-lg)",
                padding: "4px 12px", borderRadius: "var(--radius-pill)",
                border: "1px solid oklch(65% 0.14 190 / 0.25)",
                background: "oklch(65% 0.14 190 / 0.08)",
                color: "oklch(75% 0.16 190)",
                fontFamily: "var(--font-mono)", fontSize: 11, fontWeight: 700, letterSpacing: 1,
              }}
            >
              <span style={{ width: 6, height: 6, borderRadius: "50%", background: "oklch(75% 0.16 190)", boxShadow: "0 0 10px oklch(75% 0.16 190)" }} />
              CTF PLATFORM
            </span>
            <h1 style={{ fontFamily: "var(--font-display)", fontSize: "var(--text-display)", fontWeight: 800, lineHeight: 0.92, margin: 0, letterSpacing: "-0.03em" }}>
              Belajar Security<br />
              <span style={{ color: "var(--color-accent)" }}>Lewat Tantangan.</span>
            </h1>
            <p style={{ maxWidth: "52ch", margin: "var(--space-lg) 0 0", color: "var(--color-muted)", fontSize: "var(--text-lg)", lineHeight: 1.7 }}>
              Platform CTF challenges untuk komunitas SpectraSec. Asah skill ethical hacking, web security, dan vulnerability research — dari easy sampai insane.
            </p>
            <div style={{ display: "flex", gap: "var(--space-sm)", marginTop: "var(--space-xl)", flexWrap: "wrap" }}>
              <Link href="/register" className="btn btn-primary">Mulai Belajar →</Link>
              <Link href="/labs" className="btn btn-ghost">Jelajahi Labs</Link>
            </div>
          </div>
          <div style={{ display: "grid", gap: "var(--space-sm)" }}>
            {/* Featured challenge cards */}
            {featuredChallenges.map((c) => (
              <div key={c.name} className="card" style={{ padding: "var(--space-md) var(--space-lg)", display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                <div>
                  <div style={{ display: "flex", gap: "var(--space-2xs)", marginBottom: 4 }}>
                    <span className="badge badge-cyan" style={{ fontSize: 9 }}>{c.cat}</span>
                    <span className="badge badge-success" style={{ fontSize: 9 }}>{c.diff}</span>
                  </div>
                  <span style={{ fontFamily: "var(--font-display)", fontWeight: 700, fontSize: 15 }}>{c.name}</span>
                </div>
                <div style={{ textAlign: "right" }}>
                  <div style={{ fontFamily: "var(--font-mono)", fontSize: 14, fontWeight: 700, color: "var(--color-accent)" }}>{c.pts} pts</div>
                  <div style={{ fontSize: 11, color: "var(--color-neutral)" }}>{c.solved} solved</div>
                </div>
              </div>
            ))}
            <div style={{ textAlign: "right" }}>
              <Link href="/labs" style={{ fontSize: 13, color: "var(--color-accent)", fontFamily: "var(--font-mono)" }}>
                Lihat semua challenge →
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* ─── ECO: Stats rail ─── */}
      <section style={{ borderBottom: "1px solid var(--color-rule)", background: "color-mix(in oklch, var(--color-accent) 2%, transparent)" }}>
        <div className="container" style={{ display: "grid", gridTemplateColumns: "repeat(4, 1fr)", gap: 0 }}>
          {[
            { label: "Challenges", value: "0" },
            { label: "Players", value: "0" },
            { label: "Categories", value: "7" },
            { label: "Difficulty", value: "4" },
          ].map((s) => (
            <div key={s.label} style={{ padding: "var(--space-xl) var(--space-lg)", textAlign: "center", borderRight: "1px solid var(--color-rule)" }}>
              <p style={{ fontFamily: "var(--font-display)", fontSize: 36, fontWeight: 800, margin: 0, color: "var(--color-accent)" }}>{s.value}</p>
              <p style={{ color: "var(--color-muted)", fontSize: 11, margin: "4px 0 0", fontFamily: "var(--font-mono)", letterSpacing: 1 }}>{s.label}</p>
            </div>
          ))}
        </div>
      </section>

      {/* ─── ECO: Categories grid ─── */}
      <section style={{ padding: "var(--space-3xl) 0", borderBottom: "1px solid var(--color-rule)" }}>
        <div className="container">
          <div style={{ marginBottom: "var(--space-2xl)" }}>
            <span className="eyebrow"><span /> KATEGORI</span>
            <h2 style={{ fontFamily: "var(--font-display)", fontSize: "var(--text-3xl)", fontWeight: 800, lineHeight: 1, margin: 0 }}>
              7 Area Tantangan
            </h2>
            <p style={{ color: "var(--color-muted)", maxWidth: "52ch", margin: "var(--space-sm) 0 0", lineHeight: 1.7 }}>
              Dari web exploitation sampai reverse engineering — setiap kategori dirancang untuk menguji sudut pandang yang berbeda.
            </p>
          </div>
          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(300px, 1fr))", gap: "var(--space-sm)" }}>
            {categories.map((cat) => (
              <Link
                key={cat.name}
                href={`/labs?category=${cat.name.toLowerCase()}`}
                className="card hover-card"
                style={{ padding: "var(--space-lg)", textDecoration: "none", display: "flex", gap: "var(--space-md)", alignItems: "flex-start" }}
              >
                <span style={{ fontSize: 24, flexShrink: 0, lineHeight: 1 }}>{cat.icon}</span>
                <div>
                  <h3 style={{ fontFamily: "var(--font-display)", fontSize: 16, fontWeight: 700, margin: "0 0 4px" }}>{cat.name}</h3>
                  <p style={{ color: "var(--color-muted)", fontSize: 13, lineHeight: 1.6, margin: 0 }}>{cat.desc}</p>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* ─── ECO: Call to action ─── */}
      <section style={{ padding: "var(--space-3xl) 0", textAlign: "center", background: "linear-gradient(180deg, color-mix(in oklch, var(--color-accent) 6%, transparent), transparent)" }}>
        <div className="container">
          <h2 style={{ fontFamily: "var(--font-display)", fontSize: "var(--text-3xl)", fontWeight: 800, lineHeight: 1.05, margin: 0 }}>
            Siap Menantang Diri?
          </h2>
          <p style={{ color: "var(--color-muted)", maxWidth: "42ch", margin: "var(--space-md) auto var(--space-xl)", lineHeight: 1.7 }}>
            Daftar, selesaikan tantangan, dan naikkan peringkatmu di leaderboard SpectraSec.
          </p>
          <div style={{ display: "flex", gap: "var(--space-sm)", justifyContent: "center", flexWrap: "wrap" }}>
            <Link href="/register" className="btn btn-primary">Daftar Sekarang</Link>
            <Link href="/labs" className="btn btn-ghost">Jelajahi Labs</Link>
          </div>
        </div>
      </section>

      {/* Ft5 Statement Footer */}
      <footer style={{ padding: "var(--space-2xl) 0 var(--space-lg)", borderTop: "1px solid var(--color-rule)" }}>
        <div className="container" style={{ display: "grid", gap: "var(--space-lg)" }}>
          <p style={{ fontFamily: "var(--font-display)", fontSize: "clamp(1.5rem, 4vw, 2.5rem)", lineHeight: 1.0, letterSpacing: "-0.02em", maxWidth: "28ch", margin: 0 }}>
            Learn. Hack. Protect.
          </p>
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "baseline", paddingBlockStart: "var(--space-sm)", borderTop: "1px solid var(--color-rule)" }}>
            <span style={{ fontFamily: "var(--font-display)", fontWeight: 800, fontSize: 14 }}>SPECTRASEC<span style={{ color: "var(--color-accent)" }}>.LABS</span></span>
            <span style={{ color: "var(--color-muted)", fontSize: 12 }}>© 2026 · SpectraSec</span>
          </div>
        </div>
      </footer>
    </>
  );
}
