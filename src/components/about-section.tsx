'use client'

import { motion } from 'framer-motion'
import { Card, CardContent } from '~/components/ui/card'
import { Code, Palette, Zap } from 'lucide-react'

export default function About() {
  const features = [
    {
      icon: <Code className="h-8 w-8 text-neutral-300" />,
      title: 'Clean Code',
      description:
        'Writing maintainable and scalable code following best practices',
    },
    {
      icon: <Palette className="h-8 w-8 text-neutral-300" />,
      title: 'Creative Design',
      description: 'Crafting beautiful and intuitive user interfaces',
    },
    {
      icon: <Zap className="h-8 w-8 text-neutral-300" />,
      title: 'Performance',
      description: 'Optimizing applications for speed and efficiency',
    },
  ]

  return (
    <section id="about" className="bg-neutral-950 px-4 py-20">
      <div className="mx-auto max-w-6xl">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          viewport={{ once: true }}
          className="mb-16 text-center"
        >
          <h2 className="mb-6 text-4xl font-bold text-white md:text-5xl">
            About Me
          </h2>
          <p className="mx-auto max-w-3xl text-xl text-neutral-400">
            I&apos;m a passionate full-stack developer with 5+ years of
            experience creating digital solutions that make a difference. I love
            turning complex problems into simple, beautiful, and intuitive
            designs.
          </p>
        </motion.div>

        <div className="mb-16 grid items-center gap-12 md:grid-cols-2">
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            whileInView={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8 }}
            viewport={{ once: true }}
          >
            <div className="rounded-2xl border border-neutral-200 bg-gradient-to-r from-neutral-800 to-neutral-700 p-8 text-white dark:border-neutral-800">
              <h3 className="mb-4 text-2xl font-bold">My Journey</h3>
              <p className="text-lg leading-relaxed text-neutral-300">
                Started as a curious student who loved solving problems with
                code. Over the years, I&apos;ve worked with startups and
                established companies, helping them build amazing products that
                users love. I believe in continuous learning and staying updated
                with the latest technologies.
              </p>
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, x: 20 }}
            whileInView={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8 }}
            viewport={{ once: true }}
            className="space-y-6"
          >
            {features.map((feature, index) => (
              <Card
                key={index}
                className="border-neutral-700 bg-neutral-900/50"
              >
                <CardContent className="flex items-center space-x-4 p-6">
                  {feature.icon}
                  <div>
                    <h4 className="mb-2 text-xl font-semibold text-white">
                      {feature.title}
                    </h4>
                    <p className="text-neutral-400">{feature.description}</p>
                  </div>
                </CardContent>
              </Card>
            ))}
          </motion.div>
        </div>
      </div>
    </section>
  )
}
