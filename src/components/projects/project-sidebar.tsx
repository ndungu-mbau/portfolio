import Link from 'next/link'
import { Badge } from '~/components/ui/badge'
import { Button } from '~/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '~/components/ui/card'
import { ExternalLink, Github, Calendar, Clock } from 'lucide-react'
import type { RouterOutputs } from '~/trpc/react'

interface ProjectSidebarProps {
  project: RouterOutputs['projects']['getProjectById']
}

export function ProjectSidebar({ project }: ProjectSidebarProps) {
  if (!project) return null

  return (
    <div className="space-y-6">
      {/* Project Details Card */}
      <Card className="border-neutral-700 bg-neutral-900/50">
        <CardHeader>
          <CardTitle className="text-lg text-white">Project Info</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          {/* Status */}
          <div>
            <p className="mb-2 text-sm text-neutral-400">Status</p>
            <Badge
              variant="outline"
              className={`${
                project.status === 'Live'
                  ? 'border-green-400/30 bg-green-400/10 text-green-400'
                  : project.status === 'Beta'
                    ? 'border-yellow-400/30 bg-yellow-400/10 text-yellow-400'
                    : 'border-blue-400/30 bg-blue-400/10 text-blue-400'
              }`}
            >
              {project.status}
            </Badge>
          </div>

          {/* Year */}
          <div className="flex items-center gap-2 text-neutral-300">
            <Calendar size={16} className="text-neutral-400" />
            <span className="text-sm">{project.year}</span>
          </div>

          {/* Duration */}
          <div className="flex items-center gap-2 text-neutral-300">
            <Clock size={16} className="text-neutral-400" />
            <span className="text-sm">{project.duration}</span>
          </div>

          {/* Action Buttons */}
          <div className="space-y-2 pt-2">
            {project.liveUrl && (
              <Button
                className="w-full bg-white text-black hover:bg-neutral-200"
                asChild
              >
                <a
                  href={project.liveUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  <ExternalLink className="mr-2 h-4 w-4" />
                  View Live
                </a>
              </Button>
            )}
            <Button
              variant="outline"
              className="w-full border-neutral-600 text-neutral-300 hover:bg-neutral-800"
              asChild
            >
              <a
                href={project.githubUrl}
                target="_blank"
                rel="noopener noreferrer"
              >
                <Github className="mr-2 h-4 w-4" />
                View Code
              </a>
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Technologies Card */}
      <Card className="border-neutral-700 bg-neutral-900/50">
        <CardHeader>
          <CardTitle className="text-lg text-white">Technologies</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex flex-wrap gap-2">
            {project.projectTechnologies.map((tech) => (
              <Link
                key={tech.technology.id}
                href={`/technologies/${tech.technology.id}`}
              >
                <Badge
                  variant="secondary"
                  className="cursor-pointer border-neutral-600 bg-neutral-800 text-xs text-neutral-200 transition-colors hover:bg-neutral-700"
                >
                  {tech.technology.name}
                </Badge>
              </Link>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
