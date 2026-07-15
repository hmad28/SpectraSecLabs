import Link from "next/link";

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
      {/* Navbar */}
      <nav className="navbar">
        <Link href="/" className="navbar-brand">
          SPECTRASEC<span className="text-violet-bright">.LABS</span>
        </Link>
        <div className="navbar-links">
          <Link href="/labs" className="navbar-link">Labs</Link>
          <Link href="/leaderboard" className="navbar-link">Leaderboard</Link>
          <Link href="/login" className="navbar-link">Masuk</Link>
          <Link href="/register" className="btn btn-primary" style={{ minHeight: 36, padding: "0 16px", fontSize: 13 }}>Daftar</Link>
        </div>
      </nav>

      {/* Hero */}
      <section style={{
        position: "relative", minHeight: "calc(100vh - 73px)", display: "flex", alignItems: "center",
        overflow: "hidden", borderBottom: "1px solid var(--line)",
      }}>
        <div style={{
          position: "absolute", inset: 0,
          backgroundImage: "linear-gradient(rgba(255,255,255,.03) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,.03) 1px, transparent 1px)",
          backgroundSize: "72px 72px", opacity: 0.5,
        }} />
        <div className="container" style={{ position: "relative", zIndex: 1, paddingBlock: 80 }}>
          <div style={{ maxWidth: 720 }}>
            <p style={{
              display: "inline-flex", alignItems: "center", gap: 8, margin: "0 0 20px",
              padding: "6px 14px", border: "1px solid rgba(94,231,231,.2)", borderRadius: "var(--radius-pill)",
              background: "rgba(94,231,231,.06)", color: "var(--cyan)",
              fontFamily: "var(--font-mono)", fontSize: 11, fontWeight: 700, letterSpacing: 1,
            }}>
              <span style={{ width: 6, height: 6, borderRadius: "50%", background: "var(--cyan)", boxShadow: "0 0 10px var(--cyan)" }} />
              CTF PLATFORM — BETA
            </p>
            <h1 style={{
              fontFamily: "var(--font-display)", fontSize: "clamp(48px, 8vw, 96px)",
              fontWeight: 800, lineHeight: 0.92, margin: 0, letterSpacing: "-0.03em",
            }}>
              Belajar Security<br />
              <span style={{ color: "var(--violet-bright)" }}>Lewat Tantangan.</span>
            </h1>
            <p style={{ maxWidth: 580, margin: "24px 0 0", color: "var(--muted)", fontSize: "clamp(15px, 1.2vw, 18px)", lineHeight: 1.7 }}>
              Platform CTF challenges untuk komunitas SpectraSec. Asah skill ethical hacking, web security, dan vulnerability research — dari easy sampai insane.
            </p>
            <div style={{ display: "flex", gap: 12, marginTop: 32, flexWrap: "wrap" }}>
              <Link href="/register" className="btn btn-primary">Mulai Belajar →</Link>
              <Link href="/labs" className="btn btn-ghost">Jelajahi Labs</Link>
            </div>
          </div>
        </div>
      </section>

      {/* Stats */}
      <section style={{ borderBottom: "1px solid var(--line)", background: "rgba(255,255,255,.015)" }}>
        <div className="container" style={{ display: "grid", gridTemplateColumns: "repeat(4, 1fr)", gap: 0 }}>
          {[
            { label: "Challenges", value: "0" },
            { label: "Players", value: "0" },
            { label: "Categories", value: "7" },
            { label: "Difficulty", value: "4" },
          ].map((s) => (
            <div key={s.label} style={{ padding: "32px 24px", textAlign: "center", borderRight: "1px solid var(--line)" }}>
              <p style={{ fontFamily: "var(--font-display)", fontSize: 36, fontWeight: 800, margin: 0, color: "var(--violet-bright)" }}>{s.value}</p>
              <p style={{ color: "var(--muted)", fontSize: 12, margin: "6px 0 0", fontFamily: "var(--font-mono)", letterSpacing: 1 }}>{s.label}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Categories */}
      <section style={{ padding: "100px 0", borderBottom: "1px solid var(--line)" }}>
        <div className="container">
          <div style={{ textAlign: "center", marginBottom: 60 }}>
            <p className="eyebrow" style={{ justifyContent: "center" }}><span /> KATEGORI</p>
            <h2 style={{ fontFamily: "var(--font-display)", fontSize: "clamp(32px, 4vw, 52px)", fontWeight: 800, lineHeight: 1, margin: "16px 0 0" }}>
              7 Area Tantangan
            </h2>
            <p style={{ color: "var(--muted)", maxWidth: 520, margin: "16px auto 0", lineHeight: 1.7 }}>
              Dari web exploitation sampai reverse engineering — setiap kategori dirancang untuk menguji sudut pandang yang berbeda.
            </p>
          </div>
          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(280px, 1fr))", gap: 16 }}>
            {categories.map((cat) => (
              <Link key={cat.name} href={`/labs?category=${cat.name.toLowerCase()}`} className="card hover-card" style={{ padding: 28, textDecoration: "none", display: "flex", gap: "var(--space-md)", alignItems: "flex-start" }}>
                <span style={{ fontSize: 24, flexShrink: 0, lineHeight: 1 }}>{cat.icon}</span>
                <div>
                  <h3 style={{ fontFamily: "var(--font-display)", fontSize: 16, fontWeight: 700, margin: "0 0 4px" }}>{cat.name}</h3>
                  <p style={{ color: "var(--muted)", fontSize: 13, lineHeight: 1.6, margin: 0 }}>{cat.desc}</p>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section style={{ padding: "80px 0", textAlign: "center", background: "linear-gradient(180deg, rgba(146,84,246,.06), transparent)" }}>
        <div className="container">
          <h2 style={{ fontFamily: "var(--font-display)", fontSize: "clamp(28px, 3.5vw, 44px)", fontWeight: 800, lineHeight: 1.05, margin: 0 }}>
            Siap Menantang Diri?
          </h2>
          <p style={{ color: "var(--muted)", maxWidth: 480, margin: "16px auto 28px", lineHeight: 1.7 }}>
            Daftar sekarang dan mulai selesaikan tantangan CTF. Naikkan peringkatmu di leaderboard!
          </p>
          <div style={{ display: "flex", gap: 12, justifyContent: "center", flexWrap: "wrap" }}>
            <Link href="/register" className="btn btn-primary">Daftar Gratis</Link>
            <Link href="/labs" className="btn btn-ghost">Jelajahi Labs</Link>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer style={{ borderTop: "1px solid var(--line)", padding: "32px 0", textAlign: "center" }}>
        <div className="container">
          <p style={{ fontFamily: "var(--font-display)", fontSize: 18, fontWeight: 700, margin: "0 0 8px" }}>
            Learn. Hack. Protect.
          </p>
          <p style={{ color: "var(--muted)", fontSize: 12, margin: 0 }}>
            &copy; 2026 SpectraSec Labs — Platform CTF Challenges untuk komunitas cyber security Indonesia.
          </p>
        </div>
      </footer>
    </>
  );
}
