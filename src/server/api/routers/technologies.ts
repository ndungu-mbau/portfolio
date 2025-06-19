import { TRPCError } from '@trpc/server'
import { eq } from 'drizzle-orm'
import { z } from 'zod'

import {
  createTRPCRouter,
  protectedProcedure,
  publicProcedure,
} from '~/server/api/trpc'
import { db } from '~/server/db'
import { technologies } from '~/server/db/schema'

export const technologiesRouter = createTRPCRouter({
  createTechnology: protectedProcedure
    .input(
      z.object({
        name: z.string(),
        category: z.enum([
          'Frontend',
          'Backend',
          'Database',
          'Cloud',
          'DevOps',
        ]),
        url: z.string(),
        github: z.string(),
        image: z.string(),
      })
    )
    .mutation(async ({ input }) => {
      try {
        const technology = await db.insert(technologies).values(input)
        return technology
      } catch (e) {
        console.error(e)
        throw new TRPCError({
          code: 'INTERNAL_SERVER_ERROR',
          message: 'Technology not created',
        })
      }
    }),

  updateTechnology: protectedProcedure
    .input(
      z.object({
        id: z.string().uuid(),
        name: z.string(),
        category: z.enum([
          'Frontend',
          'Backend',
          'Database',
          'Cloud',
          'DevOps',
        ]),
        url: z.string(),
        github: z.string(),
        image: z.string(),
      })
    )
    .mutation(async ({ input }) => {
      try {
        const technology = await db
          .update(technologies)
          .set(input)
          .where(eq(technologies.id, input.id))
        return technology
      } catch (e) {
        console.error(e)
        throw new TRPCError({
          code: 'INTERNAL_SERVER_ERROR',
          message: 'Technology not updated',
        })
      }
    }),

  deleteTechnology: protectedProcedure
    .input(
      z.object({
        id: z.string().uuid(),
      })
    )
    .mutation(async ({ input }) => {
      try {
        const technology = await db
          .delete(technologies)
          .where(eq(technologies.id, input.id))
        return technology
      } catch (e) {
        console.error(e)
        throw new TRPCError({
          code: 'INTERNAL_SERVER_ERROR',
          message: 'Technology not deleted',
        })
      }
    }),

  getAllTechnologies: publicProcedure.query(async () => {
    try {
      const technologies = await db.query.technologies.findMany()
      return technologies
    } catch (e) {
      console.error(e)
      throw new TRPCError({
        code: 'INTERNAL_SERVER_ERROR',
        message: 'Technologies not found',
      })
    }
  }),

  getTechnologiesByCategory: publicProcedure
    .input(
      z.object({
        category: z.enum([
          'Frontend',
          'Backend',
          'Database',
          'Cloud',
          'DevOps',
        ]),
      })
    )
    .query(async ({ input }) => {
      try {
        const technologiesByCategory = await db.query.technologies.findMany({
          where: (tbl, { eq }) => eq(tbl.category, input.category),
        })
        return technologiesByCategory
      } catch (e) {
        console.error(e)
        throw new TRPCError({
          code: 'INTERNAL_SERVER_ERROR',
          message: 'Technologies not found',
        })
      }
    }),

  getTechnologyById: publicProcedure
    .input(
      z.object({
        id: z.string().uuid(),
      })
    )
    .query(async ({ input }) => {
      try {
        const technologyById = await db.query.technologies.findFirst({
          where: (tbl, { eq }) => eq(tbl.id, input.id),
        })
        return technologyById
      } catch (e) {
        console.error(e)
        throw new TRPCError({
          code: 'INTERNAL_SERVER_ERROR',
          message: 'Technology not found',
        })
      }
    }),

  getTechnologiesBySearch: publicProcedure
    .input(
      z.object({
        search: z.string(),
      })
    )
    .query(async ({ input }) => {
      try {
        const technologiesBySearch = await db.query.technologies.findMany({
          where: (tbl, { eq }) => eq(tbl.name, input.search),
        })
        return technologiesBySearch
      } catch (e) {
        console.error(e)
        throw new TRPCError({
          code: 'INTERNAL_SERVER_ERROR',
          message: 'Technologies not found',
        })
      }
    }),
})
