'use client'

import { motion } from 'framer-motion'
import Link from 'next/link'
import { Card, CardContent, CardHeader, CardTitle } from '~/components/ui/card'
import { Button } from '~/components/ui/button'
import { Badge } from '~/components/ui/badge'
import {
  Settings,
  Users,
  FolderOpen,
  BarChart3,
  Plus,
  Edit,
  Trash2,
  Code2,
} from 'lucide-react'

export default function AdminPage() {
  const stats = [
    {
      title: 'Total Projects',
      value: '12',
      icon: FolderOpen,
      change: '+2 this month',
    },
    {
      title: 'Technologies',
      value: '24',
      icon: Code2,
      change: '+3 this month',
    },
    {
      title: 'Page Views',
      value: '2,847',
      icon: BarChart3,
      change: '+12% from last month',
    },
    { title: 'Contact Messages', value: '23', icon: Users, change: '5 unread' },
  ]

  const recentProjects = [
    { name: 'E-Commerce Platform', status: 'Live', updated: '2 days ago' },
    { name: 'Task Management App', status: 'Live', updated: '1 week ago' },
    { name: 'Weather Dashboard', status: 'Live', updated: '2 weeks ago' },
    { name: 'Blog Platform', status: 'Beta', updated: '3 days ago' },
  ]

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
    {
      title: 'Site Settings',
      description: 'Configure portfolio settings and preferences',
      icon: Settings,
      href: '/admin/settings',
      color: 'purple',
    },
    {
      title: 'View Analytics',
      description: 'Check site performance and visitor statistics',
      icon: BarChart3,
      href: '/admin/analytics',
      color: 'orange',
    },
  ]

  return (
    <div className="min-h-screen bg-neutral-950">
      <div className="mx-auto max-w-6xl px-4 py-12">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
        >
          <div className="mb-12 flex items-center justify-between">
            <div>
              <h1 className="mb-2 text-4xl font-bold text-white">
                Admin Dashboard
              </h1>
              <p className="text-neutral-400">
                Manage your portfolio and projects
              </p>
            </div>
            <div className="flex gap-3">
              <Button
                className="bg-white text-black hover:bg-neutral-200"
                asChild
              >
                <Link href="/admin/projects/new">
                  <Plus className="mr-2 h-4 w-4" />
                  New Project
                </Link>
              </Button>
              <Button
                variant="outline"
                className="border-neutral-600 text-neutral-300 hover:bg-neutral-800"
                asChild
              >
                <Link href="/admin/technologies">
                  <Code2 className="mr-2 h-4 w-4" />
                  Technologies
                </Link>
              </Button>
            </div>
          </div>

          {/* Stats Grid */}
          <div className="mb-12 grid gap-6 md:grid-cols-2 lg:grid-cols-4">
            {stats.map((stat, index) => {
              const Icon = stat.icon
              return (
                <motion.div
                  key={stat.title}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.8, delay: index * 0.1 }}
                >
                  <Card className="border-neutral-700 bg-neutral-900/50">
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
                        <p className="mb-1 text-2xl font-bold text-white">
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
                    {recentProjects.map((project, index) => (
                      <motion.div
                        key={project.name}
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
                          <div>
                            <h3 className="font-medium text-white">
                              {project.name}
                            </h3>
                            <p className="text-sm text-neutral-400">
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
                                : 'border-yellow-400/30 text-yellow-400'
                            }`}
                          >
                            {project.status}
                          </Badge>
                          <div className="flex gap-2">
                            <Button
                              size="sm"
                              variant="ghost"
                              className="text-neutral-400 hover:text-white"
                            >
                              <Edit size={14} />
                            </Button>
                            <Button
                              size="sm"
                              variant="ghost"
                              className="text-neutral-400 hover:text-red-400"
                            >
                              <Trash2 size={14} />
                            </Button>
                          </div>
                        </div>
                      </motion.div>
                    ))}
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
