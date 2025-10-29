'use client'

import { motion } from 'framer-motion'
import { Badge } from '~/components/ui/badge'

interface Technology {
  name: string
  category: string
}

interface SkillsProps {
  technologies: Technology[]
}

export default function Skills({ technologies }: SkillsProps) {
  const frontendSkills = technologies.filter(t => t.category.toLowerCase() === 'frontend').map(t => t.name)
  const backendSkills = technologies.filter(t => t.category.toLowerCase() === 'backend').map(t => t.name)
  const toolsSkills = technologies.filter(t => {
    const cat = t.category.toLowerCase()
    return cat !== 'frontend' && cat !== 'backend'
  }).map(t => t.name)

  const skillCategories = [
    {
      title: 'Frontend',
      skills: frontendSkills,
    },
    {
      title: 'Backend',
      skills: backendSkills,
    },
    {
      title: 'Tools & Others',
      skills: toolsSkills,
    },
  ]

  return (
    <section id="skills" className="bg-neutral-950 px-4 py-20">
      <div className="mx-auto max-w-6xl">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="grid grid-cols-1 md:grid-cols-3 gap-8"
        >
          {skillCategories.map(({ title, skills }) => (
            <div key={title}>
              <h3 className="mb-4 text-xl font-semibold text-white">{title}</h3>
              <div className="flex flex-wrap gap-2">
                {skills.map(skill => (
                  <Badge key={skill} variant="secondary">
                    {skill}
                  </Badge>
                ))}
              </div>
            </div>
          ))}
        </motion.div>
      </div>
    </section>
  )
}
