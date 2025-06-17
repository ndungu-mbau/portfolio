"use client"

import type React from "react"

import { motion } from "framer-motion"
import { useState } from "react"
import Link from "next/link"
import { Card, CardContent, CardHeader, CardTitle } from "~/components/ui/card"
import { Button } from "~/components/ui/button"
import { Badge } from "~/components/ui/badge"
import { Input } from "~/components/ui/input"
import { ArrowLeft, Plus, Edit, Trash2, Search, Code, Palette, Server, Database, Cloud, Wrench } from "lucide-react"

// Mock technologies data
const mockTechnologies = [
  { id: "react", name: "React", category: "Frontend", color: "blue", icon: Code, usageCount: 8 },
  { id: "nextjs", name: "Next.js", category: "Frontend", color: "gray", icon: Code, usageCount: 6 },
  { id: "typescript", name: "TypeScript", category: "Frontend", color: "blue", icon: Code, usageCount: 10 },
  { id: "nodejs", name: "Node.js", category: "Backend", color: "green", icon: Server, usageCount: 7 },
  { id: "python", name: "Python", category: "Backend", color: "yellow", icon: Server, usageCount: 5 },
  { id: "postgresql", name: "PostgreSQL", category: "Database", color: "blue", icon: Database, usageCount: 4 },
  { id: "mongodb", name: "MongoDB", category: "Database", color: "green", icon: Database, usageCount: 3 },
  { id: "aws", name: "AWS", category: "Cloud", color: "orange", icon: Cloud, usageCount: 6 },
  { id: "docker", name: "Docker", category: "DevOps", color: "blue", icon: Wrench, usageCount: 5 },
  { id: "tailwind", name: "Tailwind CSS", category: "Frontend", color: "cyan", icon: Palette, usageCount: 9 },
]

const categories = ["All", "Frontend", "Backend", "Database", "Cloud", "DevOps"]

export default function AdminTechnologiesPage() {
  const [technologies, setTechnologies] = useState(mockTechnologies)
  const [searchTerm, setSearchTerm] = useState("")
  const [categoryFilter, setCategoryFilter] = useState("All")
  const [newTech, setNewTech] = useState({ name: "", category: "Frontend" })
  const [showAddForm, setShowAddForm] = useState(false)

  const filteredTechnologies = technologies.filter((tech) => {
    const matchesSearch = tech.name.toLowerCase().includes(searchTerm.toLowerCase())
    const matchesCategory = categoryFilter === "All" || tech.category === categoryFilter
    return matchesSearch && matchesCategory
  })

  const handleAddTechnology = (e: React.FormEvent) => {
    e.preventDefault()
    if (newTech.name.trim()) {
      const newTechnology = {
        id: newTech.name.toLowerCase().replace(/\s+/g, "-"),
        name: newTech.name,
        category: newTech.category,
        color: "gray",
        icon: Code,
        usageCount: 0,
      }
      setTechnologies([...technologies, newTechnology])
      setNewTech({ name: "", category: "Frontend" })
      setShowAddForm(false)
    }
  }

  const handleDeleteTechnology = (techId: string) => {
    if (confirm("Are you sure want to delete this technology?")) {
      setTechnologies(technologies.filter((t) => t.id !== techId))
    }
  }

  const getIconForCategory = (category: string) => {
    switch (category) {
      case "Frontend":
        return Code
      case "Backend":
        return Server
      case "Database":
        return Database
      case "Cloud":
        return Cloud
      case "DevOps":
        return Wrench
      default:
        return Code
    }
  }

  return (
    <div className="min-h-screen bg-neutral-950">
      <div className="max-w-6xl mx-auto px-4 py-8">
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.8 }}>
          {/* Header */}
          <div className="flex items-center justify-between mb-8">
            <div className="flex items-center gap-4">
              <Button variant="ghost" className="text-neutral-400 hover:text-white" asChild>
                <Link href="/admin">
                  <ArrowLeft className="w-4 h-4 mr-2" />
                  Back to Dashboard
                </Link>
              </Button>
              <div>
                <h1 className="text-3xl font-bold text-white">Manage Technologies</h1>
                <p className="text-neutral-400">View and manage your technology stack</p>
              </div>
            </div>
            <Button className="bg-white text-black hover:bg-neutral-200" onClick={() => setShowAddForm(!showAddForm)}>
              <Plus className="w-4 h-4 mr-2" />
              Add Technology
            </Button>
          </div>

          {/* Add Technology Form */}
          {showAddForm && (
            <Card className="bg-neutral-900/50 border-neutral-700 mb-8">
              <CardHeader>
                <CardTitle className="text-white">Add New Technology</CardTitle>
              </CardHeader>
              <CardContent>
                <form onSubmit={handleAddTechnology} className="flex gap-4">
                  <Input
                    placeholder="Technology name"
                    value={newTech.name}
                    onChange={(e) => setNewTech({ ...newTech, name: e.target.value })}
                    className="bg-neutral-800/50 border-neutral-600 text-white placeholder:text-neutral-500"
                    required
                  />
                  <select
                    value={newTech.category}
                    onChange={(e) => setNewTech({ ...newTech, category: e.target.value })}
                    className="px-3 py-2 bg-neutral-800/50 border border-neutral-200 border-neutral-600 rounded-md text-white dark:border-neutral-800"
                  >
                    {categories
                      .filter((cat) => cat !== "All")
                      .map((category) => (
                        <option key={category} value={category}>
                          {category}
                        </option>
                      ))}
                  </select>
                  <Button type="submit" className="bg-white text-black hover:bg-neutral-200">
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
          <Card className="bg-neutral-900/50 border-neutral-700 mb-8">
            <CardContent className="p-6">
              <div className="flex flex-col md:flex-row gap-4">
                <div className="flex-1">
                  <div className="relative">
                    <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-neutral-400" size={18} />
                    <Input
                      placeholder="Search technologies..."
                      value={searchTerm}
                      onChange={(e) => setSearchTerm(e.target.value)}
                      className="pl-10 bg-neutral-800/50 border-neutral-600 text-white placeholder:text-neutral-500"
                    />
                  </div>
                </div>
                <div className="flex gap-2 flex-wrap">
                  {categories.map((category) => (
                    <Button
                      key={category}
                      variant={categoryFilter === category ? "default" : "outline"}
                      size="sm"
                      onClick={() => setCategoryFilter(category)}
                      className={
                        categoryFilter === category
                          ? "bg-white text-black"
                          : "border-neutral-600 text-neutral-300 hover:bg-neutral-800"
                      }
                    >
                      {category}
                    </Button>
                  ))}
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Technologies Grid */}
          <div className="grid md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
            {filteredTechnologies.map((tech, index) => {
              const IconComponent = tech.icon
              return (
                <motion.div
                  key={tech.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.5, delay: index * 0.05 }}
                >
                  <Card className="bg-neutral-900/50 border-neutral-700 hover:border-neutral-500 transition-colors group">
                    <CardContent className="p-4">
                      <div className="flex items-center justify-between mb-3">
                        <div className="flex items-center gap-3">
                          <div className="w-8 h-8 bg-neutral-800 rounded-lg flex items-center justify-center">
                            <IconComponent className="text-neutral-300" size={16} />
                          </div>
                          <div>
                            <h3 className="text-white font-medium">{tech.name}</h3>
                            <Badge variant="outline" className="border-neutral-600 text-neutral-400 text-xs mt-1">
                              {tech.category}
                            </Badge>
                          </div>
                        </div>
                        <div className="flex gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                          <Button size="sm" variant="ghost" className="text-neutral-400 hover:text-white p-1">
                            <Edit size={14} />
                          </Button>
                          <Button
                            size="sm"
                            variant="ghost"
                            className="text-neutral-400 hover:text-red-400 p-1"
                            onClick={() => handleDeleteTechnology(tech.id)}
                          >
                            <Trash2 size={14} />
                          </Button>
                        </div>
                      </div>
                      <div className="text-xs text-neutral-500">
                        Used in {tech.usageCount} project{tech.usageCount !== 1 ? "s" : ""}
                      </div>
                    </CardContent>
                  </Card>
                </motion.div>
              )
            })}
          </div>

          {filteredTechnologies.length === 0 && (
            <div className="text-center py-12">
              <p className="text-neutral-400 text-lg">No technologies found matching your criteria.</p>
            </div>
          )}

          {/* Statistics */}
          <Card className="bg-neutral-900/50 border-neutral-700 mt-8">
            <CardHeader>
              <CardTitle className="text-white">Technology Statistics</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-4">
                <div className="text-center">
                  <div className="text-2xl font-bold text-white">{technologies.length}</div>
                  <div className="text-neutral-400 text-sm">Total Technologies</div>
                </div>
                {categories
                  .filter((cat) => cat !== "All")
                  .map((category) => (
                    <div key={category} className="text-center">
                      <div className="text-2xl font-bold text-white">
                        {technologies.filter((t) => t.category === category).length}
                      </div>
                      <div className="text-neutral-400 text-sm">{category}</div>
                    </div>
                  ))}
              </div>
            </CardContent>
          </Card>
        </motion.div>
      </div>
    </div>
  )
}
