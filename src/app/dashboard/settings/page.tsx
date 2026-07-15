import { headers } from "next/headers";
import { redirect } from "next/navigation";
import { AppSidebar } from "@/components/app-sidebar";
import { SettingsForm } from "@/components/settings-form";
import { auth } from "@/lib/auth";

export default async function DashboardSettingsPage() {
  const session = await auth.api.getSession({ headers: await headers() });
  if (!session) redirect("/login");
  return <div className="dashboard-layout"><AppSidebar active="/dashboard/settings" /><main className="dashboard-main"><div className="page-header"><p className="eyebrow">PLAYER IDENTITY</p><h1>Settings.</h1><p>Perbarui identitas yang tampil di dashboard dan leaderboard.</p></div><SettingsForm initialName={session.user.name} initialImage={session.user.image} /></main></div>;
}
