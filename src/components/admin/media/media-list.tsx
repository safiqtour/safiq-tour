"use client"

import { motion } from "framer-motion"
import { ImageIcon, FileText, Video, Trash2, Undo, ArrowUpDown, ChevronUp, ChevronDown } from "lucide-react"
import { cn } from "@/lib/utils"

interface MediaListItem {
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

interface MediaListProps {
  items: MediaListItem[]
  selectedIds: string[]
  sort: string
  order: "asc" | "desc"
  onSelect: (id: string) => void
  onSelectAll: () => void
  onSort: (key: string) => void
  onDelete: (id: string) => void
  onRestore: (id: string) => void
  onPreview: (item: MediaListItem) => void
}

function formatSize(bytes: number) {
  if (bytes < 1024) return `${bytes} B`
  if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`
  return `${(bytes / (1024 * 1024)).toFixed(1)} MB`
}

function getIcon(mime: string) {
  if (mime.startsWith("video/")) return <Video className="size-4 text-purple-500" />
  if (mime === "application/pdf") return <FileText className="size-4 text-red-500" />
  return <ImageIcon className="size-4 text-blue-500" />
}

function SortHeader({ label, sortKey, currentSort, order, onSort }: { label: string; sortKey: string; currentSort: string; order: "asc" | "desc"; onSort: (k: string) => void }) {
  const active = currentSort === sortKey
  return (
    <th
      className="px-4 py-3 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider cursor-pointer select-none hover:text-gray-700"
      onClick={() => onSort(sortKey)}
    >
      <div className="flex items-center gap-1">
        {label}
        {active ? (
          order === "asc" ? <ChevronUp className="size-3" /> : <ChevronDown className="size-3" />
        ) : (
          <ArrowUpDown className="size-3 opacity-30" />
        )}
      </div>
    </th>
  )
}

export function MediaList({ items, selectedIds, sort, order, onSelect, onSelectAll, onSort, onDelete, onRestore, onPreview }: MediaListProps) {
  const allSelected = items.length > 0 && selectedIds.length === items.length

  return (
    <div className="overflow-x-auto rounded-xl border border-gray-200">
      <table className="w-full">
        <thead className="bg-gray-50">
          <tr>
            <th className="w-12 px-4 py-3">
              <input type="checkbox" checked={allSelected} onChange={onSelectAll} className="size-4 rounded border-gray-300" />
            </th>
            <th className="w-12 px-4 py-3"></th>
            <SortHeader label="Name" sortKey="filename" currentSort={sort} order={order} onSort={onSort} />
            <SortHeader label="Size" sortKey="size" currentSort={sort} order={order} onSort={onSort} />
            <SortHeader label="Dimensions" sortKey="width" currentSort={sort} order={order} onSort={onSort} />
            <th className="px-4 py-3 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">Type</th>
            <th className="px-4 py-3 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">Folder</th>
            <SortHeader label="Created" sortKey="createdAt" currentSort={sort} order={order} onSort={onSort} />
            <th className="w-20 px-4 py-3"></th>
          </tr>
        </thead>
        <tbody className="divide-y divide-gray-100">
          {items.map((item) => {
            const isSelected = selectedIds.includes(item.id)
            const isImage = item.mimeType.startsWith("image/")
            return (
              <motion.tr
                key={item.id}
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className={cn(
                  "group cursor-pointer transition-colors hover:bg-gray-50",
                  isSelected && "bg-blue-50",
                  item.deletedAt && "opacity-50"
                )}
                onClick={() => onPreview(item)}
              >
                <td className="px-4 py-3" onClick={(e) => e.stopPropagation()}>
                  <input
                    type="checkbox"
                    checked={isSelected}
                    onChange={() => onSelect(item.id)}
                    className="size-4 rounded border-gray-300"
                  />
                </td>
                <td className="px-4 py-3">
                  <div className="size-10 rounded-lg bg-gray-100 flex items-center justify-center overflow-hidden">
                    {isImage ? (
                      <img src={item.thumbnailUrl || item.url} alt="" className="size-full object-cover" loading="lazy" />
                    ) : (
                      getIcon(item.mimeType)
                    )}
                  </div>
                </td>
                <td className="px-4 py-3">
                  <p className="text-sm font-medium text-gray-800 truncate max-w-[200px]">{item.alt || item.filename}</p>
                  {item.caption && <p className="text-[10px] text-gray-400 truncate max-w-[200px]">{item.caption}</p>}
                </td>
                <td className="px-4 py-3 text-sm text-gray-600 whitespace-nowrap">{formatSize(item.size)}</td>
                <td className="px-4 py-3 text-sm text-gray-600 whitespace-nowrap">
                  {item.width && item.height ? `${item.width}x${item.height}` : "—"}
                </td>
                <td className="px-4 py-3">
                  <span className="inline-flex items-center gap-1 rounded-full bg-gray-100 px-2 py-0.5 text-[10px] font-medium text-gray-600 uppercase">
                    {getIcon(item.mimeType)}
                    {item.mimeType.split("/").pop()}
                  </span>
                </td>
                <td className="px-4 py-3 text-sm text-gray-600">{item.folder?.name ?? "—"}</td>
                <td className="px-4 py-3 text-sm text-gray-500 whitespace-nowrap">
                  {item.createdAt ? new Date(item.createdAt).toLocaleDateString() : "—"}
                </td>
                <td className="px-4 py-3" onClick={(e) => e.stopPropagation()}>
                  <div className="flex gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                    {item.deletedAt ? (
                      <button onClick={() => onRestore(item.id)} className="rounded-lg p-1.5 text-green-600 hover:bg-green-50" title="Restore">
                        <Undo className="size-4" />
                      </button>
                    ) : (
                      <button onClick={() => onDelete(item.id)} className="rounded-lg p-1.5 text-red-500 hover:bg-red-50" title="Trash">
                        <Trash2 className="size-4" />
                      </button>
                    )}
                  </div>
                </td>
              </motion.tr>
            )
          })}
        </tbody>
      </table>

      {items.length === 0 && (
        <div className="flex flex-col items-center justify-center py-20 text-gray-400">
          <ImageIcon className="size-12 mb-3 opacity-50" />
          <p className="text-sm">No media found</p>
        </div>
      )}
    </div>
  )
}
