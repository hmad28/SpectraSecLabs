import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "SpectraSec Labs | CTF Challenges & Cyber Security Community",
  description:
    "SpectraSec Labs — platform CTF challenges, leaderboard, dan cyber security labs untuk komunitas ethical hacking Indonesia.",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="id" className="h-full antialiased">
      <body className="min-h-full flex flex-col bg-background text-foreground">
        {children}
      </body>
    </html>
  );
}
