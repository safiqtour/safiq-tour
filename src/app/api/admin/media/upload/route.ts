import { NextResponse } from "next/server"
import { getWritableSession } from "@/services/auth.integration.service"
import { can } from "@/services/authorization.service"
import { mediaService } from "@/services/media.service"
import { UPLOAD_PURPOSES, type UploadPurpose } from "@/providers/storage/types"

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
    const purposeRaw = formData.get("purpose") as string | null

    let purpose: UploadPurpose = "public"
    if (purposeRaw !== null && purposeRaw !== "") {
      if (!UPLOAD_PURPOSES.includes(purposeRaw as UploadPurpose)) {
        return NextResponse.json({ error: "Invalid upload purpose" }, { status: 400 })
      }
      purpose = purposeRaw as UploadPurpose
    }

    const maxSize = file.type.startsWith("video/") ? 20 * 1024 * 1024 : 5 * 1024 * 1024
    if (file.size > maxSize) {
      return NextResponse.json({ error: `File too large. Max ${maxSize / 1024 / 1024}MB` }, { status: 400 })
    }

    const allowedTypes = ["image/jpeg", "image/png", "image/webp", "image/gif", "image/svg+xml", "video/mp4", "application/pdf"]
    if (!allowedTypes.includes(file.type)) {
      return NextResponse.json({ error: "File type not allowed" }, { status: 400 })
    }

    const media = await mediaService.upload(file, folderId ?? undefined, caption ?? undefined, purpose)

    return NextResponse.json({ success: true, data: media }, { status: 201 })
  } catch (error) {
    console.error("[api/admin/media/upload] Upload failed:", error instanceof Error ? error.message : "unknown error")
    return NextResponse.json({ error: "Upload failed" }, { status: 500 })
  }
}
