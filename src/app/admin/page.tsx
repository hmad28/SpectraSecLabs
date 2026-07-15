import Link from "next/link";
import { headers } from "next/headers";
import { auth } from "@/lib/auth";
import { redirect } from "next/navigation";

export default async function AdminPage() {
  const session = await auth.api.getSession({
    headers: await headers(),
  });

  if (!session || session.user.role !== "admin") redirect("/dashboard");

  return (
    <div className="min-h-screen flex">
      <aside className="w-64 border-r border-line p-6 space-y-1">
        <Link
          href="/"
          className="font-display font-bold text-lg block mb-8"
        >
          SPECTRASEC<span className="text-violet-bright">.ADMIN</span>
        </Link>
        <Link
          href="/admin"
          className="block px-4 py-2 rounded-lg bg-panel-2 text-sm font-medium"
        >
          Overview
        </Link>
        <Link
          href="/admin/challenges"
          className="block px-4 py-2 rounded-lg text-sm text-muted hover:text-foreground transition-colors"
        >
          Challenges
        </Link>
        <Link
          href="/admin/users"
          className="block px-4 py-2 rounded-lg text-sm text-muted hover:text-foreground transition-colors"
        >
          Users
        </Link>
        <Link
          href="/admin/submissions"
          className="block px-4 py-2 rounded-lg text-sm text-muted hover:text-foreground transition-colors"
        >
          Submissions
        </Link>
      </aside>

      <main className="flex-1 p-8">
        <h1 className="text-2xl font-bold font-display mb-8">
          Admin Overview
        </h1>

        <div className="grid grid-cols-4 gap-4">
          <div className="bg-panel border border-line rounded-xl p-6">
            <p className="text-2xl font-bold font-display">0</p>
            <p className="text-muted text-sm mt-1">Total Users</p>
          </div>
          <div className="bg-panel border border-line rounded-xl p-6">
            <p className="text-2xl font-bold font-display">0</p>
            <p className="text-muted text-sm mt-1">Challenges</p>
          </div>
          <div className="bg-panel border border-line rounded-xl p-6">
            <p className="text-2xl font-bold font-display">0</p>
            <p className="text-muted text-sm mt-1">Submissions</p>
          </div>
          <div className="bg-panel border border-line rounded-xl p-6">
            <p className="text-2xl font-bold font-display">0</p>
            <p className="text-muted text-sm mt-1">Solved</p>
          </div>
        </div>
      </main>
    </div>
  );
}
