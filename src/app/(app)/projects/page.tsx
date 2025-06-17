"use client";

import { motion } from "framer-motion";
import Link from "next/link";
import Image from "next/image";
import { Card, CardContent, CardHeader, CardTitle } from "~/components/ui/card";
import { Badge } from "~/components/ui/badge";
import { Button } from "~/components/ui/button";
import { ExternalLink } from "lucide-react";
import FeaturedProjectsCarousel from "~/components/featured-projects-carousel";

// Mock project data - in a real app, this would come from a database or API
const featuredProjects = [
  {
    id: "ecommerce-platform",
    title: "E-Commerce Platform",
    description:
      "A full-stack e-commerce solution with React, Node.js, and Stripe integration. Features include user authentication, product management, order processing advanced analytics.",
    longDescription:
      "This comprehensive e-commerce platform was built to handle high-traffic retail operations. It includes advanced features like inventory management, real-time analytics, multi-payment gateway integration, and a sophisticated admin dashboard.",
    image: "/placeholder.svg?height=400&width=600",
    technologies: ["React", "Node.js", "MongoDB", "Stripe", "Redis", "AWS"],
    liveUrl: "https://example.com",
    githubUrl: "https://github.com/example/ecommerce",
    featured: true,
    status: "Live",
    duration: "6 months",
    team: "4 developers",
    year: "2024",
  },
  {
    id: "task-management-app",
    title: "Task Management App",
    description:
      "A collaborative task management application built with Next.js and real-time updates using Socket.io. Includes team collaboration features advanced project tracking.",
    longDescription:
      "A modern task management solution designed for remote teams. Features real-time collaboration, advanced project tracking, time tools, and comprehensive reporting capabilities.",
    image: "/placeholder.svg?height=400&width=600",
    technologies: ["Next.js", "Socket.io", "PostgreSQL", "Tailwind", "Prisma"],
    liveUrl: "https://example.com",
    githubUrl: "https://github.com/example/taskapp",
    featured: true,
    status: "Live",
    duration: "4 months",
    team: "3 developers",
    year: "2024",
  },
  {
    id: "ai-dashboard",
    title: "AI Analytics Dashboard",
    description:
      "An intelligent analytics dashboard powered by machine learning algorithms. Provides real-time insights, predictive analytics, and automated reporting for business intelligence.",
    longDescription:
      "A comprehensive AI-powered dashboard that transforms raw data into actionable insights using advanced machine learning algorithms and beautiful visualizations.",
    image: "/placeholder.svg?height=400&width=600",
    technologies: [
      "React",
      "Python",
      "TensorFlow",
      "D3.js",
      "FastAPI",
      "PostgreSQL",
    ],
    liveUrl: "https://example.com",
    githubUrl: "https://github.com/example/ai-dashboard",
    featured: true,
    status: "Beta",
    duration: "8 months",
    team: "5 developers",
    year: "2024",
  },
];

const otherProjects = [
  {
    id: "weather-dashboard",
    title: "Weather Dashboard",
    description:
      "A beautiful weather dashboard with location-based forecasts, interactive maps, and detailed analytics.",
    longDescription:
      "An intuitive weather application that provides comprehensive information with beautiful visualizations and interactive maps.",
    image: "/placeholder.svg?height=300&width=500",
    technologies: ["Vue.js", "Chart.js", "Weather API", "CSS3"],
    liveUrl: "https://example.com",
    githubUrl: "https://github.com/example/weather",
    featured: false,
    status: "Live",
    duration: "2 months",
    team: "Solo",
    year: "2023",
  },
  {
    id: "blog-platform",
    title: "Blog Platform",
    description:
      "A modern blog platform with markdown support, SEO optimization, and content management system.",
    longDescription:
      "A full-featured blogging platform with advanced content management, SEO tools, and analytics dashboard.",
    image: "/placeholder.svg?height=300&width=500",
    technologies: ["Next.js", "MDX", "Supabase", "Tailwind"],
    liveUrl: "https://example.com",
    githubUrl: "https://github.com/example/blog",
    featured: false,
    status: "Live",
    duration: "3 months",
    team: "2 developers",
    year: "2023",
  },
  {
    id: "portfolio-generator",
    title: "Portfolio Generator",
    description:
      "An automated portfolio generator that creates beautiful developer portfolios from GitHub data.",
    longDescription:
      "A tool that automatically generates professional portfolios by analyzing GitHub repositories and creating beautiful presentations.",
    image: "/placeholder.svg?height=300&width=500",
    technologies: ["React", "GitHub API", "Styled Components"],
    liveUrl: "https://example.com",
    githubUrl: "https://github.com/example/portfolio-gen",
    featured: false,
    status: "Beta",
    duration: "2 months",
    team: "Solo",
    year: "2023",
  },
];

export default function ProjectsPage() {
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
            {otherProjects.map((project, index) => (
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
                      src={project.image || "/placeholder.svg"}
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
                      {project.technologies.slice(0, 3).map((tech) => (
                        <Badge
                          key={tech}
                          variant="secondary"
                          className="border-neutral-600 bg-neutral-800 text-xs text-neutral-200"
                        >
                          {tech}
                        </Badge>
                      ))}
                      {project.technologies.length > 3 && (
                        <Badge
                          variant="secondary"
                          className="border-neutral-600 bg-neutral-800 text-xs text-neutral-200"
                        >
                          +{project.technologies.length - 3}
                        </Badge>
                      )}
                    </div>

                    <div className="flex items-center gap-3 text-xs text-neutral-500">
                      <span>{project.year}</span>
                      <span>•</span>
                      <span>{project.team}</span>
                    </div>

                    <div className="flex gap-2 pt-2">
                      <Button
                        size="sm"
                        className="flex-1 bg-white text-xs text-black hover:bg-neutral-200"
                        asChild
                      >
                        <Link href={`/projects/${project.id}`}>Details</Link>
                      </Button>
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
                    </div>
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
}
