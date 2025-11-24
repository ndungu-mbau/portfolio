---
description: Add featured field to technologies table and filter hero section
---

# Add Featured Technologies Field and Filter Hero Section

This workflow outlines the steps to add a 'featured' boolean field to the technologies table and update the hero section to display only featured technologies in the typewriter effect.

## Prerequisites
- Database connection is working
- You have access to run database migrations
- pnpm is installed and configured

## Step 1: Update the Database Schema

Add a `featured` nullable boolean field to the `technologies` table in `/home/mbau/Work/portfolio/src/server/db/schema.ts`:

```typescript
// In the technologies table definition (around line 105-121)
// Add this field after the 'github' field:
featured: d.boolean(),
```

**Note:** The field is nullable in the database. We'll handle the null-to-false conversion in the tRPC router logic.

## Step 2: Generate and Run Database Migration

Generate a new migration for the schema change:

```bash
cd /home/mbau/Work/portfolio
pnpm db:generate
```

This will create a new migration file in the `drizzle` directory.

Review the generated migration to ensure it correctly adds the `featured` column as nullable.

Apply the migration to update the database:

```bash
pnpm db:migrate
```

## Step 3: Update the Technologies API Router

Update `/home/mbau/Work/portfolio/src/server/api/routers/technologies.ts`:

### 3a. Add the featured field to the create mutation input schema (around line 14-29):

```typescript
.input(
  z.object({
    name: z.string(),
    category: z.enum([
      'Frontend',
      'Backend',
      'Database',
      'Cloud',
      'DevOps',
    ]),
    url: z.string(),
    github: z.string(),
    image: z.string(),
    featured: z.boolean().default(false), // Add this line
  })
)
```

### 3b. Add the featured field to the update mutation input schema (around line 43-59):

```typescript
.input(
  z.object({
    id: z.string().uuid(),
    name: z.string(),
    category: z.enum([
      'Frontend',
      'Backend',
      'Database',
      'Cloud',
      'DevOps',
    ]),
    url: z.string(),
    github: z.string(),
    image: z.string(),
    featured: z.boolean().default(false), // Add this line
  })
)
```

### 3c. Update getAllTechnologies to handle null featured field

Modify the `getAllTechnologies` procedure (around line 97-112) to convert null to false:

```typescript
getAllTechnologies: publicProcedure.query(async () => {
  try {
    const allTechnologies = await db.query.technologies.findMany({
      with: {
        image: true,
      },
    })
    // Convert null featured values to false
    return allTechnologies.map((tech) => ({
      ...tech,
      featured: tech.featured ?? false,
    }))
  } catch (e) {
    console.error(e)
    throw new TRPCError({
      code: 'INTERNAL_SERVER_ERROR',
      message: 'Technologies not found',
    })
  }
}),
```

### 3d. Create a new procedure to get featured technologies

Add this new procedure after the `getAllTechnologies` procedure (around line 112):

```typescript
getFeaturedTechnologies: publicProcedure.query(async () => {
  try {
    const featuredTechnologies = await db.query.technologies.findMany({
      where: (tbl, { eq }) => eq(tbl.featured, true),
      with: {
        image: true,
      },
    })
    // Return empty array if no featured technologies found (expected behavior)
    return featuredTechnologies.map((tech) => ({
      ...tech,
      featured: tech.featured ?? false,
    }))
  } catch (e) {
    console.error(e)
    throw new TRPCError({
      code: 'INTERNAL_SERVER_ERROR',
      message: 'Featured technologies not found',
    })
  }
}),
```

## Step 4: Update the Hero Section Component

Update `/home/mbau/Work/portfolio/src/components/hero-section.tsx`:

Change the query from `getAllTechnologies` to `getFeaturedTechnologies` (around line 12-13):

```typescript
// Change from:
const { data: technologies = [], isLoading } =
  api.technologies.getAllTechnologies.useQuery()

// To:
const { data: technologies = [], isLoading } =
  api.technologies.getFeaturedTechnologies.useQuery()
```

## Step 5: Update Admin Technology Drawer

Update `/home/mbau/Work/portfolio/src/app/(admin)/admin/technologies/page.tsx` to add the featured field:

### 5a. Add featured to the state (around line 50-56):

```typescript
const [newTech, setNewTech] = useState({
  name: '',
  category: 'Frontend',
  url: '',
  github: '',
  image: '',
  featured: false, // Add this line
})
```

### 5b. Reset featured in success handler (around line 77-83):

```typescript
setNewTech({
  name: '',
  category: 'Frontend',
  url: '',
  github: '',
  image: '',
  featured: false, // Add this line
})
```

### 5c. Add featured field to mutation (around line 127-138):

```typescript
createTech({
  name: newTech.name,
  category: newTech.category as
    | 'Frontend'
    | 'Backend'
    | 'Database'
    | 'Cloud'
    | 'DevOps',
  url: newTech.url,
  github: newTech.github,
  image: newTech.image ?? '',
  featured: newTech.featured, // Add this line
})
```

### 5d. Add Checkbox UI component import (around line 9-33):

```typescript
import { Checkbox } from '~/components/ui/checkbox'
```

### 5e. Add featured checkbox in the drawer form (add this after the image upload section, around line 310):

```typescript
<div className="space-y-2">
  <div className="flex items-center space-x-2">
    <Checkbox
      id="tech-featured"
      checked={newTech.featured}
      onCheckedChange={(checked) =>
        setNewTech({ ...newTech, featured: checked as boolean })
      }
    />
    <Label
      htmlFor="tech-featured"
      className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70 text-white cursor-pointer"
    >
      Featured Technology
    </Label>
  </div>
  <p className="text-xs text-neutral-400">
    Featured technologies will appear in the hero section typewriter effect
  </p>
</div>
```

## Step 6: Verify the Changes

### 6a. Check TypeScript compilation:

```bash
cd /home/mbau/Work/portfolio
pnpm typecheck
```

### 6b. Start the development server:

```bash
pnpm dev
```

### 6c. Manual verification steps:

1. Navigate to `/admin/technologies`
2. Click "Add Technology" and verify the "Featured Technology" checkbox appears
3. Create a new technology with the featured checkbox checked
4. Visit the homepage and verify that the featured technology appears in the typewriter effect in the hero section
5. Create another technology without checking featured, and verify it doesn't appear in the hero
6. Mark different technologies as featured and confirm the hero section updates accordingly

## Notes

- The `featured` field is nullable in the database but defaults to `false` in the tRPC router when null
- New technologies default to `featured: false` unless explicitly checked in the admin form
- Similar to the projects table which already has a `featured` field, this maintains consistency in your schema
- **Expected Behavior:** If no technologies are marked as featured, the hero section will show an empty array, resulting in no typewriter effect. In production, ensure at least one technology is featured.

## Rollback

If you need to rollback these changes:

1. Revert the schema changes in `schema.ts`
2. Revert the API router changes in `technologies.ts`
3. Revert the hero section component changes in `hero-section.tsx`
4. Revert the admin page changes in `technologies/page.tsx`
5. Generate and apply a migration to remove the `featured` column from the database
