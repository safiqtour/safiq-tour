"use client"

import { useState, useEffect } from "react"
import { useParams } from "next/navigation"
import { getUser, getUserRoles } from "@/modules/user/actions/user"
import { UserForm, type UserFormData, type RoleOption } from "../../_components/user-form"

export default function EditUserPage() {
  const params = useParams()
  const [loading, setLoading] = useState(true)
  const [initial, setInitial] = useState<UserFormData | null>(null)
  const [roles, setRoles] = useState<RoleOption[]>([])
  const [error, setError] = useState("")

  useEffect(() => {
    Promise.all([getUser(params.id as string), getUserRoles()])
      .then(([user, roleList]) => {
        if (!user) { setError("User tidak ditemukan"); return }
        setInitial({
          id: user.id,
          name: user.name ?? "",
          email: user.email,
          roleId: user.role?.id ?? "",
          image: user.image ?? "",
          isActive: user.isActive,
        })
        setRoles(roleList)
      })
      .catch(() => setError("Gagal memuat data user"))
      .finally(() => setLoading(false))
  }, [params.id])

  if (loading) {
    return (
      <div className="flex items-center justify-center py-20">
        <div className="size-8 animate-spin rounded-full border-2 border-gray-200 border-t-[#0B3C6D]" />
      </div>
    )
  }

  if (error) return <div className="rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">{error}</div>

  return <UserForm mode="edit" initial={initial} roles={roles} />
}