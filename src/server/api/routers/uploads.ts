import { TRPCError } from '@trpc/server'
import { z } from 'zod'

import {
  createTRPCRouter,
  protectedProcedure,
  publicProcedure,
} from '~/server/api/trpc'
import { db } from '~/server/db'
import { uploads } from '~/server/db/schema'

export const uploadsRouter = createTRPCRouter({
  saveFile: protectedProcedure
    .input(
      z.object({
        key: z.string(),
        name: z.string(),
        url: z.string(),
        size: z.string(),
      })
    )
    .mutation(async ({ input }) => {
      try {
        const [file] = await db.insert(uploads).values(input).returning()
        return file
      } catch (e) {
        console.error(e)
        throw new TRPCError({
          code: 'INTERNAL_SERVER_ERROR',
          message: 'File not saved',
        })
      }
    }),

  getFileById: publicProcedure
    .input(
      z.object({
        id: z.string().uuid(),
      })
    )
    .query(async ({ input }) => {
      try {
        const fileById = await db.query.uploads.findFirst({
          where: (tbl, { eq }) => eq(tbl.id, input.id),
        })
        return fileById
      } catch (e) {
        console.error(e)
        throw new TRPCError({
          code: 'INTERNAL_SERVER_ERROR',
          message: 'File not found',
        })
      }
    }),

  getAllFiles: publicProcedure.query(async () => {
    try {
      const files = await db.query.uploads.findMany()
      return files
    } catch (e) {
      console.error(e)
      throw new TRPCError({
        code: 'INTERNAL_SERVER_ERROR',
        message: 'Files not found',
      })
    }
  }),
})
