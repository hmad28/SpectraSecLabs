import { config } from "dotenv";
import { neon } from "@neondatabase/serverless";
import { defaultAvatars } from "../src/lib/avatars";

config({ path: ".env.local" });

const defaultAvatarSet = new Set<string>(defaultAvatars);

function shouldBackfill(value: string | null) {
  return !value
    || value.startsWith("/images/avatars/")
    || value.includes("googleusercontent.com")
    || value.includes("ggpht.com")
    || defaultAvatarSet.has(value);
}

async function main() {
  if (!process.env.DATABASE_URL) throw new Error("DATABASE_URL is required");
  const sql = neon(process.env.DATABASE_URL);
  const users = await sql`
    SELECT id, image, avatar_url
    FROM users
    ORDER BY created_at ASC, id ASC
  ` as Array<{ id: string; image: string | null; avatar_url: string | null }>;

  let updated = 0;
  for (const [index, user] of users.entries()) {
    if (!shouldBackfill(user.image) && !shouldBackfill(user.avatar_url)) continue;
    const avatar = defaultAvatars[index % defaultAvatars.length];
    const image = shouldBackfill(user.image) ? avatar : user.image;
    const avatarUrl = shouldBackfill(user.avatar_url) ? avatar : user.avatar_url;
    await sql`
      UPDATE users
      SET image = ${image}, avatar_url = ${avatarUrl}, updated_at = now()
      WHERE id = ${user.id}
    `;
    updated += 1;
  }
  console.log(`Backfilled sequential default avatars for ${updated} users.`);
}

main().catch((error) => { console.error(error); process.exit(1); });

