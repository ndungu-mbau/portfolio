import { Mail } from 'lucide-react'

export default function DefaultContent() {
  return (
    <div className="md:col-span-2">
      <div className="bg-card text-muted-foreground flex h-full flex-col items-center justify-center rounded-lg border p-8 text-center">
        <Mail className="mb-4 h-10 w-10" />
        <h3 className="mb-2 text-lg font-medium">No message selected</h3>
        <p className="text-sm">
          Select a message from the list to view its contents
        </p>
      </div>
    </div>
  )
}
