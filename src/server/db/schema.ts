import { relations, sql } from "drizzle-orm";
import { index, pgTableCreator, primaryKey } from "drizzle-orm/pg-core";
import type { AdapterAccount } from "next-auth/adapters";

/**
 * This is an example of how to use the multi-project schema feature of Drizzle ORM. Use the same
 * database instance for multiple projects.
 *
 * @see https://orm.drizzle.team/docs/goodies#multi-project-schema
 */
export const createTable = pgTableCreator((name) => `portforlio_${name}`);

export const users = createTable("user", (d) => ({
  id: d.uuid().notNull().primaryKey().defaultRandom(),
  name: d.varchar({ length: 255 }),
  email: d.varchar({ length: 255 }).notNull(),
  emailVerified: d
    .timestamp({
      mode: "date",
      withTimezone: true,
    })
    .default(sql`CURRENT_TIMESTAMP`),
  image: d.varchar({ length: 255 }),
}));

export const usersRelations = relations(users, ({ many }) => ({
  accounts: many(accounts),
}));

export const accounts = createTable(
  "account",
  (d) => ({
    userId: d
      .uuid()
      .notNull()
      .references(() => users.id),
    type: d.varchar({ length: 255 }).$type<AdapterAccount["type"]>().notNull(),
    provider: d.varchar({ length: 255 }).notNull(),
    providerAccountId: d.varchar({ length: 255 }).notNull(),
    refresh_token: d.text(),
    access_token: d.text(),
    expires_at: d.integer(),
    token_type: d.varchar({ length: 255 }),
    scope: d.varchar({ length: 255 }),
    id_token: d.text(),
    session_state: d.varchar({ length: 255 }),
  }),
  (t) => [
    primaryKey({ columns: [t.provider, t.providerAccountId] }),
    index("account_user_id_idx").on(t.userId),
  ],
);

export const accountsRelations = relations(accounts, ({ one }) => ({
  user: one(users, { fields: [accounts.userId], references: [users.id] }),
}));

export const sessions = createTable(
  "session",
  (d) => ({
    sessionToken: d.varchar({ length: 255 }).notNull().primaryKey(),
    userId: d
      .uuid()
      .notNull()
      .references(() => users.id),
    expires: d.timestamp({ mode: "date", withTimezone: true }).notNull(),
  }),
  (t) => [index("t_user_id_idx").on(t.userId)],
);

export const sessionsRelations = relations(sessions, ({ one }) => ({
  user: one(users, { fields: [sessions.userId], references: [users.id] }),
}));

export const verificationTokens = createTable(
  "verification_token",
  (d) => ({
    identifier: d.varchar({ length: 255 }).notNull(),
    token: d.varchar({ length: 255 }).notNull(),
    expires: d.timestamp({ mode: "date", withTimezone: true }).notNull(),
  }),
  (t) => [primaryKey({ columns: [t.identifier, t.token] })],
);

export const projects = createTable("project", (d) => ({
  id: d.uuid().notNull().primaryKey().defaultRandom(),
  name: d.varchar({ length: 255 }).notNull(),
  description: d.text(),
  url: d.varchar({ length: 255 }).notNull(),
  github: d.varchar({ length: 255 }),
  image: d.varchar({ length: 255 }),
  featured: d.boolean().default(false),
  createdAt: d
    .timestamp({
      mode: "date",
      withTimezone: true,
    })
    .default(sql`CURRENT_TIMESTAMP`),
}));

export const technologies = createTable("technology", (d) => ({
  id: d.uuid().notNull().primaryKey().defaultRandom(),
  name: d.varchar({ length: 255 }).notNull(),
  description: d.text(),
  url: d.varchar({ length: 255 }).notNull(),
  github: d.varchar({ length: 255 }),
}));

export const uploads = createTable("upload", (d) => ({
  id: d.uuid().notNull().primaryKey().defaultRandom(),
  name: d.varchar({ length: 255 }).notNull(),
  url: d.varchar({ length: 255 }).notNull(),
  key: d.varchar({ length: 255 }).notNull(),
  size: d.varchar({ length: 255 }).notNull(),
  createdAt: d
    .timestamp({
      mode: "date",
      withTimezone: true,
    })
    .default(sql`CURRENT_TIMESTAMP`),
}));

export const projectTechnologies = createTable(
  "project_technology",
  (d) => ({
    id: d.uuid().notNull().primaryKey().defaultRandom(),
    projectId: d
      .uuid()
      .notNull()
      .references(() => projects.id, { onDelete: "cascade" }),
    technologyId: d
      .uuid()
      .notNull()
      .references(() => technologies.id, { onDelete: "cascade" }),
  }),
  (t) => [index("project_technology_project_id_idx").on(t.projectId)],
);

export const projectsRelations = relations(projects, ({ many }) => ({
  technologies: many(projectTechnologies),
}));

export const technologiesRelations = relations(technologies, ({ many }) => ({
  projects: many(projectTechnologies),
}));

export const projectTechnologiesRelations = relations(
  projectTechnologies,
  ({ one }) => ({
    project: one(projects, {
      fields: [projectTechnologies.projectId],
      references: [projects.id],
    }),
    technology: one(technologies, {
      fields: [projectTechnologies.technologyId],
      references: [technologies.id],
    }),
  }),
);
