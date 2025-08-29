'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { toast } from 'sonner'
import { motion } from 'framer-motion'
import { api, type RouterOutputs } from '~/trpc/react'
import { cn } from '~/lib/utils'
import { Save, X } from 'lucide-react'
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '~/components/ui/card'
import { Input } from '~/components/ui/input'
import { Button } from '~/components/ui/button'
import { Badge } from '~/components/ui/badge'
import { TiptapEditor } from '~/components/ui/editor'
import { Textarea } from '../ui/textarea'
import Link from 'next/link'

type Project = RouterOutputs['projects']['getAllProjects'][number]

type ProjectFormData = {
  title: string
  description: string
  longDescription: string
  image: string
  liveUrl: string
  githubUrl: string
  status: 'Development' | 'Beta' | 'Live' | 'Archived'
  featured: boolean
  technologies: string[]
  features: string[]
  challenges: string[]
  duration: string
  year: string
  gallery: string[]
}

interface EditProjectProps {
  project: Project
  technologies: RouterOutputs['technologies']['getAllTechnologies']
}

export default function EditProjectPage({
  project,
  technologies,
}: EditProjectProps) {
  const router = useRouter()
  const utils = api.useUtils()
  const [newFeature, setNewFeature] = useState('')
  const [newChallenge, setNewChallenge] = useState('')

  const [formData, setFormData] = useState<ProjectFormData>({
    title: '',
    description: '',
    longDescription: '',
    image: '',
    liveUrl: '',
    githubUrl: '',
    status: 'Development',
    featured: false,
    technologies: [] as string[],
    features: [] as string[],
    challenges: [] as string[],
    duration: '',
    year: new Date().getFullYear().toString(),
    gallery: [] as string[],
  })

  useEffect(() => {
    if (project) {
      setFormData({
        title: project.title ?? '',
        description: project.description ?? '',
        longDescription: project.longDescription ?? '',
        image: project.image ?? '',
        liveUrl: project.liveUrl ?? '',
        githubUrl: project.githubUrl ?? '',
        status: project.status ?? 'Development',
        featured: project.featured ?? false,
        technologies:
          project.projectTechnologies?.map((t) => t.technologyId) ?? [],
        features: project.features?.map((f) => f.text) ?? [],
        challenges: project.challenges?.map((c) => c.text) ?? [],
        duration: project.duration ?? '',
        year: project.year ?? new Date().getFullYear().toString(),
        gallery: project.gallery ?? [],
      })
    }
  }, [project])

  const handleInputChange = (
    e: React.ChangeEvent<
      HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement
    >
  ) => {
    const { name, value, type } = e.target as HTMLInputElement
    setFormData((prev) => ({
      ...prev,
      [name]:
        type === 'checkbox' ? (e.target as HTMLInputElement).checked : value,
    }))
  }

  const toggleTechnology = (techId: string) => {
    setFormData((prev) => ({
      ...prev,
      technologies: prev.technologies.includes(techId)
        ? prev.technologies.filter((id) => id !== techId)
        : [...prev.technologies, techId],
    }))
  }

  const addToArray = (
    field: 'features' | 'challenges' | 'gallery',
    value: string
  ) => {
    if (value.trim()) {
      setFormData((prev) => ({
        ...prev,
        [field]: [...prev[field], value.trim()],
      }))
      if (field === 'features') setNewFeature('')
      if (field === 'challenges') setNewChallenge('')
    }
  }

  const removeFromArray = (
    field: 'technologies' | 'features' | 'challenges' | 'gallery',
    index: number
  ) => {
    setFormData((prev) => ({
      ...prev,
      [field]: prev[field].filter((_, i) => i !== index),
    }))
  }

  const { mutate: updateProject } = api.projects.updateProject.useMutation({
    onSuccess: () => {
      toast.success('Project updated successfully')
      void utils.projects.invalidate()
      router.push('/admin/projects')
    },
    onError: (error) => {
      toast.error('Failed to update project')
      console.error('Error updating project:', error)
    },
  })

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (formData.features.length === 0) {
      toast.error('Please add at least one feature')
      return
    }

    updateProject({
      id: project?.id,
      ...formData,
      features: formData.features.map((text) => ({ text })),
      challenges: formData.challenges.map((text) => ({ text })),
    })
  }

  const handleLongDescriptionChange = (content: string) => {
    setFormData((prev) => ({ ...prev, longDescription: content }))
  }

  // The rest of the JSX from new.tsx can be copied here
  // Make sure to replace any 'create' text with 'update' for better UX
  // Also update the form's onSubmit handler to use handleSubmit

  return (
    <div className="min-h-screen bg-neutral-950">
      <div className="mx-auto max-w-4xl px-4 py-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
        >
          <form onSubmit={handleSubmit} className="space-y-8">
            {/* Basic Information */}
            <Card className="border-neutral-700 bg-neutral-900/50">
              <CardHeader>
                <CardTitle className="text-white">Basic Information</CardTitle>
                <CardDescription>
                  Add basic information about your project
                </CardDescription>
              </CardHeader>
              <CardContent className="flex flex-col gap-6">
                <div className="grid grid-cols-2 gap-6 md:grid-cols-3">
                  <div className="space-y-2">
                    <label className="text-sm font-medium text-neutral-300">
                      Title <span className="text-red-500">*</span>
                    </label>
                    <Input
                      name="title"
                      value={formData.title}
                      onChange={handleInputChange}
                      placeholder="Project Title"
                      className="border-neutral-600 bg-neutral-800/50 text-white placeholder:text-neutral-500"
                      required
                    />
                  </div>

                  {/* Project Status */}
                  <div className="space-y-2">
                    <label className="text-sm font-medium text-neutral-300">
                      Status <span className="text-red-500">*</span>
                    </label>
                    <select
                      name="status"
                      value={formData.status}
                      onChange={handleInputChange}
                      className="w-full rounded-md border border-neutral-600 bg-neutral-800/50 px-3 py-2 text-white"
                    >
                      <option value="Development">Development</option>
                      <option value="Beta">Beta</option>
                      <option value="Live">Live</option>
                      <option value="Archived">Archived</option>
                    </select>
                  </div>

                  {/* Featured */}
                  <div className="flex items-center space-x-2">
                    <input
                      type="checkbox"
                      id="featured"
                      name="featured"
                      checked={formData.featured}
                      onChange={handleInputChange}
                      className="h-4 w-4 rounded border-neutral-600 bg-neutral-800/50 text-blue-500 focus:ring-blue-500"
                    />
                    <label
                      htmlFor="featured"
                      className="text-sm font-medium text-neutral-300"
                    >
                      Featured Project
                    </label>
                  </div>
                </div>

                <div>
                  <label className="mb-2 block text-sm font-medium text-neutral-300">
                    Short Description
                  </label>
                  <Textarea
                    name="description"
                    value={formData.description}
                    onChange={handleInputChange}
                    placeholder="Brief description of the project"
                    rows={3}
                    className="border-neutral-600 bg-neutral-800/50 text-white placeholder:text-neutral-500"
                    required
                  />
                </div>

                <div>
                  <label className="mb-2 block text-sm font-medium text-neutral-300">
                    Long Description
                  </label>
                  <TiptapEditor
                    content={formData.longDescription}
                    onChange={handleLongDescriptionChange}
                    placeholder="Write a detailed description of your project. You can use formatting, lists, links, and more..."
                    className="min-h-[300px]"
                  />
                  <p className="mt-2 text-xs text-neutral-500">
                    Use the toolbar to format your text. You can add bold,
                    italic, lists, quotes, and links.
                  </p>
                </div>
              </CardContent>
            </Card>

            {/* Project Details */}
            <Card className="border-neutral-700 bg-neutral-900/50">
              <CardHeader>
                <CardTitle className="text-white">Project Details</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid gap-4 md:grid-cols-3">
                  <div>
                    <label className="mb-2 block text-sm font-medium text-neutral-300">
                      Year
                    </label>
                    <Input
                      name="year"
                      value={formData.year}
                      onChange={handleInputChange}
                      placeholder="2024"
                      className="border-neutral-600 bg-neutral-800/50 text-white placeholder:text-neutral-500"
                    />
                  </div>
                  <div>
                    <label className="mb-2 block text-sm font-medium text-neutral-300">
                      Duration
                    </label>
                    <Input
                      name="duration"
                      value={formData.duration}
                      onChange={handleInputChange}
                      placeholder="3 months"
                      className="border-neutral-600 bg-neutral-800/50 text-white placeholder:text-neutral-500"
                    />
                  </div>
                </div>

                <div className="grid gap-4 md:grid-cols-2">
                  <div>
                    <label className="mb-2 block text-sm font-medium text-neutral-300">
                      Live URL
                    </label>
                    <Input
                      name="liveUrl"
                      value={formData.liveUrl}
                      onChange={handleInputChange}
                      placeholder="https://example.com"
                      className="border-neutral-600 bg-neutral-800/50 text-white placeholder:text-neutral-500"
                    />
                  </div>
                  <div>
                    <label className="mb-2 block text-sm font-medium text-neutral-300">
                      GitHub URL
                    </label>
                    <Input
                      name="githubUrl"
                      value={formData.githubUrl}
                      onChange={handleInputChange}
                      placeholder="https://github.com/username/repo"
                      className="border-neutral-600 bg-neutral-800/50 text-white placeholder:text-neutral-500"
                    />
                  </div>
                </div>

                <div>
                  <label className="mb-2 block text-sm font-medium text-neutral-300">
                    Project Image URL
                  </label>
                  <Input
                    name="image"
                    value={formData.image}
                    onChange={handleInputChange}
                    placeholder="https://example.com/image.jpg"
                    className="border-neutral-600 bg-neutral-800/50 text-white placeholder:text-neutral-500"
                  />
                </div>
              </CardContent>
            </Card>

            {/* Technologies */}
            <Card className="border-neutral-700 bg-neutral-900/50">
              <CardHeader>
                <CardTitle className="text-white">Technologies</CardTitle>
                <CardDescription>
                  Add the technologies used in this project
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex flex-wrap gap-2">
                  {technologies.map((tech) => (
                    <Badge
                      key={tech.id}
                      variant="secondary"
                      onClick={() => toggleTechnology(tech.id)}
                      className={cn(
                        'flex cursor-pointer items-center gap-1 bg-blue-500/20 text-blue-300',
                        formData.technologies.includes(tech.id)
                          ? 'bg-blue-400 text-white'
                          : ''
                      )}
                    >
                      {tech.name}{' '}
                      {formData.technologies.includes(tech.id) ? <X /> : null}
                    </Badge>
                  ))}
                </div>
              </CardContent>
            </Card>
            <Card className="border-neutral-700 bg-neutral-900/50">
              <CardHeader>
                <CardTitle className="text-white">Features</CardTitle>
                <CardDescription>
                  List the key features of this project
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <ul className="space-y-2">
                  {formData.features.map((feature, index) => (
                    <li key={feature} className="flex items-start gap-2">
                      <div className="mt-1 h-2 w-2 flex-shrink-0 rounded-full bg-blue-500" />
                      <span className="text-neutral-300">{feature}</span>
                      <button
                        type="button"
                        onClick={() => removeFromArray('features', index)}
                        className="ml-auto text-neutral-400 hover:text-white"
                      >
                        <X className="h-4 w-4" />
                      </button>
                    </li>
                  ))}
                </ul>
                <div className="flex gap-2">
                  <Input
                    value={newFeature}
                    onChange={(e) => setNewFeature(e.target.value)}
                    onKeyDown={(e) => {
                      if (e.key === 'Enter') {
                        e.preventDefault()
                        if (newFeature.trim()) {
                          addToArray('features', newFeature.trim())
                          setNewFeature('')
                        }
                      }
                    }}
                    placeholder="Add a feature (press Enter)"
                    className="flex-1 border-neutral-600 bg-neutral-800/50 text-white placeholder:text-neutral-500"
                  />
                  <Button
                    type="button"
                    onClick={() => {
                      if (newFeature.trim()) {
                        addToArray('features', newFeature.trim())
                        setNewFeature('')
                      }
                    }}
                    variant="outline"
                    className="border-blue-500/50 text-blue-400 hover:bg-blue-500/20 hover:text-blue-300"
                  >
                    Add
                  </Button>
                </div>
              </CardContent>
            </Card>

            <Card className="border-neutral-700 bg-neutral-900/50">
              <CardHeader>
                <CardTitle className="text-white">Challenges</CardTitle>
                <CardDescription>
                  List the key challenges of this project
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <ul className="space-y-2">
                  {formData.challenges.map((challenge, index) => (
                    <li key={challenge} className="flex items-start gap-2">
                      <div className="mt-1 h-2 w-2 flex-shrink-0 rounded-full bg-blue-500" />
                      <span className="text-neutral-300">{challenge}</span>
                      <button
                        type="button"
                        onClick={() => removeFromArray('challenges', index)}
                        className="ml-auto text-neutral-400 hover:text-white"
                      >
                        <X className="h-4 w-4" />
                      </button>
                    </li>
                  ))}
                </ul>
                <div className="flex gap-2">
                  <Input
                    value={newChallenge}
                    onChange={(e) => setNewChallenge(e.target.value)}
                    onKeyDown={(e) => {
                      if (e.key === 'Enter') {
                        e.preventDefault()
                        if (newChallenge.trim()) {
                          addToArray('challenges', newChallenge.trim())
                          setNewChallenge('')
                        }
                      }
                    }}
                    placeholder="Add a challenge (press Enter)"
                    className="flex-1 border-neutral-600 bg-neutral-800/50 text-white placeholder:text-neutral-500"
                  />
                  <Button
                    type="button"
                    onClick={() => {
                      if (newChallenge.trim()) {
                        addToArray('challenges', newChallenge.trim())
                        setNewChallenge('')
                      }
                    }}
                    variant="outline"
                    className="border-blue-500/50 text-blue-400 hover:bg-blue-500/20 hover:text-blue-300"
                  >
                    Add
                  </Button>
                </div>
              </CardContent>
            </Card>

            <div className="flex justify-end gap-4">
              <Button
                type="button"
                variant="outline"
                className="border-neutral-600 text-neutral-300"
                asChild
              >
                <Link href="/admin/projects">Cancel</Link>
              </Button>
              <Button
                type="submit"
                className="bg-white text-black hover:bg-neutral-200"
              >
                <Save className="mr-2 h-4 w-4" />
                Update Project
              </Button>
            </div>
          </form>
        </motion.div>
      </div>
    </div>
  )
}
