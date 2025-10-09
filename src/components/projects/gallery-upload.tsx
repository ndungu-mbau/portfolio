'use client'

import { useState } from 'react'
import { UploadButton } from '~/lib/uploadthing'
import { X } from 'lucide-react'
import Image from 'next/image'

type GalleryUploadProps = {
  value: string[]
  onChange: (value: string[]) => void
}

export function GalleryUpload({ value = [], onChange }: GalleryUploadProps) {
  const [isUploading, setIsUploading] = useState(false)

  const handleUploadComplete = (res: { url: string; key: string }[]) => {
    setIsUploading(false)
    if (res?.[0]?.url) {
      onChange([...value, res[0].url])
    }
  }

  const removeImage = (index: number) => {
    const newImages = [...value]
    newImages.splice(index, 1)
    onChange(newImages)
  }

  return (
    <div className="space-y-4">
      <div className="flex flex-wrap gap-4">
        {value.map((url, index) => (
          <div
            key={url}
            className="group relative h-32 w-32 overflow-hidden rounded-md"
          >
            <Image
              src={url}
              alt={`Gallery image ${index + 1}`}
              fill
              className="object-cover"
              sizes="128px"
            />
            <button
              type="button"
              onClick={(e) => {
                e.preventDefault()
                e.stopPropagation()
                removeImage(index)
              }}
              className="absolute top-1 right-1 rounded-full bg-red-500/80 p-1 text-white opacity-0 transition-opacity group-hover:opacity-100"
            >
              <X className="h-4 w-4" />
            </button>
          </div>
        ))}
        <div className="flex h-32 w-32 items-center justify-center rounded-md border-2 border-dashed border-neutral-600">
          <UploadButton
            endpoint="imageUploader"
            onClientUploadComplete={handleUploadComplete}
            onUploadBegin={() => setIsUploading(true)}
            onUploadError={(error: Error) => {
              console.error('Upload Error:', error)
              setIsUploading(false)
            }}
            className="ut-button:bg-blue-500 ut-button:ut-readying:bg-blue-500/50"
            content={{
              button: isUploading ? 'Uploading...' : 'Upload',
              allowedContent: 'Image (4MB max)',
            }}
          />
        </div>
      </div>
      <p className="text-sm text-neutral-400">
        Upload images to display in the project gallery. Maximum 10 images.
      </p>
    </div>
  )
}
