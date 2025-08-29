import { notFound } from 'next/navigation'
import { api } from '~/trpc/server'
import ProjectDetail from '~/components/projects/item'

export default async function ProjectPage({
  params,
}: {
  params: Promise<{ id: string }>
}) {
  const { id } = await params
  try {
    const project = await api.projects.getProjectById({ id })

    if (!project) {
      notFound()
    }

    return <ProjectDetail project={project} />
  } catch (e) {
    console.error(e)
    notFound()
  }
}

export const revalidate = 3600 // Revalidate at most every hour
