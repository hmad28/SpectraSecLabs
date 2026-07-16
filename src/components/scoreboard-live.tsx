"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";

export function ScoreboardLive({ intervalMs = 20000 }: { intervalMs?: number }) {
  const router = useRouter();
  const [pulse, setPulse] = useState(0);

  useEffect(() => {
    const timer = window.setInterval(() => {
      setPulse((value) => value + 1);
      router.refresh();
    }, intervalMs);
    return () => window.clearInterval(timer);
  }, [intervalMs, router]);

  return <span className="live-scoreboard"><span className="signal-dot" />LIVE SCOREBOARD · AUTO REFRESH {pulse ? `#${pulse}` : "ON"}</span>;
}
