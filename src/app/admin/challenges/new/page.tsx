import Link from "next/link";
import { headers } from "next/headers";
import { auth } from "@/lib/auth";
import { redirect } from "next/navigation";

export default async function NewChallengePage() {
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
          className="block px-4 py-2 rounded-lg text-sm text-muted hover:text-foreground transition-colors"
        >
          Overview
        </Link>
        <Link
          href="/admin/challenges"
          className="block px-4 py-2 rounded-lg bg-panel-2 text-sm font-medium"
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
          New Challenge
        </h1>

        <div className="max-w-2xl space-y-6">
          <div>
            <label className="block text-sm font-medium mb-1">Title</label>
            <input
              type="text"
              className="w-full px-4 py-2.5 rounded-lg bg-panel border border-line text-foreground focus:outline-none focus:border-violet transition-colors"
              placeholder="Nama challenge"
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium mb-1">
                Category
              </label>
              <select className="w-full px-4 py-2.5 rounded-lg bg-panel border border-line text-foreground focus:outline-none focus:border-violet transition-colors">
                <option>web</option>
                <option>crypto</option>
                <option>forensic</option>
                <option>osint</option>
                <option>reversing</option>
                <option>pwn</option>
                <option>misc</option>
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium mb-1">
                Difficulty
              </label>
              <select className="w-full px-4 py-2.5 rounded-lg bg-panel border border-line text-foreground focus:outline-none focus:border-violet transition-colors">
                <option>easy</option>
                <option>medium</option>
                <option>hard</option>
                <option>insane</option>
              </select>
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium mb-1">Points</label>
            <input
              type="number"
              className="w-full px-4 py-2.5 rounded-lg bg-panel border border-line text-foreground focus:outline-none focus:border-violet transition-colors"
              placeholder="100"
              min={0}
            />
          </div>

          <div>
            <label className="block text-sm font-medium mb-1">
              Description
            </label>
            <textarea
              rows={6}
              className="w-full px-4 py-2.5 rounded-lg bg-panel border border-line text-foreground focus:outline-none focus:border-violet transition-colors resize-y"
              placeholder="Deskripsi challenge dan petunjuk"
            />
          </div>

          <div>
            <label className="block text-sm font-medium mb-1">Flag</label>
            <input
              type="text"
              className="w-full px-4 py-2.5 rounded-lg bg-panel border border-line text-foreground focus:outline-none focus:border-violet transition-colors"
              placeholder="CTF{...}"
            />
            <p className="text-xs text-muted mt-1">
              Flag akan di-hash otomatis saat disimpan.
            </p>
          </div>

          <div>
            <label className="block text-sm font-medium mb-1">
              Challenge Files
            </label>
            <div className="border-2 border-dashed border-line rounded-lg p-8 text-center">
              <p className="text-muted text-sm">
                Drag & drop files atau klik untuk upload
              </p>
              <p className="text-xs text-muted mt-1">
                Max 32MB per file (UploadThing)
              </p>
            </div>
          </div>

          <button className="px-6 py-2.5 rounded-lg bg-violet text-white font-semibold hover:bg-violet-bright transition-colors">
            Create Challenge
          </button>
        </div>
      </main>
    </div>
  );
}
