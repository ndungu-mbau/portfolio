'use client'

import { useRouter } from 'next/navigation'
import Image from 'next/image'
import { X } from 'lucide-react'
import { motion } from 'framer-motion'
import { use } from 'react'

export default function ImageModal({
  params,
}: {
  params: Promise<{ id: string; imageId: string }>
}) {
  const router = useRouter()
  const { imageId } = use(params)

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/90"
      onClick={() => router.back()}
    >
      <motion.div
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        exit={{ opacity: 0, scale: 0.9 }}
        className="relative max-h-[90vh] max-w-[90vw]"
        onClick={(e) => e.stopPropagation()}
      >
        <button
          onClick={() => router.back()}
          className="absolute -top-12 right-0 text-white hover:text-neutral-300"
        >
          <X size={32} />
        </button>
        <Image
          src={decodeURIComponent(imageId)}
          alt="Project image"
          width={1200}
          height={800}
          className="h-auto w-auto max-h-[90vh] max-w-[90vw] rounded-lg object-contain"
        />
      </motion.div>
    </div>
  )
}
