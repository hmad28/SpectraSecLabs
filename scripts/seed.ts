import { config } from "dotenv";
config({ path: ".env.local" });
import { neon } from "@neondatabase/serverless";
import { drizzle } from "drizzle-orm/neon-http";
import { eq } from "drizzle-orm";
import { nanoid } from "nanoid";
import { hashPassword } from "better-auth/crypto";
import bcrypt from "bcryptjs";
import * as schema from "../src/lib/db/schema";
import { challengeBlueprints, challengeSlug } from "../src/lib/challenge-blueprints";
import { basePointsForDifficulty } from "../src/lib/scoring";

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
  let username = email.split("@")[0] || "admin";

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
    const usernameOwner = await db.select({ id: schema.users.id }).from(schema.users)
      .where(eq(schema.users.username, username)).limit(1);
    if (usernameOwner.length) {
      username = `${username}-spectrasec`;
      const fallbackOwner = await db.select({ id: schema.users.id }).from(schema.users)
        .where(eq(schema.users.username, username)).limit(1);
      if (fallbackOwner.length) username = `${username}-${nanoid(4)}`;
    }

    await db.insert(schema.users).values({
      id: userId,
      name: "Super Admin",
      username,
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

  for (const challenge of challengeBlueprints) {
    const slug = challengeSlug(challenge.title, challenge.category);
    const existingChallenge = await db
      .select({ id: schema.challenges.id })
      .from(schema.challenges)
      .where(eq(schema.challenges.slug, slug))
      .limit(1);

    if (existingChallenge.length) {
      await db.update(schema.challenges).set({
        title: challenge.title,
        description: challenge.description,
        category: challenge.category,
        difficulty: challenge.difficulty,
        points: basePointsForDifficulty(challenge.difficulty),
        flagHash: await bcrypt.hash(challenge.flag, 12),
        flagHint: challenge.flagHint,
        authorId: userId,
        isPublished: true,
        updatedAt: now,
      }).where(eq(schema.challenges.id, existingChallenge[0].id));
      await db.delete(schema.challengeFiles).where(eq(schema.challengeFiles.challengeId, existingChallenge[0].id));
      await db.insert(schema.challengeFiles).values(challenge.resources.map((resource) => ({
        id: nanoid(),
        challengeId: existingChallenge[0].id,
        name: resource.name,
        storageKey: `seed:${slug}:${resource.kind}`,
        url: resource.path,
        size: resource.size,
      })));
      continue;
    }

    const challengeId = nanoid();
    await db.insert(schema.challenges).values({
      id: challengeId,
      title: challenge.title,
      slug,
      description: challenge.description,
      category: challenge.category,
      difficulty: challenge.difficulty,
      points: basePointsForDifficulty(challenge.difficulty),
      flagHash: await bcrypt.hash(challenge.flag, 12),
      flagHint: challenge.flagHint,
      authorId: userId,
      isPublished: true,
      solvedCount: 0,
      createdAt: now,
      updatedAt: now,
    });
    await db.insert(schema.challengeFiles).values(challenge.resources.map((resource) => ({
      id: nanoid(),
      challengeId,
      name: resource.name,
      storageKey: `seed:${slug}:${resource.kind}`,
      url: resource.path,
      size: resource.size,
    })));
  }

  console.log(`Super admin ${email} is ready.`);
}

seed()
  .catch((e) => {
    console.error("Seed failed:", e);
    process.exit(1);
  });

