import NewProjectPage from '~/components/projects/new'
import { api } from '~/trpc/server'

export default async function NewProject() {
  const technologies = await api.technologies.getAllTechnologies()
  return <NewProjectPage technologies={technologies} />
}
