'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import Image from 'next/image'
import { toast } from 'sonner'
import { motion } from 'framer-motion'

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
import { api, type RouterOutputs } from '~/trpc/react'
import { cn } from '~/lib/utils'
import { Save, Upload, X } from 'lucide-react'
import { Textarea } from '../ui/textarea'
import { GalleryUpload } from './gallery-upload'
import { UploadButton } from '~/lib/uploadthing'
import { Label } from '../ui/label'
import { Select, SelectTrigger, SelectContent, SelectItem } from '../ui/select'

// Type for the project form data
interface ProjectFormData {
  title: string
  description: string
  longDescription: string
  image: string | undefined
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

export default function NewProjectPage({
  technologies,
}: {
  technologies: RouterOutputs['technologies']['getAllTechnologies']
}) {
  const router = useRouter()
  const utils = api.useUtils()

  // State for new items being added to arrays
  const [newFeature, setNewFeature] = useState('')
  const [newChallenge, setNewChallenge] = useState('')

  // Form state
  const [formData, setFormData] = useState<ProjectFormData>({
    title: '',
    description: '',
    longDescription: '',
    image: '',
    liveUrl: '',
    githubUrl: '',
    status: 'Development',
    featured: false,
    technologies: [],
    features: [],
    challenges: [],
    duration: '',
    year: new Date().getFullYear().toString(),
    gallery: [],
  })

  // Input change handler
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

  // Toggle technology selection
  const toggleTechnology = (techId: string) => {
    setFormData((prev) => ({
      ...prev,
      technologies: prev.technologies.includes(techId)
        ? prev.technologies.filter((id) => id !== techId)
        : [...prev.technologies, techId],
    }))
  }

  // Handle array field changes (technologies, features, etc.)
  const addToArray = (
    field: keyof Pick<ProjectFormData, 'features' | 'challenges' | 'gallery'>,
    value: string
  ) => {
    if (value.trim()) {
      setFormData((prev) => ({
        ...prev,
        [field]: [...prev[field], value.trim()],
      }))
    }
  }

  const removeFromArray = (
    field: keyof Pick<
      ProjectFormData,
      'technologies' | 'features' | 'challenges' | 'gallery'
    >,
    index: number
  ) => {
    setFormData((prev) => ({
      ...prev,
      [field]: prev[field].filter((_, i) => i !== index),
    }))
  }

  // Create project mutation
  const { mutate: createProject } = api.projects.createProject.useMutation({
    onSuccess: () => {
      toast.success('Project created successfully')
      void utils.projects.invalidate()
      router.push('/admin/projects')
    },
    onError: (error) => {
      toast.error('Failed to create project')
      console.error('Error creating project:', error)
    },
  })

  // Handle form submission
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    try {
      if (formData.features.length === 0) {
        toast.error('Please add at least one feature')
        return
      }

      const submissionData = {
        ...formData,
        features: formData.features.map((text) => ({ text })),
        challenges: formData.challenges.map((challenge) => ({
          text: challenge,
        })),
      }

      createProject({ ...submissionData, image: submissionData.image ?? '' })
    } catch (error) {
      console.error('Error creating project:', error)
      toast.error('Failed to create project')
    }
  }

  // Handle long description change for TipTap editor
  const handleLongDescriptionChange = (content: string) => {
    setFormData((prev) => ({
      ...prev,
      longDescription: content,
    }))
  }

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
                    <Label htmlFor="status" className="text-white">
                      Category
                    </Label>
                    <Select
                      name="status"
                      value={formData.status}
                      onValueChange={(value: string) =>
                        setFormData({
                          ...formData,
                          status: value as ProjectFormData['status'],
                        })
                      }
                    >
                      <SelectTrigger className="h-10 w-full rounded-md px-3 py-2 text-sm text-white placeholder:text-neutral-500 focus:ring-2 focus:ring-neutral-400 focus:ring-offset-2 focus:outline-none disabled:cursor-not-allowed disabled:opacity-50">
                        <span>{formData.status ?? 'Select a status'}</span>
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="Development">Development</SelectItem>
                        <SelectItem value="Beta">Beta</SelectItem>
                        <SelectItem value="Live">Live</SelectItem>
                        <SelectItem value="Archived">Archived</SelectItem>
                      </SelectContent>
                    </Select>
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

                <div className="space-y-2">
                  <label className="block text-sm font-medium text-neutral-300">
                    Project Image
                  </label>
                  {formData.image ? (
                    <div className="relative">
                      <div className="relative h-40 w-full overflow-hidden rounded-lg border border-neutral-700">
                        <Image
                          src={formData.image}
                          alt="Project preview"
                          fill
                          className="object-cover transition-transform duration-300 group-hover:scale-105"
                          sizes="160px"
                          height={500}
                          width={800}
                        />
                        <button
                          type="button"
                          onClick={() =>
                            setFormData((prev) => ({ ...prev, image: '' }))
                          }
                          className="absolute top-2 right-2 rounded-full bg-red-600 p-1 text-white hover:bg-red-700"
                        >
                          <X className="h-4 w-4" />
                        </button>
                      </div>
                    </div>
                  ) : (
                    <div className="flex flex-col items-center justify-center rounded-lg border-2 border-dashed border-neutral-600 bg-neutral-800/50 p-8 text-center transition-colors hover:border-blue-500 hover:bg-neutral-800/70">
                      <Upload className="mb-3 h-8 w-8 text-neutral-400" />
                      <p className="mb-1 text-sm font-medium text-neutral-300">
                        Upload Project Image
                      </p>
                      <p className="mb-3 text-xs text-neutral-500">
                        PNG, JPG, GIF up to 4MB
                      </p>
                      <UploadButton
                        endpoint="imageUploader"
                        onClientUploadComplete={(res) => {
                          if (res?.[0]?.url) {
                            setFormData((prev) => ({
                              ...prev,
                              image:
                                // eslint-disable-next-line @typescript-eslint/no-unsafe-member-access,
                                (res?.[0]?.serverData?.file?.id as string) ??
                                '',
                            }))
                            toast.success('Image uploaded successfully')
                          }
                        }}
                        onUploadError={(error: Error) => {
                          console.error('Upload Error:', error)
                          toast.error('Upload failed', {
                            description: error.message,
                          })
                        }}
                        className="ut-button:bg-blue-600 ut-button:ut-readying:bg-blue-600/50 ut-button:ut-uploading:bg-blue-600/50"
                        content={{
                          button: 'Select Image',
                          allowedContent: '',
                        }}
                      />
                    </div>
                  )}
                </div>

                <div className="space-y-2">
                  <label className="block text-sm font-medium text-neutral-300">
                    Gallery Images
                  </label>
                  <GalleryUpload
                    onUploadComplete={(upload) =>
                      setFormData((prev) => ({
                        ...prev,
                        gallery: [...prev.gallery, upload.id],
                      }))
                    }
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
                Create Project
              </Button>
            </div>
          </form>
        </motion.div>
      </div>
    </div>
  )
}
