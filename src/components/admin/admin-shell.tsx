"use client"

import { useState } from "react"
import { Sidebar } from "@/components/admin/sidebar"
import { Topbar } from "@/components/admin/topbar"
import { Toaster } from "sonner"
import type { AppUser } from "@/services/auth.integration.service"

export function AdminShell({
  user,
  children,
}: {
  user: AppUser | null
  children: React.ReactNode
}) {
  const [collapsed, setCollapsed] = useState(false)
  const [mobileOpen, setMobileOpen] = useState(false)

  return (
    <div className="flex min-h-screen bg-[#F8FAFC]">
      <Sidebar
        collapsed={collapsed}
        onToggle={() => setCollapsed(!collapsed)}
        mobileOpen={mobileOpen}
        onMobileClose={() => setMobileOpen(false)}
        permissions={user?.permissions ?? []}
      />
      <div className="flex flex-1 flex-col min-w-0">
        <Topbar onMenuClick={() => setMobileOpen(true)} user={user} />
        <main className="flex-1 p-4 lg:p-6">{children}</main>
      </div>
      <Toaster position="top-right" richColors />
    </div>
  )
}
