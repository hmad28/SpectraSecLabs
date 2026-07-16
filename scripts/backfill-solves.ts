import { config } from "dotenv";
import { neon } from "@neondatabase/serverless";

config({ path: ".env.local" });

async function main() {
  if (!process.env.DATABASE_URL) throw new Error("DATABASE_URL is required");
  const sql = neon(process.env.DATABASE_URL);

  await sql`
    UPDATE challenges
    SET points = CASE difficulty
      WHEN 'easy' THEN 50
      WHEN 'medium' THEN 150
      WHEN 'hard' THEN 300
      WHEN 'insane' THEN 500
      ELSE points
    END,
    updated_at = now()
  `;
  await sql`
    INSERT INTO solves (id, user_id, challenge_id, points_awarded, is_pioneer, created_at)
    SELECT DISTINCT ON (s.user_id, s.challenge_id)
      'legacy-' || md5(s.user_id || ':' || s.challenge_id),
      s.user_id,
      s.challenge_id,
      c.points,
      false,
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
    UPDATE solves
    SET is_pioneer = false
  `;

  await sql`
    WITH first_solves AS (
      SELECT DISTINCT ON (challenge_id) id
      FROM solves
      ORDER BY challenge_id, created_at ASC
    )
    UPDATE solves
    SET is_pioneer = true
    WHERE id IN (SELECT id FROM first_solves)
  `;

  await sql`
    UPDATE solves s
    SET points_awarded = c.points + CASE WHEN s.is_pioneer THEN 30 ELSE 0 END
    FROM challenges c
    WHERE s.challenge_id = c.id
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



