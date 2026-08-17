"use client"

import { useEditor, EditorContent } from "@tiptap/react"
import StarterKit from "@tiptap/starter-kit"
import Image from "@tiptap/extension-image"
import Placeholder from "@tiptap/extension-placeholder"
import { Bold, Italic, List, ListOrdered, ImageIcon, Undo, Redo } from "lucide-react"

interface TipTapEditorProps {
  value: string
  onChange: (value: string) => void
  placeholder?: string
  /** When false, bullet/ordered list extensions and toolbar buttons are disabled. */
  allowLists?: boolean
}

export function TipTapEditor({ value, onChange, placeholder, allowLists = true }: TipTapEditorProps) {
  const editor = useEditor({
    extensions: [
      allowLists
        ? StarterKit
        : StarterKit.configure({ bulletList: false, orderedList: false }),
      Image,
      Placeholder.configure({ placeholder: placeholder ?? "Tulis deskripsi..." }),
    ],
    content: value,
    onUpdate: ({ editor }) => onChange(editor.getHTML()),
    editorProps: {
      attributes: {
        class: "prose prose-sm max-w-none min-h-[200px] px-4 py-3 outline-none",
      },
    },
  })

  if (!editor) return null

  const ToolButton = ({ onClick, active, label, children }: { onClick: () => void; active: boolean; label: string; children: React.ReactNode }) => (
    <button
      type="button"
      onClick={onClick}
      title={label}
      className={`flex size-8 items-center justify-center rounded-lg text-sm transition-colors ${
        active ? "bg-[#0B3C6D] text-white" : "text-[#6B7280] hover:bg-[#F8FAFC] hover:text-[#0B3C6D]"
      }`}
    >
      {children}
    </button>
  )

  return (
    <div className="rounded-xl border border-[#E5E7EB] overflow-hidden">
      <div className="flex flex-wrap gap-0.5 border-b border-[#E5E7EB] bg-[#F8FAFC] px-2 py-2">
        <ToolButton onClick={() => editor.chain().focus().toggleBold().run()} active={editor.isActive("bold")} label="Bold">
          <Bold className="size-4" />
        </ToolButton>
        <ToolButton onClick={() => editor.chain().focus().toggleItalic().run()} active={editor.isActive("italic")} label="Italic">
          <Italic className="size-4" />
        </ToolButton>
        <div className="mx-1 w-px bg-[#E5E7EB]" />
        {allowLists && (
          <>
            <ToolButton onClick={() => editor.chain().focus().toggleBulletList().run()} active={editor.isActive("bulletList")} label="Bullet List">
              <List className="size-4" />
            </ToolButton>
            <ToolButton onClick={() => editor.chain().focus().toggleOrderedList().run()} active={editor.isActive("orderedList")} label="Ordered List">
              <ListOrdered className="size-4" />
            </ToolButton>
            <div className="mx-1 w-px bg-[#E5E7EB]" />
          </>
        )}
        <ToolButton onClick={() => {
          const url = prompt("Image URL:")
          if (url) editor.chain().focus().setImage({ src: url }).run()
        }} active={false} label="Image">
          <ImageIcon className="size-4" />
        </ToolButton>
        <div className="ml-auto flex gap-0.5">
          <ToolButton onClick={() => editor.chain().focus().undo().run()} active={false} label="Undo">
            <Undo className="size-4" />
          </ToolButton>
          <ToolButton onClick={() => editor.chain().focus().redo().run()} active={false} label="Redo">
            <Redo className="size-4" />
          </ToolButton>
        </div>
      </div>
      <EditorContent editor={editor} />
    </div>
  )
}
