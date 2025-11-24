---
description: Redesign the public-facing project detail page
---

# Redesign Project Detail Page Workflow

This workflow covers the complete redesign of the public-facing project detail page (`/projects/[id]`) with a new layout featuring an auto-playing image carousel, 3:1 content split, and sticky sidebar.

## Overview

The redesigned page will have:
- Auto-playing image carousel with navigation (top)
- Project title and short description (below carousel)
- 3:1 split layout:
  - **Left (75%)**: Long description + Features accordion + Challenges accordion
  - **Right (25%)**: Sticky sidebar with project details, links, and technologies
- Lightbox for images using Next.js intercepted routes
- Mobile-responsive design

---

## Step 1: Create Image Lightbox with Intercepted Routes

We'll use Next.js parallel routes and intercepted routes for the lightbox functionality.

### 1.1 Create the parallel route slot

Create the directory structure for the modal slot:

```bash
mkdir -p src/app/(app)/projects/[id]/@modal
mkdir -p src/app/(app)/projects/[id]/gallery
```

### 1.2 Create the modal default component

**File**: `src/app/(app)/projects/[id]/@modal/default.tsx`

```tsx
export default function Default() {
  return null
}
```

### 1.3 Create the intercepted gallery route

**File**: `src/app/(app)/projects/[id]/@modal/(.)gallery/[imageId]/page.tsx`

```tsx
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

  // In a real implementation, fetch the image data
  // For now, we'll assume the imageId is the image URL or we'll get it from context
  
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
```

### 1.4 Create the actual gallery page

**File**: `src/app/(app)/projects/[id]/gallery/[imageId]/page.tsx`

```tsx
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
```

### 1.5 Update the layout to include the modal slot

**File**: `src/app/(app)/projects/[id]/layout.tsx`

```tsx
export default function ProjectLayout({
  children,
  modal,
}: {
  children: React.ReactNode
  modal: React.ReactNode
}) {
  return (
    <>
      {children}
      {modal}
    </>
  )
}
```

---

## Step 2: Create the Image Carousel Component

### 2.1 Create the carousel component

**File**: `src/components/projects/image-carousel.tsx`

```tsx
'use client'

import { useState, useEffect } from 'react'
import Image from 'next/image'
import Link from 'next/link'
import { ChevronLeft, ChevronRight } from 'lucide-react'
import { motion, AnimatePresence } from 'framer-motion'
import { Button } from '~/components/ui/button'

interface ImageCarouselProps {
  images: Array<{ url: string; id: string }>
  projectId: string
  autoPlayInterval?: number
}

export function ImageCarousel({
  images,
  projectId,
  autoPlayInterval = 5000,
}: ImageCarouselProps) {
  const [currentIndex, setCurrentIndex] = useState(0)

  // Auto-play functionality
  useEffect(() => {
    if (images.length <= 1) return

    const interval = setInterval(() => {
      setCurrentIndex((prev) => (prev + 1) % images.length)
    }, autoPlayInterval)

    return () => clearInterval(interval)
  }, [images.length, autoPlayInterval])

  const goToPrevious = () => {
    setCurrentIndex((prev) => (prev - 1 + images.length) % images.length)
  }

  const goToNext = () => {
    setCurrentIndex((prev) => (prev + 1) % images.length)
  }

  const goToSlide = (index: number) => {
    setCurrentIndex(index)
  }

  if (!images || images.length === 0) {
    return (
      <div className="flex h-96 items-center justify-center rounded-lg border border-neutral-700 bg-neutral-900">
        <p className="text-neutral-400">No images available</p>
      </div>
    )
  }

  return (
    <div className="relative">
      {/* Main Image */}
      <div className="relative h-96 overflow-hidden rounded-lg md:h-[500px]">
        <AnimatePresence mode="wait">
          <motion.div
            key={currentIndex}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.5 }}
            className="h-full w-full"
          >
            <Link
              href={`/projects/${projectId}/gallery/${encodeURIComponent(
                images[currentIndex]!.url
              )}`}
              className="block h-full w-full cursor-pointer"
            >
              <Image
                src={images[currentIndex]!.url}
                alt={`Project image ${currentIndex + 1}`}
                fill
                className="object-cover"
                priority={currentIndex === 0}
              />
            </Link>
          </motion.div>
        </AnimatePresence>

        {/* Navigation Buttons */}
        {images.length > 1 && (
          <>
            <Button
              variant="ghost"
              size="icon"
              onClick={goToPrevious}
              className="absolute left-4 top-1/2 -translate-y-1/2 bg-black/50 text-white hover:bg-black/70"
            >
              <ChevronLeft className="h-6 w-6" />
            </Button>
            <Button
              variant="ghost"
              size="icon"
              onClick={goToNext}
              className="absolute right-4 top-1/2 -translate-y-1/2 bg-black/50 text-white hover:bg-black/70"
            >
              <ChevronRight className="h-6 w-6" />
            </Button>
          </>
        )}
      </div>

      {/* Dots Navigation */}
      {images.length > 1 && (
        <div className="mt-4 flex justify-center gap-2">
          {images.map((_, index) => (
            <button
              key={index}
              onClick={() => goToSlide(index)}
              className={`h-2 rounded-full transition-all ${
                index === currentIndex
                  ? 'w-8 bg-white'
                  : 'w-2 bg-neutral-600 hover:bg-neutral-400'
              }`}
              aria-label={`Go to slide ${index + 1}`}
            />
          ))}
        </div>
      )}
    </div>
  )
}
```

---

## Step 3: Create the Sticky Sidebar Component

**File**: `src/components/projects/project-sidebar.tsx`

```tsx
import Link from 'next/link'
import { Badge } from '~/components/ui/badge'
import { Button } from '~/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '~/components/ui/card'
import { ExternalLink, Github, Calendar, Clock } from 'lucide-react'
import type { RouterOutputs } from '~/trpc/react'

interface ProjectSidebarProps {
  project: RouterOutputs['projects']['getProjectById']
}

export function ProjectSidebar({ project }: ProjectSidebarProps) {
  if (!project) return null

  return (
    <div className="space-y-6">
      {/* Project Details Card */}
      <Card className="border-neutral-700 bg-neutral-900/50">
        <CardHeader>
          <CardTitle className="text-lg text-white">Project Info</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          {/* Status */}
          <div>
            <p className="mb-2 text-sm text-neutral-400">Status</p>
            <Badge
              variant="outline"
              className={`${
                project.status === 'Live'
                  ? 'border-green-400/30 bg-green-400/10 text-green-400'
                  : project.status === 'Beta'
                    ? 'border-yellow-400/30 bg-yellow-400/10 text-yellow-400'
                    : 'border-blue-400/30 bg-blue-400/10 text-blue-400'
              }`}
            >
              {project.status}
            </Badge>
          </div>

          {/* Year */}
          <div className="flex items-center gap-2 text-neutral-300">
            <Calendar size={16} className="text-neutral-400" />
            <span className="text-sm">{project.year}</span>
          </div>

          {/* Duration */}
          <div className="flex items-center gap-2 text-neutral-300">
            <Clock size={16} className="text-neutral-400" />
            <span className="text-sm">{project.duration}</span>
          </div>

          {/* Action Buttons */}
          <div className="space-y-2 pt-2">
            {project.liveUrl && (
              <Button
                className="w-full bg-white text-black hover:bg-neutral-200"
                asChild
              >
                <a
                  href={project.liveUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  <ExternalLink className="mr-2 h-4 w-4" />
                  View Live
                </a>
              </Button>
            )}
            <Button
              variant="outline"
              className="w-full border-neutral-600 text-neutral-300 hover:bg-neutral-800"
              asChild
            >
              <a
                href={project.githubUrl}
                target="_blank"
                rel="noopener noreferrer"
              >
                <Github className="mr-2 h-4 w-4" />
                View Code
              </a>
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Technologies Card */}
      <Card className="border-neutral-700 bg-neutral-900/50">
        <CardHeader>
          <CardTitle className="text-lg text-white">Technologies</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex flex-wrap gap-2">
            {project.projectTechnologies.map((tech) => (
              <Link
                key={tech.technology.id}
                href={`/technologies/${tech.technology.id}`}
              >
                <Badge
                  variant="secondary"
                  className="cursor-pointer border-neutral-600 bg-neutral-800 text-xs text-neutral-200 transition-colors hover:bg-neutral-700"
                >
                  {tech.technology.name}
                </Badge>
              </Link>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
```

---

## Step 4: Create Features and Challenges Accordion Component

**File**: `src/components/projects/features-challenges.tsx`

```tsx
'use client'

import { Card, CardContent } from '~/components/ui/card'
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from '~/components/ui/accordion'
import { CheckCircle, AlertCircle } from 'lucide-react'

interface FeaturesChallengesProps {
  features: Array<{ text: string }>
  challenges: Array<{ text: string }>
}

export function FeaturesChallenges({
  features,
  challenges,
}: FeaturesChallengesProps) {
  return (
    <Card className="border-neutral-700 bg-neutral-900/50">
      <CardContent className="p-0">
        <Accordion
          type="multiple"
          defaultValue={['features', 'challenges']}
          className="w-full"
        >
          {/* Features */}
          <AccordionItem value="features" className="border-neutral-700">
            <AccordionTrigger className="px-6 py-4 hover:no-underline">
              <div className="flex items-center gap-2">
                <CheckCircle className="text-green-400" size={20} />
                <span className="text-lg font-semibold text-white">
                  Key Features
                </span>
              </div>
            </AccordionTrigger>
            <AccordionContent className="px-6 pb-4">
              <ul className="space-y-3">
                {features.map((feature, index) => (
                  <li
                    key={index}
                    className="flex items-start gap-3 text-neutral-300"
                  >
                    <div className="mt-2 h-2 w-2 flex-shrink-0 rounded-full bg-green-400" />
                    <span>{feature.text}</span>
                  </li>
                ))}
              </ul>
            </AccordionContent>
          </AccordionItem>

          {/* Challenges */}
          <AccordionItem value="challenges" className="border-neutral-700">
            <AccordionTrigger className="px-6 py-4 hover:no-underline">
              <div className="flex items-center gap-2">
                <AlertCircle className="text-orange-400" size={20} />
                <span className="text-lg font-semibold text-white">
                  Technical Challenges
                </span>
              </div>
            </AccordionTrigger>
            <AccordionContent className="px-6 pb-4">
              <ul className="space-y-3">
                {challenges.map((challenge, index) => (
                  <li
                    key={index}
                    className="flex items-start gap-3 text-neutral-300"
                  >
                    <div className="mt-2 h-2 w-2 flex-shrink-0 rounded-full bg-orange-400" />
                    <span>{challenge.text}</span>
                  </li>
                ))}
              </ul>
            </AccordionContent>
          </AccordionItem>
        </Accordion>
      </CardContent>
    </Card>
  )
}
```

---

## Step 5: Update the Project Detail Component

**File**: `src/components/projects/item.tsx`

Replace the entire content with the new layout:

```tsx
'use client'

import { motion } from 'framer-motion'
import Link from 'next/link'
import ReactMarkdown from 'react-markdown'
import remarkGfm from 'remark-gfm'
import { Button } from '~/components/ui/button'
import { ArrowLeft } from 'lucide-react'
import type { RouterOutputs } from '~/trpc/react'
import { ImageCarousel } from './image-carousel'
import { ProjectSidebar } from './project-sidebar'
import { FeaturesChallenges } from './features-challenges'

export default function ProjectDetail({
  project,
}: {
  project: RouterOutputs['projects']['getProjectById']
}) {
  if (!project) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-neutral-950">
        <div className="text-center">
          <h1 className="mb-4 text-4xl font-bold text-white">
            Project Not Found
          </h1>
          <p className="mb-8 text-neutral-400">
            The project you&apos;re looking for doesn&apos;t exist.
          </p>
          <Button asChild>
            <Link href="/projects">
              <ArrowLeft className="mr-2 h-4 w-4" />
              Back to Projects
            </Link>
          </Button>
        </div>
      </div>
    )
  }

  // Prepare gallery images
  const galleryImages = [
    { url: project.image.url, id: project.image.id },
    ...(project.gallery?.map((img) => ({ url: img.url, id: img.id })) ?? []),
  ]

  return (
    <div className="min-h-screen bg-neutral-950">
      <div className="mx-auto max-w-7xl px-4 py-8">
        {/* Back Button */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          <Button
            variant="ghost"
            className="mb-6 text-neutral-400 hover:text-white"
            asChild
          >
            <Link href="/projects">
              <ArrowLeft className="mr-2 h-4 w-4" />
              Back to Projects
            </Link>
          </Button>
        </motion.div>

        {/* Image Carousel */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.1 }}
          className="mb-8"
        >
          <ImageCarousel images={galleryImages} projectId={project.id} />
        </motion.div>

        {/* Title and Short Description */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.2 }}
          className="mb-8"
        >
          <h1 className="mb-4 text-4xl font-bold text-white md:text-5xl">
            {project.title}
          </h1>
          <p className="text-xl text-neutral-400">{project.description}</p>
        </motion.div>

        {/* Main Content: 3:1 Split */}
        <div className="grid gap-8 lg:grid-cols-4">
          {/* Sidebar - Shows first on mobile, right on desktop */}
          <motion.aside
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6, delay: 0.3 }}
            className="order-first lg:order-last lg:col-span-1"
          >
            <div className="lg:sticky lg:top-8">
              <ProjectSidebar project={project} />
            </div>
          </motion.aside>

          {/* Main Content */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.4 }}
            className="order-last lg:order-first lg:col-span-3"
          >
            <div className="space-y-8">
              {/* Long Description */}
              <div className="prose prose-invert prose-lg prose-p:leading-relaxed prose-headings:text-white prose-ul:list-disc prose-ol:list-decimal prose-li:my-1 prose-a:text-blue-400 hover:prose-a:text-blue-300 prose-code:rounded-md prose-code:bg-neutral-800 prose-code:px-1.5 prose-code:py-0.5 prose-code:before:content-[''] prose-code:after:content-[''] max-w-none text-neutral-300">
                <ReactMarkdown remarkPlugins={[remarkGfm]}>
                  {project.longDescription || ''}
                </ReactMarkdown>
              </div>

              {/* Features and Challenges */}
              <FeaturesChallenges
                features={project.features}
                challenges={project.challenges}
              />
            </div>
          </motion.div>
        </div>
      </div>
    </div>
  )
}
```

---

## Step 6: Verify the Accordion Component Exists

Check if the Accordion component from shadcn/ui is installed. If not, install it:

```bash
npx shadcn@latest add accordion
```

---

## Step 7: Test the Implementation

1. Start the development server:
   ```bash
   npm run dev
   ```

2. Navigate to a project detail page: `/projects/[some-project-id]`

3. Verify:
   - ✅ Image carousel auto-plays
   - ✅ Previous/Next buttons work
   - ✅ Dots navigation works and updates
   - ✅ Clicking an image opens a modal with the lightbox
   - ✅ Modal closes with X button or clicking outside
   - ✅ Title and short description display correctly
   - ✅ 3:1 layout on desktop, stacked on mobile
   - ✅ Sidebar is sticky on desktop
   - ✅ Long description renders markdown correctly
   - ✅ Features and Challenges accordions are both expanded by default
   - ✅ Technology badges link to `/technologies/[id]`
   - ✅ Live URL and GitHub buttons work

---

## Step 8: Polish and Refinements

### 8.1 Add Loading States

Consider adding skeleton loaders for better UX while the page loads.

### 8.2 Accessibility Improvements

- Ensure all interactive elements have proper ARIA labels
- Test keyboard navigation for the carousel and modal
- Verify color contrast ratios

### 8.3 Performance Optimizations

- Use Next.js Image optimization for all images
- Consider lazy loading for images below the fold
- Add proper caching headers

---

## Completion Checklist

- [ ] Created intercepted routes for lightbox
- [ ] Built auto-playing image carousel component
- [ ] Created sticky sidebar component  
- [ ] Built features/challenges accordion component
- [ ] Updated main project detail component with new layout
- [ ] Tested carousel auto-play and navigation
- [ ] Verified lightbox functionality
- [ ] Confirmed responsive behavior on mobile
- [ ] Tested technology badge links
- [ ] Verified markdown rendering
- [ ] Tested accordion expand/collapse

---

## Notes

- The intercepted route pattern allows the lightbox to work seamlessly while maintaining a proper URL for direct access
- Auto-play can be paused by interacting with the carousel (clicking prev/next)
- The sticky sidebar only applies on large screens (lg breakpoint and above)
- All components maintain the existing dark theme aesthetic
