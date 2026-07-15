import Link from "next/link";
import { cookies } from "next/headers";
import { notFound } from "next/navigation";
import { findChallengeBlueprintBySlug } from "@/lib/challenge-blueprints";

const targetCopy: Record<string, { title: string; hint: string; input: string }> = {
  "proxy-leak": {
    title: "Proxy Leak Debug Gateway",
    hint: "The proxy only hides traces when debug is absent. Try query parameters.",
    input: "?debug=true",
  },
  "cookie-relay": {
    title: "Cookie Relay Operator Panel",
    hint: "The app trusts a plain role cookie. Browser devtools are enough.",
    input: "document.cookie = 'role=admin; path=/'",
  },
  "origin-split": {
    title: "Origin Split Redirector",
    hint: "The allowlist checks whether the next URL starts with the trusted origin.",
    input: "?next=https://spectrasec.xyz.evil/admin",
  },
  "cache-shadow": {
    title: "Cache Shadow Profile",
    hint: "Cache key ignores viewer. Ask for another user with public cache enabled.",
    input: "?user=admin&cache=public",
  },
  "jwt-furnace": {
    title: "JWT Furnace Vault",
    hint: "The parser accepts alg=none and reads role directly from query token fields.",
    input: "?alg=none&role=admin",
  },
};

function resultFor(slug: string, query: Record<string, string | string[] | undefined>, roleCookie: string | undefined, flag: string) {
  if (slug === "proxy-leak" && query.debug === "true") return `debug.trace.internal.flag=${flag}`;
  if (slug === "cookie-relay" && roleCookie === "admin") return `operator.session.flag=${flag}`;
  if (slug === "origin-split" && typeof query.next === "string" && query.next.startsWith("https://spectrasec.xyz") && query.next.includes(".evil/admin")) return `redirect.audit.flag=${flag}`;
  if (slug === "cache-shadow" && query.user === "admin" && query.cache === "public") return `cached.profile.admin.flag=${flag}`;
  if (slug === "jwt-furnace" && query.alg === "none" && query.role === "admin") return `vault.claim.flag=${flag}`;
  return null;
}

export default async function WebTargetPage({
  params,
  searchParams,
}: {
  params: Promise<{ slug: string }>;
  searchParams: Promise<Record<string, string | string[] | undefined>>;
}) {
  const [{ slug }, query, cookieStore] = await Promise.all([params, searchParams, cookies()]);
  const blueprint = findChallengeBlueprintBySlug(slug);
  const copy = targetCopy[slug];
  if (!blueprint || blueprint.category !== "web" || !copy) notFound();

  const output = resultFor(slug, query, cookieStore.get("role")?.value, blueprint.flag);

  return (
    <main className="target-page">
      <section className="target-shell">
        <Link href="/labs" className="back-link">← Back to SpectraSec Labs</Link>
        <p className="eyebrow">VULNERABLE WEB TARGET</p>
        <h1>{copy.title}</h1>
        <p>{copy.hint}</p>
        <div className="target-console">
          <span>expected probe</span>
          <code>{copy.input}</code>
        </div>
        <div className={`target-output ${output ? "open" : ""}`}>
          <span>{output ? "exploit result" : "response"}</span>
          <pre>{output ?? "403: insufficient signal. Adjust your request and try again."}</pre>
        </div>
      </section>
    </main>
  );
}
