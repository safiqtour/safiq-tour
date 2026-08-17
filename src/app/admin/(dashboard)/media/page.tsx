"use client"

import { useState, useEffect, useCallback } from "react"
import { motion } from "framer-motion"
import { Upload, Grid3X3, List, Search, FolderPlus, Trash2 } from "lucide-react"
import { getMediaList, deleteMedia, restoreMedia, getFolderTree } from "@/actions/media"
import { createMediaFolder } from "@/actions/media-folder"
import { MediaGrid } from "@/components/admin/media/media-grid"
import { MediaList } from "@/components/admin/media/media-list"
import { MediaUpload } from "@/components/admin/media/media-upload"
import { MediaDetail } from "@/components/admin/media/media-detail"
import { cn } from "@/lib/utils"

type ViewMode = "grid" | "list"

type MediaItem = {
  id: string
  url: string
  thumbnailUrl?: string | null
  filename: string
  originalName?: string
  extension?: string
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

type FolderNode = {
  id: string
  name: string
  slug: string
  parentId?: string | null
  _count: { media: number; children: number }
  children?: FolderNode[]
}

export default function MediaLibraryPage() {
  const [data, setData] = useState<MediaItem[]>([])
  const [loading, setLoading] = useState(true)
  const [page, setPage] = useState(1)
  const [totalPages, setTotalPages] = useState(0)
  const [total, setTotal] = useState(0)
  const [search, setSearch] = useState("")
  const [sort, setSort] = useState("createdAt")
  const [order, setOrder] = useState<"asc" | "desc">("desc")
  const [view, setView] = useState<ViewMode>("grid")
  const [selectedIds, setSelectedIds] = useState<string[]>([])
  const [currentFolderId, setCurrentFolderId] = useState<string | undefined>(undefined)
  const [folders, setFolders] = useState<FolderNode[]>([])
  const [showDeleted, setShowDeleted] = useState(false)
  const [uploadOpen, setUploadOpen] = useState(false)
  const [previewItem, setPreviewItem] = useState<MediaItem | null>(null)
  const [previewOpen, setPreviewOpen] = useState(false)
  const [showNewFolder, setShowNewFolder] = useState(false)
  const [newFolderName, setNewFolderName] = useState("")

  const fetchData = useCallback(async () => {
    setLoading(true)
    try {
      const result = await getMediaList({ page, limit: 24, search, sort, order, folderId: currentFolderId, includeDeleted: showDeleted || undefined })
      setData(result.data as MediaItem[])
      setTotalPages(result.pagination.totalPages)
      setTotal(result.pagination.total)
    } catch { setData([]) }
    finally { setLoading(false) }
  }, [page, search, sort, order, currentFolderId, showDeleted])

  const fetchFolders = useCallback(async () => {
    try {
      const result = await getFolderTree()
      setFolders(result as unknown as FolderNode[])
    } catch { setFolders([]) }
  }, [])

  useEffect(() => { fetchData(); fetchFolders() }, [fetchData, fetchFolders])

  useEffect(() => { setPage(1) }, [search, currentFolderId, showDeleted])

  useEffect(() => { setSelectedIds([]) }, [view])

  const handleSort = (key: string) => {
    if (sort === key) setOrder(order === "asc" ? "desc" : "asc")
    else { setSort(key); setOrder("asc") }
  }

  const handleSelect = (id: string) => {
    setSelectedIds((prev) => prev.includes(id) ? prev.filter((x) => x !== id) : [...prev, id])
  }

  const handleSelectAll = () => {
    if (selectedIds.length === data.filter((d) => !d.deletedAt).length) {
      setSelectedIds([])
    } else {
      setSelectedIds(data.filter((d) => !d.deletedAt).map((d) => d.id))
    }
  }

  const handleDelete = async (id: string) => {
    await deleteMedia(id)
    fetchData()
  }

  const handleRestore = async (id: string) => {
    await restoreMedia(id)
    fetchData()
  }

  const handlePreview = (item: MediaItem) => {
    setPreviewItem(item)
    setPreviewOpen(true)
  }

  const handleCreateFolder = async () => {
    if (!newFolderName.trim()) return
    try {
      await createMediaFolder({ name: newFolderName, parentId: currentFolderId ?? null })
      setNewFolderName("")
      setShowNewFolder(false)
      fetchFolders()
    } catch (err) {
      alert(err instanceof Error ? err.message : "Failed to create folder")
    }
  }

  const moveToFolder = (folderId: string | undefined) => {
    setCurrentFolderId(folderId)
    setPage(1)
  }

  const renderFolderTree = (nodes: FolderNode[], level = 0) => (
    <div className="space-y-0.5">
      {nodes.map((node) => {
        const isActive = currentFolderId === node.id
        const hasChildren = node.children && node.children.length > 0
        return (
          <div key={node.id}>
            <button
              onClick={() => moveToFolder(node.id)}
              className={cn(
                "w-full flex items-center gap-2 rounded-lg px-3 py-1.5 text-xs font-medium transition-all text-left",
                isActive ? "bg-[#0B3C6D]/10 text-[#0B3C6D]" : "text-gray-600 hover:bg-gray-100"
              )}
              style={{ paddingLeft: `${12 + level * 12}px` }}
            >
              <span className="text-gray-400 shrink-0">{hasChildren ? "▾" : "▸"}</span>
              <span className="truncate flex-1">{node.name}</span>
              <span className="text-[10px] text-gray-400">{node._count.media}</span>
            </button>
            {hasChildren && level < 2 && (
              <div>{renderFolderTree(node.children!, level + 1)}</div>
            )}
          </div>
        )
      })}
    </div>
  )

  return (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="flex gap-6 h-[calc(100vh-8rem)]">
      <div className="w-56 shrink-0 hidden lg:block">
        <div className="rounded-xl border border-gray-200 bg-white p-3 sticky top-0">
          <div className="flex items-center justify-between mb-2">
            <h3 className="text-xs font-semibold text-gray-400 uppercase tracking-wider">Folders</h3>
            <button onClick={() => setShowNewFolder(!showNewFolder)} className="rounded-lg p-1 text-gray-400 hover:bg-gray-100 hover:text-gray-600" title="New Folder">
              <FolderPlus className="size-3.5" />
            </button>
          </div>

          {showNewFolder && (
            <div className="mb-2 flex gap-1">
              <input
                type="text"
                value={newFolderName}
                onChange={(e) => setNewFolderName(e.target.value)}
                placeholder="Folder name..."
                className="flex-1 rounded-lg border border-gray-200 px-2 py-1 text-xs outline-none focus:border-blue-400"
                onKeyDown={(e) => e.key === "Enter" && handleCreateFolder()}
                autoFocus
              />
              <button onClick={handleCreateFolder} className="rounded-lg bg-[#0B3C6D] px-2 py-1 text-[10px] text-white">Add</button>
            </div>
          )}

          <button
            onClick={() => moveToFolder(undefined)}
            className={cn(
              "w-full flex items-center gap-2 rounded-lg px-3 py-1.5 text-xs font-medium transition-all text-left mb-1",
              !currentFolderId ? "bg-[#0B3C6D]/10 text-[#0B3C6D]" : "text-gray-600 hover:bg-gray-100"
            )}
          >
            <span className="shrink-0">📁</span>
            <span className="truncate flex-1">All Files</span>
            <span className="text-[10px] text-gray-400">{total}</span>
          </button>

          {renderFolderTree(folders)}
        </div>
      </div>

      <div className="flex-1 flex flex-col min-w-0">
        <div className="flex items-center justify-between mb-4 gap-4 flex-wrap">
          <div className="flex items-center gap-2">
            <h1 className="font-heading text-xl font-bold text-[#0B3C6D]">Media Library</h1>
            {currentFolderId && (
              <button onClick={() => moveToFolder(undefined)} className="text-xs text-blue-600 hover:underline">
                (clear filter)
              </button>
            )}
          </div>

          <div className="flex items-center gap-2">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 size-4 -translate-y-1/2 text-gray-400" />
              <input
                type="text"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                placeholder="Search..."
                className="w-48 rounded-xl border border-gray-200 pl-9 pr-4 py-2 text-sm outline-none focus:border-blue-400 focus:ring-2 focus:ring-blue-100"
              />
            </div>

            <div className="flex rounded-xl border border-gray-200 overflow-hidden">
              <button
                onClick={() => setView("grid")}
                className={cn("p-2 transition-colors", view === "grid" ? "bg-[#0B3C6D] text-white" : "text-gray-400 hover:bg-gray-50")}
              >
                <Grid3X3 className="size-4" />
              </button>
              <button
                onClick={() => setView("list")}
                className={cn("p-2 transition-colors", view === "list" ? "bg-[#0B3C6D] text-white" : "text-gray-400 hover:bg-gray-50")}
              >
                <List className="size-4" />
              </button>
            </div>

            <button
              onClick={() => setShowDeleted(!showDeleted)}
              className={cn("flex items-center gap-1.5 rounded-xl border px-3 py-2 text-sm transition-colors", showDeleted ? "border-orange-300 bg-orange-50 text-orange-700" : "border-gray-200 text-gray-600 hover:bg-gray-50")}
            >
              <Trash2 className="size-4" />
              Trash
            </button>

            <button
              onClick={() => setUploadOpen(true)}
              className="flex items-center gap-2 rounded-xl bg-[#0B3C6D] px-4 py-2 text-sm font-semibold text-white shadow-lg shadow-[#0B3C6D]/20 transition-all hover:bg-[#0B2D52]"
            >
              <Upload className="size-4" />
              Upload
            </button>
          </div>
        </div>

        {selectedIds.length > 0 && (
          <div className="mb-3 flex items-center gap-2 rounded-xl bg-blue-50 border border-blue-200 px-4 py-2">
            <span className="text-sm text-blue-700 font-medium">{selectedIds.length} selected</span>
            <button
              onClick={async () => { await Promise.all(selectedIds.map(handleDelete)); setSelectedIds([]) }}
              className="ml-auto flex items-center gap-1 rounded-lg px-2.5 py-1 text-xs font-medium text-red-600 hover:bg-red-50"
            >
              <Trash2 className="size-3" /> Delete selected
            </button>
            <button onClick={() => setSelectedIds([])} className="rounded-lg px-2.5 py-1 text-xs font-medium text-gray-500 hover:bg-gray-100">
              Clear
            </button>
          </div>
        )}

        <div className="flex-1 overflow-y-auto">
          {loading ? (
            <div className="flex items-center justify-center py-20">
              <div className="size-8 animate-spin rounded-full border-2 border-gray-200 border-t-[#0B3C6D]" />
            </div>
          ) : view === "grid" ? (
            <MediaGrid
              items={data}
              selectedIds={selectedIds}
              onSelect={handleSelect}
              onSelectAll={handleSelectAll}
              onDelete={handleDelete}
              onRestore={handleRestore}
              onPreview={handlePreview}
            />
          ) : (
            <MediaList
              items={data}
              selectedIds={selectedIds}
              sort={sort}
              order={order}
              onSelect={handleSelect}
              onSelectAll={handleSelectAll}
              onSort={handleSort}
              onDelete={handleDelete}
              onRestore={handleRestore}
              onPreview={handlePreview}
            />
          )}
        </div>

        {totalPages > 1 && (
          <div className="flex items-center justify-between border-t border-gray-100 pt-4 mt-4">
            <span className="text-xs text-gray-400">Page {page} of {totalPages} ({total} total)</span>
            <div className="flex gap-2">
              <button disabled={page <= 1} onClick={() => setPage((p) => p - 1)} className="rounded-xl border border-gray-200 px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50 disabled:opacity-50">Previous</button>
              <button disabled={page >= totalPages} onClick={() => setPage((p) => p + 1)} className="rounded-xl border border-gray-200 px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50 disabled:opacity-50">Next</button>
            </div>
          </div>
        )}
      </div>

      <MediaUpload
        open={uploadOpen}
        onClose={() => setUploadOpen(false)}
        folderId={currentFolderId}
        onUploadComplete={fetchData}
      />

      <MediaDetail
        item={previewItem}
        open={previewOpen}
        onClose={() => { setPreviewOpen(false); setPreviewItem(null) }}
        onDelete={handleDelete}
        onRestore={handleRestore}
      />
    </motion.div>
  )
}
