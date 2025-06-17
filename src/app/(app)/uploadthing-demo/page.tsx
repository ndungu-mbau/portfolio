import { ImageUpload } from "~/components/image-upload"

export default function Home() {
  return (
    <div className="min-h-screen bg-neutral-900 p-8">
      <div className="max-w-4xl mx-auto">
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold text-neutral-100 mb-4">Portfolio Image Upload</h1>
          <p className="text-neutral-400 text-lg">Upload images for your portfolio and blog posts</p>
        </div>
        <ImageUpload />
      </div>
    </div>
  )
}
