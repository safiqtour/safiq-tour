"use client"

import { useState, useEffect } from "react"
import { getUserRoles } from "@/modules/user/actions/user"
import { UserForm, type RoleOption } from "../_components/user-form"

export default function NewUserPage() {
  const [roles, setRoles] = useState<RoleOption[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    getUserRoles()
      .then(setRoles)
      .catch(() => setRoles([]))
      .finally(() => setLoading(false))
  }, [])

  if (loading) {
    return (
      <div className="flex items-center justify-center py-20">
        <div className="size-8 animate-spin rounded-full border-2 border-gray-200 border-t-[#0B3C6D]" />
      </div>
    )
  }

  return <UserForm mode="create" initial={null} roles={roles} />
}