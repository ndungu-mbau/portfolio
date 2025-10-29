import { api } from '~/trpc/server'
import EditProjectPage from '~/components/projects/edit'
import { redirect } from 'next/navigation'

export default async function EditProject({
  params,
}: {
  params: Promise<{ id: string }>
}) {
  const [project, allTechnologies] = await Promise.all([
    api.projects.getProjectById({ id: (await params).id }),
    api.technologies.getAllTechnologies(),
  ])

  if (!project) redirect('/admin/projects')

  return <EditProjectPage project={project} technologies={allTechnologies} />
}
