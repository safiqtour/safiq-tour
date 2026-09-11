import { NextResponse } from "next/server"
import fs from "node:fs/promises"
import path from "node:path"
import { getWritableSession } from "@/services/auth.integration.service"
import { can } from "@/services/authorization.service"

const STORAGE_ROOT = path.join(process.cwd(), "private", "uploads")

function resolveSafe(root: string, storagePath: string): string {
  const rootResolved = path.resolve(root)
  const full = path.resolve(rootResolved, storagePath)
  if (full !== rootResolved && !full.startsWith(rootResolved + path.sep)) {
    return ""
  }
  return full
}

const MIME_MAP: Record<string, string> = {
  ".jpg": "image/jpeg",
  ".jpeg": "image/jpeg",
  ".png": "image/png",
  ".webp": "image/webp",
  ".gif": "image/gif",
  ".svg": "image/svg+xml",
  ".mp4": "video/mp4",
  ".pdf": "application/pdf",
  ".bin": "application/octet-stream",
}

export async function GET(
  _request: Request,
  { params }: { params: Promise<{ path: string[] }> }
) {
  const session = await getWritableSession()
  if (!session?.user?.id) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
  }

  if (!can(session.user.role, "media:read")) {
    return NextResponse.json({ error: "Forbidden" }, { status: 403 })
  }

  const { path: segments } = await params
  const storagePath = segments.join("/")

  const fullPath = resolveSafe(STORAGE_ROOT, storagePath)
  if (!fullPath) {
    return NextResponse.json({ error: "Not found" }, { status: 404 })
  }

  try {
    const stat = await fs.stat(fullPath)
    if (!stat.isFile()) {
      return NextResponse.json({ error: "Not found" }, { status: 404 })
    }

    const ext = path.extname(fullPath).toLowerCase()
    const contentType = MIME_MAP[ext] ?? "application/octet-stream"

    const buffer = await fs.readFile(fullPath)
    return new NextResponse(buffer, {
      headers: {
        "Content-Type": contentType,
        "Content-Length": String(buffer.length),
        "Cache-Control": "private, max-age=0",
      },
    })
  } catch {
    return NextResponse.json({ error: "Not found" }, { status: 404 })
  }
}
