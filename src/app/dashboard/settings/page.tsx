import Link from "next/link";
import { headers } from "next/headers";
import { auth } from "@/lib/auth";
import { redirect } from "next/navigation";

export default async function DashboardSettingsPage() {
  const session = await auth.api.getSession({
    headers: await headers(),
  });

  if (!session) redirect("/login");

  return (
    <div className="min-h-screen flex">
      <aside className="w-64 border-r border-line p-6 space-y-1">
        <Link
          href="/"
          className="font-display font-bold text-lg block mb-8"
        >
          SPECTRASEC<span className="text-violet-bright">.LABS</span>
        </Link>
        <Link
          href="/dashboard"
          className="block px-4 py-2 rounded-lg text-sm text-muted hover:text-foreground transition-colors"
        >
          Dashboard
        </Link>
        <Link
          href="/dashboard/settings"
          className="block px-4 py-2 rounded-lg bg-panel-2 text-sm font-medium"
        >
          Settings
        </Link>
      </aside>

      <main className="flex-1 p-8">
        <h1 className="text-2xl font-bold font-display mb-8">Settings</h1>

        <div className="max-w-md space-y-6">
          <div>
            <label className="block text-sm font-medium mb-1">
              Display Name
            </label>
            <input
              type="text"
              defaultValue={session.user.displayName || ""}
              className="w-full px-4 py-2.5 rounded-lg bg-panel border border-line text-foreground focus:outline-none focus:border-violet transition-colors"
            />
          </div>

          <div>
            <label className="block text-sm font-medium mb-1">Email</label>
            <input
              type="email"
              defaultValue={session.user.email}
              disabled
              className="w-full px-4 py-2.5 rounded-lg bg-panel border border-line text-muted cursor-not-allowed"
            />
          </div>

          <button className="px-6 py-2.5 rounded-lg bg-violet text-white font-semibold hover:bg-violet-bright transition-colors">
            Simpan
          </button>
        </div>
      </main>
    </div>
  );
}
