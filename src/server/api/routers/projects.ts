import { TRPCError } from '@trpc/server'
import { eq } from 'drizzle-orm'
import { z } from 'zod'

import {
  createTRPCRouter,
  protectedProcedure,
  publicProcedure,
} from '~/server/api/trpc'
import { db } from '~/server/db'
import { projects, projectTechnologies } from '~/server/db/schema'

export const projectsRouter = createTRPCRouter({
  getAllProjects: publicProcedure.query(async () => {
    try {
      const projects = await db.query.projects.findMany({
        with: {
          image: true,
          gallery: true,
          projectTechnologies: {
            with: {
              technology: true,
            },
          },
        },
      })
      return projects
    } catch (e) {
      console.error(e)
      throw new TRPCError({
        code: 'INTERNAL_SERVER_ERROR',
        message: 'Projects not found',
      })
    }
  }),

  getProjectById: publicProcedure
    .input(
      z.object({
        id: z.string().uuid(),
      })
    )
    .query(async ({ input }) => {
      try {
        const projectById = await db.query.projects.findFirst({
          where: (tbl, { eq }) => eq(tbl.id, input.id),
          with: {
            image: true,
            gallery: true,
            projectTechnologies: {
              with: {
                technology: true,
              },
            },
          },
        })
        return projectById
      } catch (e) {
        console.error(e)
        throw new TRPCError({
          code: 'INTERNAL_SERVER_ERROR',
          message: 'Project not found',
        })
      }
    }),

  getProjectsByCategory: publicProcedure
    .input(
      z.object({
        status: z.enum(['Development', 'Beta', 'Live', 'Archived']),
      })
    )
    .query(async ({ input }) => {
      try {
        const projectsByCategory = await db.query.projects.findMany({
          where: (tbl, { eq }) => eq(tbl.status, input.status),
          with: {
            image: true,
            gallery: true,
            projectTechnologies: {
              with: {
                technology: true,
              },
            },
          },
        })
        return projectsByCategory
      } catch (e) {
        console.error(e)
        throw new TRPCError({
          code: 'INTERNAL_SERVER_ERROR',
          message: 'Projects not found',
        })
      }
    }),

  getProjectsBySearch: publicProcedure
    .input(
      z.object({
        search: z.string(),
      })
    )
    .query(async ({ input }) => {
      try {
        const projectsBySearch = await db.query.projects.findMany({
          where: (tbl, { eq }) => eq(tbl.title, input.search),
          with: {
            image: true,
            gallery: true,
            projectTechnologies: {
              with: {
                technology: true,
              },
            },
          },
        })
        return projectsBySearch
      } catch (e) {
        console.error(e)
        throw new TRPCError({
          code: 'INTERNAL_SERVER_ERROR',
          message: 'Projects not found',
        })
      }
    }),

  getProjectsByFeatured: publicProcedure
    .input(z.object({ featured: z.boolean().optional() }))
    .query(async ({ input: { featured = false } }) => {
      try {
        const projectsByFetured = await db.query.projects.findMany({
          where: (tbl, { eq }) => eq(tbl.featured, featured),
          with: {
            image: true,
            gallery: true,
            projectTechnologies: {
              with: {
                technology: true,
              },
            },
          },
        })
        return projectsByFetured
      } catch (e) {
        console.error(e)
        throw new TRPCError({
          code: 'INTERNAL_SERVER_ERROR',
          message: 'Projects not found',
        })
      }
    }),

  createProject: protectedProcedure
    .input(
      z.object({
        title: z.string(),
        description: z.string(),
        longDescription: z.string(),
        image: z.string().uuid(),
        liveUrl: z.string().optional(),
        githubUrl: z.string(),
        status: z.enum(['Development', 'Beta', 'Live', 'Archived']),
        featured: z.boolean().optional().default(false),
        duration: z.string(),
        year: z.string(),
        technologies: z.array(z.string()),
        features: z.array(z.object({ text: z.string() })),
        challenges: z.array(z.object({ text: z.string() })),
        gallery: z.array(z.string()),
      })
    )
    .mutation(async ({ input: { technologies, ...input } }) => {
      try {
        const [project] = await db.insert(projects).values(input).returning()

        if (!project) {
          throw new TRPCError({
            code: 'INTERNAL_SERVER_ERROR',
            message: 'Project not created',
          })
        }

        await db.insert(projectTechnologies).values(
          technologies.map((technology) => ({
            projectId: project.id,
            technologyId: technology,
          }))
        )

        return project
      } catch (e) {
        console.error(e)
        throw new TRPCError({
          code: 'INTERNAL_SERVER_ERROR',
          message: 'Project not created',
        })
      }
    }),

  updateProject: protectedProcedure
    .input(
      z.object({
        id: z.string().uuid(),
        title: z.string().optional(),
        description: z.string().optional(),
        longDescription: z.string().optional(),
        image: z.string().uuid().optional(),
        liveUrl: z.string().optional(),
        githubUrl: z.string().optional(),
        status: z.enum(['Development', 'Beta', 'Live', 'Archived']).optional(),
        featured: z.boolean().optional().default(false),
        duration: z.string().optional(),
        year: z.string().optional(),
        technologies: z.array(z.string().uuid()).optional(),
        features: z.array(z.object({ text: z.string() })).optional(),
        challenges: z.array(z.object({ text: z.string() })).optional(),
        gallery: z.array(z.string().uuid()).optional(),
      })
    )
    .mutation(async ({ input: { technologies, ...input } }) => {
      try {
        const [project] = await db
          .update(projects)
          .set(input)
          .where(eq(projects.id, input.id))
          .returning()

        if (!project) {
          throw new TRPCError({
            code: 'INTERNAL_SERVER_ERROR',
            message: 'Project not updated',
          })
        }

        if (technologies) {
          await db
            .delete(projectTechnologies)
            .where(eq(projectTechnologies.projectId, input.id))
          await db.insert(projectTechnologies).values(
            technologies.map((technology) => ({
              projectId: project.id,
              technologyId: technology,
            }))
          )
        }
        return project
      } catch (e) {
        console.error(e)
        throw new TRPCError({
          code: 'INTERNAL_SERVER_ERROR',
          message: 'Project not updated',
        })
      }
    }),

  deleteProject: protectedProcedure
    .input(
      z.object({
        id: z.string().uuid(),
      })
    )
    .mutation(async ({ input }) => {
      try {
        await db.delete(projects).where(eq(projects.id, input.id))
        await db
          .delete(projectTechnologies)
          .where(eq(projectTechnologies.projectId, input.id))
        return true
      } catch (e) {
        console.error(e)

        throw new TRPCError({
          code: 'INTERNAL_SERVER_ERROR',
          message: 'Project not deleted',
        })
      }
    }),
})
