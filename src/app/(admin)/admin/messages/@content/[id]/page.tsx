import { notFound } from 'next/navigation'
import { api } from '~/trpc/server'
import { format } from 'date-fns'
import { Button } from '~/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '~/components/ui/card'

export default async function MessageDetailsPage({
  params,
}: {
  params: Promise<{ id: string }>
}) {
  const message = await api.messages.getMessageById({ id: (await params).id })
  if (!message) {
    notFound()
  }

  return (
    <Card className="h-full dark:bg-neutral-900 dark:border-neutral-800">
      <CardHeader className="border-b p-4 dark:border-neutral-800">
        <div className="flex items-start justify-between">
          <div>
            <CardTitle className="text-lg dark:text-white">{message.name}</CardTitle>
            <p className="text-muted-foreground text-sm dark:text-neutral-400">{message.email}</p>
            <p className="text-muted-foreground mt-1 text-xs dark:text-neutral-500">
              {format(new Date(message.createdAt ?? ''), 'PPpp')}
            </p>
          </div>
          <Button 
            variant="outline" 
            size="sm" 
            asChild
            className="dark:border-gray-700 dark:text-gray-200 dark:hover:bg-gray-800"
          >
            <a href={`mailto:${message.email}`} className="dark:text-gray-200">
              Reply
            </a>
          </Button>
        </div>
      </CardHeader>
      <CardContent className="p-6">
        <div className="text-sm whitespace-pre-line dark:text-neutral-300">{message.message}</div>
      </CardContent>
    </Card>
  )
}
