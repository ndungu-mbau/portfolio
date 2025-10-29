import { TRPCError } from '@trpc/server'
import { eq } from 'drizzle-orm'
import { z } from 'zod'

import {
  createTRPCRouter,
  protectedProcedure,
  publicProcedure,
} from '~/server/api/trpc'
import { db } from '~/server/db'
import { messages } from '~/server/db/schema'

export const messagesRouter = createTRPCRouter({
  createMessage: protectedProcedure
    .input(
      z.object({
        name: z.string(),
        email: z.string(),
        message: z.string(),
      })
    )
    .mutation(async ({ input }) => {
      try {
        const message = await db.insert(messages).values(input)
        return message
      } catch (e) {
        console.error(e)
        throw new TRPCError({
          code: 'INTERNAL_SERVER_ERROR',
          message: 'Technology not created',
        })
      }
    }),

  deleteMessage: protectedProcedure
    .input(
      z.object({
        id: z.string().uuid(),
      })
    )
    .mutation(async ({ input }) => {
      try {
        const message = await db
          .delete(messages)
          .where(eq(messages.id, input.id))
        return message
      } catch (e) {
        console.error(e)
        throw new TRPCError({
          code: 'INTERNAL_SERVER_ERROR',
          message: 'Technology not deleted',
        })
      }
    }),

  getAllMessages: publicProcedure.query(async () => {
    try {
      const messages = await db.query.messages.findMany()
      return messages
    } catch (e) {
      console.error(e)
      throw new TRPCError({
        code: 'INTERNAL_SERVER_ERROR',
        message: 'Messages not found',
      })
    }
  }),

  getMessageById: publicProcedure
    .input(
      z.object({
        id: z.string().uuid(),
      })
    )
    .query(async ({ input }) => {
      try {
        const messageById = await db.query.messages.findFirst({
          where: (tbl, { eq }) => eq(tbl.id, input.id),
        })
        return messageById
      } catch (e) {
        console.error(e)
        throw new TRPCError({
          code: 'INTERNAL_SERVER_ERROR',
          message: 'Technology not found',
        })
      }
    }),
})
