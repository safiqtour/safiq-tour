import fs from "node:fs/promises"
import path from "node:path"
import type {
  StorageFileInput,
  StorageListEntry,
  StorageProvider,
  StorageUploadResult,
} from "./types"

const DEFAULT_ROOT = path.join(process.cwd(), "public", "uploads")

export type LocalStorageProviderOptions = {
  root?: string
  publicBasePath?: string
}

function normalizePath(storagePath: string): string {
  return storagePath.replace(/\\/g, "/").replace(/^\/+/, "")
}

function resolveSafe(root: string, storagePath: string): string {
  const rootResolved = path.resolve(root)
  const full = path.resolve(rootResolved, normalizePath(storagePath))
  if (full !== rootResolved && !full.startsWith(rootResolved + path.sep)) {
    throw new Error(`Invalid storage path: ${storagePath}`)
  }
  return full
}

async function toBuffer(input: StorageFileInput): Promise<Buffer> {
  if (Buffer.isBuffer(input)) return input
  if (input instanceof Uint8Array) return Buffer.from(input)
  return Buffer.from(await input.arrayBuffer())
}

async function ensureDir(dir: string): Promise<void> {
  await fs.mkdir(dir, { recursive: true })
}

export function createLocalStorageProvider(
  options: LocalStorageProviderOptions = {}
): StorageProvider {
  const root = path.resolve(options.root ?? DEFAULT_ROOT)
  const publicBasePath = options.publicBasePath ?? "/uploads"

  async function walk(
    dir: string,
    base: string,
    entries: StorageListEntry[]
  ): Promise<void> {
    const items = await fs.readdir(dir, { withFileTypes: true })
    for (const item of items) {
      const abs = path.join(dir, item.name)
      const rel = `${base ? `${base}/` : ""}${item.name}`
      if (item.isDirectory()) {
        entries.push({
          path: rel,
          name: item.name,
          size: 0,
          updatedAt: (await fs.stat(abs)).mtime,
          isFolder: true,
        })
        await walk(abs, rel, entries)
      } else {
        const stat = await fs.stat(abs)
        entries.push({
          path: rel,
          name: item.name,
          size: stat.size,
          updatedAt: stat.mtime,
          isFolder: false,
        })
      }
    }
  }

  return {
    async upload(file: StorageFileInput, storagePath: string): Promise<StorageUploadResult> {
      const normalized = normalizePath(storagePath)
      const fullPath = resolveSafe(root, normalized)
      await ensureDir(path.dirname(fullPath))
      const buffer = await toBuffer(file)
      await fs.writeFile(fullPath, buffer)
      return {
        path: normalized,
        url: `${publicBasePath}/${normalized}`,
        size: buffer.length,
      }
    },

    async delete(storagePath: string): Promise<void> {
      const fullPath = resolveSafe(root, storagePath)
      await fs.unlink(fullPath).catch((error) => {
        if ((error as NodeJS.ErrnoException).code !== "ENOENT") throw error
      })
    },

    async exists(storagePath: string): Promise<boolean> {
      const fullPath = resolveSafe(root, storagePath)
      try {
        await fs.access(fullPath)
        return true
      } catch {
        return false
      }
    },

    async copy(from: string, to: string): Promise<void> {
      const fromPath = resolveSafe(root, from)
      const toPath = resolveSafe(root, to)
      await ensureDir(path.dirname(toPath))
      await fs.copyFile(fromPath, toPath)
    },

    async move(from: string, to: string): Promise<void> {
      const fromPath = resolveSafe(root, from)
      const toPath = resolveSafe(root, to)
      await ensureDir(path.dirname(toPath))
      try {
        await fs.rename(fromPath, toPath)
      } catch (error) {
        if ((error as NodeJS.ErrnoException).code === "EXDEV") {
          await fs.copyFile(fromPath, toPath)
          await fs.unlink(fromPath)
          return
        }
        throw error
      }
    },

    getPublicUrl(storagePath: string): string {
      return `${publicBasePath}/${normalizePath(storagePath)}`
    },

    async createSignedUrl(storagePath: string, _expiresIn: number): Promise<string> {
      return `${publicBasePath}/${normalizePath(storagePath)}`
    },

    async list(prefix: string): Promise<StorageListEntry[]> {
      const normalized = normalizePath(prefix)
      const dir = resolveSafe(root, normalized)
      const entries: StorageListEntry[] = []
      try {
        await fs.access(dir)
      } catch {
        return entries
      }
      await walk(dir, normalized, entries)
      return entries
    },

    async createFolder(storagePath: string): Promise<void> {
      await ensureDir(resolveSafe(root, storagePath))
    },

    async deleteFolder(storagePath: string): Promise<void> {
      const fullPath = resolveSafe(root, storagePath)
      await fs.rm(fullPath, { recursive: true, force: true })
    },
  }
}
