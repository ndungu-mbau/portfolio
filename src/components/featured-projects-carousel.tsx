/* eslint-disable @typescript-eslint/no-non-null-asserted-optional-chain */
'use client'

import { motion, AnimatePresence } from 'framer-motion'
import { useState, useEffect } from 'react'
import Link from 'next/link'
import Image from 'next/image'
import { Card, CardContent, CardHeader, CardTitle } from '~/components/ui/card'
import { Badge } from '~/components/ui/badge'
import { Button } from '~/components/ui/button'
import {
  ExternalLink,
  Github,
  Calendar,
  ChevronLeft,
  ChevronRight,
} from 'lucide-react'
import type { RouterOutputs } from '~/trpc/react'

interface FeaturedProjectsCarouselProps {
  projects: RouterOutputs['projects']['getProjectsByFeatured']
}

export default function FeaturedProjectsCarousel({
  projects,
}: FeaturedProjectsCarouselProps) {
  const [currentIndex, setCurrentIndex] = useState(0)
  const [isAutoPlaying, setIsAutoPlaying] = useState(true)

  // Auto-play functionality
  useEffect(() => {
    if (!isAutoPlaying) return

    const interval = setInterval(() => {
      setCurrentIndex((prevIndex) => (prevIndex + 1) % projects.length)
    }, 5000)

    return () => clearInterval(interval)
  }, [projects.length, isAutoPlaying])

  const goToNext = () => {
    setCurrentIndex((prevIndex) => (prevIndex + 1) % projects.length)
    setIsAutoPlaying(false)
  }

  const goToPrevious = () => {
    setCurrentIndex(
      (prevIndex) => (prevIndex - 1 + projects.length) % projects.length
    )
    setIsAutoPlaying(false)
  }

  const goToSlide = (index: number) => {
    setCurrentIndex(index)
    setIsAutoPlaying(false)
  }

  if (projects.length === 0) return null

  return (
    <div className="relative mx-auto w-full max-w-6xl">
      {/* Main Carousel Container */}
      <div className="relative overflow-hidden rounded-2xl">
        <AnimatePresence mode="wait">
          <motion.div
            key={currentIndex}
            initial={{ opacity: 0, x: 300 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -300 }}
            transition={{
              type: 'spring',
              stiffness: 300,
              damping: 30,
            }}
            className="w-full"
          >
            <Card className="overflow-hidden border-neutral-700 bg-neutral-900/50 backdrop-blur-sm">
              <div className="grid gap-0 lg:grid-cols-2">
                {/* Image Section */}
                <div className="group relative overflow-hidden">
                  <Image
                    src={
                      projects[currentIndex]?.image?.url ?? '/placeholder.svg'
                    }
                    alt={projects[currentIndex]?.title ?? ''}
                    width={600}
                    height={400}
                    className="h-80 w-full object-cover transition-transform duration-700 group-hover:scale-105 lg:h-96"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-neutral-950/60 via-transparent to-transparent" />

                  {/* Featured Badge */}
                  <div className="absolute top-4 left-4">
                    <Badge className="bg-white px-3 py-1 font-medium text-black">
                      Featured
                    </Badge>
                  </div>

                  {/* Status Badge */}
                  <div className="absolute top-4 right-4">
                    <Badge
                      variant="outline"
                      className={`border-neutral-600 font-medium ${
                        projects[currentIndex]?.status === 'Live'
                          ? 'border-green-400/30 bg-green-400/10 text-green-400'
                          : 'border-yellow-400/30 bg-yellow-400/10 text-yellow-400'
                      }`}
                    >
                      {projects[currentIndex]?.status ?? ''}
                    </Badge>
                  </div>

                  {/* Navigation Arrows */}
                  <button
                    onClick={goToPrevious}
                    className="absolute top-1/2 left-4 -translate-y-1/2 transform rounded-full border border-neutral-700 bg-neutral-900/80 p-2 text-white opacity-0 backdrop-blur-sm transition-colors group-hover:opacity-100 hover:bg-neutral-800 dark:border-neutral-800"
                  >
                    <ChevronLeft size={20} />
                  </button>
                  <button
                    onClick={goToNext}
                    className="absolute top-1/2 right-4 -translate-y-1/2 transform rounded-full border border-neutral-700 bg-neutral-900/80 p-2 text-white opacity-0 backdrop-blur-sm transition-colors group-hover:opacity-100 hover:bg-neutral-800 dark:border-neutral-800"
                  >
                    <ChevronRight size={20} />
                  </button>
                </div>

                {/* Content Section */}
                <div className="flex flex-col justify-between p-8">
                  <div>
                    <CardHeader className="mb-6 p-0">
                      <CardTitle className="mb-3 text-3xl text-white">
                        {projects[currentIndex]?.title ?? ''}
                      </CardTitle>
                      <p className="text-lg leading-relaxed text-neutral-400">
                        {projects[currentIndex]?.description ?? ''}
                      </p>
                    </CardHeader>

                    <CardContent className="space-y-6 p-0">
                      {/* Technologies */}
                      <div>
                        <h4 className="mb-3 font-medium text-white">
                          Technologies
                        </h4>
                        <div className="flex flex-wrap gap-2">
                          {projects[currentIndex]?.projectTechnologies
                            .slice(0, 6)
                            .map((tech) => (
                              <Badge
                                key={tech.technology.id}
                                variant="secondary"
                                className="border-neutral-600 bg-neutral-800 text-sm text-neutral-200"
                              >
                                {tech.technology.name}
                              </Badge>
                            ))}
                          {projects[currentIndex]?.projectTechnologies
                            ?.length! > 6 && (
                            <Badge
                              variant="secondary"
                              className="border-neutral-600 bg-neutral-800 text-sm text-neutral-200"
                            >
                              +
                              {projects[currentIndex]?.projectTechnologies
                                ?.length! - 6}
                            </Badge>
                          )}
                        </div>
                      </div>

                      {/* Project Meta */}
                      <div className="flex items-center gap-6 text-sm text-neutral-400">
                        <div className="flex items-center gap-2">
                          <Calendar size={16} />
                          <span>{projects[currentIndex]?.year}</span>
                        </div>
                      </div>
                    </CardContent>
                  </div>

                  {/* Action Buttons */}
                  <div className="mt-8 flex gap-3">
                    <Button
                      size="lg"
                      className="flex-1 bg-white text-black hover:bg-neutral-200"
                      asChild
                    >
                      <Link href={`/projects/${projects[currentIndex]?.id}`}>
                        View Details
                      </Link>
                    </Button>
                    {projects[currentIndex]?.liveUrl && (
                      <Button
                        size="lg"
                        variant="outline"
                        className="border-neutral-600 text-neutral-300 hover:bg-neutral-800"
                        asChild
                      >
                        <a
                          href={projects[currentIndex]?.liveUrl}
                          target="_blank"
                          rel="noopener noreferrer"
                        >
                          <ExternalLink className="h-4 w-4" />
                        </a>
                      </Button>
                    )}
                    <Button
                      size="lg"
                      variant="outline"
                      className="border-neutral-600 text-neutral-300 hover:bg-neutral-800"
                      asChild
                    >
                      <a
                        href={projects[currentIndex]?.githubUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                      >
                        <Github className="h-4 w-4" />
                      </a>
                    </Button>
                  </div>
                </div>
              </div>
            </Card>
          </motion.div>
        </AnimatePresence>
      </div>

      {/* Dots Indicator */}
      <div className="mt-8 flex justify-center space-x-2">
        {projects.map((_, index) => (
          <button
            key={index}
            onClick={() => goToSlide(index)}
            className={`h-3 w-3 rounded-full transition-all duration-300 ${
              index === currentIndex
                ? 'scale-110 bg-white'
                : 'bg-neutral-600 hover:bg-neutral-500'
            }`}
          />
        ))}
      </div>

      {/* Progress Bar */}
      <div className="mt-4 h-1 w-full overflow-hidden rounded-full bg-neutral-800">
        <motion.div
          className="h-full rounded-full bg-white"
          initial={{ width: '0%' }}
          animate={{
            width: `${((currentIndex + 1) / projects.length) * 100}%`,
          }}
          transition={{ duration: 0.3 }}
        />
      </div>

      {/* Thumbnail Navigation */}
      <div className="mt-8 flex justify-center space-x-4 overflow-x-auto pb-4">
        {projects.map((project, index) => (
          <motion.button
            key={project.id}
            onClick={() => goToSlide(index)}
            className={`relative flex-shrink-0 overflow-hidden rounded-lg border-2 transition-all duration-300 ${
              index === currentIndex
                ? 'scale-105 border-white'
                : 'border-neutral-700 hover:border-neutral-500'
            }`}
            whileHover={{ scale: index === currentIndex ? 1.05 : 1.02 }}
            whileTap={{ scale: 0.98 }}
          >
            <Image
              src={project.image?.url || '/placeholder.svg'}
              alt={project.title}
              width={120}
              height={80}
              className="h-12 w-20 object-cover"
            />
            <div
              className={`absolute inset-0 transition-opacity duration-300 ${
                index === currentIndex
                  ? 'bg-white/20'
                  : 'bg-black/40 hover:bg-black/20'
              }`}
            />
          </motion.button>
        ))}
      </div>
    </div>
  )
}
