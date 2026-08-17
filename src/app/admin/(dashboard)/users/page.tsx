"use client"

import { useState } from "react"
import { motion } from "framer-motion"
import {
  Search,
  Plus,
  Eye,
  Pencil,
  Trash2,
  Shield,
  ShieldCheck,
  ShieldAlert,
} from "lucide-react"

const initialUsers = [
  { id: 1, name: "Super Admin", email: "superadmin@safiq.com", role: "SUPER_ADMIN", status: "Active", createdAt: "2026-01-15" },
  { id: 2, name: "Admin Safiq", email: "admin@safiq.com", role: "ADMIN", status: "Active", createdAt: "2026-01-15" },
  { id: 3, name: "Marketing Team", email: "marketing@safiq.com", role: "MARKETING", status: "Active", createdAt: "2026-02-20" },
  { id: 4, name: "Editor Team", email: "editor@safiq.com", role: "EDITOR", status: "Active", createdAt: "2026-03-10" },
]

const roleIcons: Record<string, typeof Shield> = {
  SUPER_ADMIN: ShieldAlert,
  ADMIN: ShieldCheck,
  MARKETING: Shield,
  EDITOR: Shield,
}

const roleColors: Record<string, string> = {
  SUPER_ADMIN: "text-purple-600 bg-purple-50",
  ADMIN: "text-blue-600 bg-blue-50",
  MARKETING: "text-emerald-600 bg-emerald-50",
  EDITOR: "text-amber-600 bg-amber-50",
}

export default function UsersPage() {
  const [users] = useState(initialUsers)
  const [search, setSearch] = useState("")
  const [currentPage, setCurrentPage] = useState(1)
  const itemsPerPage = 5

  const filtered = users.filter(
    (u) =>
      u.name.toLowerCase().includes(search.toLowerCase()) ||
      u.email.toLowerCase().includes(search.toLowerCase())
  )

  const totalPages = Math.max(1, Math.ceil(filtered.length / itemsPerPage))
  const paginated = filtered.slice((currentPage - 1) * itemsPerPage, currentPage * itemsPerPage)

  return (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="font-heading text-xl font-bold text-[#0B3C6D]">Users</h1>
          <p className="text-sm text-[#9CA3AF]">Kelola pengguna CMS Safiq Tour</p>
        </div>
        <button className="flex items-center gap-2 rounded-xl bg-[#0B3C6D] px-4 py-2.5 text-sm font-semibold text-white transition-all hover:bg-[#0B2D52] shadow-lg shadow-[#0B3C6D]/20">
          <Plus className="size-4" />
          Tambah User
        </button>
      </div>

      <div className="rounded-2xl border border-[#E5E7EB] bg-white">
        <div className="border-b border-[#E5E7EB] p-4">
          <div className="relative max-w-xs">
            <Search className="absolute left-3 top-1/2 size-4 -translate-y-1/2 text-[#9CA3AF]" />
            <input
              type="text"
              placeholder="Cari user..."
              value={search}
              onChange={(e) => { setSearch(e.target.value); setCurrentPage(1) }}
              className="w-full rounded-xl border border-[#E5E7EB] bg-[#F8FAFC] py-2.5 pl-10 pr-4 text-sm text-[#0B3C6D] placeholder:text-[#9CA3AF] outline-none focus:border-[#C89B3C] focus:ring-2 focus:ring-[#C89B3C]/20 transition-all"
            />
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b border-[#E5E7EB]">
                <th className="px-4 py-3 text-left text-xs font-semibold text-[#9CA3AF] uppercase">Nama</th>
                <th className="px-4 py-3 text-left text-xs font-semibold text-[#9CA3AF] uppercase">Email</th>
                <th className="px-4 py-3 text-left text-xs font-semibold text-[#9CA3AF] uppercase">Role</th>
                <th className="px-4 py-3 text-left text-xs font-semibold text-[#9CA3AF] uppercase">Status</th>
                <th className="px-4 py-3 text-left text-xs font-semibold text-[#9CA3AF] uppercase">Tanggal Dibuat</th>
                <th className="px-4 py-3 text-right text-xs font-semibold text-[#9CA3AF] uppercase">Action</th>
              </tr>
            </thead>
            <tbody>
              {paginated.map((user, i) => {
                const Icon = roleIcons[user.role] ?? Shield
                return (
                  <motion.tr
                    key={user.id}
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: i * 0.05 }}
                    className="border-b border-[#E5E7EB] last:border-0 hover:bg-[#F8FAFC] transition-colors"
                  >
                    <td className="px-4 py-3">
                      <div className="flex items-center gap-3">
                        <div className="flex size-9 items-center justify-center rounded-xl bg-gradient-to-br from-[#0B3C6D] to-[#C89B3C] text-xs font-bold text-white">
                          {user.name.charAt(0)}
                        </div>
                        <span className="text-sm font-medium text-[#0B3C6D]">{user.name}</span>
                      </div>
                    </td>
                    <td className="px-4 py-3 text-sm text-[#6B7280]">{user.email}</td>
                    <td className="px-4 py-3">
                      <span className={`inline-flex items-center gap-1 rounded-lg px-2.5 py-1 text-xs font-medium ${roleColors[user.role]}`}>
                        <Icon className="size-3" />
                        {user.role.replace("_", " ")}
                      </span>
                    </td>
                    <td className="px-4 py-3">
                      <span className="inline-flex items-center gap-1 rounded-lg bg-emerald-50 px-2.5 py-1 text-xs font-medium text-emerald-600">
                        <span className="size-1.5 rounded-full bg-emerald-500" />
                        {user.status}
                      </span>
                    </td>
                    <td className="px-4 py-3 text-sm text-[#6B7280]">{user.createdAt}</td>
                    <td className="px-4 py-3 text-right">
                      <div className="flex items-center justify-end gap-1">
                        <button className="flex size-8 items-center justify-center rounded-lg text-[#9CA3AF] hover:bg-[#F8FAFC] hover:text-[#0B3C6D] transition-colors">
                          <Eye className="size-4" />
                        </button>
                        <button className="flex size-8 items-center justify-center rounded-lg text-[#9CA3AF] hover:bg-[#F8FAFC] hover:text-blue-600 transition-colors">
                          <Pencil className="size-4" />
                        </button>
                        <button className="flex size-8 items-center justify-center rounded-lg text-[#9CA3AF] hover:bg-red-50 hover:text-red-600 transition-colors">
                          <Trash2 className="size-4" />
                        </button>
                      </div>
                    </td>
                  </motion.tr>
                )
              })}
            </tbody>
          </table>
        </div>

        {totalPages > 1 && (
          <div className="flex items-center justify-between border-t border-[#E5E7EB] px-4 py-3">
            <p className="text-sm text-[#9CA3AF]">
              Menampilkan {(currentPage - 1) * itemsPerPage + 1} - {Math.min(currentPage * itemsPerPage, filtered.length)} dari {filtered.length}
            </p>
            <div className="flex gap-1">
              {Array.from({ length: totalPages }, (_, i) => (
                <button
                  key={i + 1}
                  onClick={() => setCurrentPage(i + 1)}
                  className={`flex size-8 items-center justify-center rounded-lg text-sm transition-colors ${
                    currentPage === i + 1
                      ? "bg-[#0B3C6D] text-white"
                      : "text-[#6B7280] hover:bg-[#F8FAFC]"
                  }`}
                >
                  {i + 1}
                </button>
              ))}
            </div>
          </div>
        )}
      </div>
    </motion.div>
  )
}
