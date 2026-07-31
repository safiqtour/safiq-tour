import { NextResponse } from "next/server"
import { getSession } from "@/services/auth.integration.service"
import { findUserById, verifyPassword, changePassword } from "@/services/auth.service"

export async function PUT(req: Request) {
  const session = await getSession()
  if (!session?.user?.id) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
  }

  const body = await req.json()
  const { currentPassword, newPassword } = body

  if (!currentPassword || !newPassword) {
    return NextResponse.json({ error: "All fields are required" }, { status: 400 })
  }

  if (newPassword.length < 6) {
    return NextResponse.json({ error: "Password minimal 6 karakter" }, { status: 400 })
  }

  const user = await findUserById(session.user.id)
  if (!user?.password) {
    return NextResponse.json({ error: "User not found" }, { status: 404 })
  }

  const isValid = await verifyPassword(currentPassword, user.password)
  if (!isValid) {
    return NextResponse.json({ error: "Password saat ini salah" }, { status: 400 })
  }

  await changePassword(session.user.id, newPassword)

  return NextResponse.json({ success: true })
}
