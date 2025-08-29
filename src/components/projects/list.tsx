'use client'

import { motion } from 'framer-motion'
import Link from 'next/link'
import Image from 'next/image'
import { Card, CardContent, CardHeader, CardTitle } from '~/components/ui/card'
import { Badge } from '~/components/ui/badge'
import { Button } from '~/components/ui/button'
import { ExternalLink } from 'lucide-react'
import FeaturedProjectsCarousel from '~/components/featured-projects-carousel'
import type { RouterOutputs } from '~/trpc/react'

export default function ProjectsList({
  projects,
  featuredProjects,
}: {
  projects: RouterOutputs['projects']['getAllProjects']
  featuredProjects: RouterOutputs['projects']['getProjectsByFeatured']
}) {
  return (
    <div className="min-h-screen bg-neutral-950">
      {/* Hero Section */}
      <section className="px-4 py-20">
        <div className="mx-auto max-w-6xl">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className="mb-16 text-center"
          >
            <h1 className="mb-6 text-5xl font-bold text-white md:text-6xl">
              My Projects
            </h1>
            <p className="mx-auto max-w-3xl text-xl text-neutral-400">
              A collection of projects I&apos;ve worked on, from full-stack
              applications to creative experiments. Each project represents a
              unique challenge and learning experience.
            </p>
          </motion.div>
        </div>
      </section>

      {/* Featured Projects Carousel */}
      <section className="px-4 py-16">
        <div className="mx-auto max-w-6xl">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            viewport={{ once: true }}
            className="mb-12"
          >
            <h2 className="mb-4 text-3xl font-bold text-white md:text-4xl">
              Featured Projects
            </h2>
            <p className="text-lg text-neutral-400">
              Highlighting my most impactful and comprehensive work
            </p>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 40 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.2 }}
            viewport={{ once: true }}
          >
            <FeaturedProjectsCarousel projects={featuredProjects} />
          </motion.div>
        </div>
      </section>

      {/* Other Projects */}
      <section className="px-4 py-16">
        <div className="mx-auto max-w-6xl">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            viewport={{ once: true }}
            className="mb-12"
          >
            <h2 className="mb-4 text-3xl font-bold text-white md:text-4xl">
              Other Projects
            </h2>
            <p className="text-lg text-neutral-400">
              Additional projects and experiments
            </p>
          </motion.div>

          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            {projects.map((project, index) => (
              <motion.div
                key={project.id}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8, delay: index * 0.1 }}
                viewport={{ once: true }}
              >
                <Card className="group h-full overflow-hidden border-neutral-700 bg-neutral-900/50 transition-all duration-300 hover:border-neutral-500">
                  <div className="relative overflow-hidden">
                    <Image
                      src={project.image?.url || '/placeholder.svg'}
                      alt={project.title}
                      width={500}
                      height={300}
                      className="h-48 w-full object-cover transition-transform duration-300 group-hover:scale-105"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-neutral-950/60 to-transparent opacity-0 transition-opacity duration-300 group-hover:opacity-100" />
                  </div>

                  <CardHeader>
                    <div className="flex items-center justify-between">
                      <CardTitle className="text-lg text-white">
                        {project.title}
                      </CardTitle>
                      <Badge
                        variant="outline"
                        className="border-neutral-600 text-xs text-neutral-300"
                      >
                        {project.status}
                      </Badge>
                    </div>
                  </CardHeader>

                  <CardContent className="space-y-4">
                    <p className="text-sm leading-relaxed text-neutral-400">
                      {project.description}
                    </p>

                    <div className="flex flex-wrap gap-1">
                      {project.projectTechnologies.slice(0, 3).map((tech) => (
                        <Badge
                          key={`${tech.technology.id}-${tech.projectId}`}
                          variant="secondary"
                          className="border-neutral-600 bg-neutral-800 text-xs text-neutral-200"
                        >
                          {tech.technology.name}
                        </Badge>
                      ))}
                      {project.projectTechnologies.length > 3 && (
                        <Badge
                          variant="secondary"
                          className="border-neutral-600 bg-neutral-800 text-xs text-neutral-200"
                        >
                          +{project.projectTechnologies.length - 3}
                        </Badge>
                      )}
                    </div>

                    <div className="flex items-center gap-3 text-xs text-neutral-500">
                      <span>{project.year}</span>
                      <span>•</span>
                    </div>

                    <div className="flex gap-2 pt-2">
                      <Button
                        size="sm"
                        className="flex-1 bg-white text-xs text-black hover:bg-neutral-200"
                        asChild
                      >
                        <Link href={`/projects/${project.id}`}>Details</Link>
                      </Button>
                      {project.liveUrl && (
                        <Button
                          size="sm"
                          variant="outline"
                          className="border-neutral-600 text-neutral-300 hover:bg-neutral-800"
                          asChild
                        >
                          <a
                            href={project.liveUrl}
                            target="_blank"
                            rel="noopener noreferrer"
                          >
                            <ExternalLink className="h-3 w-3" />
                          </a>
                        </Button>
                      )}
                    </div>
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </div>
        </div>
      </section>
    </div>
  )
}
