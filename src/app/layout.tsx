import type { Metadata } from "next";
import { JetBrains_Mono, Manrope, Sora } from "next/font/google";
import "./globals.css";

const display = Sora({
  subsets: ["latin"],
  weight: ["600", "700", "800"],
  variable: "--font-display",
  display: "swap",
});

const body = Manrope({
  subsets: ["latin"],
  weight: ["400", "500", "600", "700", "800"],
  variable: "--font-body",
  display: "swap",
});

const mono = JetBrains_Mono({
  subsets: ["latin"],
  weight: ["500", "700", "800"],
  variable: "--font-mono",
  display: "swap",
});

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
      <body className={`${display.variable} ${body.variable} ${mono.variable}`}>{children}</body>
    </html>
  );
}
