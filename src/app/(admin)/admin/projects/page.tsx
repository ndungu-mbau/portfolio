'use client'

import { motion } from 'framer-motion'
import { useState } from 'react'
import Link from 'next/link'
import Image from 'next/image'
import { Card, CardContent, CardHeader, CardTitle } from '~/components/ui/card'
import { Button } from '~/components/ui/button'
import { Badge } from '~/components/ui/badge'
import { Input } from '~/components/ui/input'
import { Plus, Edit, Trash2, Search, Eye } from 'lucide-react'

// Mock projects data
const mockProjects = [
  {
    id: 'ecommerce-platform',
    title: 'E-Commerce Platform',
    description:
      'A full-stack e-commerce solution with React, Node.js, and Stripe integration.',
    image: '/placeholder.svg?height=200&width=300',
    technologies: ['React', 'Node.js', 'MongoDB', 'Stripe'],
    status: 'Live',
    featured: true,
    year: '2024',
    createdAt: '2024-01-15',
    updatedAt: '2024-01-20',
  },
  {
    id: 'task-management-app',
    title: 'Task Management App',
    description:
      'A collaborative task management application built with Next.js and real-time updates.',
    image: '/placeholder.svg?height=200&width=300',
    technologies: ['Next.js', 'Socket.io', 'PostgreSQL'],
    status: 'Live',
    featured: true,
    year: '2024',
    createdAt: '2024-02-10',
    updatedAt: '2024-02-15',
  },
  {
    id: 'weather-dashboard',
    title: 'Weather Dashboard',
    description:
      'A beautiful weather dashboard with location-based forecasts and interactive maps.',
    image: '/placeholder.svg?height=200&width=300',
    technologies: ['Vue.js', 'Chart.js', 'Weather API'],
    status: 'Live',
    featured: false,
    year: '2023',
    createdAt: '2023-11-05',
    updatedAt: '2023-11-10',
  },
  {
    id: 'blog-platform',
    title: 'Blog Platform',
    description:
      'A modern blog platform with markdown support and SEO optimization.',
    image: '/placeholder.svg?height=200&width=300',
    technologies: ['Next.js', 'MDX', 'Supabase'],
    status: 'Beta',
    featured: false,
    year: '2023',
    createdAt: '2023-09-20',
    updatedAt: '2023-10-01',
  },
]

export default function AdminProjectsPage() {
  const [projects, setProjects] = useState(mockProjects)
  const [searchTerm, setSearchTerm] = useState('')
  const [statusFilter, setStatusFilter] = useState('all')
  const [featuredFilter, setFeaturedFilter] = useState('all')

  const filteredProjects = projects.filter((project) => {
    const matchesSearch =
      project.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      project.description.toLowerCase().includes(searchTerm.toLowerCase())
    const matchesStatus =
      statusFilter === 'all' || project.status.toLowerCase() === statusFilter
    const matchesFeatured =
      featuredFilter === 'all' ||
      (featuredFilter === 'featured' && project.featured) ||
      (featuredFilter === 'not-featured' && !project.featured)

    return matchesSearch && matchesStatus && matchesFeatured
  })

  const handleDeleteProject = (projectId: string) => {
    if (confirm('Are you sure want to delete this project?')) {
      setProjects(projects.filter((p) => p.id !== projectId))
    }
  }

  return (
    <div className="min-h-screen bg-neutral-950">
      <div className="mx-auto max-w-7xl px-4 py-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
        >
          {/* Header */}
          <div className="mb-8 flex items-center justify-between">
            <div className="flex items-center gap-4">
              <div>
                <h1 className="text-3xl font-bold text-white">
                  Manage Projects
                </h1>
                <p className="text-neutral-400">
                  View, edit, and manage your portfolio projects
                </p>
              </div>
            </div>
            <Button
              className="bg-white text-black hover:bg-neutral-200"
              asChild
            >
              <Link href="/admin/projects/new">
                <Plus className="mr-2 h-4 w-4" />
                Add New Project
              </Link>
            </Button>
          </div>

          {/* Filters and Search */}
          <Card className="mb-8 border-neutral-700 bg-neutral-900/50">
            <CardContent className="p-6">
              <div className="flex flex-col gap-4 md:flex-row">
                <div className="flex-1">
                  <div className="relative">
                    <Search
                      className="absolute top-1/2 left-3 -translate-y-1/2 transform text-neutral-400"
                      size={18}
                    />
                    <Input
                      placeholder="Search projects..."
                      value={searchTerm}
                      onChange={(e) => setSearchTerm(e.target.value)}
                      className="border-neutral-600 bg-neutral-800/50 pl-10 text-white placeholder:text-neutral-500"
                    />
                  </div>
                </div>
                <div className="flex gap-4">
                  <select
                    value={statusFilter}
                    onChange={(e) => setStatusFilter(e.target.value)}
                    className="rounded-md border border-neutral-600 bg-neutral-800/50 px-3 py-2 text-sm text-white dark:border-neutral-800"
                  >
                    <option value="all">All Status</option>
                    <option value="live">Live</option>
                    <option value="beta">Beta</option>
                    <option value="development">Development</option>
                  </select>
                  <select
                    value={featuredFilter}
                    onChange={(e) => setFeaturedFilter(e.target.value)}
                    className="rounded-md border border-neutral-600 bg-neutral-800/50 px-3 py-2 text-sm text-white dark:border-neutral-800"
                  >
                    <option value="all">All Projects</option>
                    <option value="featured">Featured Only</option>
                    <option value="not-featured">Not Featured</option>
                  </select>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Projects Grid */}
          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            {filteredProjects.map((project, index) => (
              <motion.div
                key={project.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
              >
                <Card className="group overflow-hidden border-neutral-700 bg-neutral-900/50 transition-colors hover:border-neutral-500">
                  <div className="relative">
                    <Image
                      src={project.image || '/placeholder.svg'}
                      alt={project.title}
                      width={300}
                      height={200}
                      className="h-48 w-full object-cover"
                    />
                    <div className="absolute top-3 left-3 flex gap-2">
                      {project.featured && (
                        <Badge className="bg-white text-xs text-black">
                          Featured
                        </Badge>
                      )}
                      <Badge
                        variant="outline"
                        className={`text-xs ${
                          project.status === 'Live'
                            ? 'border-green-400/30 bg-green-400/10 text-green-400'
                            : project.status === 'Beta'
                              ? 'border-yellow-400/30 bg-yellow-400/10 text-yellow-400'
                              : 'border-blue-400/30 bg-blue-400/10 text-blue-400'
                        }`}
                      >
                        {project.status}
                      </Badge>
                    </div>
                  </div>

                  <CardHeader>
                    <CardTitle className="text-lg text-white">
                      {project.title}
                    </CardTitle>
                    <p className="line-clamp-2 text-sm text-neutral-400">
                      {project.description}
                    </p>
                  </CardHeader>

                  <CardContent className="space-y-4">
                    <div className="flex flex-wrap gap-1">
                      {project.technologies.slice(0, 3).map((tech) => (
                        <Badge
                          key={tech}
                          variant="secondary"
                          className="border-neutral-600 bg-neutral-800 text-xs text-neutral-200"
                        >
                          {tech}
                        </Badge>
                      ))}
                      {project.technologies.length > 3 && (
                        <Badge
                          variant="secondary"
                          className="border-neutral-600 bg-neutral-800 text-xs text-neutral-200"
                        >
                          +{project.technologies.length - 3}
                        </Badge>
                      )}
                    </div>

                    <div className="text-xs text-neutral-500">
                      <p>
                        Created:{' '}
                        {new Date(project.createdAt).toLocaleDateString()}
                      </p>
                      <p>
                        Updated:{' '}
                        {new Date(project.updatedAt).toLocaleDateString()}
                      </p>
                    </div>

                    <div className="flex gap-2 pt-2">
                      <Button
                        size="sm"
                        variant="outline"
                        className="flex-1 border-neutral-600 text-neutral-300 hover:bg-neutral-800"
                        asChild
                      >
                        <Link href={`/projects/${project.id}`}>
                          <Eye className="mr-1 h-3 w-3" />
                          View
                        </Link>
                      </Button>
                      <Button
                        size="sm"
                        variant="outline"
                        className="border-neutral-600 text-neutral-300 hover:bg-neutral-800"
                        asChild
                      >
                        <Link href={`/admin/projects/${project.id}/edit`}>
                          <Edit className="h-3 w-3" />
                        </Link>
                      </Button>
                      <Button
                        size="sm"
                        variant="outline"
                        className="border-red-600 text-red-400 hover:bg-red-600/10"
                        onClick={() => handleDeleteProject(project.id)}
                      >
                        <Trash2 className="h-3 w-3" />
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </div>

          {filteredProjects.length === 0 && (
            <div className="py-12 text-center">
              <p className="text-lg text-neutral-400">
                No projects found matching your criteria.
              </p>
            </div>
          )}
        </motion.div>
      </div>
    </div>
  )
}
