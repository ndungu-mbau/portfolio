import Image from 'next/image'
import Link from 'next/link'
import { ArrowLeft } from 'lucide-react'
import { Button } from '~/components/ui/button'
import { use } from 'react'

export default function GalleryPage({
  params,
}: {
  params: Promise<{ id: string; imageId: string }>
}) {
  const { id, imageId } = use(params)

  return (
    <div className="min-h-screen bg-neutral-950 px-4 py-8">
      <div className="mx-auto max-w-6xl">
        <Button variant="ghost" className="mb-8 text-neutral-400" asChild>
          <Link href={`/projects/${id}`}>
            <ArrowLeft className="mr-2 h-4 w-4" />
            Back to Project
          </Link>
        </Button>
        <div className="flex items-center justify-center">
          <Image
            src={decodeURIComponent(imageId)}
            alt="Project image"
            width={1200}
            height={800}
            className="h-auto w-full rounded-lg"
          />
        </div>
      </div>
    </div>
  )
}
