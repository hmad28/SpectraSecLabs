import Image from "next/image";
import Link from "next/link";
import { headers } from "next/headers";
import { auth } from "@/lib/auth";

export async function SiteHeader({ active }: { active?: "labs" | "leaderboard" }) {
  const session = await auth.api.getSession({ headers: await headers() }).catch(() => null);
  return (
    <header className="site-header">
      <Link href="/" className="brand" aria-label="SpectraSec Labs beranda">
        <Image src="/images/spectrasec-logo.jpg" alt="" width={40} height={40} className="brand-logo" priority />
        <span>SPECTRASEC<span>.LABS</span></span>
      </Link>
      <nav className="desktop-nav" aria-label="Navigasi utama">
        <Link href="/labs" data-active={active === "labs"}>Labs</Link>
        <Link href="/leaderboard" data-active={active === "leaderboard"}>Leaderboard</Link>
        {session ? <Link href="/dashboard">Dashboard</Link> : <Link href="/login">Masuk</Link>}
      </nav>
      <Link href={session ? "/dashboard" : "/register"} className="header-cta">
        {session ? session.user.name : "Mulai Challenge"}<span aria-hidden="true">↗</span>
      </Link>
      <details className="mobile-menu">
        <summary aria-label="Buka navigasi"><span /><span /></summary>
        <nav>
          <Link href="/labs">Labs</Link>
          <Link href="/leaderboard">Leaderboard</Link>
          <Link href={session ? "/dashboard" : "/login"}>{session ? "Dashboard" : "Masuk"}</Link>
        </nav>
      </details>
    </header>
  );
}
