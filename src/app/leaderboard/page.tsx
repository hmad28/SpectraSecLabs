import Image from "next/image";
import { sql } from "drizzle-orm";
import { PublicHeader } from "@/components/public-header";
import { ScoreboardLive } from "@/components/scoreboard-live";
import { avatarForUser } from "@/lib/avatars";
import { db } from "@/lib/db";
import { playerHandle } from "@/lib/privacy";
import { bestBadge } from "@/lib/scoring";

export const revalidate = 0;

type LeaderboardRow = {
  id: string;
  username: string | null;
  displayName: string | null;
  email: string;
  image: string | null;
  avatarUrl: string | null;
  totalPoints: number;
  updatedAt: Date;
  solves: number;
  pioneers: number;
  easy: number;
  medium: number;
  hard: number;
  insane: number;
  categories: number;
  avatarIndex: number;
};

const platformCapabilities = [
  ["Real-time Scoreboard", "Auto-refresh rank tracking, fixed scoring, and first-blood bonus visibility."],
  ["Team Collaboration", "Squad mode foundation: designed for team ranks and shared progress in the next schema pass."],
  ["Dynamic Challenges", "Ready for external isolated runners; Vercel stays as control plane, not Docker host."],
  ["Multi-Task Challenges", "Challenge model can be extended into staged questions without changing score display."],
  ["Flag Placeholders", "Standard flag wrapper and hints are shown per challenge, with bcrypt-only flag storage."],
  ["Secure Platform", "Role-based admin access, OTP flows, hashed flags, and privacy-first public identity."],
] as const;

function PodiumCard({ row, rank }: { row: LeaderboardRow; rank: number }) {
  const medal = rank === 1 ? "CHAMPION" : rank === 2 ? "RUNNER-UP" : "THIRD PLACE";
  const handle = playerHandle(row);
  const badge = bestBadge({ easy: row.easy, medium: row.medium, hard: row.hard, insane: row.insane, pioneers: row.pioneers, categories: row.categories, categoryTotal: 8 });
  return <article className={`podium-card podium-${rank}`}>
    <span className="podium-rank">#{rank}</span><span className="podium-medal">{medal}</span>
    <Image className="player-avatar podium-avatar" src={avatarForUser(row)} alt="" width={86} height={86} unoptimized />
    <div><h2>{handle}</h2>{badge ? <span className={`badge badge-${badge.tone}`}>{badge.label}</span> : null}</div>
    <strong>{row.totalPoints} pts</strong>
    <p>{row.solves} solves · {row.pioneers} pioneers</p>
  </article>;
}

export default async function LeaderboardPage() {
  const result = await db.execute<LeaderboardRow>(sql`
    SELECT
      u.id,
      u.username,
      u.display_name AS "displayName",
      u.email,
      u.image,
      u.avatar_url AS "avatarUrl",
      u.total_points AS "totalPoints",
      u.updated_at AS "updatedAt",
      ROW_NUMBER() OVER (ORDER BY u.created_at ASC, u.id ASC)::int AS "avatarIndex",
      COUNT(s.id)::int AS solves,
      COUNT(s.id) FILTER (WHERE s.is_pioneer = true)::int AS pioneers,
      COUNT(s.id) FILTER (WHERE c.difficulty = 'easy')::int AS easy,
      COUNT(s.id) FILTER (WHERE c.difficulty = 'medium')::int AS medium,
      COUNT(s.id) FILTER (WHERE c.difficulty = 'hard')::int AS hard,
      COUNT(s.id) FILTER (WHERE c.difficulty = 'insane')::int AS insane,
      COUNT(DISTINCT c.category)::int AS categories
    FROM users u
    LEFT JOIN solves s ON s.user_id = u.id
    LEFT JOIN challenges c ON c.id = s.challenge_id
    WHERE u.role = 'user' AND u.username IS NOT NULL AND u.username <> ''
    GROUP BY u.id, u.username, u.display_name, u.email, u.image, u.avatar_url, u.total_points, u.updated_at, u.created_at
    ORDER BY u.total_points DESC, u.updated_at ASC
    LIMIT 500
  `);
  const rows = result.rows.map((row) => ({ ...row, totalPoints: Number(row.totalPoints), solves: Number(row.solves), pioneers: Number(row.pioneers), easy: Number(row.easy), medium: Number(row.medium), hard: Number(row.hard), insane: Number(row.insane), categories: Number(row.categories), avatarIndex: Number(row.avatarIndex) }));
  const podium = rows.slice(0, 3);
  const tableRows = rows;

  return (
    <>
      <PublicHeader active="leaderboard" />
      <main className="section leaderboard-page">
        <div className="container">
          <div className="section-head reveal leaderboard-head">
            <div><p className="eyebrow">REAL-TIME SCOREBOARD</p><h1>Leaderboard.</h1></div>
            <div className="leaderboard-copy"><ScoreboardLive /><p>Ranking dihitung dari points DESC, tie-break updated_at ASC. Pioneer pertama tiap challenge dapat +30 poin.</p></div>
          </div>

          {podium.length ? <section className="podium-grid reveal reveal-delay">
            {podium[1] ? <PodiumCard row={podium[1]} rank={2} /> : null}
            {podium[0] ? <PodiumCard row={podium[0]} rank={1} /> : null}
            {podium[2] ? <PodiumCard row={podium[2]} rank={3} /> : null}
          </section> : null}

          {tableRows.length ? <div className="table-wrapper leaderboard-table reveal reveal-delay"><table><thead><tr><th>Rank</th><th>Operator</th><th>Best Badge</th><th>Points</th><th>Solves</th><th>Pioneer</th></tr></thead><tbody>
            {tableRows.map((user, index) => {
              const badge = bestBadge({ easy: user.easy, medium: user.medium, hard: user.hard, insane: user.insane, pioneers: user.pioneers, categories: user.categories, categoryTotal: 8 });
              return <tr key={user.id}><td><strong className="rank">#{String(index + 1).padStart(2, "0")}</strong></td><td><span className="player-cell"><Image className="player-avatar" src={avatarForUser(user)} alt="" width={42} height={42} unoptimized /><strong>{playerHandle(user)}</strong></span></td><td>{badge ? <span className={`badge badge-${badge.tone}`}>{badge.label}</span> : <span className="text-muted">-</span>}</td><td><strong className="points">{user.totalPoints}</strong></td><td>{user.solves}</td><td>{user.pioneers ? <span className="badge badge-red">{user.pioneers}x</span> : <span className="text-muted">0</span>}</td></tr>;
            })}
          </tbody></table></div> : <div className="empty-state"><p>Belum ada solve. Jadilah pemain pertama di leaderboard.</p></div>}

          <section className="feature-strip reveal">
            {platformCapabilities.map(([title, copy]) => <article key={title}><span>{title}</span><p>{copy}</p></article>)}
          </section>
        </div>
      </main>
    </>
  );
}








