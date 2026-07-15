import { headers } from "next/headers";
import { redirect } from "next/navigation";
import { AppSidebar } from "@/components/app-sidebar";
import { auth } from "@/lib/auth";
import ChallengeForm from "../challenge-form";

export default async function NewChallengePage() {
  const session = await auth.api.getSession({ headers: await headers() }); if (!session || session.user.role !== "admin") redirect("/dashboard");
  return <div className="dashboard-layout"><AppSidebar admin active="/admin/challenges" /><main className="dashboard-main"><div className="page-header"><p className="eyebrow">CONTENT OPS</p><h1>New challenge.</h1><p>Buat challenge, unggah artefak, lalu publish ketika seluruh scope siap.</p></div><ChallengeForm /></main></div>;
}
