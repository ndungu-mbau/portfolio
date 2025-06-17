/* eslint-disable @typescript-eslint/no-unsafe-member-access */
/* eslint-disable @typescript-eslint/no-unsafe-call */
"use client";

import { useEditor, EditorContent } from "@tiptap/react";
import StarterKit from "@tiptap/starter-kit";
import Link from "@tiptap/extension-link";
import Placeholder from "@tiptap/extension-placeholder";
import { Markdown } from "tiptap-markdown";
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
} from "lucide-react";
import { Button } from "~/components/ui/button";
import { useState, useCallback } from "react";

interface TiptapEditorProps {
  content: string;
  onChange: (content: string) => void;
  placeholder?: string;
  className?: string;
}

export function TiptapEditor({
  content,
  onChange,
  placeholder = "Start writing...",
  className = "",
}: TiptapEditorProps) {
  const [isLinkModalOpen, setIsLinkModalOpen] = useState(false);
  const [linkUrl, setLinkUrl] = useState("");

  const editor = useEditor({
    immediatelyRender: false,
    extensions: [
      StarterKit,
      Link.configure({
        openOnClick: false,
        HTMLAttributes: {
          class:
            "text-blue-400 underline hover:text-blue-300 transition-colors",
        },
      }),
      Placeholder.configure({
        placeholder,
      }),
      Markdown,
    ],
    content,
    onUpdate: ({ editor }) => {
      onChange(editor.storage.markdown.getMarkdown() as string);
    },
    editorProps: {
      attributes: {
        class:
          "prose prose-invert max-w-none focus:outline-none min-h-[200px] p-4 text-neutral-300",
      },
    },
  });

  const setLink = useCallback(() => {
    if (!editor) return;

    const previousUrl = editor.getAttributes("link").href as string;
    setLinkUrl(previousUrl ?? "");
    setIsLinkModalOpen(true);
  }, [editor]);

  const handleSetLink = () => {
    if (!editor) return;

    // cancelled
    if (linkUrl === "") {
      return;
    }

    // empty
    if (linkUrl === "") {
      editor.chain().focus().extendMarkRange("link").unsetLink().run();
      setIsLinkModalOpen(false);
      return;
    }

    // update link
    editor
      .chain()
      .focus()
      .extendMarkRange("link")
      .setLink({ href: linkUrl })
      .run();
    setIsLinkModalOpen(false);
    setLinkUrl("");
  };

  const unsetLink = useCallback(() => {
    if (!editor) return;
    editor.chain().focus().unsetLink().run();
  }, [editor]);

  if (!editor) {
    return null;
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
            editor.isActive("bold")
              ? "bg-neutral-700 text-white"
              : "text-neutral-400 hover:bg-neutral-700 hover:text-white"
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
            editor.isActive("italic")
              ? "bg-neutral-700 text-white"
              : "text-neutral-400 hover:bg-neutral-700 hover:text-white"
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
            editor.isActive("strike")
              ? "bg-neutral-700 text-white"
              : "text-neutral-400 hover:bg-neutral-700 hover:text-white"
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
            editor.isActive("code")
              ? "bg-neutral-700 text-white"
              : "text-neutral-400 hover:bg-neutral-700 hover:text-white"
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
            editor.isActive("bulletList")
              ? "bg-neutral-700 text-white"
              : "text-neutral-400 hover:bg-neutral-700 hover:text-white"
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
            editor.isActive("orderedList")
              ? "bg-neutral-700 text-white"
              : "text-neutral-400 hover:bg-neutral-700 hover:text-white"
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
            editor.isActive("blockquote")
              ? "bg-neutral-700 text-white"
              : "text-neutral-400 hover:bg-neutral-700 hover:text-white"
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
            editor.isActive("link")
              ? "bg-neutral-700 text-white"
              : "text-neutral-400 hover:bg-neutral-700 hover:text-white"
          }`}
        >
          <LinkIcon size={16} />
        </Button>

        {editor.isActive("link") && (
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
                if (e.key === "Enter") {
                  handleSetLink();
                } else if (e.key === "Escape") {
                  setIsLinkModalOpen(false);
                  setLinkUrl("");
                }
              }}
            />
            <div className="flex justify-end gap-2">
              <Button
                type="button"
                variant="outline"
                size="sm"
                onClick={() => {
                  setIsLinkModalOpen(false);
                  setLinkUrl("");
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
  );
}
