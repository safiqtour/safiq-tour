"use server"

import { redirect } from "next/navigation"
import { signIn, signOut } from "@/services/auth.integration.service"

export async function loginAction(formData: FormData) {
  const email = formData.get("email")
  const password = formData.get("password")

  if (
    typeof email !== "string" ||
    typeof password !== "string" ||
    !email ||
    !password
  ) {
    return { error: "Email atau password salah" }
  }

  try {
    const session = await signIn({
      email,
      password,
    })

    if (!session.user.role) {
      console.error("[loginAction] User authenticated but has no application role")
      await signOut()
      return {
        error: "User berhasil login tetapi tidak memiliki role aplikasi.",
      }
    }

    return {
      success: true,
    }
  } catch (error) {
    console.error("[loginAction] Login failed:", error instanceof Error ? error.message : "unknown error")

    return {
      error: "Email atau password salah",
    }
  }
}

export async function logoutAction() {
  await signOut()
  redirect("/admin/login")
}