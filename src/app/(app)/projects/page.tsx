import { notFound } from 'next/navigation'
import { api } from '~/trpc/server'
import ProjectList from '~/components/projects/list'

export default async function ProjectsListPage() {
  try {
    const projects = await api.projects.getAllProjects()
    const featured = await api.projects.getProjectsByFeatured({
      featured: true,
    })

    return <ProjectList projects={projects} featuredProjects={featured} />
  } catch (e) {
    console.error(e)
    notFound()
  }
}

export const revalidate = 3600 // Revalidate at most every hour
