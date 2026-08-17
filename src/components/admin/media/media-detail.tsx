"use client"

import { motion, AnimatePresence } from "framer-motion"
import { X, ImageIcon, FileText, Video, Trash2, Undo, Tag, FolderOpen, ExternalLink } from "lucide-react"

interface MediaDetailItem {
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
  createdAt?: Date | string
  updatedAt?: Date | string
  deletedAt?: Date | string | null
  tags?: { tag: { id: string; name: string } }[]
  usage?: { id: string; entity: string; entityId: string; field: string }[]
}

interface MediaDetailProps {
  item: MediaDetailItem | null
  open: boolean
  onClose: () => void
  onDelete: (id: string) => void
  onRestore: (id: string) => void
}

function formatSize(bytes: number) {
  if (bytes < 1024) return `${bytes} B`
  if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`
  return `${(bytes / (1024 * 1024)).toFixed(1)} MB`
}

export function MediaDetail({ item, open, onClose, onDelete, onRestore }: MediaDetailProps) {
  if (!item) return null

  const isImage = item.mimeType.startsWith("image/")

  return (
    <AnimatePresence>
      {open && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 z-50 flex justify-end bg-black/30"
          onClick={onClose}
        >
          <motion.div
            initial={{ x: "100%" }}
            animate={{ x: 0 }}
            exit={{ x: "100%" }}
            transition={{ type: "spring", damping: 25, stiffness: 200 }}
            className="w-full max-w-lg bg-white shadow-2xl overflow-y-auto"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="sticky top-0 z-10 flex items-center justify-between border-b border-gray-200 bg-white px-5 py-4">
              <h2 className="text-base font-bold text-gray-900 truncate">{item.filename}</h2>
              <button onClick={onClose} className="rounded-lg p-1.5 text-gray-400 hover:bg-gray-100">
                <X className="size-5" />
              </button>
            </div>

            <div className="p-5 space-y-5">
              {isImage ? (
                <div className="rounded-xl overflow-hidden bg-gray-100">
                  <img src={item.url} alt={item.alt || ""} className="w-full object-contain max-h-80" />
                </div>
              ) : (
                <div className="flex items-center justify-center h-48 rounded-xl bg-gray-100">
                  {item.mimeType.startsWith("video/") ? <Video className="size-16 text-purple-400" /> :
                   item.mimeType === "application/pdf" ? <FileText className="size-16 text-red-400" /> :
                   <ImageIcon className="size-16 text-blue-400" />}
                </div>
              )}

              <div>
                {item.deletedAt ? (
                  <button onClick={() => onRestore(item.id)} className="flex items-center gap-2 rounded-xl bg-green-500 px-4 py-2 text-sm font-medium text-white hover:bg-green-600">
                    <Undo className="size-4" /> Restore
                  </button>
                ) : (
                  <button onClick={() => onDelete(item.id)} className="flex items-center gap-2 rounded-xl bg-red-500 px-4 py-2 text-sm font-medium text-white hover:bg-red-600">
                    <Trash2 className="size-4" /> Move to Trash
                  </button>
                )}
              </div>

              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-medium text-gray-400 uppercase tracking-wider">File Info</span>
                  <a href={item.url} target="_blank" rel="noopener noreferrer" className="flex items-center gap-1 text-xs text-blue-600 hover:underline">
                    Open <ExternalLink className="size-3" />
                  </a>
                </div>
                <InfoRow label="Filename" value={item.filename} />
                <InfoRow label="Size" value={formatSize(item.size)} />
                <InfoRow label="Type" value={item.mimeType} />
                {item.width && item.height && <InfoRow label="Dimensions" value={`${item.width} x ${item.height} px`} />}
                <InfoRow label="Provider" value={item.storageProvider ?? "local"} />
                <InfoRow label="Created" value={item.createdAt ? new Date(item.createdAt).toLocaleString() : "—"} />
                <InfoRow label="Uploaded by" value={item.uploadedBy?.name ?? "—"} />
                <InfoRow label="Folder" value={item.folder?.name ?? "Root"} />
              </div>

              <div className="space-y-2">
                <span className="text-xs font-medium text-gray-400 uppercase tracking-wider">Alt Text</span>
                <input
                  type="text"
                  defaultValue={item.alt ?? ""}
                  className="w-full rounded-xl border border-gray-200 px-3 py-2 text-sm"
                  placeholder="Add alt text..."
                />
              </div>

              {item.tags && item.tags.length > 0 && (
                <div className="space-y-2">
                  <span className="text-xs font-medium text-gray-400 uppercase tracking-wider">Tags</span>
                  <div className="flex flex-wrap gap-1.5">
                    {item.tags.map((t) => (
                      <span key={t.tag.id} className="inline-flex items-center gap-1 rounded-full bg-blue-50 px-2.5 py-1 text-xs font-medium text-blue-700">
                        <Tag className="size-3" /> {t.tag.name}
                      </span>
                    ))}
                  </div>
                </div>
              )}

              {item.usage && item.usage.length > 0 && (
                <div className="space-y-2">
                  <span className="text-xs font-medium text-gray-400 uppercase tracking-wider">Used In ({item.usage.length})</span>
                  <div className="space-y-1">
                    {item.usage.slice(0, 5).map((u) => (
                      <div key={u.id} className="flex items-center gap-2 rounded-lg bg-gray-50 px-3 py-2 text-xs text-gray-600">
                        <FolderOpen className="size-3" />
                        <span className="font-medium">{u.entity}</span>
                        <span className="text-gray-400">/ {u.entityId.slice(0, 8)}</span>
                      </div>
                    ))}
                    {item.usage.length > 5 && (
                      <p className="text-xs text-gray-400 pl-2">+{item.usage.length - 5} more</p>
                    )}
                  </div>
                </div>
              )}
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  )
}

function InfoRow({ label, value }: { label: string; value: string }) {
  return (
    <div className="flex justify-between text-sm">
      <span className="text-gray-500">{label}</span>
      <span className="text-gray-800 font-medium truncate ml-4 max-w-[200px]">{value}</span>
    </div>
  )
}
