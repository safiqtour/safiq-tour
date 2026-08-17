"use client"

import { motion } from "framer-motion"
import { ImageIcon, FileText, Video, Trash2, Undo } from "lucide-react"
import { cn } from "@/lib/utils"

interface MediaGridItem {
  id: string
  url: string
  thumbnailUrl?: string | null
  filename: string
  originalName?: string
  mimeType: string
  size: number
  width?: number | null
  height?: number | null
  alt?: string | null
  caption?: string
  description?: string
  dominantColor?: string
  storageProvider?: string
  folder?: { id: string; name: string } | null
  uploadedBy?: { id: string; name: string | null } | null
  tags?: { tag: { id: string; name: string } }[]
  usage?: { id: string; entity: string; entityId: string; field: string }[]
  createdAt?: Date | string
  updatedAt?: Date | string
  deletedAt?: Date | string | null
}

interface MediaGridProps {
  items: MediaGridItem[]
  selectedIds: string[]
  onSelect: (id: string) => void
  onSelectAll: () => void
  onDelete: (id: string) => void
  onRestore: (id: string) => void
  onPreview: (item: MediaGridItem) => void
}

function formatSize(bytes: number) {
  if (bytes < 1024) return `${bytes} B`
  if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`
  return `${(bytes / (1024 * 1024)).toFixed(1)} MB`
}

function getFileIcon(mimeType: string) {
  if (mimeType.startsWith("video/")) return <Video className="size-6 text-purple-400" />
  if (mimeType === "application/pdf") return <FileText className="size-6 text-red-400" />
  return <ImageIcon className="size-6 text-blue-400" />
}

export function MediaGrid({ items, selectedIds, onSelect, onSelectAll, onDelete, onRestore, onPreview }: MediaGridProps) {
  const allSelected = items.length > 0 && selectedIds.length === items.length && !items.some((i) => i.deletedAt)

  return (
    <div>
      {items.length > 0 && (
        <div className="mb-3 flex items-center gap-2">
          <label className="flex items-center gap-2 cursor-pointer">
            <input type="checkbox" checked={allSelected} onChange={onSelectAll} className="size-4 rounded border-gray-300" />
            <span className="text-xs text-gray-500">Select all ({items.length})</span>
          </label>
        </div>
      )}

      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-3">
        {items.map((item) => {
          const isSelected = selectedIds.includes(item.id)
          const isImage = item.mimeType.startsWith("image/")

          return (
            <motion.div
              key={item.id}
              layout
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              className={cn(
                "group relative rounded-xl border-2 overflow-hidden cursor-pointer transition-all hover:shadow-lg",
                isSelected ? "border-blue-500 ring-2 ring-blue-200" : "border-gray-200",
                item.deletedAt && "opacity-60 border-dashed"
              )}
              onClick={() => onPreview(item)}
            >
              <div className="absolute top-2 left-2 z-10">
                <input
                  type="checkbox"
                  checked={isSelected}
                  onChange={(e) => { e.stopPropagation(); onSelect(item.id) }}
                  className="size-4 rounded border-gray-300"
                />
              </div>

              <div className="aspect-square bg-gray-100 flex items-center justify-center overflow-hidden">
                {isImage ? (
                  <img
                    src={item.thumbnailUrl || item.url}
                    alt={item.alt || item.filename}
                    className="size-full object-cover group-hover:scale-105 transition-transform duration-300"
                    loading="lazy"
                  />
                ) : (
                  <div className="flex flex-col items-center gap-1">
                    {getFileIcon(item.mimeType)}
                    <span className="text-[10px] text-gray-400 font-medium uppercase">
                      {item.mimeType.split("/").pop()}
                    </span>
                  </div>
                )}
              </div>

              <div className="p-2">
                <p className="text-xs font-medium text-gray-700 truncate">{item.alt || item.filename}</p>
                <p className="text-[10px] text-gray-400 mt-0.5">{formatSize(item.size)}</p>
              </div>

              <div className="absolute top-2 right-2 hidden group-hover:flex gap-1 z-10">
                {item.deletedAt ? (
                  <button
                    onClick={(e) => { e.stopPropagation(); onRestore(item.id) }}
                    className="rounded-lg bg-green-500 p-1.5 text-white hover:bg-green-600 transition-colors"
                    title="Restore"
                  >
                    <Undo className="size-3" />
                  </button>
                ) : (
                  <button
                    onClick={(e) => { e.stopPropagation(); onDelete(item.id) }}
                    className="rounded-lg bg-red-500 p-1.5 text-white hover:bg-red-600 transition-colors"
                    title="Trash"
                  >
                    <Trash2 className="size-3" />
                  </button>
                )}
              </div>

              {item.deletedAt && (
                <div className="absolute inset-0 flex items-center justify-center bg-black/20">
                  <span className="bg-black/70 text-white text-[10px] px-2 py-0.5 rounded-full">Deleted</span>
                </div>
              )}
            </motion.div>
          )
        })}
      </div>

      {items.length === 0 && (
        <div className="flex flex-col items-center justify-center py-20 text-gray-400">
          <ImageIcon className="size-12 mb-3 opacity-50" />
          <p className="text-sm">No media found</p>
          <p className="text-xs mt-1">Upload files or adjust filters</p>
        </div>
      )}
    </div>
  )
}
