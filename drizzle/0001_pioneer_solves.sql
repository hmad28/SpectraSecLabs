ALTER TABLE "solves" ADD COLUMN IF NOT EXISTS "is_pioneer" boolean DEFAULT false NOT NULL;--> statement-breakpoint
WITH first_solves AS (
  SELECT DISTINCT ON (challenge_id) id
  FROM solves
  ORDER BY challenge_id, created_at ASC
)
UPDATE solves
SET is_pioneer = true
WHERE id IN (SELECT id FROM first_solves);--> statement-breakpoint
UPDATE solves s
SET points_awarded = c.points + 30
FROM challenges c
WHERE s.challenge_id = c.id AND s.is_pioneer = true AND s.points_awarded = c.points;--> statement-breakpoint
UPDATE users u
SET total_points = COALESCE((SELECT SUM(points_awarded)::int FROM solves s WHERE s.user_id = u.id), 0),
    updated_at = now();
