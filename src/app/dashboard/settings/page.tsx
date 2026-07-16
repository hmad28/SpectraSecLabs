import { headers } from "next/headers";
import { redirect } from "next/navigation";
import { eq } from "drizzle-orm";
import { AppSidebar } from "@/components/app-sidebar";
import { SettingsForm } from "@/components/settings-form";
import { auth } from "@/lib/auth";
import { db } from "@/lib/db";
import { accounts, users } from "@/lib/db/schema";
import { anonymousHandle, shortEmailFingerprint } from "@/lib/privacy";

export default async function DashboardSettingsPage() {
  const session = await auth.api.getSession({ headers: await headers() });
  if (!session) redirect("/login");
  const [[credentialAccount], [user]] = await Promise.all([
    db.select({ password: accounts.password }).from(accounts).where(eq(accounts.userId, session.user.id)).limit(1),
    db.select({ username: users.username, displayName: users.displayName, image: users.image, email: users.email }).from(users).where(eq(users.id, session.user.id)).limit(1),
  ]);
  const email = user?.email ?? session.user.email;
  const initialUsername = user?.username || user?.displayName || anonymousHandle(email);
  return <div className="dashboard-layout"><AppSidebar active="/dashboard/settings" /><main className="dashboard-main"><div className="page-header"><p className="eyebrow">PLAYER IDENTITY</p><h1>Settings.</h1><p>Kelola handle publik, password, dan status verifikasi tanpa menampilkan email mentah.</p></div><SettingsForm initialUsername={initialUsername} initialImage={user?.image ?? session.user.image} emailHash={shortEmailFingerprint(email)} emailVerified={session.user.emailVerified} hasPassword={!!credentialAccount?.password} /></main></div>;
}

