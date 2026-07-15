import { config } from "dotenv";
config({ path: ".env.local" });
import { neon } from "@neondatabase/serverless";
import { drizzle } from "drizzle-orm/neon-http";
import { eq } from "drizzle-orm";
import { nanoid } from "nanoid";
import { hashPassword } from "better-auth/crypto";
import * as schema from "../src/lib/db/schema";

async function seed() {
  const url = process.env.DATABASE_URL;
  if (!url) {
    console.error("DATABASE_URL is required");
    process.exit(1);
  }

  const sql = neon(url);
  const db = drizzle(sql, { schema });

  const email = process.env.SUPER_ADMIN_EMAIL || "admin@spectrasec.id";
  const password = process.env.SUPER_ADMIN_PASSWORD;

  if (!password) {
    console.error("SUPER_ADMIN_PASSWORD is required");
    process.exit(1);
  }

  // Check if super admin already exists
  const existing = await db
    .select()
    .from(schema.users)
    .where(eq(schema.users.email, email))
    .limit(1);

  const passwordHash = await hashPassword(password);
  const now = new Date();

  const userId = existing[0]?.id ?? nanoid();
  if (existing.length) {
    await db.update(schema.users).set({ name: "Super Admin", displayName: "Super Admin", role: "admin", updatedAt: now }).where(eq(schema.users.id, userId));
  } else {
    await db.insert(schema.users).values({
      id: userId,
      name: "Super Admin",
      username: email.split("@")[0],
      email,
      emailVerified: true,
      displayName: "Super Admin",
      role: "admin",
      totalPoints: 0,
      createdAt: now,
      updatedAt: now,
    });
  }

  const credential = await db.select({ id: schema.accounts.id }).from(schema.accounts)
    .where(eq(schema.accounts.userId, userId)).limit(1);
  if (credential.length) {
    await db.update(schema.accounts).set({ password: passwordHash, updatedAt: now }).where(eq(schema.accounts.id, credential[0].id));
  } else {
    await db.insert(schema.accounts).values({
      id: nanoid(), userId, accountId: userId, providerId: "credential", password: passwordHash, createdAt: now, updatedAt: now,
    });
  }

  console.log(`Super admin ${email} is ready.`);
}

seed()
  .catch((e) => {
    console.error("Seed failed:", e);
    process.exit(1);
  });
