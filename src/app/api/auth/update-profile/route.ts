import { NextResponse } from "next/server"
import { getWritableSession } from "@/services/auth.integration.service"
import { updateUserProfile } from "@/services/auth.service"

export async function PUT(req: Request) {
  const session = await getWritableSession()
  if (!session?.user?.id) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
  }

  const body = await req.json()
  const { name, image } = body

  if (!name || typeof name !== "string") {
    return NextResponse.json({ error: "Name is required" }, { status: 400 })
  }

  try {
    await updateUserProfile(session.user.id, { name, image: image || undefined })
  } catch (error) {
    console.error("[api/auth/update-profile] Update failed:", error instanceof Error ? error.message : "unknown error")
    return NextResponse.json({ error: "Gagal memperbarui profil" }, { status: 500 })
  }

  return NextResponse.json({ success: true })
}
