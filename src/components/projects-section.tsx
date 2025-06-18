'use client'

import { motion } from 'framer-motion'
import { Card, CardContent, CardHeader, CardTitle } from '~/components/ui/card'
import { Button } from '~/components/ui/button'
import { Badge } from '~/components/ui/badge'
import { ExternalLink, Github } from 'lucide-react'
import Image from 'next/image'

export default function Projects() {
  const projects = [
    {
      title: 'E-Commerce Platform',
      description:
        'A full-stack e-commerce solution with React, Node.js, and Stripe integration. Features include user authentication, product management, order processing.',
      image: '/placeholder.svg?height=300&width=500',
      technologies: ['React', 'Node.js', 'MongoDB', 'Stripe'],
      liveUrl: '#',
      githubUrl: '#',
    },
    {
      title: 'Task Management App',
      description:
        'A collaborative task management application built with Next.js and real-time updates using Socket.io. Includes team collaboration features.',
      image: '/placeholder.svg?height=300&width=500',
      technologies: ['Next.js', 'Socket.io', 'PostgreSQL', 'Tailwind'],
      liveUrl: '#',
      githubUrl: '#',
    },
    {
      title: 'Weather Dashboard',
      description:
        'A beautiful weather dashboard with location-based forecasts, interactive maps, and detailed analytics using modern APIs.',
      image: '/placeholder.svg?height=300&width=500',
      technologies: ['Vue.js', 'Chart.js', 'Weather API', 'CSS3'],
      liveUrl: '#',
      githubUrl: '#',
    },
  ]

  return (
    <section id="projects" className="bg-neutral-950 px-4 py-20">
      <div className="mx-auto max-w-6xl">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          viewport={{ once: true }}
          className="mb-16 text-center"
        >
          <h2 className="mb-6 text-4xl font-bold text-white md:text-5xl">
            Featured Projects
          </h2>
          <p className="mx-auto max-w-3xl text-xl text-neutral-400">
            Here are some of my recent projects that showcase my skills and
            passion for development
          </p>
        </motion.div>

        <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-3">
          {projects.map((project, index) => (
            <motion.div
              key={project.title}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: index * 0.2 }}
              viewport={{ once: true }}
            >
              <Card className="group overflow-hidden border-neutral-700 bg-neutral-900/50 transition-colors hover:border-neutral-500">
                <div className="relative overflow-hidden">
                  <Image
                    src={project.image || '/placeholder.svg'}
                    alt={project.title}
                    width={500}
                    height={300}
                    className="h-48 w-full object-cover transition-transform duration-300 group-hover:scale-105"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-neutral-950/80 to-transparent opacity-0 transition-opacity duration-300 group-hover:opacity-100" />
                </div>

                <CardHeader>
                  <CardTitle className="text-xl text-white">
                    {project.title}
                  </CardTitle>
                </CardHeader>

                <CardContent className="space-y-4">
                  <p className="text-sm leading-relaxed text-neutral-400">
                    {project.description}
                  </p>

                  <div className="flex flex-wrap gap-2">
                    {project.technologies.map((tech) => (
                      <Badge
                        key={tech}
                        variant="secondary"
                        className="border-neutral-600 bg-neutral-800 text-xs text-neutral-200"
                      >
                        {tech}
                      </Badge>
                    ))}
                  </div>

                  <div className="flex gap-3 pt-2">
                    <Button
                      size="sm"
                      className="flex-1 bg-white text-black hover:bg-neutral-200"
                      asChild
                    >
                      <a
                        href={project.liveUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                      >
                        <ExternalLink className="mr-2 h-4 w-4" />
                        Live Demo
                      </a>
                    </Button>
                    <Button
                      size="sm"
                      variant="outline"
                      className="border-neutral-600 text-neutral-300 hover:bg-neutral-800"
                      asChild
                    >
                      <a
                        href={project.githubUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                      >
                        <Github className="h-4 w-4" />
                      </a>
                    </Button>
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  )
}
