import Link from "next/link";
import { headers } from "next/headers";
import { notFound, redirect } from "next/navigation";
import { auth } from "@/lib/auth";
import { db } from "@/lib/db";
import { challenges, challengeFiles } from "@/lib/db/schema";
import { eq } from "drizzle-orm";
import FlagSubmit from "./flag-submit";

export default async function ChallengePage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const session = await auth.api
    .getSession({ headers: await headers() })
    .catch(() => null);

  if (!session) {
    redirect(`/login?redirect=/labs/${slug}`);
  }

  const challenge = await db
    .select()
    .from(challenges)
    .where(eq(challenges.slug, slug))
    .limit(1);

  if (challenge.length === 0) notFound();
  const c = challenge[0];

  const files = await db
    .select()
    .from(challengeFiles)
    .where(eq(challengeFiles.challengeId, c.id));

  const categoryColors: Record<string, string> = {
    web: "badge-cyan",
    crypto: "badge-violet",
    forensic: "badge-yellow",
    osint: "badge-green",
    reversing: "badge-red",
    pwn: "badge-red",
    misc: "badge-violet",
  };

  return (
    <div>
      <nav className="navbar">
        <Link href="/" className="navbar-brand">
          SPECTRASEC<span className="text-violet-bright">.LABS</span>
        </Link>
        <div className="navbar-links">
          <Link href="/labs" className="navbar-link" style={{ color: "var(--paper)" }}>
            ← Labs
          </Link>
        </div>
      </nav>

      <main className="container" style={{ paddingBlock: "32px 80px" }}>
        <div style={{ display: "grid", gridTemplateColumns: "1fr 360px", gap: 32, alignItems: "start" }}>
          {/* Challenge Detail */}
          <div>
            <div style={{ display: "flex", gap: 8, marginBottom: 16, flexWrap: "wrap" }}>
              <span className={`badge ${categoryColors[c.category] || "badge-violet"}`}>
                {c.category.toUpperCase()}
              </span>
              <span
                className={`badge ${
                  c.difficulty === "easy"
                    ? "badge-green"
                    : c.difficulty === "medium"
                    ? "badge-yellow"
                    : c.difficulty === "hard"
                    ? "badge-red"
                    : "badge-violet"
                }`}
              >
                {c.difficulty}
              </span>
              <span className="badge badge-violet">{c.points} pts</span>
            </div>

            <h1
              style={{
                fontFamily: "var(--font-display)",
                fontSize: 32,
                fontWeight: 800,
                margin: "0 0 24px",
                lineHeight: 1.1,
              }}
            >
              {c.title}
            </h1>

            <div
              style={{
                color: "var(--muted)",
                lineHeight: 1.8,
                fontSize: 15,
                whiteSpace: "pre-wrap",
              }}
            >
              {c.description}
            </div>

            {c.flagHint && (
              <div
                style={{
                  marginTop: 24,
                  padding: 16,
                  border: "1px solid rgba(234,179,8,.25)",
                  borderRadius: 8,
                  background: "rgba(234,179,8,.06)",
                  fontSize: 13,
                  color: "var(--yellow)",
                }}
              >
                <strong>Format Flag:</strong> {c.flagHint}
              </div>
            )}

            {files.length > 0 && (
              <div style={{ marginTop: 24 }}>
                <h3 style={{ fontFamily: "var(--font-display)", fontSize: 16, fontWeight: 700, margin: "0 0 12px" }}>
                  Files
                </h3>
                <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
                  {files.map((f) => (
                    <a
                      key={f.id}
                      href={f.url}
                      target="_blank"
                      rel="noreferrer"
                      className="card category-card"
                      style={{
                        padding: "12px 16px",
                        display: "flex",
                        justifyContent: "space-between",
                        alignItems: "center",
                        textDecoration: "none",
                      }}
                    >
                      <span style={{ fontSize: 14, fontWeight: 600 }}>{f.name}</span>
                      <span style={{ fontSize: 12, color: "var(--muted)" }}>
                        {(f.size / 1024).toFixed(0)} KB
                      </span>
                    </a>
                  ))}
                </div>
              </div>
            )}
          </div>

          {/* Flag Submission Sidebar */}
          <FlagSubmit
            challengeId={c.id}
            slug={slug}
            solvedCount={c.solvedCount}
          />
        </div>
      </main>
    </div>
  );
}
