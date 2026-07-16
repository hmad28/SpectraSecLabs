import { boolean, index, integer, pgEnum, pgTable, text, timestamp, uniqueIndex } from "drizzle-orm/pg-core";

export const categoryEnum = pgEnum("category", [
  "web",
  "crypto",
  "forensic",
  "osint",
  "reversing",
  "pwn",
  "stego",
  "misc",
]);

export const difficultyEnum = pgEnum("difficulty", [
  "easy",
  "medium",
  "hard",
  "insane",
]);

export const roleEnum = pgEnum("role", ["user", "admin"]);

export const users = pgTable("users", {
  id: text("id").primaryKey(),
  name: text("name").default("").notNull(),
  username: text("username").unique(),
  email: text("email").unique().notNull(),
  emailVerified: boolean("email_verified").default(false).notNull(),
  image: text("image"),
  displayName: text("display_name").default(""),
  passwordHash: text("password_hash"),
  role: roleEnum("role").default("user").notNull(),
  avatarUrl: text("avatar_url"),
  totalPoints: integer("total_points").default(0).notNull(),
  createdAt: timestamp("created_at").defaultNow().notNull(),
  updatedAt: timestamp("updated_at").defaultNow().notNull(),
});

export const sessions = pgTable("sessions", {
  id: text("id").primaryKey(),
  userId: text("user_id").notNull().references(() => users.id, { onDelete: "cascade" }),
  token: text("token").notNull().unique(),
  expiresAt: timestamp("expires_at").notNull(),
  ipAddress: text("ip_address"),
  userAgent: text("user_agent"),
  createdAt: timestamp("created_at").defaultNow().notNull(),
  updatedAt: timestamp("updated_at").defaultNow().notNull(),
}, (table) => [index("sessions_user_id_idx").on(table.userId)]);

export const accounts = pgTable("accounts", {
  id: text("id").primaryKey(),
  userId: text("user_id").notNull().references(() => users.id, { onDelete: "cascade" }),
  accountId: text("account_id").notNull(),
  providerId: text("provider_id").notNull(),
  accessToken: text("access_token"),
  refreshToken: text("refresh_token"),
  accessTokenExpiresAt: timestamp("access_token_expires_at"),
  refreshTokenExpiresAt: timestamp("refresh_token_expires_at"),
  scope: text("scope"),
  idToken: text("id_token"),
  password: text("password"),
  createdAt: timestamp("created_at").defaultNow().notNull(),
  updatedAt: timestamp("updated_at").defaultNow().notNull(),
}, (table) => [
  index("accounts_user_id_idx").on(table.userId),
  uniqueIndex("accounts_provider_account_idx").on(table.providerId, table.accountId),
]);

export const verifications = pgTable("verifications", {
  id: text("id").primaryKey(),
  identifier: text("identifier").notNull(),
  value: text("value").notNull(),
  expiresAt: timestamp("expires_at").notNull(),
  createdAt: timestamp("created_at").defaultNow().notNull(),
  updatedAt: timestamp("updated_at").defaultNow().notNull(),
}, (table) => [index("verifications_identifier_idx").on(table.identifier)]);

export const challenges = pgTable("challenges", {
  id: text("id").primaryKey(),
  title: text("title").notNull(),
  slug: text("slug").unique().notNull(),
  description: text("description").notNull(),
  category: categoryEnum("category").notNull(),
  difficulty: difficultyEnum("difficulty").notNull(),
  points: integer("points").notNull(),
  flagHash: text("flag_hash").notNull(),
  flagHint: text("flag_hint"),
  authorId: text("author_id")
    .references(() => users.id)
    .notNull(),
  isPublished: boolean("is_published").default(false).notNull(),
  solvedCount: integer("solved_count").default(0).notNull(),
  createdAt: timestamp("created_at").defaultNow().notNull(),
  updatedAt: timestamp("updated_at").defaultNow().notNull(),
});

export const challengeFiles = pgTable("challenge_files", {
  id: text("id").primaryKey(),
  challengeId: text("challenge_id")
    .references(() => challenges.id, { onDelete: "cascade" })
    .notNull(),
  name: text("name").notNull(),
  storageKey: text("storage_key"),
  url: text("url").notNull(),
  size: integer("size").notNull(),
  createdAt: timestamp("created_at").defaultNow().notNull(),
});

export const submissions = pgTable("submissions", {
  id: text("id").primaryKey(),
  userId: text("user_id")
    .references(() => users.id, { onDelete: "cascade" })
    .notNull(),
  challengeId: text("challenge_id")
    .references(() => challenges.id, { onDelete: "cascade" })
    .notNull(),
  submissionFingerprint: text("flag_submitted").notNull(),
  isCorrect: boolean("is_correct").notNull(),
  createdAt: timestamp("created_at").defaultNow().notNull(),
}, (table) => [
  index("submissions_user_created_idx").on(table.userId, table.createdAt),
  index("submissions_challenge_idx").on(table.challengeId),
]);

export const solves = pgTable("solves", {
  id: text("id").primaryKey(),
  userId: text("user_id").references(() => users.id, { onDelete: "cascade" }).notNull(),
  challengeId: text("challenge_id").references(() => challenges.id, { onDelete: "cascade" }).notNull(),
  pointsAwarded: integer("points_awarded").notNull(),
  isPioneer: boolean("is_pioneer").default(false).notNull(),
  createdAt: timestamp("created_at").defaultNow().notNull(),
}, (table) => [
  uniqueIndex("solves_user_challenge_idx").on(table.userId, table.challengeId),
  index("solves_created_idx").on(table.createdAt),
]);

