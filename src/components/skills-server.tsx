'use server'

import { api } from '~/trpc/server'
import { default as Skills } from '~/components/skills-section'

export default async function SkillsServer() {
  const technologies = await api.technologies.getAllTechnologies()
  return <Skills technologies={technologies} />
}
