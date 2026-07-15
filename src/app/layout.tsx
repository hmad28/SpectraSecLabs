import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  metadataBase: new URL("https://labs.spectrasec.xyz"),
  title: "SpectraSec Labs | CTF Challenges & Cyber Security Community",
  description:
    "SpectraSec Labs - platform CTF challenges, leaderboard, dan cyber security labs untuk komunitas ethical hacking Indonesia.",
  alternates: { canonical: "/" },
  openGraph: {
    title: "SpectraSec Labs",
    description: "Belajar cyber security lewat challenge legal dan terarah.",
    url: "https://labs.spectrasec.xyz",
    siteName: "SpectraSec Labs",
    locale: "id_ID",
    type: "website",
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="id">
      <body>{children}</body>
    </html>
  );
}
