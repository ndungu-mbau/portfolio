'use client'

import type React from 'react'

import { motion } from 'framer-motion'
import { useState } from 'react'
import Link from 'next/link'
import { Card, CardContent, CardHeader, CardTitle } from '~/components/ui/card'
import { Button } from '~/components/ui/button'
import { Badge } from '~/components/ui/badge'
import { Input } from '~/components/ui/input'
import {
  ArrowLeft,
  Plus,
  Edit,
  Trash2,
  Search,
  Code,
  Palette,
  Server,
  Database,
  Cloud,
  Wrench,
} from 'lucide-react'

// Mock technologies data
const mockTechnologies = [
  {
    id: 'react',
    name: 'React',
    category: 'Frontend',
    color: 'blue',
    icon: Code,
    usageCount: 8,
  },
  {
    id: 'nextjs',
    name: 'Next.js',
    category: 'Frontend',
    color: 'gray',
    icon: Code,
    usageCount: 6,
  },
  {
    id: 'typescript',
    name: 'TypeScript',
    category: 'Frontend',
    color: 'blue',
    icon: Code,
    usageCount: 10,
  },
  {
    id: 'nodejs',
    name: 'Node.js',
    category: 'Backend',
    color: 'green',
    icon: Server,
    usageCount: 7,
  },
  {
    id: 'python',
    name: 'Python',
    category: 'Backend',
    color: 'yellow',
    icon: Server,
    usageCount: 5,
  },
  {
    id: 'postgresql',
    name: 'PostgreSQL',
    category: 'Database',
    color: 'blue',
    icon: Database,
    usageCount: 4,
  },
  {
    id: 'mongodb',
    name: 'MongoDB',
    category: 'Database',
    color: 'green',
    icon: Database,
    usageCount: 3,
  },
  {
    id: 'aws',
    name: 'AWS',
    category: 'Cloud',
    color: 'orange',
    icon: Cloud,
    usageCount: 6,
  },
  {
    id: 'docker',
    name: 'Docker',
    category: 'DevOps',
    color: 'blue',
    icon: Wrench,
    usageCount: 5,
  },
  {
    id: 'tailwind',
    name: 'Tailwind CSS',
    category: 'Frontend',
    color: 'cyan',
    icon: Palette,
    usageCount: 9,
  },
]

const categories = ['All', 'Frontend', 'Backend', 'Database', 'Cloud', 'DevOps']

export default function AdminTechnologiesPage() {
  const [technologies, setTechnologies] = useState(mockTechnologies)
  const [searchTerm, setSearchTerm] = useState('')
  const [categoryFilter, setCategoryFilter] = useState('All')
  const [newTech, setNewTech] = useState({ name: '', category: 'Frontend' })
  const [showAddForm, setShowAddForm] = useState(false)

  const filteredTechnologies = technologies.filter((tech) => {
    const matchesSearch = tech.name
      .toLowerCase()
      .includes(searchTerm.toLowerCase())
    const matchesCategory =
      categoryFilter === 'All' || tech.category === categoryFilter
    return matchesSearch && matchesCategory
  })

  const handleAddTechnology = (e: React.FormEvent) => {
    e.preventDefault()
    if (newTech.name.trim()) {
      const newTechnology = {
        id: newTech.name.toLowerCase().replace(/\s+/g, '-'),
        name: newTech.name,
        category: newTech.category,
        color: 'gray',
        icon: Code,
        usageCount: 0,
      }
      setTechnologies([...technologies, newTechnology])
      setNewTech({ name: '', category: 'Frontend' })
      setShowAddForm(false)
    }
  }

  const handleDeleteTechnology = (techId: string) => {
    if (confirm('Are you sure want to delete this technology?')) {
      setTechnologies(technologies.filter((t) => t.id !== techId))
    }
  }

  // const getIconForCategory = (category: string) => {
  //   switch (category) {
  //     case "Frontend":
  //       return Code
  //     case "Backend":
  //       return Server
  //     case "Database":
  //       return Database
  //     case "Cloud":
  //       return Cloud
  //     case "DevOps":
  //       return Wrench
  //     default:
  //       return Code
  //   }
  // }

  return (
    <div className="min-h-screen bg-neutral-950">
      <div className="mx-auto max-w-6xl px-4 py-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
        >
          {/* Header */}
          <div className="mb-8 flex items-center justify-between">
            <div className="flex items-center gap-4">
              <Button
                variant="ghost"
                className="text-neutral-400 hover:text-white"
                asChild
              >
                <Link href="/admin">
                  <ArrowLeft className="mr-2 h-4 w-4" />
                  Back to Dashboard
                </Link>
              </Button>
              <div>
                <h1 className="text-3xl font-bold text-white">
                  Manage Technologies
                </h1>
                <p className="text-neutral-400">
                  View and manage your technology stack
                </p>
              </div>
            </div>
            <Button
              className="bg-white text-black hover:bg-neutral-200"
              onClick={() => setShowAddForm(!showAddForm)}
            >
              <Plus className="mr-2 h-4 w-4" />
              Add Technology
            </Button>
          </div>

          {/* Add Technology Form */}
          {showAddForm && (
            <Card className="mb-8 border-neutral-700 bg-neutral-900/50">
              <CardHeader>
                <CardTitle className="text-white">Add New Technology</CardTitle>
              </CardHeader>
              <CardContent>
                <form onSubmit={handleAddTechnology} className="flex gap-4">
                  <Input
                    placeholder="Technology name"
                    value={newTech.name}
                    onChange={(e) =>
                      setNewTech({ ...newTech, name: e.target.value })
                    }
                    className="border-neutral-600 bg-neutral-800/50 text-white placeholder:text-neutral-500"
                    required
                  />
                  <select
                    value={newTech.category}
                    onChange={(e) =>
                      setNewTech({ ...newTech, category: e.target.value })
                    }
                    className="rounded-md border border-neutral-600 bg-neutral-800/50 px-3 py-2 text-white dark:border-neutral-800"
                  >
                    {categories
                      .filter((cat) => cat !== 'All')
                      .map((category) => (
                        <option key={category} value={category}>
                          {category}
                        </option>
                      ))}
                  </select>
                  <Button
                    type="submit"
                    className="bg-white text-black hover:bg-neutral-200"
                  >
                    Add
                  </Button>
                  <Button
                    type="button"
                    variant="outline"
                    className="border-neutral-600 text-neutral-300"
                    onClick={() => setShowAddForm(false)}
                  >
                    Cancel
                  </Button>
                </form>
              </CardContent>
            </Card>
          )}

          {/* Filters */}
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
                      placeholder="Search technologies..."
                      value={searchTerm}
                      onChange={(e) => setSearchTerm(e.target.value)}
                      className="border-neutral-600 bg-neutral-800/50 pl-10 text-white placeholder:text-neutral-500"
                    />
                  </div>
                </div>
                <div className="flex flex-wrap gap-2">
                  {categories.map((category) => (
                    <Button
                      key={category}
                      variant={
                        categoryFilter === category ? 'default' : 'outline'
                      }
                      size="sm"
                      onClick={() => setCategoryFilter(category)}
                      className={
                        categoryFilter === category
                          ? 'bg-white text-black'
                          : 'border-neutral-600 text-neutral-300 hover:bg-neutral-800'
                      }
                    >
                      {category}
                    </Button>
                  ))}
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Statistics */}
          <Card className="mb-8 border-neutral-700 bg-neutral-900/50">
            <CardHeader>
              <CardTitle className="text-white">
                Technology Statistics
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
                <div className="text-center">
                  <div className="text-2xl font-bold text-white">
                    {technologies.length}
                  </div>
                  <div className="text-sm text-neutral-400">
                    Total Technologies
                  </div>
                </div>
                {categories
                  .filter((cat) => cat !== 'All')
                  .map((category) => (
                    <div key={category} className="text-center">
                      <div className="text-2xl font-bold text-white">
                        {
                          technologies.filter((t) => t.category === category)
                            .length
                        }
                      </div>
                      <div className="text-sm text-neutral-400">{category}</div>
                    </div>
                  ))}
              </div>
            </CardContent>
          </Card>

          {/* Technologies Grid */}
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
            {filteredTechnologies.map((tech, index) => {
              const IconComponent = tech.icon
              return (
                <motion.div
                  key={tech.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.5, delay: index * 0.05 }}
                >
                  <Card className="group border-neutral-700 bg-neutral-900/50 transition-colors hover:border-neutral-500">
                    <CardContent className="p-4">
                      <div className="mb-3 flex items-center justify-between">
                        <div className="flex items-center gap-3">
                          <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-neutral-800">
                            <IconComponent
                              className="text-neutral-300"
                              size={16}
                            />
                          </div>
                          <div>
                            <h3 className="font-medium text-white">
                              {tech.name}
                            </h3>
                            <Badge
                              variant="outline"
                              className="mt-1 border-neutral-600 text-xs text-neutral-400"
                            >
                              {tech.category}
                            </Badge>
                          </div>
                        </div>
                        <div className="flex gap-1 opacity-0 transition-opacity group-hover:opacity-100">
                          <Button
                            size="sm"
                            variant="ghost"
                            className="p-1 text-neutral-400 hover:text-white"
                          >
                            <Edit size={14} />
                          </Button>
                          <Button
                            size="sm"
                            variant="ghost"
                            className="p-1 text-neutral-400 hover:text-red-400"
                            onClick={() => handleDeleteTechnology(tech.id)}
                          >
                            <Trash2 size={14} />
                          </Button>
                        </div>
                      </div>
                      <div className="text-xs text-neutral-500">
                        Used in {tech.usageCount} project
                        {tech.usageCount !== 1 ? 's' : ''}
                      </div>
                    </CardContent>
                  </Card>
                </motion.div>
              )
            })}
          </div>

          {filteredTechnologies.length === 0 && (
            <div className="py-12 text-center">
              <p className="text-lg text-neutral-400">
                No technologies found matching your criteria.
              </p>
            </div>
          )}
        </motion.div>
      </div>
    </div>
  )
}
