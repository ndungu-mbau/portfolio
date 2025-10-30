'use client'

import { motion } from 'framer-motion'
import Link from 'next/link'
import { formatDistanceToNow } from 'date-fns'
import { Card, CardContent, CardHeader, CardTitle } from '~/components/ui/card'
import { Button } from '~/components/ui/button'
import { Badge } from '~/components/ui/badge'
import {
  FolderOpen,
  BarChart3,
  Plus,
  Edit,
  Code2,
  MessageCircle,
} from 'lucide-react'
import { api } from '~/trpc/react'

type ProjectStatus = 'Development' | 'Beta' | 'Live' | 'Archived'

export default function AdminPage() {
  const { data: stats, isLoading } = api.dashboard.getStats.useQuery()

  const statsData = [
    {
      title: 'Total Projects',
      value: stats?.totalProjects?.toString() ?? '0',
      icon: FolderOpen,
      change: `${stats?.projectsByStatus?.Live ?? 0} live, ${stats?.projectsByStatus?.['In Development'] ?? 0} in dev`,
    },
    {
      title: 'Technologies',
      value: stats?.totalTechnologies?.toString() ?? '0',
      icon: Code2,
      change: `${stats?.technologiesByCategory?.Frontend ?? 0} frontend, ${stats?.technologiesByCategory?.Backend ?? 0} backend`,
    },
    {
      title: 'Projects by Status',
      value: Object.entries(stats?.projectsByStatus ?? {})
        .map(([status, count]) => `${status}: ${count}`)
        .join(', '),
      icon: BarChart3,
      change: 'Status distribution',
    },
    {
      title: 'Contact Messages',
      value: '0',
      icon: MessageCircle,
      change: '0 unread',
    },
  ]

  const recentProjects =
    stats?.recentProjects?.map((project) => ({
      title: project.title,
      status: project.status as ProjectStatus,
      updated: formatDistanceToNow(new Date(project.updatedAt ?? Date.now()), {
        addSuffix: true,
      }),
      technologies: project.technologies.join(', '),
    })) ?? []

  const quickActions = [
    {
      title: 'Manage Projects',
      description: 'View, add, and edit your portfolio projects',
      icon: FolderOpen,
      href: '/admin/projects',
      color: 'blue',
    },
    {
      title: 'Manage Technologies',
      description: 'Update your technology stack and skills',
      icon: Code2,
      href: '/admin/technologies',
      color: 'green',
    },
  ]

  return (
    <div className="min-h-screen bg-neutral-950">
      {/* Top Navigation Bar */}
      <div className="border-b border-neutral-800 bg-neutral-900/50 backdrop-blur-sm">
        <div className="mx-auto flex max-w-6xl items-center justify-between px-4 py-2">
          <div className="flex items-center space-x-1">
            {quickActions.map((action, index) => {
              const Icon = action.icon
              return (
                <motion.div
                  key={action.title}
                  initial={{ opacity: 0, y: -10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.3, delay: index * 0.1 }}
                >
                  <Button
                    variant="ghost"
                    className={`flex items-center gap-2 text-sm text-neutral-300 hover:bg-neutral-800 hover:text-white ${
                      action.color === 'blue' ? 'text-blue-400' : ''
                    } ${action.color === 'green' ? 'text-green-400' : ''}`}
                    asChild
                  >
                    <Link href={action.href}>
                      <Icon className="h-4 w-4" />
                      <span>{action.title}</span>
                    </Link>
                  </Button>
                </motion.div>
              )
            })}
          </div>
          <div className="flex items-center gap-3">
            <Button
              className="bg-white text-black hover:bg-neutral-200"
              asChild
              size="sm"
            >
              <Link href="/admin/projects/new">
                <Plus className="mr-1 h-4 w-4" />
                New Project
              </Link>
            </Button>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="mx-auto max-w-6xl px-4 py-8">
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          <div className="mb-8">
            <h1 className="mb-1 text-3xl font-bold text-white">
              Admin Dashboard
            </h1>
            <p className="text-neutral-400">
              Manage your portfolio and projects
            </p>
          </div>

          {/* Stats Grid */}
          <div className="mb-12 grid gap-6 md:grid-cols-2 lg:grid-cols-4">
            {statsData.map((stat, index) => {
              const Icon = stat.icon
              return (
                <motion.div
                  key={stat.title}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.8, delay: index * 0.1 }}
                >
                  <Card className="h-full border-neutral-700 bg-neutral-900/50">
                    <CardContent className="p-6">
                      <div className="mb-4 flex items-center justify-between">
                        <Icon className="text-neutral-400" size={24} />
                        <Badge
                          variant="outline"
                          className="border-neutral-600 text-xs text-neutral-300"
                        >
                          {stat.change}
                        </Badge>
                      </div>
                      <div>
                        <p className="mb-1 truncate text-2xl font-bold text-white">
                          {stat.value}
                        </p>
                        <p className="text-sm text-neutral-400">{stat.title}</p>
                      </div>
                    </CardContent>
                  </Card>
                </motion.div>
              )
            })}
          </div>

          <div className="mb-12 grid gap-8 lg:grid-cols-2">
            {/* Recent Projects */}
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.8, delay: 0.4 }}
            >
              <Card className="border-neutral-700 bg-neutral-900/50">
                <CardHeader>
                  <CardTitle className="text-xl text-white">
                    Recent Projects
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {isLoading ? (
                      <div className="space-y-4">
                        {[1, 2, 3].map((i) => (
                          <div
                            key={i}
                            className="h-20 animate-pulse rounded-lg bg-neutral-800/50"
                          />
                        ))}
                      </div>
                    ) : recentProjects.length > 0 ? (
                      recentProjects.map((project, index) => (
                        <motion.div
                          key={`${project.title}-${index}`}
                          initial={{ opacity: 0, x: -20 }}
                          animate={{ opacity: 1, x: 0 }}
                          transition={{ duration: 0.5, delay: index * 0.1 }}
                          className="flex items-center justify-between rounded-lg border border-neutral-200 bg-neutral-800/30 p-4 dark:border-neutral-800"
                        >
                          <div className="flex items-center gap-4">
                            <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-neutral-700">
                              <FolderOpen
                                className="text-neutral-300"
                                size={18}
                              />
                            </div>
                            <div className="min-w-0 flex-1">
                              <h3 className="truncate font-medium text-white">
                                {project.title}
                              </h3>
                              <p className="truncate text-sm text-neutral-400">
                                {project.technologies}
                              </p>
                              <p className="text-xs text-neutral-500">
                                Updated {project.updated}
                              </p>
                            </div>
                          </div>
                          <div className="flex items-center gap-3">
                            <Badge
                              variant="outline"
                              className={`border-neutral-600 text-xs ${
                                project.status === 'Live'
                                  ? 'border-green-400/30 text-green-400'
                                  : project.status === 'Beta'
                                    ? 'border-blue-400/30 text-blue-400'
                                    : project.status === 'Development'
                                      ? 'border-yellow-400/30 text-yellow-400'
                                      : 'border-neutral-500/30 text-neutral-400'
                              }`}
                            >
                              {project.status}
                            </Badge>
                            <div className="flex gap-2">
                              <Button
                                asChild
                                size="sm"
                                variant="ghost"
                                className="text-neutral-400 hover:text-white"
                              >
                                <Link
                                  href={`/admin/projects/${project.title.toLowerCase().replace(/\s+/g, '-')}`}
                                >
                                  <Edit size={14} />
                                </Link>
                              </Button>
                            </div>
                          </div>
                        </motion.div>
                      ))
                    ) : (
                      <div className="rounded-lg border border-dashed border-neutral-700 p-8 text-center">
                        <FolderOpen className="mx-auto mb-2 h-8 w-8 text-neutral-500" />
                        <p className="text-neutral-400">No projects found</p>
                        <Button asChild variant="ghost" className="mt-2">
                          <Link href="/admin/projects/new">
                            <Plus className="mr-2 h-4 w-4" />
                            Create Project
                          </Link>
                        </Button>
                      </div>
                    )}
                  </div>
                </CardContent>
              </Card>
            </motion.div>

            {/* Quick Actions */}
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.8, delay: 0.6 }}
            >
              <Card className="border-neutral-700 bg-neutral-900/50">
                <CardHeader>
                  <CardTitle className="text-xl text-white">
                    Quick Actions
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="grid gap-4">
                    {quickActions.map((action, index) => {
                      const Icon = action.icon
                      return (
                        <motion.div
                          key={action.title}
                          initial={{ opacity: 0, y: 10 }}
                          animate={{ opacity: 1, y: 0 }}
                          transition={{ duration: 0.5, delay: index * 0.1 }}
                        >
                          <Link
                            href={action.href}
                            className="group flex items-center gap-4 rounded-lg border border-neutral-200 bg-neutral-800/30 p-4 transition-colors hover:border-neutral-500 dark:border-neutral-800"
                          >
                            <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-neutral-700 transition-colors group-hover:bg-neutral-600">
                              <Icon className="text-neutral-300" size={18} />
                            </div>
                            <div className="flex-1">
                              <h3 className="font-medium text-white transition-colors group-hover:text-neutral-200">
                                {action.title}
                              </h3>
                              <p className="text-sm text-neutral-400">
                                {action.description}
                              </p>
                            </div>
                          </Link>
                        </motion.div>
                      )
                    })}
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          </div>
        </motion.div>
      </div>
    </div>
  )
}
