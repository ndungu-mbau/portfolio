import { createUploadthing, type FileRouter } from 'uploadthing/next'
import { db } from '~/server/db'
import { uploads } from '~/server/db/schema'
import { eq } from 'drizzle-orm'

const f = createUploadthing()

export const ourFileRouter = {
  imageUploader: f({
    image: { maxFileSize: '4MB', maxFileCount: 10 },
  }).onUploadComplete(async ({ file }) => {
    try {
      // Save file details directly to the database
      const [savedFile] = await db
        .insert(uploads)
        .values({
          name: file.name,
          url: file.ufsUrl,
          size: file.size.toString(),
          key: file.key,
        })
        .returning()

      if (!savedFile) {
        throw new Error('Failed to save file to database')
      }

      // Return the saved file data to the client
      return {
        success: true,
        file: savedFile,
      }
    } catch (error) {
      console.error('Error saving file to database:', error)
      return {
        success: false,
        error: 'Failed to save file details to database',
        details: error instanceof Error ? error.message : 'Unknown error',
      }
    }
  }),
} satisfies FileRouter

export type OurFileRouter = typeof ourFileRouter
