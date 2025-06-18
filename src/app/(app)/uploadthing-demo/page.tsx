import { ImageUpload } from '~/components/image-upload'

export default function Home() {
  return (
    <div className="min-h-screen bg-neutral-900 p-8">
      <div className="mx-auto max-w-4xl">
        <div className="mb-8 text-center">
          <h1 className="mb-4 text-4xl font-bold text-neutral-100">
            Portfolio Image Upload
          </h1>
          <p className="text-lg text-neutral-400">
            Upload images for your portfolio and blog posts
          </p>
        </div>
        <ImageUpload />
      </div>
    </div>
  )
}
