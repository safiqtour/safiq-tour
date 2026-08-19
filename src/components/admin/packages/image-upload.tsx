"use client"

import { useState, useCallback } from "react"
import { Upload, X, Plus, Loader2, AlertCircle } from "lucide-react"
import Image from "next/image"

interface ImageUploadProps {
  value: string
  onChange: (url: string) => void
  label?: string
  /** Compact mode (itinerary rows): small upload button when empty, capped preview with Ganti/Hapus actions. */
  compact?: boolean
}

export function ImageUpload({ value, onChange, label, compact = false }: ImageUploadProps) {
  const [preview, setPreview] = useState(value)
  const [url, setUrl] = useState(value)
  const [mode, setMode] = useState<"upload" | "url">(value ? "url" : "upload")
  const [uploading, setUploading] = useState(false)
  const [uploadError, setUploadError] = useState<string | null>(null)

  // Upload via the media API so only a URL is persisted (never a base64 blob).
  const handleFile = useCallback(async (file: File) => {
    setUploading(true)
    setUploadError(null)
    try {
      const formData = new FormData()
      formData.append("file", file)
      const res = await fetch("/api/admin/media/upload", { method: "POST", body: formData })
      const json = await res.json().catch(() => null)
      if (!res.ok || !json?.success) {
        throw new Error(json?.error || "Upload gagal")
      }
      const mediaUrl = (json.data?.url as string) ?? ""
      if (!mediaUrl) throw new Error("Upload gagal: URL tidak valid")
      setPreview(mediaUrl)
      onChange(mediaUrl)
    } catch (err) {
      setUploadError(err instanceof Error ? err.message : "Upload gagal")
    } finally {
      setUploading(false)
    }
  }, [onChange])

  const handleUrlSubmit = () => {
    if (url) {
      setPreview(url)
      onChange(url)
    }
  }

  // Compact variant — used by itinerary day rows. Same upload logic, smaller UI.
  if (compact) {
    return (
      <div>
        {label && <label className="mb-1.5 block text-sm font-medium text-[#6B7280]">{label}</label>}
        {preview ? (
          <div>
            <div className="relative aspect-video max-h-[250px] w-full overflow-hidden rounded-xl border border-[#E5E7EB]">
              <Image
                src={preview}
                alt="Preview"
                fill
                className="object-cover"
                sizes="400px"
              />
              {uploading && (
                <div className="absolute inset-0 flex items-center justify-center bg-black/40">
                  <Loader2 className="size-6 animate-spin text-white" />
                </div>
              )}
            </div>
            <div className="mt-2 flex items-center gap-4">
              <label className="inline-flex cursor-pointer items-center gap-1.5 text-xs font-medium text-[#C89B3C] transition-colors hover:text-[#B88A2E]">
                <Upload className="size-3.5" /> Ganti Gambar
                <input
                  type="file"
                  accept="image/*"
                  className="hidden"
                  disabled={uploading}
                  onChange={(e) => {
                    const file = e.target.files?.[0]
                    if (file) handleFile(file)
                    e.target.value = ""
                  }}
                />
              </label>
              <button
                type="button"
                onClick={() => { setPreview(""); onChange(""); setUploadError(null) }}
                disabled={uploading}
                className="inline-flex items-center gap-1 text-xs font-medium text-red-500 transition-colors hover:text-red-700 disabled:opacity-50"
              >
                <X className="size-3.5" /> Hapus
              </button>
            </div>
            {uploadError && (
              <p className="mt-1 flex items-center gap-1 text-xs text-red-500">
                <AlertCircle className="size-3.5" /> {uploadError}
              </p>
            )}
          </div>
        ) : (
          <label className="flex h-12 w-full cursor-pointer items-center justify-center gap-1.5 rounded-xl border border-dashed border-[#C89B3C] px-4 text-sm font-medium text-[#C89B3C] transition-colors hover:bg-[#C89B3C]/10 disabled:opacity-60">
            {uploading ? (
              <>
                <Loader2 className="size-4 animate-spin" /> Uploading...
              </>
            ) : (
              <>
                <Plus className="size-4" /> Upload Gambar
              </>
            )}
            <input
              type="file"
              accept="image/*"
              className="hidden"
              disabled={uploading}
              onChange={(e) => {
                const file = e.target.files?.[0]
                if (file) handleFile(file)
                e.target.value = ""
              }}
            />
          </label>
        )}
        {!preview && uploadError && (
          <p className="mt-1 flex items-center gap-1 text-xs text-red-500">
            <AlertCircle className="size-3.5" /> {uploadError}
          </p>
        )}
      </div>
    )
  }

  return (
    <div>
      {label && <label className="mb-1.5 block text-sm font-medium text-[#6B7280]">{label}</label>}
      <div className="flex gap-2 mb-2">
        <button
          type="button"
          onClick={() => setMode("upload")}
          className={`px-3 py-1 text-xs rounded-lg transition-colors ${mode === "upload" ? "bg-[#0B3C6D] text-white" : "bg-[#F8FAFC] text-[#6B7280]"}`}
        >
          Upload
        </button>
        <button
          type="button"
          onClick={() => setMode("url")}
          className={`px-3 py-1 text-xs rounded-lg transition-colors ${mode === "url" ? "bg-[#0B3C6D] text-white" : "bg-[#F8FAFC] text-[#6B7280]"}`}
        >
          URL
        </button>
      </div>

      {mode === "upload" ? (
        <div className="relative">
          {preview ? (
            <div className="relative aspect-video rounded-xl overflow-hidden border border-[#E5E7EB]">
              <Image
                src={preview}
                alt="Preview"
                fill
                className="object-cover"
                sizes="400px"
              />
              {uploading && (
                <div className="absolute inset-0 flex items-center justify-center bg-black/40">
                  <Loader2 className="size-6 animate-spin text-white" />
                </div>
              )}
              <button
                type="button"
                onClick={() => { setPreview(""); onChange(""); setUploadError(null) }}
                disabled={uploading}
                className="absolute top-2 right-2 flex size-7 items-center justify-center rounded-full bg-black/50 text-white hover:bg-black/70 transition-colors disabled:opacity-50"
              >
                <X className="size-4" />
              </button>
            </div>
          ) : (
            <label className="flex cursor-pointer flex-col items-center justify-center aspect-video rounded-xl border-2 border-dashed border-[#E5E7EB] bg-[#F8FAFC] hover:border-[#C89B3C] hover:bg-[#C89B3C]/5 transition-all disabled:cursor-not-allowed">
              {uploading ? (
                <>
                  <Loader2 className="size-6 animate-spin text-[#C89B3C]" />
                  <p className="mt-2 text-xs text-[#9CA3AF]">Uploading...</p>
                </>
              ) : (
                <>
                  <Upload className="size-6 text-[#9CA3AF]" />
                  <p className="mt-2 text-xs text-[#9CA3AF]">Klik untuk upload gambar</p>
                </>
              )}
              <input
                type="file"
                accept="image/*"
                className="hidden"
                disabled={uploading}
                onChange={(e) => {
                  const file = e.target.files?.[0]
                  if (file) handleFile(file)
                  e.target.value = ""
                }}
              />
            </label>
          )}
          {uploadError && (
            <p className="mt-2 flex items-center gap-1 text-xs text-red-500">
              <AlertCircle className="size-3.5" /> {uploadError}
            </p>
          )}
        </div>
      ) : (
        <div className="flex gap-2">
          <input
            type="text"
            value={url}
            onChange={(e) => setUrl(e.target.value)}
            placeholder="https://example.com/image.jpg"
            className="flex-1 rounded-xl border border-[#E5E7EB] bg-[#F8FAFC] px-4 py-2.5 text-sm text-[#0B3C6D] placeholder:text-[#9CA3AF] outline-none focus:border-[#C89B3C] transition-all"
          />
          <button
            type="button"
            onClick={handleUrlSubmit}
            className="rounded-xl bg-[#0B3C6D] px-4 py-2.5 text-sm font-medium text-white hover:bg-[#0B2D52] transition-colors"
          >
            Set
          </button>
        </div>
      )}
    </div>
  )
}
