---
description: Fix Tiptap editor to load existing markdown content
---

# Fix Tiptap Editor Markdown Loading Workflow

This workflow fixes the Tiptap editor to properly load and display existing markdown content when editing a project.

## Problem

When editing an existing project, the Tiptap editor does not load the markdown content from the database, leaving the editor empty and forcing users to rewrite everything.

## Root Cause

The Tiptap editor is not properly parsing the markdown content when it's passed as the `content` prop, or it's not updating when the prop changes.

## Solution

Update the Tiptap editor to:
1. Parse markdown content on initialization
2. React to content prop changes (for when data loads asynchronously)
3. Properly convert markdown to the editor's internal format

---

## Step 1: Update the Tiptap Editor Component

**File**: `src/components/ui/editor.tsx`

### 1.1 Add useEffect to handle content updates

Add this import at the top:

```tsx
import { useEffect } from 'react'
```

### 1.2 Update the editor initialization

Replace the current `useEditor` hook (lines 42-68) with this updated version:

```tsx
const editor = useEditor({
  immediatelyRender: false,
  extensions: [
    StarterKit,
    Link.configure({
      openOnClick: false,
      HTMLAttributes: {
        class:
          'text-blue-400 underline hover:text-blue-300 transition-colors',
      },
    }),
    Placeholder.configure({
      placeholder,
    }),
    Markdown.configure({
      html: true,
      transformPastedText: true,
      transformCopiedText: true,
    }),
  ],
  content: content || '',
  onUpdate: ({ editor }) => {
    onChange(editor.storage.markdown.getMarkdown() as string)
  },
  editorProps: {
    attributes: {
      class:
        'prose prose-invert max-w-none focus:outline-none min-h-[200px] p-4 text-neutral-300',
    },
  },
})
```

### 1.3 Add effect to update editor content when prop changes

Add this `useEffect` after the `useEditor` hook:

```tsx
// Update editor content when the content prop changes
useEffect(() => {
  if (editor && content !== undefined) {
    // Get current content from editor
    const currentContent = editor.storage.markdown.getMarkdown() as string
    
    // Only update if the content has actually changed
    // This prevents infinite loops and unnecessary re-renders
    if (currentContent !== content) {
      // Use setContent with emitUpdate: false to prevent triggering onChange
      editor.commands.setContent(content, false)
    }
  }
}, [editor, content])
```

### Complete Updated Component

Here's the complete updated `editor.tsx` file:

```tsx
/* eslint-disable @typescript-eslint/no-unsafe-member-access */
/* eslint-disable @typescript-eslint/no-unsafe-call */
'use client'

import { useEditor, EditorContent } from '@tiptap/react'
import StarterKit from '@tiptap/starter-kit'
import Link from '@tiptap/extension-link'
import Placeholder from '@tiptap/extension-placeholder'
import { Markdown } from 'tiptap-markdown'
import {
  Bold,
  Italic,
  Strikethrough,
  Code,
  List,
  ListOrdered,
  Quote,
  Undo,
  Redo,
  LinkIcon,
  Unlink,
} from 'lucide-react'
import { Button } from '~/components/ui/button'
import { useState, useCallback, useEffect } from 'react'

interface TiptapEditorProps {
  content: string
  onChange: (content: string) => void
  placeholder?: string
  className?: string
}

export function TiptapEditor({
  content,
  onChange,
  placeholder = 'Start writing...',
  className = '',
}: TiptapEditorProps) {
  const [isLinkModalOpen, setIsLinkModalOpen] = useState(false)
  const [linkUrl, setLinkUrl] = useState('')

  const editor = useEditor({
    immediatelyRender: false,
    extensions: [
      StarterKit,
      Link.configure({
        openOnClick: false,
        HTMLAttributes: {
          class:
            'text-blue-400 underline hover:text-blue-300 transition-colors',
        },
      }),
      Placeholder.configure({
        placeholder,
      }),
      Markdown.configure({
        html: true,
        transformPastedText: true,
        transformCopiedText: true,
      }),
    ],
    content: content || '',
    onUpdate: ({ editor }) => {
      onChange(editor.storage.markdown.getMarkdown() as string)
    },
    editorProps: {
      attributes: {
        class:
          'prose prose-invert max-w-none focus:outline-none min-h-[200px] p-4 text-neutral-300',
      },
    },
  })

  // Update editor content when the content prop changes
  useEffect(() => {
    if (editor && content !== undefined) {
      // Get current content from editor
      const currentContent = editor.storage.markdown.getMarkdown() as string
      
      // Only update if the content has actually changed
      // This prevents infinite loops and unnecessary re-renders
      if (currentContent !== content) {
        editor.commands.setContent(content, false)
      }
    }
  }, [editor, content])

  const setLink = useCallback(() => {
    if (!editor) return

    const previousUrl = editor.getAttributes('link').href as string
    setLinkUrl(previousUrl ?? '')
    setIsLinkModalOpen(true)
  }, [editor])

  const handleSetLink = () => {
    if (!editor) return

    // cancelled
    if (linkUrl === '') {
      return
    }

    // empty
    if (linkUrl === '') {
      editor.chain().focus().extendMarkRange('link').unsetLink().run()
      setIsLinkModalOpen(false)
      return
    }

    // update link
    editor
      .chain()
      .focus()
      .extendMarkRange('link')
      .setLink({ href: linkUrl })
      .run()
    setIsLinkModalOpen(false)
    setLinkUrl('')
  }

  const unsetLink = useCallback(() => {
    if (!editor) return
    editor.chain().focus().unsetLink().run()
  }, [editor])

  if (!editor) {
    return null
  }

  return (
    <div
      className={`rounded-md border border-neutral-600 bg-neutral-800/50 ${className}`}
    >
      {/* Toolbar */}
      <div className="flex flex-wrap gap-1 border-b border-neutral-600 p-2">
        <Button
          type="button"
          variant="ghost"
          size="sm"
          onClick={() => editor.chain().focus().toggleBold().run()}
          className={`h-8 w-8 p-0 ${
            editor.isActive('bold')
              ? 'bg-neutral-700 text-white'
              : 'text-neutral-400 hover:bg-neutral-700 hover:text-white'
          }`}
        >
          <Bold size={16} />
        </Button>

        <Button
          type="button"
          variant="ghost"
          size="sm"
          onClick={() => editor.chain().focus().toggleItalic().run()}
          className={`h-8 w-8 p-0 ${
            editor.isActive('italic')
              ? 'bg-neutral-700 text-white'
              : 'text-neutral-400 hover:bg-neutral-700 hover:text-white'
          }`}
        >
          <Italic size={16} />
        </Button>

        <Button
          type="button"
          variant="ghost"
          size="sm"
          onClick={() => editor.chain().focus().toggleStrike().run()}
          className={`h-8 w-8 p-0 ${
            editor.isActive('strike')
              ? 'bg-neutral-700 text-white'
              : 'text-neutral-400 hover:bg-neutral-700 hover:text-white'
          }`}
        >
          <Strikethrough size={16} />
        </Button>

        <Button
          type="button"
          variant="ghost"
          size="sm"
          onClick={() => editor.chain().focus().toggleCode().run()}
          className={`h-8 w-8 p-0 ${
            editor.isActive('code')
              ? 'bg-neutral-700 text-white'
              : 'text-neutral-400 hover:bg-neutral-700 hover:text-white'
          }`}
        >
          <Code size={16} />
        </Button>

        <div className="mx-1 h-6 w-px bg-neutral-600" />

        <Button
          type="button"
          variant="ghost"
          size="sm"
          onClick={() => editor.chain().focus().toggleBulletList().run()}
          className={`h-8 w-8 p-0 ${
            editor.isActive('bulletList')
              ? 'bg-neutral-700 text-white'
              : 'text-neutral-400 hover:bg-neutral-700 hover:text-white'
          }`}
        >
          <List size={16} />
        </Button>

        <Button
          type="button"
          variant="ghost"
          size="sm"
          onClick={() => editor.chain().focus().toggleOrderedList().run()}
          className={`h-8 w-8 p-0 ${
            editor.isActive('orderedList')
              ? 'bg-neutral-700 text-white'
              : 'text-neutral-400 hover:bg-neutral-700 hover:text-white'
          }`}
        >
          <ListOrdered size={16} />
        </Button>

        <Button
          type="button"
          variant="ghost"
          size="sm"
          onClick={() => editor.chain().focus().toggleBlockquote().run()}
          className={`h-8 w-8 p-0 ${
            editor.isActive('blockquote')
              ? 'bg-neutral-700 text-white'
              : 'text-neutral-400 hover:bg-neutral-700 hover:text-white'
          }`}
        >
          <Quote size={16} />
        </Button>

        <div className="mx-1 h-6 w-px bg-neutral-600" />

        <Button
          type="button"
          variant="ghost"
          size="sm"
          onClick={setLink}
          className={`h-8 w-8 p-0 ${
            editor.isActive('link')
              ? 'bg-neutral-700 text-white'
              : 'text-neutral-400 hover:bg-neutral-700 hover:text-white'
          }`}
        >
          <LinkIcon size={16} />
        </Button>

        {editor.isActive('link') && (
          <Button
            type="button"
            variant="ghost"
            size="sm"
            onClick={unsetLink}
            className="h-8 w-8 p-0 text-neutral-400 hover:bg-neutral-700 hover:text-white"
          >
            <Unlink size={16} />
          </Button>
        )}

        <div className="mx-1 h-6 w-px bg-neutral-600" />

        <Button
          type="button"
          variant="ghost"
          size="sm"
          onClick={() => editor.chain().focus().undo().run()}
          disabled={!editor.can().chain().focus().undo().run()}
          className="h-8 w-8 p-0 text-neutral-400 hover:bg-neutral-700 hover:text-white disabled:cursor-not-allowed disabled:opacity-50"
        >
          <Undo size={16} />
        </Button>

        <Button
          type="button"
          variant="ghost"
          size="sm"
          onClick={() => editor.chain().focus().redo().run()}
          disabled={!editor.can().chain().focus().redo().run()}
          className="h-8 w-8 p-0 text-neutral-400 hover:bg-neutral-700 hover:text-white disabled:cursor-not-allowed disabled:opacity-50"
        >
          <Redo size={16} />
        </Button>
      </div>

      {/* Editor Content */}
      <EditorContent editor={editor} />

      {/* Link Modal */}
      {isLinkModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50">
          <div className="w-96 rounded-lg border border-neutral-700 bg-neutral-900 p-6">
            <h3 className="mb-4 font-medium text-white">Add Link</h3>
            <input
              type="url"
              placeholder="Enter URL"
              value={linkUrl}
              onChange={(e) => setLinkUrl(e.target.value)}
              className="mb-4 w-full rounded border border-neutral-600 bg-neutral-800 px-3 py-2 text-white placeholder:text-neutral-500"
              autoFocus
              onKeyDown={(e) => {
                if (e.key === 'Enter') {
                  handleSetLink()
                } else if (e.key === 'Escape') {
                  setIsLinkModalOpen(false)
                  setLinkUrl('')
                }
              }}
            />
            <div className="flex justify-end gap-2">
              <Button
                type="button"
                variant="outline"
                size="sm"
                onClick={() => {
                  setIsLinkModalOpen(false)
                  setLinkUrl('')
                }}
                className="border-neutral-600 text-neutral-300"
              >
                Cancel
              </Button>
              <Button
                type="button"
                size="sm"
                onClick={handleSetLink}
                className="bg-white text-black hover:bg-neutral-200"
              >
                Add Link
              </Button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
```

---

## Step 2: Verify the Edit Component Usage

The edit component (`src/components/projects/edit.tsx`) already passes the content correctly:

```tsx
<TiptapEditor
  content={formData.longDescription}
  onChange={handleLongDescriptionChange}
  placeholder="Write a detailed description of your project..."
  className="min-h-[300px]"
/>
```

This should work correctly with our updated editor.

---

## Step 3: Test the Fix

1. Start the development server:
   ```bash
   npm run dev
   ```

2. Navigate to an existing project's edit page: `/admin/projects/[project-id]/edit`

3. Verify:
   - ✅ The Tiptap editor loads with the existing markdown content
   - ✅ The content is properly formatted (bold, italic, lists, etc.)
   - ✅ You can edit the existing content
   - ✅ Saving preserves the changes correctly
   - ✅ The markdown is properly converted to HTML on the public project page

---

## Step 4: Additional Testing Scenarios

### Test Case 1: Create New Project
- Navigate to `/admin/projects/new`
- Verify the editor starts empty with the placeholder text

### Test Case 2: Edit Existing Project
- Navigate to `/admin/projects/[id]/edit`
- Verify existing markdown loads correctly
- Make edits and save
- View the project page to confirm changes rendered correctly

### Test Case 3: Complex Markdown
Test with markdown that includes:
- **Bold** and *italic* text
- Links
- Bullet lists
- Numbered lists
- Block quotes
- Inline code
- Multiple paragraphs

### Test Case 4: Empty Content
- Edit a project with no long description
- Verify the editor shows the placeholder
- Add content and save

---

## Troubleshooting

### Issue: Editor still shows empty content

**Solution**: Check the data type being passed. Ensure `formData.longDescription` is a string, not null or undefined.

Add this to the edit component if needed:

```tsx
<TiptapEditor
  content={formData.longDescription || ''}
  onChange={handleLongDescriptionChange}
  placeholder="Write a detailed description of your project..."
  className="min-h-[300px]"
/>
```

### Issue: Content flashes when loading

**Solution**: This is normal as the editor initializes. You can add a loading state:

```tsx
const [isEditorReady, setIsEditorReady] = useState(false)

// In useEffect after setting formData
useEffect(() => {
  if (project) {
    setFormData({...})
    setIsEditorReady(true)
  }
}, [project])

// In JSX
{isEditorReady && (
  <TiptapEditor
    content={formData.longDescription}
    onChange={handleLongDescriptionChange}
    placeholder="Write a detailed description..."
    className="min-h-[300px]"
  />
)}
```

### Issue: Markdown not converting properly

**Solution**: Verify the `tiptap-markdown` package is installed and the Markdown extension is configured correctly:

```bash
npm list tiptap-markdown
```

If not installed:

```bash
npm install tiptap-markdown
```

---

## Completion Checklist

- [ ] Updated Tiptap editor with content change effect
- [ ] Configured Markdown extension properly
- [ ] Tested editor loads existing content
- [ ] Verified content can be edited
- [ ] Confirmed saves work correctly
- [ ] Tested with various markdown formats
- [ ] Verified placeholder shows on empty content
- [ ] Tested create new project flow
- [ ] Tested edit existing project flow

---

## Notes

- The key fix is adding the `useEffect` that watches for content changes and updates the editor
- The `editor.commands.setContent(content, false)` method is used with `false` to prevent triggering the `onChange` callback, which would create an infinite loop
- The Markdown extension configuration includes `html: true` to support HTML in markdown if needed
- The fix maintains backward compatibility - existing functionality is not affected
