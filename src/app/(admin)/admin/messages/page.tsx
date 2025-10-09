'use client'

import { api } from '~/trpc/react'
import { format } from 'date-fns'
import { Loader2, Mail } from 'lucide-react'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { Card, CardHeader, CardTitle } from '~/components/ui/card'
import { ScrollArea } from '~/components/ui/scroll-area'

export default function MessagesPage() {
  const pathname = usePathname()
  const { data: messages, isLoading } = api.messages.getAllMessages.useQuery()

  if (isLoading) {
    return (
      <div className="flex h-screen items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin" />
      </div>
    )
  }

  return (
    <Card className="overflow-hidden dark:bg-neutral-900 dark:border-neutral-800">
      <CardHeader className="border-b p-4 dark:border-neutral-800">
        <CardTitle className="text-lg dark:text-white">Inbox</CardTitle>
      </CardHeader>
      <ScrollArea className="h-[calc(100%-73px)]">
        <div className="divide-y dark:divide-neutral-800">
          {messages?.length === 0 ? (
            <div className="text-muted-foreground flex h-32 flex-col items-center justify-center dark:text-neutral-400">
              <Mail className="mb-2 h-6 w-6" />
              <p>No messages yet</p>
            </div>
          ) : (
            messages?.map((message) => {
              const isActive = pathname === `/admin/messages/${message.id}`
              return (
                <Link
                  key={message.id}
                  href={`/admin/messages/${message.id}`}
                  className={`hover:bg-muted/50 dark:hover:bg-neutral-800/50 block w-full p-4 text-left transition-colors ${
                    isActive ? 'bg-muted dark:bg-neutral-800' : ''
                  } dark:text-neutral-200`}
                >
                  <div className="flex items-center justify-between">
                    <h3 className="font-medium dark:text-white">{message.name}</h3>
                    <span className="text-muted-foreground text-xs dark:text-neutral-400">
                      {format(new Date(message.createdAt ?? ''), 'MMM d, yyyy')}
                    </span>
                  </div>
                  <p className="text-muted-foreground truncate text-sm dark:text-neutral-400">
                    {message.email}
                  </p>
                </Link>
              )
            })
          )}
        </div>
      </ScrollArea>
    </Card>
  )
}
