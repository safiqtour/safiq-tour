import { NextResponse } from "next/server"
import { getWritableSession } from "@/services/auth.integration.service"
import { can } from "@/services/authorization.service"
import { mediaService } from "@/services/media.service"

export async function GET(
  _request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const session = await getWritableSession()
  if (!session?.user?.id) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
  }

  if (!can(session.user.role, "media:read")) {
    return NextResponse.json({ error: "Forbidden" }, { status: 403 })
  }

  try {
    const { id } = await params

    const signedUrl = await mediaService.getPrivateMediaSignedUrl(id)

    return NextResponse.json({ success: true, data: { signedUrl } })
  } catch {
    // Internal details (media id, storage path, bucket) are sensitive — do not leak.
    return NextResponse.json({ success: false, error: "Media not found" }, { status: 404 })
  }
}