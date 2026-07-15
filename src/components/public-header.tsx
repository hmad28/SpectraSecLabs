import Image from "next/image";
import Link from "next/link";

export function PublicHeader({ active }: { active?: "labs" | "leaderboard" }) {
  return (
    <header className="site-header public-header">
      <Link href="/" className="brand" aria-label="SpectraSec Labs beranda">
        <Image src="/images/spectrasec-logo.jpg" alt="" width={40} height={40} className="brand-logo" priority />
        <span>SPECTRASEC<span>.LABS</span></span>
      </Link>
      <nav className="desktop-nav" aria-label="Navigasi utama">
        <Link href="/labs" data-active={active === "labs"}>Labs</Link>
        <Link href="/leaderboard" data-active={active === "leaderboard"}>Leaderboard</Link>
        <Link href="/login">Masuk</Link>
      </nav>
      <Link href="/register" className="header-cta">
        Join Operation<span aria-hidden="true">↗</span>
      </Link>
      <details className="mobile-menu">
        <summary aria-label="Buka navigasi"><span /><span /></summary>
        <nav>
          <Link href="/labs">Labs</Link>
          <Link href="/leaderboard">Leaderboard</Link>
          <Link href="/login">Masuk</Link>
          <Link href="/register">Join Operation</Link>
        </nav>
      </details>
    </header>
  );
}
