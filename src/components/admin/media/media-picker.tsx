"use client"

import { useState, useEffect, useCallback } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { X, Search, ImageIcon, Check } from "lucide-react"
import { getMediaList } from "@/actions/media"
import { cn } from "@/lib/utils"

type MediaPickerItem = {
  id: string
  url: string
  thumbnailUrl?: string | null
  filename: string
  mimeType: string
  alt?: string | null
}

interface MediaPickerProps {
  open: boolean
  onClose: () => void
  onSelect: (media: { id: string; url: string; thumbnailUrl?: string | null; alt?: string | null }) => void
  multiple?: boolean
  folderId?: string | null
}

export function MediaPicker({ open, onClose, onSelect, multiple = false, folderId }: MediaPickerProps) {
  const [items, setItems] = useState<MediaPickerItem[]>([])
  const [loading, setLoading] = useState(true)
  const [search, setSearch] = useState("")
  const [selectedId, setSelectedId] = useState<string | null>(null)
  const [selectedIds, setSelectedIds] = useState<string[]>([])

  const fetchData = useCallback(async () => {
    setLoading(true)
    try {
      const result = await getMediaList({ search, limit: 50, folderId })
      setItems(result.data as MediaPickerItem[])
    } catch { setItems([]) }
    finally { setLoading(false) }
  }, [search, folderId])

  useEffect(() => { if (open) fetchData() }, [fetchData, open])

  useEffect(() => { setSelectedId(null); setSelectedIds([]) }, [search])

  const handleSelect = (item: MediaPickerItem) => {
    if (multiple) {
      setSelectedIds((prev) => prev.includes(item.id) ? prev.filter((id) => id !== item.id) : [...prev, item.id])
    } else {
      setSelectedId(item.id)
    }
  }

  const handleConfirm = () => {
    if (multiple) {
      const selected = items.filter((i) => selectedIds.includes(i.id))
      selected.forEach((s) => onSelect({ id: s.id, url: s.url, thumbnailUrl: s.thumbnailUrl, alt: s.alt }))
    } else {
      const item = items.find((i) => i.id === selectedId)
      if (item) onSelect({ id: item.id, url: item.url, thumbnailUrl: item.thumbnailUrl, alt: item.alt })
    }
    onClose()
  }

  const hasSelection = multiple ? selectedIds.length > 0 : selectedId !== null

  return (
    <AnimatePresence>
      {open && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4"
          onClick={onClose}
        >
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.95 }}
            className="w-full max-w-3xl rounded-2xl bg-white shadow-2xl max-h-[80vh] flex flex-col"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-center justify-between border-b border-gray-200 px-6 py-4">
              <h2 className="text-lg font-bold text-gray-900">{multiple ? "Select Media" : "Select Media"}</h2>
              <button onClick={onClose} className="rounded-lg p-1.5 text-gray-400 hover:bg-gray-100">
                <X className="size-5" />
              </button>
            </div>

            <div className="px-6 py-3 border-b border-gray-100">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 size-4 -translate-y-1/2 text-gray-400" />
                <input
                  type="text"
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                  placeholder="Search media..."
                  className="w-full rounded-xl border border-gray-200 pl-9 pr-4 py-2 text-sm outline-none focus:border-blue-400 focus:ring-2 focus:ring-blue-100"
                />
              </div>
            </div>

            <div className="flex-1 overflow-y-auto p-6">
              {loading ? (
                <div className="flex items-center justify-center py-20">
                  <div className="size-8 animate-spin rounded-full border-2 border-gray-200 border-t-[#0B3C6D]" />
                </div>
              ) : items.length === 0 ? (
                <div className="flex flex-col items-center justify-center py-20 text-gray-400">
                  <ImageIcon className="size-12 mb-3 opacity-50" />
                  <p className="text-sm">No media found</p>
                </div>
              ) : (
                <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-3">
                  {items.map((item) => {
                    const isSelected = multiple ? selectedIds.includes(item.id) : selectedId === item.id
                    return (
                      <div
                        key={item.id}
                        onClick={() => handleSelect(item)}
                        className={cn(
                          "relative aspect-square rounded-xl border-2 overflow-hidden cursor-pointer transition-all hover:shadow-lg group",
                          isSelected ? "border-blue-500 ring-2 ring-blue-200" : "border-gray-200"
                        )}
                      >
                        {item.mimeType?.startsWith("image/") ? (
                          <img src={item.thumbnailUrl || item.url} alt={item.alt || ""} className="size-full object-cover" loading="lazy" />
                        ) : (
                          <div className="size-full bg-gray-100 flex items-center justify-center">
                            <ImageIcon className="size-8 text-gray-300" />
                          </div>
                        )}
                        {isSelected && (
                          <div className="absolute top-2 right-2 rounded-full bg-blue-500 p-0.5">
                            <Check className="size-3 text-white" />
                          </div>
                        )}
                        <div className="absolute bottom-0 inset-x-0 bg-gradient-to-t from-black/60 to-transparent p-2 opacity-0 group-hover:opacity-100 transition-opacity">
                          <p className="text-[10px] text-white truncate">{item.alt || item.filename}</p>
                        </div>
                      </div>
                    )
                  })}
                </div>
              )}
            </div>

            <div className="flex items-center justify-between border-t border-gray-200 px-6 py-4">
              <span className="text-xs text-gray-400">{items.length} files</span>
              <div className="flex gap-2">
                <button onClick={onClose} className="rounded-xl border border-gray-200 px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50">
                  Cancel
                </button>
                <button
                  onClick={handleConfirm}
                  disabled={!hasSelection}
                  className="rounded-xl bg-[#0B3C6D] px-4 py-2 text-sm font-semibold text-white shadow-lg shadow-[#0B3C6D]/20 transition-all hover:bg-[#0B2D52] disabled:opacity-50"
                >
                  {multiple ? `Select (${selectedIds.length})` : "Select"}
                </button>
              </div>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  )
}
