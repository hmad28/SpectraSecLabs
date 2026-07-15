import Image from "next/image";
import Link from "next/link";

const userLinks = [
  ["/dashboard", "Overview"],
  ["/dashboard/settings", "Settings"],
  ["/labs", "Labs"],
  ["/leaderboard", "Leaderboard"],
] as const;
const adminLinks = [
  ["/admin", "Overview"],
  ["/admin/challenges", "Challenges"],
  ["/admin/users", "Users"],
  ["/admin/submissions", "Submissions"],
] as const;

export function AppSidebar({ active, admin = false }: { active: string; admin?: boolean }) {
  const links = admin ? adminLinks : userLinks;
  return (
    <aside className="sidebar">
      <Link href="/" className="sidebar-brand">
        <Image src="/images/spectrasec-logo.jpg" width={38} height={38} alt="" />
        <span>SPECTRASEC<em>.{admin ? "ADMIN" : "LABS"}</em></span>
      </Link>
      <p className="sidebar-label">{admin ? "CONTROL ROOM" : "PLAYER CONSOLE"}</p>
      <nav>
        {links.map(([href, label], index) => (
          <Link key={href} href={href} className={`sidebar-link ${active === href ? "active" : ""}`}>
            <span>0{index + 1}</span>{label}
          </Link>
        ))}
      </nav>
      {admin ? <Link href="/dashboard" className="sidebar-exit">Kembali ke dashboard →</Link> : null}
    </aside>
  );
}
