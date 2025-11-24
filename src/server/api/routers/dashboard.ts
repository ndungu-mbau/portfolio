import { TRPCError } from '@trpc/server'
import { count } from 'drizzle-orm'

import { createTRPCRouter, protectedProcedure } from '~/server/api/trpc'
import { db } from '~/server/db'
import { projects, technologies } from '~/server/db/schema'

export const dashboardRouter = createTRPCRouter({
  getStats: protectedProcedure.query(async () => {
    try {
      // Get total projects count
      const [totalProjects] = await db.select({ count: count() }).from(projects)

      // Get projects count by status
      const projectsByStatus = await db
        .select({
          status: projects.status,
          count: count(),
        })
        .from(projects)
        .groupBy(projects.status)

      // Get total technologies count
      const [totalTechnologies] = await db
        .select({ count: count() })
        .from(technologies)

      // Get technologies by category
      const technologiesByCategory = await db
        .select({
          category: technologies.category,
          count: count(),
        })
        .from(technologies)
        .groupBy(technologies.category)

      // Get recent projects
      const recentProjects = await db.query.projects.findMany({
        with: {
          projectTechnologies: {
            with: {
              technology: true,
            },
          },
        },
        orderBy: (projects, { desc }) => [desc(projects.updatedAt)],
        limit: 5,
      })

      // Format the data for the dashboard
      const stats = {
        totalProjects: totalProjects?.count ?? 0,
        totalTechnologies: totalTechnologies?.count ?? 0,
        projectsByStatus: projectsByStatus.reduce(
          (acc, { status, count }) => ({
            ...acc,
            [status]: count,
          }),
          {}
        ) as Record<string, number>,
        technologiesByCategory: technologiesByCategory.reduce(
          (acc, { category, count }) => ({
            ...acc,
            [category]: count,
          }),
          {}
        ) as Record<string, number>,
        recentProjects: recentProjects.map((project) => ({
          id: project.id,
          title: project.title,
          status: project.status,
          updatedAt: project.updatedAt,
          technologies: project.projectTechnologies.map(
            (pt) => pt.technology.name
          ),
        })),
      }

      return stats
    } catch (error) {
      console.error('Error fetching dashboard stats:', error)
      throw new TRPCError({
        code: 'INTERNAL_SERVER_ERROR',
        message: 'Failed to fetch dashboard statistics',
      })
    }
  }),
})
