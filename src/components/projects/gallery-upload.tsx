'use client'

import { useState } from 'react'
import { UploadDropzone } from '~/lib/uploadthing'
import { Upload } from 'lucide-react'
import { toast } from 'sonner'
import { Progress } from '~/components/ui/progress'
import { Card, CardContent } from '~/components/ui/card'

type UploadedFile = {
  id: string
  url: string
  name: string
  size: number
  key: string
}

type GalleryUploadProps = {
  onUploadComplete: (value: UploadedFile) => void
}

export function GalleryUpload({ onUploadComplete }: GalleryUploadProps) {
  const [uploadProgress, setUploadProgress] = useState(0)
  const [isUploading, setIsUploading] = useState(false)
  return (
    <div className="space-y-6">
      <Card className="border-2 border-dashed border-neutral-700 bg-neutral-800/50 backdrop-blur-sm">
        <CardContent className="p-8">
          <UploadDropzone
            endpoint="imageUploader"
            onClientUploadComplete={(res) => {
              if (res) {
                const newFiles = res.map((file) => ({
                  // eslint-disable-next-line @typescript-eslint/no-unsafe-member-access,
                  id: file.serverData?.file?.id as string,
                  url: file.ufsUrl,
                  name: file.name,
                  size: file.size,
                  key: file.key,
                }))
                onUploadComplete(newFiles[0]!)
                setIsUploading(false)
                setUploadProgress(0)
                toast.success('Upload Complete!', {
                  description: `${res.length} file(s) uploaded successfully`,
                })
              }
            }}
            onUploadError={(error: Error) => {
              setIsUploading(false)
              setUploadProgress(0)
              toast.error('Upload Failed', {
                description: error.message,
              })
            }}
            onUploadBegin={() => {
              setIsUploading(true)
              setUploadProgress(0)
            }}
            onUploadProgress={(progress) => {
              setUploadProgress(progress)
            }}
            appearance={{
              container: 'border-none bg-transparent',
              uploadIcon: 'text-neutral-500',
              label: 'text-neutral-800 text-lg font-medium',
              allowedContent: 'text-neutral-500 text-sm',
              button:
                'bg-neutral-100 text-neutral-900 hover:bg-neutral-200 transition-colors ut-ready:bg-neutral-100 ut-uploading:cursor-not-allowed ut-uploading:bg-neutral-600',
            }}
            content={{
              uploadIcon: () => (
                <div className="mb-4">
                  <div className="relative">
                    <div className="absolute inset-0 animate-pulse rounded-full bg-gradient-to-r from-neutral-600 to-neutral-500 opacity-20 blur-lg"></div>
                    <div className="relative rounded-full bg-neutral-700 p-4">
                      <Upload className="h-8 w-8 text-neutral-800" />
                    </div>
                  </div>
                </div>
              ),
              label: () => (
                <div className="text-center">
                  <p className="mb-2 text-lg font-semibold text-neutral-200">
                    Drop your images here, or click to browse
                  </p>
                  <p className="text-sm text-neutral-500">
                    Supports: JPG, PNG, GIF, WebP (Max 4MB)
                  </p>
                </div>
              ),
            }}
          />

          {isUploading && (
            <div className="mt-6 space-y-2">
              <div className="flex items-center justify-between text-sm text-neutral-400">
                <span>Uploading...</span>
                <span>{uploadProgress}%</span>
              </div>
              <Progress value={uploadProgress} className="h-2" />
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  )
}
