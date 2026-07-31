"use server"

import { redirect } from "next/navigation"
import { signIn, signOut } from "@/services/auth.integration.service"

export async function loginAction(formData: FormData) {
  const email = formData.get("email")
  const password = formData.get("password")

  if (typeof email !== "string" || typeof password !== "string" || !email || !password) {
    return { error: "Email atau password salah" }
  }

  try {
    const session = await signIn({ email, password })
    if (!session.user.role) {
      await signOut()
      return { error: "Email atau password salah" }
    }
    return { success: true }
  } catch {
    return { error: "Email atau password salah" }
  }
}

export async function logoutAction() {
  await signOut()
  redirect("/admin/login")
}
