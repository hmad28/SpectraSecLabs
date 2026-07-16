import { config } from "dotenv";
import { neon } from "@neondatabase/serverless";
import { defaultAvatarForSeed } from "../src/lib/avatars";

config({ path: ".env.local" });

function shouldBackfill(value: string | null) {
  return !value || value.startsWith("/images/avatars/");
}

async function main() {
  if (!process.env.DATABASE_URL) throw new Error("DATABASE_URL is required");
  const sql = neon(process.env.DATABASE_URL);
  const users = await sql`
    SELECT id, username, email, image, avatar_url FROM users
  ` as Array<{ id: string; username: string | null; email: string; image: string | null; avatar_url: string | null }>;
  let updated = 0;
  for (const user of users) {
    if (!shouldBackfill(user.image) && !shouldBackfill(user.avatar_url)) continue;
    const avatar = defaultAvatarForSeed(user.id || user.username || user.email);
    await sql`
      UPDATE users
      SET image = CASE WHEN image IS NULL OR image LIKE '/images/avatars/%' THEN ${avatar} ELSE image END,
          avatar_url = CASE WHEN avatar_url IS NULL OR avatar_url LIKE '/images/avatars/%' THEN ${avatar} ELSE avatar_url END,
          updated_at = now()
      WHERE id = ${user.id}
    `;
    updated += 1;
  }
  console.log(`Backfilled default avatars for ${updated} users.`);
}

main().catch((error) => { console.error(error); process.exit(1); });

