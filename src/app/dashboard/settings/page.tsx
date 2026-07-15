import { headers } from "next/headers";
import { redirect } from "next/navigation";
import { eq } from "drizzle-orm";
import { AppSidebar } from "@/components/app-sidebar";
import { SettingsForm } from "@/components/settings-form";
import { auth } from "@/lib/auth";
import { db } from "@/lib/db";
import { accounts } from "@/lib/db/schema";

export default async function DashboardSettingsPage() {
  const session = await auth.api.getSession({ headers: await headers() });
  if (!session) redirect("/login");
  const [credentialAccount] = await db.select({ password: accounts.password }).from(accounts).where(eq(accounts.userId, session.user.id)).limit(1);
  return <div className="dashboard-layout"><AppSidebar active="/dashboard/settings" /><main className="dashboard-main"><div className="page-header"><p className="eyebrow">PLAYER IDENTITY</p><h1>Settings.</h1><p>Perbarui identitas, password, dan status verifikasi email.</p></div><SettingsForm initialName={session.user.name} initialImage={session.user.image} email={session.user.email} emailVerified={session.user.emailVerified} hasPassword={!!credentialAccount?.password} /></main></div>;
}
