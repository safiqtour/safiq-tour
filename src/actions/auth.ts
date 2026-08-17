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

    console.log("========== LOGIN SUCCESS ==========")
    console.log("Email :", session.user.email)
    console.log("Role  :", session.user.role)
    console.log("User  :", session.user)
    console.log("===================================")

    if (!session.user.role) {
      console.error("LOGIN FAILED: User ditemukan tetapi role = null")

      await signOut()

      return {
        error: "User berhasil login ke Supabase tetapi tidak memiliki role aplikasi.",
      }
    }

    return {
      success: true,
    }
  } catch (error) {
    console.error("========== LOGIN ERROR ==========")
    console.error(error)
    console.error("=================================")

    return {
      error:
        error instanceof Error
          ? error.message
          : JSON.stringify(error),
    }
  }
}

export async function logoutAction() {
  await signOut()
  redirect("/admin/login")
}