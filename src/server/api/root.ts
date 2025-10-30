import { exampleRouter } from '~/server/api/routers/example'
import { projectsRouter } from '~/server/api/routers/projects'
import { technologiesRouter } from '~/server/api/routers/technologies'
import { uploadsRouter } from '~/server/api/routers/uploads'
import { messagesRouter } from '~/server/api/routers/messages'
import { dashboardRouter } from '~/server/api/routers/dashboard'

import { createCallerFactory, createTRPCRouter } from '~/server/api/trpc'

/**
 * This is the primary router for your server.
 *
 * All routers added in /api/routers should be manually added here.
 */
export const appRouter = createTRPCRouter({
  example: exampleRouter,
  projects: projectsRouter,
  technologies: technologiesRouter,
  uploads: uploadsRouter,
  messages: messagesRouter,
  dashboard: dashboardRouter,
})

// export type definition of API
export type AppRouter = typeof appRouter

/**
 * Create a server-side caller for the tRPC API.
 * @example
 * const trpc = createCaller(createContext);
 * const res = await trpc.post.all();
 *       ^? Post[]
 */
export const createCaller = createCallerFactory(appRouter)
