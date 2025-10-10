import { relations, sql } from 'drizzle-orm'
import { index, pgEnum, pgTableCreator, primaryKey } from 'drizzle-orm/pg-core'
import type { AdapterAccount } from 'next-auth/adapters'

/**
 * This is an example of how to use the multi-project schema feature of Drizzle ORM. Use the same
 * database instance for multiple projects.
 *
 * @see https://orm.drizzle.team/docs/goodies#multi-project-schema
 */

export const createTable = pgTableCreator((name) => `portfolio_${name}`)

export const projectStatus = pgEnum('project_status', [
  'Development',
  'Beta',
  'Live',
  'Archived',
])

export const technologyCategory = pgEnum('technology_category', [
  'Frontend',
  'Backend',
  'Database',
  'Cloud',
  'DevOps',
])

// Drizzle schema definitions

export const users = createTable('user', (d) => ({
  id: d.uuid().notNull().primaryKey().defaultRandom(),
  name: d.varchar({ length: 255 }),
  email: d.varchar({ length: 255 }).notNull(),
  emailVerified: d
    .timestamp({
      mode: 'date',
      withTimezone: true,
    })
    .default(sql`CURRENT_TIMESTAMP`),
  image: d.varchar({ length: 255 }),
}))

export const accounts = createTable(
  'account',
  (d) => ({
    userId: d
      .uuid()
      .notNull()
      .references(() => users.id),
    type: d.varchar({ length: 255 }).$type<AdapterAccount['type']>().notNull(),
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
    index('account_user_id_idx').on(t.userId),
  ]
)

export const sessions = createTable(
  'session',
  (d) => ({
    sessionToken: d.varchar({ length: 255 }).notNull().primaryKey(),
    userId: d
      .uuid()
      .notNull()
      .references(() => users.id),
    expires: d.timestamp({ mode: 'date', withTimezone: true }).notNull(),
  }),
  (t) => [index('t_user_id_idx').on(t.userId)]
)

export const verificationTokens = createTable(
  'verification_token',
  (d) => ({
    identifier: d.varchar({ length: 255 }).notNull(),
    token: d.varchar({ length: 255 }).notNull(),
    expires: d.timestamp({ mode: 'date', withTimezone: true }).notNull(),
  }),
  (t) => [primaryKey({ columns: [t.identifier, t.token] })]
)

export const uploads = createTable('upload', (d) => ({
  id: d.uuid().notNull().primaryKey().defaultRandom(),
  name: d.text().notNull(),
  url: d.text().notNull(),
  key: d.text().notNull(),
  size: d.text().notNull(),
  createdAt: d
    .timestamp({ mode: 'date', withTimezone: true })
    .default(sql`CURRENT_TIMESTAMP`),
  updatedAt: d
    .timestamp({ mode: 'date', withTimezone: true })
    .$onUpdateFn(() => sql`CURRENT_TIMESTAMP`),
}))

export const technologies = createTable('technology', (d) => ({
  id: d.uuid().notNull().primaryKey().defaultRandom(),
  name: d.text().notNull(),
  category: technologyCategory().notNull(),
  url: d.text(),
  github: d.text(),
  image: d
    .uuid()
    .notNull()
    .references(() => uploads.id),
  createdAt: d
    .timestamp({ mode: 'date', withTimezone: true })
    .default(sql`CURRENT_TIMESTAMP`),
  updatedAt: d
    .timestamp({ mode: 'date', withTimezone: true })
    .$onUpdateFn(() => sql`CURRENT_TIMESTAMP`),
}))

export const projects = createTable('project', (d) => ({
  id: d.uuid().notNull().primaryKey().defaultRandom(),
  title: d.text().notNull(),
  description: d.text().notNull(),
  longDescription: d.text().notNull(),
  image: d
    .uuid()
    .notNull()
    .references(() => uploads.id),
  liveUrl: d.text(),
  githubUrl: d.text().notNull(),
  status: projectStatus().notNull().default('Development'),
  featured: d.boolean().notNull().default(false),
  duration: d.text().notNull(),
  year: d.text().notNull(),
  features: d.jsonb('features').notNull().$type<{ text: string }[]>(),
  challenges: d.jsonb('challenges').notNull().$type<{ text: string }[]>(),
  gallery: d
    .uuid('gallery')
    .notNull()
    .references(() => uploads.id)
    .array(),
  createdAt: d
    .timestamp({ mode: 'date', withTimezone: true })
    .default(sql`CURRENT_TIMESTAMP`),
  updatedAt: d
    .timestamp({ mode: 'date', withTimezone: true })
    .$onUpdateFn(() => sql`CURRENT_TIMESTAMP`),
}))

export const projectTechnologies = createTable(
  'project_technologies',
  (d) => ({
    projectId: d
      .uuid()
      .notNull()
      .references(() => projects.id, { onDelete: 'cascade' }),
    technologyId: d
      .uuid()
      .notNull()
      .references(() => technologies.id, { onDelete: 'cascade' }),
    createdAt: d
      .timestamp({ mode: 'date', withTimezone: true })
      .default(sql`CURRENT_TIMESTAMP`),
    updatedAt: d
      .timestamp({ mode: 'date', withTimezone: true })
      .$onUpdateFn(() => sql`CURRENT_TIMESTAMP`),
  }),
  (t) => [
    primaryKey({ columns: [t.projectId, t.technologyId] }),
    index('project_technologies_project_id_idx').on(t.projectId),
  ]
)

export const messages = createTable('message', (d) => ({
  id: d.uuid().notNull().primaryKey().defaultRandom(),
  name: d.text().notNull(),
  email: d.text().notNull(),
  message: d.text().notNull(),
  createdAt: d
    .timestamp({ mode: 'date', withTimezone: true })
    .default(sql`CURRENT_TIMESTAMP`),
  updatedAt: d
    .timestamp({ mode: 'date', withTimezone: true })
    .$onUpdateFn(() => sql`CURRENT_TIMESTAMP`),
}))

// Relations
export const usersRelations = relations(users, ({ many }) => ({
  accounts: many(accounts),
}))

export const accountsRelations = relations(accounts, ({ one }) => ({
  user: one(users, { fields: [accounts.userId], references: [users.id] }),
}))

export const sessionsRelations = relations(sessions, ({ one }) => ({
  user: one(users, { fields: [sessions.userId], references: [users.id] }),
}))

export const uploadsRelations = relations(uploads, ({ one }) => ({
  project: one(projects, {
    fields: [uploads.id],
    references: [projects.image],
  }),
  technology: one(technologies, {
    fields: [uploads.id],
    references: [technologies.image],
  }),
}))

export const technologiesRelations = relations(
  technologies,
  ({ many, one }) => ({
    projectTechnologies: many(projectTechnologies),
    image: one(uploads, {
      fields: [technologies.image],
      references: [uploads.id],
    }),
  })
)

export const projectsRelations = relations(projects, ({ many, one }) => ({
  projectTechnologies: many(projectTechnologies),
  image: one(uploads, {
    fields: [projects.image],
    references: [uploads.id],
  }),
  gallery: many(uploads),
}))

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
  })
)
