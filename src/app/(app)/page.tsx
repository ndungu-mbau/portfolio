import { HydrateClient } from '~/trpc/server'

import Hero from '~/components/hero-section'
import About from '~/components/about-section'
import Skills from '~/components/skills-section'
import Projects from '~/components/projects-section'
import Contact from '~/components/contact-section'

export default async function Home() {
  return (
    <HydrateClient>
      <main className="flex min-h-screen flex-col items-center justify-center bg-neutral-950 text-white">
        <Hero />
        <About />
        <Skills />
        <Projects />
        <Contact />
      </main>
    </HydrateClient>
  )
}
