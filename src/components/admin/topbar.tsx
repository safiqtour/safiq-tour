"use client"

import { useState } from "react"
import { usePathname } from "next/navigation"
import { motion, AnimatePresence } from "framer-motion"
import Link from "next/link"
import {
  Search,
  Bell,
  LogOut,
  Settings,
  User,
  Menu,
  ChevronDown,
} from "lucide-react"
import { logoutAction } from "@/actions/auth"
import { useSession } from "next-auth/react"

const breadcrumbMap: Record<string, string> = {
  dashboard: "Dashboard",
  packages: "Paket Umroh",
  articles: "Artikel",
  gallery: "Gallery",
  schedule: "Jadwal",
  promo: "Promo",
  testimonials: "Testimoni",
  faq: "FAQ",
  users: "Users",
  settings: "Settings",
}

interface TopbarProps {
  onMenuClick: () => void
}

export function Topbar({ onMenuClick }: TopbarProps) {
  const pathname = usePathname()
  const { data: session } = useSession()
  const [searchOpen, setSearchOpen] = useState(false)
  const [profileOpen, setProfileOpen] = useState(false)
  const [notifOpen, setNotifOpen] = useState(false)

  const segments = pathname.split("/").filter(Boolean)
  const currentLabel = segments.length > 1 ? breadcrumbMap[segments[1]] ?? segments[1] : ""

  return (
    <header className="sticky top-0 z-30 h-16 border-b border-[#E5E7EB] bg-white/80 backdrop-blur-xl">
      <div className="flex h-full items-center justify-between px-4 lg:px-6">
        <div className="flex items-center gap-3">
          <button
            onClick={onMenuClick}
            className="flex size-9 items-center justify-center rounded-xl text-[#6B7280] hover:bg-[#F8FAFC] hover:text-[#0B3C6D] transition-colors lg:hidden"
          >
            <Menu className="size-5" />
          </button>
          <div className="flex items-center gap-2 text-sm">
            <Link href="/admin/dashboard" className="text-[#9CA3AF] hover:text-[#0B3C6D] transition-colors">
              Admin
            </Link>
            {currentLabel && (
              <>
                <span className="text-[#D1D5DB]">/</span>
                <span className="font-medium text-[#0B3C6D]">{currentLabel}</span>
              </>
            )}
          </div>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={() => setSearchOpen(!searchOpen)}
            className="relative flex size-9 items-center justify-center rounded-xl text-[#6B7280] hover:bg-[#F8FAFC] hover:text-[#0B3C6D] transition-colors"
          >
            <Search className="size-4" />
            <span className="absolute -top-0.5 right-0 hidden text-[10px] text-[#9CA3AF] lg:block">Ctrl+K</span>
          </button>

          <div className="relative">
            <button
              onClick={() => setNotifOpen(!notifOpen)}
              className="relative flex size-9 items-center justify-center rounded-xl text-[#6B7280] hover:bg-[#F8FAFC] hover:text-[#0B3C6D] transition-colors"
            >
              <Bell className="size-4" />
              <span className="absolute right-1.5 top-1.5 size-2 rounded-full bg-[#C89B3C]" />
            </button>
            <AnimatePresence>
              {notifOpen && (
                <motion.div
                  initial={{ opacity: 0, y: 8 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: 8 }}
                  className="absolute right-0 top-full mt-2 w-80 rounded-2xl border border-[#E5E7EB] bg-white shadow-xl"
                >
                  <div className="border-b border-[#E5E7EB] px-4 py-3">
                    <p className="text-sm font-semibold text-[#0B3C6D]">Notifikasi</p>
                  </div>
                  <div className="p-4">
                    <p className="text-center text-sm text-[#9CA3AF]">Tidak ada notifikasi</p>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>

          <div className="relative">
            <button
              onClick={() => setProfileOpen(!profileOpen)}
              className="flex items-center gap-2 rounded-xl p-1.5 hover:bg-[#F8FAFC] transition-colors"
            >
              <div className="flex size-8 items-center justify-center rounded-xl bg-gradient-to-br from-[#0B3C6D] to-[#C89B3C] text-xs font-bold text-white">
                {session?.user?.name?.charAt(0)?.toUpperCase() ?? "A"}
              </div>
              <div className="hidden lg:block text-left">
                <p className="text-sm font-medium text-[#0B3C6D] leading-tight">
                  {session?.user?.name ?? "Admin"}
                </p>
                <p className="text-xs text-[#9CA3AF]">{session?.user?.role?.name ?? "Admin"}</p>
              </div>
              <ChevronDown className="hidden size-4 text-[#9CA3AF] lg:block" />
            </button>
            <AnimatePresence>
              {profileOpen && (
                <motion.div
                  initial={{ opacity: 0, y: 8 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: 8 }}
                  className="absolute right-0 top-full mt-2 w-56 rounded-2xl border border-[#E5E7EB] bg-white shadow-xl"
                >
                  <div className="p-2">
                    <Link
                      href="/admin/profile"
                      onClick={() => setProfileOpen(false)}
                      className="flex items-center gap-3 rounded-xl px-3 py-2 text-sm text-[#6B7280] hover:bg-[#F8FAFC] hover:text-[#0B3C6D] transition-colors"
                    >
                      <User className="size-4" />
                      Profile
                    </Link>
                    <Link
                      href="/admin/settings"
                      onClick={() => setProfileOpen(false)}
                      className="flex items-center gap-3 rounded-xl px-3 py-2 text-sm text-[#6B7280] hover:bg-[#F8FAFC] hover:text-[#0B3C6D] transition-colors"
                    >
                      <Settings className="size-4" />
                      Settings
                    </Link>
                    <form action={logoutAction}>
                      <button
                        type="submit"
                        className="flex w-full items-center gap-3 rounded-xl px-3 py-2 text-sm text-[#6B7280] hover:bg-[#F8FAFC] hover:text-red-600 transition-colors"
                      >
                        <LogOut className="size-4" />
                        Logout
                      </button>
                    </form>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </div>
      </div>

      <AnimatePresence>
        {searchOpen && (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            className="absolute inset-x-0 top-full border-b border-[#E5E7EB] bg-white p-4 shadow-lg"
          >
            <div className="relative mx-auto max-w-2xl">
              <Search className="absolute left-4 top-1/2 size-4 -translate-y-1/2 text-[#9CA3AF]" />
              <input
                type="text"
                placeholder="Cari menu, paket, artikel..."
                className="w-full rounded-xl border border-[#E5E7EB] bg-[#F8FAFC] py-3 pl-11 pr-4 text-sm text-[#0B3C6D] placeholder:text-[#9CA3AF] outline-none focus:border-[#C89B3C] focus:ring-2 focus:ring-[#C89B3C]/20 transition-all"
                autoFocus
              />
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </header>
  )
}
