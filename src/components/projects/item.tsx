/* eslint-disable @typescript-eslint/no-unsafe-assignment */
'use client'

import { motion } from 'framer-motion'
import Image from 'next/image'
import Link from 'next/link'
import ReactMarkdown from 'react-markdown'
import remarkGfm from 'remark-gfm'
import { Card, CardContent, CardHeader, CardTitle } from '~/components/ui/card'
import { Badge } from '~/components/ui/badge'
import { Button } from '~/components/ui/button'
import {
  ArrowLeft,
  ExternalLink,
  Github,
  Calendar,
  Clock,
  CheckCircle,
} from 'lucide-react'
import type { RouterOutputs } from '~/trpc/react'

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

  return (
    <div className="min-h-screen bg-neutral-950">
      {/* Hero Section */}
      <section className="px-4 py-12">
        <div className="mx-auto max-w-6xl">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
          >
            <Button
              variant="ghost"
              className="mb-8 text-neutral-400 hover:text-white"
              asChild
            >
              <Link href="/projects">
                <ArrowLeft className="mr-2 h-4 w-4" />
                Back to Projects
              </Link>
            </Button>

            <div className="grid items-center gap-12 lg:grid-cols-2">
              <div>
                <div className="mb-4 flex items-center gap-3">
                  <h1 className="text-4xl font-bold text-white md:text-5xl">
                    {project.title}
                  </h1>
                  <Badge className="bg-white font-medium text-black">
                    {project.status}
                  </Badge>
                </div>

                <div className="prose prose-invert prose-p:my-4 prose-p:text-xl prose-p:leading-relaxed prose-headings:mb-4 prose-headings:mt-8 prose-headings:text-white prose-ul:list-disc prose-ol:list-decimal prose-li:my-1 prose-a:text-blue-400 hover:prose-a:text-blue-300 prose-code:rounded-md prose-code:bg-neutral-800 prose-code:px-1.5 prose-code:py-0.5 prose-code:before:content-[''] prose-code:after:content-[''] mb-8 max-w-none text-neutral-400">
                  <ReactMarkdown remarkPlugins={[remarkGfm]}>
                    {project.longDescription || ''}
                  </ReactMarkdown>
                </div>

                <div className="mb-8 flex flex-wrap gap-4">
                  <div className="flex items-center gap-2 text-neutral-300">
                    <Calendar size={18} />
                    <span>{project.year}</span>
                  </div>
                  <div className="flex items-center gap-2 text-neutral-300">
                    <Clock size={18} />
                    <span>{project.duration}</span>
                  </div>
                </div>

                <div className="flex gap-4">
                  {project.liveUrl && (
                    <Button
                      className="bg-white text-black hover:bg-neutral-200"
                      asChild
                    >
                      <a
                        href={project.liveUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                      >
                        <ExternalLink className="mr-2 h-4 w-4" />
                        View Live
                      </a>
                    </Button>
                  )}
                  <Button
                    variant="outline"
                    className="border-neutral-600 text-neutral-300 hover:bg-neutral-800"
                    asChild
                  >
                    <a
                      href={project.githubUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                    >
                      <Github className="mr-2 h-4 w-4" />
                      View Code
                    </a>
                  </Button>
                </div>
              </div>

              <div className="relative">
                <Image
                  src={project.image.url || '/placeholder.svg'}
                  alt={project.title}
                  width={800}
                  height={500}
                  className="rounded-2xl border border-neutral-700 dark:border-neutral-800"
                />
              </div>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Technologies */}
      <section className="px-4 py-16">
        <div className="mx-auto max-w-6xl">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            viewport={{ once: true }}
          >
            <h2 className="mb-8 text-3xl font-bold text-white">
              Technologies Used
            </h2>
            <div className="flex flex-wrap gap-3">
              {project.projectTechnologies.map((tech, index) => (
                <motion.div
                  key={`${tech.technologyId}-${tech.projectId}`}
                  initial={{ opacity: 0, scale: 0.8 }}
                  whileInView={{ opacity: 1, scale: 1 }}
                  transition={{ duration: 0.5, delay: index * 0.1 }}
                  viewport={{ once: true }}
                >
                  <Badge
                    variant="secondary"
                    className="border-neutral-600 bg-neutral-800 px-4 py-2 text-sm font-medium text-neutral-200"
                  >
                    {tech.technology.name}
                  </Badge>
                </motion.div>
              ))}
            </div>
          </motion.div>
        </div>
      </section>

      {/* Features and Challenges */}
      <section className="px-4 py-16">
        <div className="mx-auto max-w-6xl">
          <div className="grid gap-12 lg:grid-cols-2">
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              whileInView={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.8 }}
              viewport={{ once: true }}
            >
              <Card className="h-full border-neutral-700 bg-neutral-900/50">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2 text-2xl text-white">
                    <CheckCircle className="text-green-400" size={24} />
                    Key Features
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <ul className="space-y-3">
                    {project.features.map((feature, index) => (
                      <motion.li
                        key={index}
                        initial={{ opacity: 0, x: -10 }}
                        whileInView={{ opacity: 1, x: 0 }}
                        transition={{ duration: 0.5, delay: index * 0.1 }}
                        viewport={{ once: true }}
                        className="flex items-start gap-3 text-neutral-300"
                      >
                        <div className="mt-2 h-2 w-2 flex-shrink-0 rounded-full bg-neutral-400" />
                        <span>{feature.text}</span>
                      </motion.li>
                    ))}
                  </ul>
                </CardContent>
              </Card>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, x: 20 }}
              whileInView={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.8 }}
              viewport={{ once: true }}
            >
              <Card className="h-full border-neutral-700 bg-neutral-900/50">
                <CardHeader>
                  <CardTitle className="text-2xl text-white">
                    Technical Challenges
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <ul className="space-y-4">
                    {project.challenges.map((challenge, index) => (
                      <motion.li
                        key={index}
                        initial={{ opacity: 0, x: 10 }}
                        whileInView={{ opacity: 1, x: 0 }}
                        transition={{ duration: 0.5, delay: index * 0.1 }}
                        viewport={{ once: true }}
                        className="leading-relaxed text-neutral-300"
                      >
                        {challenge.text}
                      </motion.li>
                    ))}
                  </ul>
                </CardContent>
              </Card>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Gallery */}
      {project.gallery && project.gallery.length > 0 && (
        <section className="px-4 py-16">
          <div className="mx-auto max-w-6xl">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8 }}
              viewport={{ once: true }}
            >
              <h2 className="mb-8 text-3xl font-bold text-white">
                Project Gallery
              </h2>
              <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
                {project.gallery.map((galleryImage, index) => (
                  <motion.div
                    key={index}
                    initial={{ opacity: 0, scale: 0.9 }}
                    whileInView={{ opacity: 1, scale: 1 }}
                    transition={{ duration: 0.5, delay: index * 0.1 }}
                    viewport={{ once: true }}
                    className="group relative cursor-pointer"
                  >
                    <Image
                      src={galleryImage.url ?? '/placeholder.svg'}
                      alt={`${project.title} screenshot ${index + 1}`}
                      width={600}
                      height={400}
                      className="rounded-lg border border-neutral-700 transition-colors group-hover:border-neutral-500 dark:border-neutral-800"
                    />
                  </motion.div>
                ))}
              </div>
            </motion.div>
          </div>
        </section>
      )}
    </div>
  )
}
