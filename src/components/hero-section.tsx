'use client'

import Link from 'next/link'
import { motion } from 'framer-motion'
import { ArrowDown, Github, Linkedin, Mail } from 'lucide-react'
import { Button } from '~/components/ui/button'
import TypewriterEffect from '~/components/ui/typewriter-effect'
import { api } from '~/trpc/react'
import { Skeleton } from './ui/skeleton'

export default function Hero() {
  const { data: technologies = [], isLoading } =
    api.technologies.getFeaturedTechnologies.useQuery()

  // Extract just the technology names for the typewriter effect
  const technologyNames = technologies.map((tech) => tech.name)

  return (
    <section className="relative flex min-h-screen items-center justify-center overflow-hidden bg-neutral-950 px-4">
      {/* Background Animation */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute -inset-10 opacity-30">
          {[...(Array(100) as number[])].map((_, i) => (
            <motion.div
              key={i}
              className="absolute rounded-full bg-neutral-400"
              style={{
                width: Math.random() * 3 + 1,
                height: Math.random() * 3 + 1,
                left: `${Math.random() * 100}%`,
                top: `${Math.random() * 100}%`,
              }}
              animate={{
                y: [0, -100, 0],
                opacity: [0, 0.6, 0],
              }}
              transition={{
                duration: Math.random() * 4 + 3,
                repeat: Number.POSITIVE_INFINITY,
                delay: Math.random() * 2,
              }}
            />
          ))}
        </div>
      </div>

      <div className="z-10 mx-auto max-w-4xl text-center">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
        >
          <h1 className="mb-6 text-5xl font-bold text-white md:text-7xl">
            Hi, I&apos;m{' '}
            <span className="bg-gradient-to-r from-blue-500 to-blue-400 bg-clip-text text-transparent">
              Nelson Mbau
            </span>
          </h1>

          {/* Updated tagline with typewriter effect */}
          <div className="mx-auto mb-4 max-w-2xl text-xl text-neutral-400 md:text-2xl">
            <p className="mb-4">Full Stack Developer & UI/UX Designer</p>
            <div className="flex flex-col items-center justify-center gap-2 text-lg sm:flex-row md:text-xl">
              <span className="text-neutral-300">Specialized in</span>
              <div className="flex h-8 items-center">
                {isLoading ? (
                  <Skeleton className="h-8 w-24 rounded" />
                ) : (
                  <TypewriterEffect
                    words={technologyNames}
                    className="text-lg md:text-xl"
                    typeSpeed={80}
                    deleteSpeed={40}
                    delayBetweenWords={1500}
                  />
                )}
              </div>
            </div>
          </div>

          <p className="mx-auto mb-8 max-w-2xl text-lg text-neutral-500">
            Passionate about creating amazing digital experiences that make a
            difference
          </p>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.2 }}
          className="mb-12 flex flex-col items-center justify-center gap-4 sm:flex-row"
        >
          <Button
            size="lg"
            className="bg-blue-500 px-8 py-3 font-medium text-white hover:bg-blue-600"
            asChild
          >
            <Link href="/projects">View My Work</Link>
          </Button>
          <Button
            variant="outline"
            size="lg"
            className="border border-neutral-500 px-8 py-3 text-neutral-800 hover:bg-neutral-800 hover:text-white"
          >
            Download CV
          </Button>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.4 }}
          className="mb-12 flex justify-center space-x-6"
        >
          <a
            href="https://github.com/ndungu-mbau"
            className="text-neutral-500 transition-colors hover:text-white"
            target="_blank"
            rel="noopener noreferrer"
          >
            <Github size={24} />
          </a>
          <a
            href="https://www.linkedin.com/in/nelson-mbau-31788a136/"
            className="text-neutral-500 transition-colors hover:text-white"
            target="_blank"
            rel="noopener noreferrer"
          >
            <Linkedin size={24} />
          </a>
          <a
            href="mailto:mbau.ndungu@gmail.com"
            className="text-neutral-500 transition-colors hover:text-white"
            target="_blank"
            rel="noopener noreferrer"
          >
            <Mail size={24} />
          </a>
        </motion.div>

        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.8, delay: 0.6 }}
          className="absolute bottom-8 left-1/2 -translate-x-1/2 transform"
        >
          <motion.div
            animate={{ y: [0, 10, 0] }}
            transition={{ duration: 2, repeat: Number.POSITIVE_INFINITY }}
          >
            <ArrowDown className="text-neutral-500" size={24} />
          </motion.div>
        </motion.div>
      </div>
    </section>
  )
}
