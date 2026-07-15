import { config } from "dotenv";
config({ path: ".env.local" });
import { neon } from "@neondatabase/serverless";
import { drizzle } from "drizzle-orm/neon-http";
import { eq } from "drizzle-orm";
import bcrypt from "bcryptjs";
import { nanoid } from "nanoid";
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

  if (existing.length > 0) {
    console.log(`Super admin ${email} already exists, skipping.`);
    return;
  }

  // Create super admin user
  const passwordHash = await bcrypt.hash(password, 10);
  const now = new Date();

  await db.insert(schema.users).values({
    id: nanoid(),
    username: email.split("@")[0],
    email,
    emailVerified: true,
    displayName: "Super Admin",
    passwordHash,
    role: "admin",
    totalPoints: 0,
    createdAt: now,
    updatedAt: now,
  });

  console.log(`Super admin ${email} created successfully!`);
}

seed()
  .catch((e) => {
    console.error("Seed failed:", e);
    process.exit(1);
  });
