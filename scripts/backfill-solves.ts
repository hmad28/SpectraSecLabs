import { config } from "dotenv";
import { neon } from "@neondatabase/serverless";

config({ path: ".env.local" });

async function main() {
  if (!process.env.DATABASE_URL) throw new Error("DATABASE_URL is required");
  const sql = neon(process.env.DATABASE_URL);

  await sql`
    INSERT INTO solves (id, user_id, challenge_id, points_awarded, created_at)
    SELECT DISTINCT ON (s.user_id, s.challenge_id)
      'legacy-' || md5(s.user_id || ':' || s.challenge_id),
      s.user_id,
      s.challenge_id,
      c.points,
      s.created_at
    FROM submissions s
    JOIN challenges c ON c.id = s.challenge_id
    WHERE s.is_correct = true
    ORDER BY s.user_id, s.challenge_id, s.created_at ASC
    ON CONFLICT (user_id, challenge_id) DO NOTHING
  `;

  await sql`
    UPDATE users
    SET name = COALESCE(NULLIF(display_name, ''), split_part(email, '@', 1)),
        updated_at = now()
    WHERE name = ''
  `;

  await sql`
    UPDATE submissions
    SET flag_submitted = 'legacy:' || md5(flag_submitted)
    WHERE flag_submitted NOT LIKE 'legacy:%' AND length(flag_submitted) <> 64
  `;

  await sql`
    UPDATE users u
    SET total_points = COALESCE((SELECT SUM(points_awarded)::int FROM solves s WHERE s.user_id = u.id), 0),
        updated_at = now()
  `;

  await sql`
    UPDATE challenges c
    SET solved_count = COALESCE((SELECT COUNT(*)::int FROM solves s WHERE s.challenge_id = c.id), 0),
        updated_at = now()
  `;

  console.log("Solve history backfilled and legacy flags scrubbed.");
}

main().catch((error) => { console.error(error); process.exit(1); });
