'use client'

import { motion } from 'framer-motion'
import { useParams } from 'next/navigation'
import Image from 'next/image'
import Link from 'next/link'
import { Card, CardContent, CardHeader, CardTitle } from '~/components/ui/card'
import { Badge } from '~/components/ui/badge'
import { Button } from '~/components/ui/button'
import {
  ArrowLeft,
  ExternalLink,
  Github,
  Calendar,
  Users,
  Clock,
  CheckCircle,
} from 'lucide-react'

// Mock project data - in a real app, this would come from a database or API
const projectsData = {
  'ecommerce-platform': {
    id: 'ecommerce-platform',
    title: 'E-Commerce Platform',
    description:
      'A full-stack e-commerce solution with React, Node.js, and Stripe integration.',
    longDescription:
      'This comprehensive e-commerce platform was built to handle high-traffic retail operations. It includes advanced features like inventory management, real-time analytics, multi-payment gateway integration, and a sophisticated admin dashboard. The supports multiple vendors, complex product variations, automated order fulfillment workflows.',
    image: '/placeholder.svg?height=500&width=800',
    technologies: [
      'React',
      'Node.js',
      'MongoDB',
      'Stripe',
      'Redis',
      'AWS',
      'Docker',
      'Kubernetes',
    ],
    liveUrl: 'https://example.com',
    githubUrl: 'https://github.com/example/ecommerce',
    featured: true,
    status: 'Live',
    duration: '6 months',
    team: '4 developers',
    year: '2024',
    features: [
      'User authentication and authorization',
      'Product catalog with advanced filtering',
      'Shopping cart and checkout process',
      'Payment processing with Stripe',
      'Order management system',
      'Inventory tracking',
      'Admin dashboard',
      'Real-time notifications',
      'Email automation',
      'Analytics and reporting',
    ],
    challenges: [
      'Handling high-traffic loads during peak shopping seasons',
      'Implementing complex product variations and pricing rules',
      'Ensuring PCI compliance for payment processing',
      'Building a scalable microservices architecture',
    ],
    gallery: [
      '/placeholder.svg?height=400&width=600',
      '/placeholder.svg?height=400&width=600',
      '/placeholder.svg?height=400&width=600',
    ],
  },
  'task-management-app': {
    id: 'task-management-app',
    title: 'Task Management App',
    description:
      'A collaborative task management application built with Next.js and real-time updates.',
    longDescription:
      'A modern task management solution designed for remote teams. Features real-time collaboration, advanced project tracking, time tools, and comprehensive reporting capabilities. The application supports multiple methodologies including Kanban, Scrum, traditional approaches.',
    image: '/placeholder.svg?height=500&width=800',
    technologies: [
      'Next.js',
      'Socket.io',
      'PostgreSQL',
      'Tailwind',
      'Prisma',
      'TypeScript',
    ],
    liveUrl: 'https://example.com',
    githubUrl: 'https://github.com/example/taskapp',
    featured: true,
    status: 'Live',
    duration: '4 months',
    team: '3 developers',
    year: '2024',
    features: [
      'Real-time collaboration',
      'Kanban boards',
      'Time tracking',
      'Team management',
      'Project templates',
      'Custom workflows',
      'Reporting and analytics',
      'Mobile responsive design',
      'Notification system',
      'File attachments',
    ],
    challenges: [
      'Implementing real-time synchronization across multiple users',
      'Designing an intuitive drag-and-drop interface',
      'Optimizing database queries for large datasets',
      'Building offline functionality',
    ],
    gallery: [
      '/placeholder.svg?height=400&width=600',
      '/placeholder.svg?height=400&width=600',
      '/placeholder.svg?height=400&width=600',
    ],
  },
  'weather-dashboard': {
    id: 'weather-dashboard',
    title: 'Weather Dashboard',
    description:
      'A beautiful weather dashboard with location-based forecasts and interactive maps.',
    longDescription:
      'An intuitive weather application that provides comprehensive information with beautiful visualizations and interactive maps. The dashboard aggregates data from multiple APIs to provide accurate forecasts historical data.',
    image: '/placeholder.svg?height=500&width=800',
    technologies: ['Vue.js', 'Chart.js', 'Weather API', 'CSS3', 'Leaflet'],
    liveUrl: 'https://example.com',
    githubUrl: 'https://github.com/example/weather',
    featured: false,
    status: 'Live',
    duration: '2 months',
    team: 'Solo',
    year: '2023',
    features: [
      'Current weather conditions',
      '7-day forecast',
      'Interactive weather maps',
      'Historical weather data',
      'Weather alerts',
      'Location search',
      'Favorite locations',
      'Weather charts and graphs',
      'Mobile responsive',
      'Dark/light theme',
    ],
    challenges: [
      'Integrating multiple weather APIs',
      'Creating smooth map interactions',
      'Handling geolocation permissions',
      'Optimizing for mobile devices',
    ],
    gallery: [
      '/placeholder.svg?height=400&width=600',
      '/placeholder.svg?height=400&width=600',
    ],
  },
}

export default function ProjectDetailPage() {
  const params = useParams()
  const slug = params.slug as string
  const project = projectsData[slug as keyof typeof projectsData]

  if (!project) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-neutral-950">
        <div className="text-center">
          <h1 className="mb-4 text-4xl font-bold text-white">
            Project Not Found
          </h1>
          <p className="mb-8 text-neutral-400">
            The project you're looking for doesn't exist.
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

                <p className="mb-8 text-xl leading-relaxed text-neutral-400">
                  {project.longDescription}
                </p>

                <div className="mb-8 flex flex-wrap gap-4">
                  <div className="flex items-center gap-2 text-neutral-300">
                    <Calendar size={18} />
                    <span>{project.year}</span>
                  </div>
                  <div className="flex items-center gap-2 text-neutral-300">
                    <Clock size={18} />
                    <span>{project.duration}</span>
                  </div>
                  <div className="flex items-center gap-2 text-neutral-300">
                    <Users size={18} />
                    <span>{project.team}</span>
                  </div>
                </div>

                <div className="flex gap-4">
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
                  src={project.image || '/placeholder.svg'}
                  alt={project.title}
                  width={800}
                  height={500}
                  className="rounded-2xl border border-neutral-200 border-neutral-700 dark:border-neutral-800"
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
              {project.technologies.map((tech, index) => (
                <motion.div
                  key={tech}
                  initial={{ opacity: 0, scale: 0.8 }}
                  whileInView={{ opacity: 1, scale: 1 }}
                  transition={{ duration: 0.5, delay: index * 0.1 }}
                  viewport={{ once: true }}
                >
                  <Badge
                    variant="secondary"
                    className="border-neutral-600 bg-neutral-800 px-4 py-2 text-sm font-medium text-neutral-200"
                  >
                    {tech}
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
                        <span>{feature}</span>
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
                        {challenge}
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
                {project.gallery.map((image, index) => (
                  <motion.div
                    key={index}
                    initial={{ opacity: 0, scale: 0.9 }}
                    whileInView={{ opacity: 1, scale: 1 }}
                    transition={{ duration: 0.5, delay: index * 0.1 }}
                    viewport={{ once: true }}
                    className="group relative cursor-pointer"
                  >
                    <Image
                      src={image || '/placeholder.svg'}
                      alt={`${project.title} screenshot ${index + 1}`}
                      width={600}
                      height={400}
                      className="rounded-lg border border-neutral-200 border-neutral-700 transition-colors group-hover:border-neutral-500 dark:border-neutral-800"
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
