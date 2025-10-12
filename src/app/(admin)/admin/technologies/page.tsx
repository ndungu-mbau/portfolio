'use client'

import { motion } from 'framer-motion'
import { useState } from 'react'
import { toast } from 'sonner'
import { UploadDropzone } from '~/lib/uploadthing'

import { Button } from '~/components/ui/button'
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '~/components/ui/card'
import {
  Drawer,
  DrawerClose,
  DrawerContent,
  DrawerDescription,
  DrawerFooter,
  DrawerHeader,
  DrawerTitle,
} from '~/components/ui/drawer'
import { Input } from '~/components/ui/input'
import { Label } from '~/components/ui/label'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
} from '~/components/ui/select'
import { Skeleton } from '~/components/ui/skeleton'
import { api } from '~/trpc/react'
import {
  Code,
  Cloud,
  Database,
  Edit2,
  Plus,
  Server,
  Trash2,
  Wrench,
} from 'lucide-react'
import Image from 'next/image'

export default function AdminTechnologiesPage() {
  const [searchTerm, setSearchTerm] = useState('')
  const [categoryFilter, setCategoryFilter] = useState('All')
  const [newTech, setNewTech] = useState({
    name: '',
    category: 'Frontend',
    url: '',
    github: '',
    image: '',
  })
  const [imageUrl, setImageUrl] = useState<string | null>(null)
  const [open, setOpen] = useState(false)

  // Fetch technologies using TRPC
  const { data: technologies = [], isLoading } =
    api.technologies.getAllTechnologies.useQuery()

  const filteredTechnologies = technologies.filter((tech) => {
    const matchesSearch = tech.name
      .toLowerCase()
      .includes(searchTerm.toLowerCase())
    const matchesCategory =
      categoryFilter === 'All' || tech.category === categoryFilter
    return matchesSearch && matchesCategory
  })

  const utils = api.useUtils()

  const { mutate: createTech } = api.technologies.createTechnology.useMutation({
    onSuccess: () => {
      setNewTech({
        name: '',
        category: 'Frontend',
        url: '',
        github: '',
        image: '',
      })
      setImageUrl(null)
      setOpen(false)
      void utils.technologies.invalidate()
      toast.success('Technology created successfully')
    },
    onError: (error) => {
      console.error('Error creating technology:', error)
      toast.error('Error creating technology')
    },
  })

  const { mutate: deleteTech } = api.technologies.deleteTechnology.useMutation({
    onSuccess: () => {
      void utils.technologies.invalidate()
      toast.success('Technology deleted successfully')
    },
    onError: (error) => {
      console.error('Error deleting technology:', error)
      toast.error('Error deleting technology')
    },
  })

  if (isLoading) {
    return (
      <div className="min-h-screen bg-neutral-950 p-8">
        <div className="mx-auto max-w-6xl">
          <div className="mb-8 flex items-center justify-between">
            <Skeleton className="h-12 w-64" />
            <Skeleton className="h-10 w-40" />
          </div>
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
            {Array.from({ length: 6 }).map((_, i) => (
              <Skeleton key={i} className="h-32 w-full rounded-lg" />
            ))}
          </div>
        </div>
      </div>
    )
  }

  const handleAddTechnology = (e: React.FormEvent) => {
    e.preventDefault()
    if (newTech.name.trim()) {
      createTech({
        name: newTech.name,
        category: newTech.category as
          | 'Frontend'
          | 'Backend'
          | 'Database'
          | 'Cloud'
          | 'DevOps',
        url: newTech.url,
        github: newTech.github,
        image: newTech.image ?? '',
      })
    }
  }

  const handleDeleteTechnology = (id: string) => {
    if (confirm('Are you sure you want to delete this technology?')) {
      deleteTech({ id })
    }
  }

  const getIconForCategory = (category: string) => {
    switch (category) {
      case 'Frontend':
        return Code
      case 'Backend':
        return Server
      case 'Database':
        return Database
      case 'Cloud':
        return Cloud
      case 'DevOps':
        return Wrench
      default:
        return Code
    }
  }

  return (
    <div className="min-h-screen bg-neutral-950 p-8">
      <div className="mx-auto max-w-6xl">
        <div className="mb-8 flex flex-col justify-between gap-4 md:flex-row md:items-center">
          <div>
            <h1 className="text-3xl font-bold text-white">Technologies</h1>
            <p className="text-neutral-400">
              View and manage your technology stack
            </p>
          </div>
          <Button
            className="bg-white text-black hover:bg-neutral-200"
            onClick={() => setOpen(true)}
          >
            <Plus className="mr-2 h-4 w-4" />
            Add Technology
          </Button>
        </div>

        {/* Add Technology Drawer */}
        <Drawer open={open} onOpenChange={setOpen} direction="right">
          <DrawerContent className="border-neutral-700 bg-neutral-900">
            <div className="mx-auto w-full max-w-sm">
              <DrawerHeader>
                <DrawerTitle className="text-white">
                  Add New Technology
                </DrawerTitle>
                <DrawerDescription className="text-neutral-400">
                  Add a new technology to your stack
                </DrawerDescription>
              </DrawerHeader>
              <form onSubmit={handleAddTechnology} className="p-4 pb-0">
                <div className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="tech-name" className="text-white">
                      Technology Name
                    </Label>
                    <Input
                      id="tech-name"
                      placeholder="e.g. React, Node.js, etc."
                      value={newTech.name}
                      onChange={(e) =>
                        setNewTech({ ...newTech, name: e.target.value })
                      }
                      className="border-neutral-600 bg-neutral-800/50 text-white placeholder:text-neutral-500"
                      required
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="tech-category" className="text-white">
                      Category
                    </Label>
                    <Select
                      value={newTech.category}
                      onValueChange={(v: string) =>
                        setNewTech({ ...newTech, category: v })
                      }
                    >
                      <SelectTrigger className="h-10 w-full rounded-md px-3 py-2 text-sm text-white placeholder:text-neutral-500 focus:ring-2 focus:ring-neutral-400 focus:ring-offset-2 focus:outline-none disabled:cursor-not-allowed disabled:opacity-50">
                        <span>{newTech.category ?? 'Select a category'}</span>
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="Frontend">Frontend</SelectItem>
                        <SelectItem value="Backend">Backend</SelectItem>
                        <SelectItem value="Database">Database</SelectItem>
                        <SelectItem value="Cloud">Cloud</SelectItem>
                        <SelectItem value="DevOps">DevOps</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="tech-url" className="text-white">
                      URL
                    </Label>
                    <Input
                      id="tech-url"
                      placeholder="https://example.com"
                      value={newTech.url}
                      onChange={(e) =>
                        setNewTech({ ...newTech, url: e.target.value })
                      }
                      className="border-neutral-600 bg-neutral-800/50 text-white placeholder:text-neutral-500"
                      required
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="tech-github" className="text-white">
                      GitHub
                    </Label>
                    <Input
                      id="tech-github"
                      placeholder="https://github.com/username/repo"
                      value={newTech.github}
                      onChange={(e) =>
                        setNewTech({ ...newTech, github: e.target.value })
                      }
                      className="border-neutral-600 bg-neutral-800/50 text-white placeholder:text-neutral-500"
                      required
                    />
                  </div>
                  <div className="space-y-2">
                    <Label className="text-white">Technology Logo</Label>
                    {imageUrl ? (
                      <div className="mt-2">
                        <div className="flex items-center justify-between">
                          <Image
                            src={imageUrl}
                            alt="Uploaded logo"
                            className="h-16 w-16 object-contain"
                            height={480}
                            width={600}
                          />
                          <Button
                            type="button"
                            variant="ghost"
                            size="sm"
                            onClick={() => setImageUrl(null)}
                            className="text-red-500 hover:text-red-600"
                          >
                            Change
                          </Button>
                        </div>
                      </div>
                    ) : (
                      <UploadDropzone
                        endpoint="imageUploader"
                        onClientUploadComplete={([res]) => {
                          console.log({ res })
                          if (res?.url) {
                            setImageUrl(res.url)
                            setNewTech({
                              ...newTech,
                              // eslint-disable-next-line @typescript-eslint/no-unsafe-member-access
                              image: res?.serverData?.file?.id as string,
                            })
                            toast.success('Image uploaded successfully!')
                          }
                        }}
                        onUploadError={(error: Error) => {
                          console.error(error)
                          toast.error('Error uploading image')
                        }}
                        className="ut-button:bg-white ut-button:text-black ut-button:hover:bg-neutral-200 ut-button:ut-uploading:bg-white/50"
                      />
                    )}
                  </div>
                </div>
                <DrawerFooter className="px-0">
                  <Button type="submit" variant="success">
                    Add Technology
                  </Button>
                  <DrawerClose asChild>
                    <Button variant="default">Cancel</Button>
                  </DrawerClose>
                </DrawerFooter>
              </form>
            </div>
          </DrawerContent>
        </Drawer>

        {/* Search and Filter */}
        <div className="mb-8 grid gap-4 md:grid-cols-2">
          <div>
            <Label htmlFor="search" className="mb-2 block text-white">
              Search Technologies
            </Label>
            <Input
              id="search"
              type="text"
              placeholder="Search technologies..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="border-neutral-600 bg-neutral-800/50 text-white placeholder:text-neutral-500"
            />
          </div>
          <div>
            <Label htmlFor="category" className="mb-2 block text-white">
              Filter by Category
            </Label>
            <select
              id="category"
              value={categoryFilter}
              onChange={(e) => setCategoryFilter(e.target.value)}
              className="flex h-10 w-full rounded-md border border-neutral-600 bg-neutral-800/50 px-3 py-2 text-sm text-white placeholder:text-neutral-500 focus:ring-2 focus:ring-neutral-400 focus:ring-offset-2 focus:outline-none disabled:cursor-not-allowed disabled:opacity-50"
            >
              <option value="All">All Categories</option>
              <option value="Frontend">Frontend</option>
              <option value="Backend">Backend</option>
              <option value="Database">Database</option>
              <option value="Cloud">Cloud</option>
              <option value="DevOps">DevOps</option>
            </select>
          </div>
        </div>

        {/* Technologies Grid */}
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
          {filteredTechnologies.map((tech, index) => {
            const IconComponent = getIconForCategory(tech.category)
            return (
              <motion.div
                key={tech.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 }}
              >
                <Card className="border-neutral-800 bg-neutral-900/50 transition-colors hover:bg-neutral-800/50">
                  <CardHeader className="pb-2">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center space-x-3">
                        {tech.image ? (
                          <Image
                            src={tech.image.url}
                            alt={tech.name}
                            className="h-8 w-8 object-contain"
                            height={480}
                            width={600}
                          />
                        ) : (
                          <IconComponent className="h-8 w-8 text-neutral-400" />
                        )}
                        <CardTitle className="text-white">
                          {tech.name}
                        </CardTitle>
                      </div>
                      <div className="flex space-x-1">
                        <Button
                          variant="ghost"
                          size="icon"
                          className="h-8 w-8 text-neutral-400 hover:bg-neutral-700 hover:text-white"
                        >
                          <Edit2 className="h-4 w-4" />
                        </Button>
                        <Button
                          variant="ghost"
                          size="icon"
                          className="h-8 w-8 text-red-500 hover:bg-red-500/10 hover:text-red-400"
                          onClick={() => handleDeleteTechnology(tech.id)}
                        >
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </div>
                    </div>
                    <CardDescription className="text-neutral-400">
                      {tech.category}
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="flex items-center justify-between">
                      <div className="flex space-x-2">
                        {tech.url && (
                          <a
                            href={tech.url}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="text-sm text-blue-400 hover:underline"
                          >
                            Website
                          </a>
                        )}
                        {tech.github && (
                          <a
                            href={tech.github}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="text-sm text-neutral-400 hover:underline"
                          >
                            GitHub
                          </a>
                        )}
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </motion.div>
            )
          })}
        </div>
      </div>
    </div>
  )
}
