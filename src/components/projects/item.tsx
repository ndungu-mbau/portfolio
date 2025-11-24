'use client'

import { motion } from 'framer-motion'
import Link from 'next/link'
import ReactMarkdown from 'react-markdown'
import remarkGfm from 'remark-gfm'
import { Button } from '~/components/ui/button'
import { ArrowLeft } from 'lucide-react'
import type { RouterOutputs } from '~/trpc/react'
import { ImageCarousel } from './image-carousel'
import { ProjectSidebar } from './project-sidebar'
import { FeaturesChallenges } from './features-challenges'

export default function ProjectDetail({
  project,
}: {
  project: RouterOutputs['projects']['getProjectById']
}) {
  if (!project) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-neutral-950">
        <div className="text-center">
          <h1 className="mb-4 text-4xl font-bold text-white">
            Project Not Found
          </h1>
          <p className="mb-8 text-neutral-400">
            The project you&apos;re looking for doesn&apos;t exist.
          </p>
          <Button asChild>
            <Link href="/projects">
              <ArrowLeft className="mr-2 h-4 w-4" />
              Back to Projects
            </Link>
          </Button>
        </div>
      </div>
    )
  }

  // Prepare gallery images
  const galleryImages = [
    { url: project.image.url, id: project.image.id },
    ...(project.gallery?.map((img) => ({ url: img.url, id: img.id })) ?? []),
  ]

  return (
    <div className="min-h-screen bg-neutral-950">
      <div className="mx-auto max-w-7xl px-4 py-8">
        {/* Back Button */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          <Button
            variant="ghost"
            className="mb-6 text-neutral-400 hover:text-white"
            asChild
          >
            <Link href="/projects">
              <ArrowLeft className="mr-2 h-4 w-4" />
              Back to Projects
            </Link>
          </Button>
        </motion.div>

        {/* Image Carousel */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.1 }}
          className="mb-8"
        >
          <ImageCarousel images={galleryImages} projectId={project.id} />
        </motion.div>

        {/* Title and Short Description */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.2 }}
          className="mb-8"
        >
          <h1 className="mb-4 text-4xl font-bold text-white md:text-5xl">
            {project.title}
          </h1>
          <p className="text-xl text-neutral-400">{project.description}</p>
        </motion.div>

        {/* Main Content: 3:1 Split */}
        <div className="container">
          <div className="grid gap-8 lg:grid-cols-4">
            {/* Sidebar - Shows first on mobile, right on desktop */}
            <motion.aside
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.6, delay: 0.3 }}
              className="order-first lg:order-last lg:col-span-1"
            >
              <div className="lg:sticky lg:top-8">
                <ProjectSidebar project={project} />
              </div>
            </motion.aside>
    
            {/* Main Content */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.4 }}
              className="order-last lg:order-first lg:col-span-3"
            >
              <div className="space-y-8">
                {/* Long Description */}
                <div className="prose prose-invert prose-lg prose-p:leading-relaxed prose-headings:text-white prose-ul:list-disc prose-ol:list-decimal prose-li:my-1 prose-a:text-blue-400 hover:prose-a:text-blue-300 prose-code:rounded-md prose-code:bg-neutral-800 prose-code:px-1.5 prose-code:py-0.5 prose-code:before:content-[''] prose-code:after:content-[''] max-w-none text-neutral-300">
                  <ReactMarkdown remarkPlugins={[remarkGfm]}>
                    {project.longDescription || ''}
                  </ReactMarkdown>
                </div>
    
                {/* Features and Challenges */}
                <FeaturesChallenges
                  features={project.features}
                  challenges={project.challenges}
                />
              </div>
            </motion.div>
          </div>
        </div>
      </div>
    </div>
  )
}
