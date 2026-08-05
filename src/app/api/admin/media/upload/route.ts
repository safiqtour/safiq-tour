import { NextResponse } from "next/server"
import { getWritableSession } from "@/services/auth.integration.service"
import { can } from "@/services/authorization.service"
import { mediaService } from "@/services/media.service"

export async function POST(request: Request) {
  const session = await getWritableSession()
  if (!session?.user?.role) return NextResponse.json({ error: "Unauthorized" }, { status: 401 })

  const canCreate = can(session.user.role, "media:create")
  if (!canCreate) return NextResponse.json({ error: "Forbidden" }, { status: 403 })

  try {
    const formData = await request.formData()
    const file = formData.get("file") as File | null
    if (!file) return NextResponse.json({ error: "No file provided" }, { status: 400 })

    const folderId = formData.get("folderId") as string | null
    const caption = formData.get("caption") as string | null

    const maxSize = file.type.startsWith("video/") ? 20 * 1024 * 1024 : 5 * 1024 * 1024
    if (file.size > maxSize) {
      return NextResponse.json({ error: `File too large. Max ${maxSize / 1024 / 1024}MB` }, { status: 400 })
    }

    const allowedTypes = ["image/jpeg", "image/png", "image/webp", "image/gif", "image/svg+xml", "video/mp4", "application/pdf"]
    if (!allowedTypes.includes(file.type)) {
      return NextResponse.json({ error: "File type not allowed" }, { status: 400 })
    }

    const media = await mediaService.upload(file, folderId ?? undefined, caption ?? undefined)

    return NextResponse.json({ success: true, data: media }, { status: 201 })
  } catch (error) {
    return NextResponse.json({ error: error instanceof Error ? error.message : "Upload failed" }, { status: 500 })
  }
}
