import { createClient, type SupabaseClient } from "@supabase/supabase-js"
import type {
  StorageFileInput,
  StorageListEntry,
  StorageProvider,
  StorageUploadResult,
} from "./types"

export type SupabaseStorageProviderOptions = {
  url?: string
  serviceRoleKey?: string
  bucket?: string
}

function normalizePath(storagePath: string): string {
  return storagePath.replace(/\\/g, "/").replace(/^\/+|\/+$/g, "")
}

function parentPath(storagePath: string): string {
  const normalized = normalizePath(storagePath)
  const index = normalized.lastIndexOf("/")
  return index === -1 ? "" : normalized.slice(0, index)
}

function fileName(storagePath: string): string {
  const normalized = normalizePath(storagePath)
  const index = normalized.lastIndexOf("/")
  return index === -1 ? normalized : normalized.slice(index + 1)
}

function requireEnvVar(name: string, value: string | undefined): string {
  if (!value) {
    throw new Error(
      `StorageProvider "supabase" requires ${name} to be configured in the environment.`
    )
  }
  return value
}

export function createSupabaseStorageProvider(
  options: SupabaseStorageProviderOptions = {}
): StorageProvider {
  const url = requireEnvVar(
    "NEXT_PUBLIC_SUPABASE_URL",
    options.url ?? process.env.NEXT_PUBLIC_SUPABASE_URL
  )
  const serviceRoleKey = requireEnvVar(
    "SUPABASE_SERVICE_ROLE_KEY",
    options.serviceRoleKey ?? process.env.SUPABASE_SERVICE_ROLE_KEY
  )
  const bucket = requireEnvVar(
    "SUPABASE_STORAGE_BUCKET",
    options.bucket ?? process.env.SUPABASE_STORAGE_BUCKET
  )

  const supabase: SupabaseClient = createClient(url, serviceRoleKey, {
    auth: { persistSession: false },
  })

  async function collectAllFiles(
    prefix: string
  ): Promise<{ path: string; isFolder: boolean }[]> {
    const normalized = normalizePath(prefix)
    const results: { path: string; isFolder: boolean }[] = []
    const { data, error } = await supabase.storage
      .from(bucket)
      .list(normalized === "" ? "" : `${normalized}/`)

    if (error) throw new Error(`Storage list failed: ${error.message}`)

    for (const item of data ?? []) {
      const isFolder = item.name.endsWith("/") || item.metadata?.mimetype == null
      const itemPath = `${normalized}${normalized ? "/" : ""}${item.name}`
      results.push({ path: itemPath, isFolder })
      if (isFolder) {
        results.push(...(await collectAllFiles(itemPath)))
      }
    }
    return results
  }

  function contentTypeOf(file: StorageFileInput): string {
    if (typeof Blob !== "undefined" && file instanceof Blob && file.type) {
      return file.type
    }
    return "application/octet-stream"
  }

  return {
    async upload(file: StorageFileInput, storagePath: string): Promise<StorageUploadResult> {
      const normalized = normalizePath(storagePath)
      const body = file instanceof Blob ? file : file instanceof Uint8Array ? file : file
      const { error } = await supabase.storage.from(bucket).upload(normalized, body, {
        contentType: contentTypeOf(file),
        upsert: true,
      })
      if (error) throw new Error(`Storage upload failed: ${error.message}`)
      const { data: publicUrlData } = supabase.storage.from(bucket).getPublicUrl(normalized)
      return {
        path: normalized,
        url: publicUrlData.publicUrl,
        size: file instanceof Blob ? file.size : file.length,
      }
    },

    async delete(storagePath: string): Promise<void> {
      const { error } = await supabase.storage
        .from(bucket)
        .remove([normalizePath(storagePath)])
      if (error) throw new Error(`Storage delete failed: ${error.message}`)
    },

    async exists(storagePath: string): Promise<boolean> {
      const normalized = normalizePath(storagePath)
      const parent = parentPath(normalized)
      const name = fileName(normalized)
      const { data, error } = await supabase.storage
        .from(bucket)
        .list(parent === "" ? "" : `${parent}/`)
      if (error) throw new Error(`Storage list failed: ${error.message}`)
      return (data ?? []).some(
        (item) =>
          item.name.replace(/\/$/, "") === name &&
          (item.metadata?.mimetype != null || item.name.endsWith("/"))
      )
    },

    async copy(from: string, to: string): Promise<void> {
      const { error } = await supabase.storage
        .from(bucket)
        .copy(normalizePath(from), normalizePath(to))
      if (error) throw new Error(`Storage copy failed: ${error.message}`)
    },

    async move(from: string, to: string): Promise<void> {
      const { error } = await supabase.storage
        .from(bucket)
        .move(normalizePath(from), normalizePath(to))
      if (error) throw new Error(`Storage move failed: ${error.message}`)
    },

    getPublicUrl(storagePath: string): string {
      return supabase.storage.from(bucket).getPublicUrl(normalizePath(storagePath)).data.publicUrl
    },

    async createSignedUrl(storagePath: string, expiresIn: number): Promise<string> {
      const { data, error } = await supabase.storage
        .from(bucket)
        .createSignedUrl(normalizePath(storagePath), expiresIn)
      if (error) throw new Error(`Storage signed URL failed: ${error.message}`)
      return data.signedUrl
    },

    async list(prefix: string): Promise<StorageListEntry[]> {
      const normalized = normalizePath(prefix)
      const { data, error } = await supabase.storage
        .from(bucket)
        .list(normalized === "" ? "" : `${normalized}/`)
      if (error) throw new Error(`Storage list failed: ${error.message}`)

      const entries: StorageListEntry[] = []
      for (const item of data ?? []) {
        const isFolder = item.name.endsWith("/") || item.metadata?.mimetype == null
        entries.push({
          path: `${normalized}${normalized ? "/" : ""}${item.name}`,
          name: item.name.replace(/\/$/, ""),
          size: item.metadata?.size ?? 0,
          updatedAt: new Date(item.updated_at ?? Date.now()),
          isFolder,
        })
      }
      return entries
    },

    async createFolder(storagePath: string): Promise<void> {
      const normalized = normalizePath(storagePath)
      const { error } = await supabase.storage.from(bucket).upload(
        `${normalized}/.emptyFolderPlaceholder`,
        new Uint8Array(0),
        { contentType: "application/octet-stream", upsert: true }
      )
      if (error) throw new Error(`Storage create folder failed: ${error.message}`)
    },

    async deleteFolder(storagePath: string): Promise<void> {
      const all = await collectAllFiles(storagePath)
      const filePaths = all.filter((entry) => !entry.isFolder).map((entry) => entry.path)
      for (let i = 0; i < filePaths.length; i += 500) {
        const chunk = filePaths.slice(i, i + 500)
        const { error } = await supabase.storage.from(bucket).remove(chunk)
        if (error) throw new Error(`Storage delete folder failed: ${error.message}`)
      }
    },
  }
}
