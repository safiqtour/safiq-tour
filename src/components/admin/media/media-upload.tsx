"use client"

import { useState, useRef, useCallback } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { Upload, X, FileImage, FileVideo, FileText, Loader2, CheckCircle, AlertCircle } from "lucide-react"
import { cn } from "@/lib/utils"

interface MediaUploadProps {
  open: boolean
  onClose: () => void
  folderId?: string | null
  onUploadComplete: () => void
}

type UploadingFile = {
  id: string
  file: File
  progress: number
  status: "pending" | "uploading" | "done" | "error"
  error?: string
}

export function MediaUpload({ open, onClose, folderId, onUploadComplete }: MediaUploadProps) {
  const [files, setFiles] = useState<UploadingFile[]>([])
  const [dragOver, setDragOver] = useState(false)
  const inputRef = useRef<HTMLInputElement>(null)

  const addFiles = useCallback((newFiles: FileList | File[]) => {
    const entries = Array.from(newFiles).map((file) => ({
      id: crypto.randomUUID(),
      file,
      progress: 0,
      status: "pending" as const,
    }))
    setFiles((prev) => [...prev, ...entries])
  }, [])

  const handleDrop = useCallback((e: React.DragEvent) => {
    e.preventDefault()
    setDragOver(false)
    if (e.dataTransfer.files.length) addFiles(e.dataTransfer.files)
  }, [addFiles])

  const handleDragOver = useCallback((e: React.DragEvent) => {
    e.preventDefault()
    setDragOver(true)
  }, [])

  const handleDragLeave = useCallback(() => setDragOver(false), [])

  const removeFile = (id: string) => {
    setFiles((prev) => prev.filter((f) => f.id !== id))
  }

  const uploadFiles = async () => {
    const pending = files.filter((f) => f.status === "pending")
    if (pending.length === 0) return

    for (const pf of pending) {
      setFiles((prev) => prev.map((f) => f.id === pf.id ? { ...f, status: "uploading" } : f))
      try {
        const formData = new FormData()
        formData.append("file", pf.file)
        if (folderId) formData.append("folderId", folderId)

        const res = await fetch("/api/admin/media/upload", { method: "POST", body: formData })
        if (!res.ok) {
          const err = await res.json()
          throw new Error(err.error || "Upload failed")
        }
        setFiles((prev) => prev.map((f) => f.id === pf.id ? { ...f, status: "done", progress: 100 } : f))
      } catch (err) {
        setFiles((prev) => prev.map((f) => f.id === pf.id ? { ...f, status: "error", error: err instanceof Error ? err.message : "Upload failed" } : f))
      }
    }

    onUploadComplete()
  }

  const handleClose = () => {
    setFiles([])
    onClose()
  }

  const pendingCount = files.filter((f) => f.status === "pending").length
  const uploadingCount = files.filter((f) => f.status === "uploading").length
  const doneCount = files.filter((f) => f.status === "done").length
  const errorCount = files.filter((f) => f.status === "error").length

  return (
    <AnimatePresence>
      {open && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4"
          onClick={handleClose}
        >
          <motion.div
            initial={{ opacity: 0, scale: 0.95, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: 20 }}
            className="w-full max-w-2xl rounded-2xl bg-white shadow-2xl"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-center justify-between border-b border-gray-200 px-6 py-4">
              <h2 className="text-lg font-bold text-gray-900">Upload Media</h2>
              <button onClick={handleClose} className="rounded-lg p-1.5 text-gray-400 hover:bg-gray-100 hover:text-gray-600">
                <X className="size-5" />
              </button>
            </div>

            <div className="p-6 space-y-4">
              <div
                onDrop={handleDrop}
                onDragOver={handleDragOver}
                onDragLeave={handleDragLeave}
                className={cn(
                  "relative rounded-xl border-2 border-dashed p-10 text-center transition-colors",
                  dragOver ? "border-blue-400 bg-blue-50" : "border-gray-300 hover:border-gray-400"
                )}
              >
                <Upload className="mx-auto mb-3 size-8 text-gray-400" />
                <p className="text-sm font-medium text-gray-700">
                  Drag & drop files here or <button onClick={() => inputRef.current?.click()} className="text-blue-600 hover:underline">browse</button>
                </p>
                <p className="mt-1 text-xs text-gray-400">JPG, PNG, WebP, GIF, SVG, MP4, PDF — Max 5MB (photo), 20MB (video)</p>
                <input
                  ref={inputRef}
                  type="file"
                  multiple
                  accept="image/*,video/mp4,application/pdf"
                  className="hidden"
                  onChange={(e) => e.target.files && addFiles(e.target.files)}
                />
              </div>

              {files.length > 0 && (
                <div className="space-y-2 max-h-60 overflow-y-auto">
                  {files.map((f) => (
                    <div key={f.id} className="flex items-center gap-3 rounded-xl border border-gray-200 p-3">
                      <div className="size-10 shrink-0 rounded-lg bg-gray-100 flex items-center justify-center">
                        {f.file.type.startsWith("video/") ? <FileVideo className="size-5 text-purple-500" /> :
                         f.file.type === "application/pdf" ? <FileText className="size-5 text-red-500" /> :
                         <FileImage className="size-5 text-blue-500" />}
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="text-sm font-medium text-gray-700 truncate">{f.file.name}</p>
                        <p className="text-xs text-gray-400">{(f.file.size / 1024).toFixed(1)} KB</p>
                      </div>
                      <div className="shrink-0">
                        {f.status === "uploading" && <Loader2 className="size-5 animate-spin text-blue-500" />}
                        {f.status === "done" && <CheckCircle className="size-5 text-green-500" />}
                        {f.status === "error" && <span title={f.error}><AlertCircle className="size-5 text-red-500" /></span>}
                        {f.status === "pending" && (
                          <button onClick={() => removeFile(f.id)} className="rounded-lg p-1 text-gray-400 hover:bg-gray-100">
                            <X className="size-4" />
                          </button>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>

            <div className="flex items-center justify-between border-t border-gray-200 px-6 py-4">
              <div className="text-xs text-gray-400">
                {doneCount > 0 && <span className="text-green-600">{doneCount} uploaded</span>}
                {errorCount > 0 && <span className="ml-2 text-red-600">{errorCount} failed</span>}
              </div>
              <div className="flex items-center gap-2">
                <button onClick={handleClose} className="rounded-xl border border-gray-200 px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50">
                  Close
                </button>
                <button
                  onClick={uploadFiles}
                  disabled={pendingCount === 0}
                  className="rounded-xl bg-[#0B3C6D] px-4 py-2 text-sm font-semibold text-white shadow-lg shadow-[#0B3C6D]/20 transition-all hover:bg-[#0B2D52] disabled:opacity-50"
                >
                  {uploadingCount > 0 ? `Uploading... (${uploadingCount})` : `Upload ${pendingCount} file(s)`}
                </button>
              </div>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  )
}
