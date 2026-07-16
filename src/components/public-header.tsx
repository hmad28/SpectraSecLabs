import Image from "next/image";
import Link from "next/link";
import { headers } from "next/headers";
import { auth } from "@/lib/auth";

export async function PublicHeader({ active }: { active?: "labs" | "leaderboard" }) {
  const session = await auth.api.getSession({ headers: await headers() }).catch(() => null);
  const accountHref = session ? (session.user.role === "admin" ? "/admin" : "/dashboard") : "/login";
  const accountLabel = session ? (session.user.role === "admin" ? "Control Room" : "Dashboard") : "Masuk";
  const ctaHref = session ? accountHref : "/register";
  const ctaLabel = session ? accountLabel : "Join Operation";

  return (
    <header className="site-header public-header">
      <Link href="/" className="brand" aria-label="SpectraSec Labs beranda">
        <Image src="/images/spectrasec-logo.jpg" alt="" width={40} height={40} className="brand-logo" priority />
        <span>SPECTRASEC<span>.LABS</span></span>
      </Link>
      <nav className="desktop-nav" aria-label="Navigasi utama">
        <Link href="/labs" data-active={active === "labs"}>Labs</Link>
        <Link href="/leaderboard" data-active={active === "leaderboard"}>Leaderboard</Link>
        <Link href={accountHref}>{accountLabel}</Link>
      </nav>
      <Link href={ctaHref} className="header-cta">
        {ctaLabel}<span aria-hidden="true">↗</span>
      </Link>
      <details className="mobile-menu">
        <summary aria-label="Buka navigasi"><span /><span /></summary>
        <nav>
          <Link href="/labs">Labs</Link>
          <Link href="/leaderboard">Leaderboard</Link>
          <Link href={accountHref}>{accountLabel}</Link>
          {!session ? <Link href="/register">Join Operation</Link> : null}
        </nav>
      </details>
    </header>
  );
}
