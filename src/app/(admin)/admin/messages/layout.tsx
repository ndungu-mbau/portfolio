export default function MessagesLayout({
  children,
  content,
}: {
  children: React.ReactNode
  content: React.ReactNode
}) {
  return (
    <div className="dark min-h-screen bg-background text-foreground">
      <div className="container mx-auto p-4">
        <div className="mb-6">
          <h1 className="text-3xl font-bold dark:text-white">Messages</h1>
          <p className="text-muted-foreground dark:text-neutral-400">
            View and manage contact form messages
          </p>
        </div>

        <div className="grid h-[calc(100vh-180px)] grid-cols-1 gap-6 md:grid-cols-3">
          {children}
          {content}
        </div>
      </div>
    </div>
  )
}
