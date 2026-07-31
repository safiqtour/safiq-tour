import { NextResponse } from "next/server"
import { getSession } from "@/services/auth.integration.service"
import { updateUserProfile } from "@/services/auth.service"

export async function PUT(req: Request) {
  const session = await getSession()
  if (!session?.user?.id) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
  }

  const body = await req.json()
  const { name, image } = body

  if (!name || typeof name !== "string") {
    return NextResponse.json({ error: "Name is required" }, { status: 400 })
  }

  await updateUserProfile(session.user.id, { name, image: image || undefined })

  return NextResponse.json({ success: true })
}
