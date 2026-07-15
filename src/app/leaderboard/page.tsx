import { desc, gt } from "drizzle-orm";
import { PublicHeader } from "@/components/public-header";
import { db } from "@/lib/db";
import { users } from "@/lib/db/schema";

export default async function LeaderboardPage() {
  const topUsers = await db.select({ id: users.id, name: users.name, displayName: users.displayName, totalPoints: users.totalPoints })
    .from(users).where(gt(users.totalPoints, 0)).orderBy(desc(users.totalPoints)).limit(100);
  return (
    <>
      <PublicHeader active="leaderboard" />
      <main className="section">
        <div className="container">
          <div className="section-head reveal">
            <div><p className="eyebrow">COMMUNITY SIGNAL</p><h1>Leaderboard.</h1></div>
            <p>Peringkat dihitung dari unique solve. Percobaan berulang tidak menambah poin.</p>
          </div>
          {topUsers.length ? <div className="table-wrapper reveal reveal-delay"><table><thead><tr><th>Rank</th><th>Player</th><th>Signal</th><th>Points</th></tr></thead><tbody>
            {topUsers.map((user, index) => <tr key={user.id}><td><strong className="rank">#{String(index + 1).padStart(2, "0")}</strong></td><td>{user.displayName || user.name || "Player"}</td><td><span className="badge badge-cyan">VERIFIED</span></td><td><strong className="points">{user.totalPoints}</strong></td></tr>)}
          </tbody></table></div> : <div className="empty-state"><p>Belum ada solve. Jadilah pemain pertama di leaderboard.</p></div>}
        </div>
      </main>
    </>
  );
}
