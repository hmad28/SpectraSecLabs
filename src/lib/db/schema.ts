import { pgTable, text, integer, boolean, timestamp, pgEnum } from "drizzle-orm/pg-core";

export const categoryEnum = pgEnum("category", [
  "web",
  "crypto",
  "forensic",
  "osint",
  "reversing",
  "pwn",
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
  username: text("username").unique().notNull(),
  email: text("email").unique().notNull(),
  emailVerified: boolean("email_verified").default(false),
  displayName: text("display_name").default(""),
  passwordHash: text("password_hash").notNull(),
  role: roleEnum("role").default("user").notNull(),
  avatarUrl: text("avatar_url"),
  totalPoints: integer("total_points").default(0).notNull(),
  createdAt: timestamp("created_at").defaultNow().notNull(),
  updatedAt: timestamp("updated_at").defaultNow().notNull(),
});

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
  url: text("url").notNull(),
  size: integer("size").notNull(),
  createdAt: timestamp("created_at").defaultNow().notNull(),
});

export const submissions = pgTable("submissions", {
  id: text("id").primaryKey(),
  userId: text("user_id")
    .references(() => users.id)
    .notNull(),
  challengeId: text("challenge_id")
    .references(() => challenges.id)
    .notNull(),
  flagSubmitted: text("flag_submitted").notNull(),
  isCorrect: boolean("is_correct").notNull(),
  createdAt: timestamp("created_at").defaultNow().notNull(),
});
