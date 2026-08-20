"use client"

import { useState, useEffect, useCallback } from "react"
import { motion } from "framer-motion"
import Link from "next/link"
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
import { getUsers, deleteUser } from "@/modules/user/actions/user"
import type { UserListItem } from "@/modules/user/types"
import { canUser } from "@/actions/permissions"

const roleIcons: Record<string, typeof Shield> = {
  "super-admin": ShieldAlert,
  admin: ShieldCheck,
  marketing: Shield,
  editor: Shield,
  finance: Shield,
  cs: Shield,
  muthowif: Shield,
  owner: Shield,
}

const roleColors: Record<string, string> = {
  "super-admin": "text-purple-600 bg-purple-50",
  admin: "text-blue-600 bg-blue-50",
  marketing: "text-emerald-600 bg-emerald-50",
  editor: "text-amber-600 bg-amber-50",
  finance: "text-cyan-600 bg-cyan-50",
  cs: "text-rose-600 bg-rose-50",
  muthowif: "text-teal-600 bg-teal-50",
  owner: "text-slate-600 bg-slate-50",
}

function formatDate(iso: string | null): string {
  if (!iso) return "-"
  const d = new Date(iso)
  if (Number.isNaN(d.getTime())) return "-"
  return d.toISOString().slice(0, 10)
}

export default function UsersPage() {
  const [users, setUsers] = useState<UserListItem[]>([])
  const [loading, setLoading] = useState(true)
  const [search, setSearch] = useState("")
  const [currentPage, setCurrentPage] = useState(1)
  const [totalPages, setTotalPages] = useState(1)
  const [total, setTotal] = useState(0)
  const itemsPerPage = 5
  const [canUpdate, setCanUpdate] = useState(false)
  const [canDelete, setCanDelete] = useState(false)
  const [canCreate, setCanCreate] = useState(false)

  const fetchData = useCallback(async () => {
    setLoading(true)
    try {
      const result = await getUsers({
        page: currentPage,
        limit: itemsPerPage,
        search: search || undefined,
      })
      setUsers(result.data)
      setTotalPages(result.pagination.totalPages)
      setTotal(result.pagination.total)
    } catch {
      setUsers([])
    } finally {
      setLoading(false)
    }
  }, [currentPage, search])

  useEffect(() => { fetchData() }, [fetchData])
  useEffect(() => { setCurrentPage(1) }, [search])
  useEffect(() => { canUser("user:update").then(setCanUpdate); canUser("user:delete").then(setCanDelete); canUser("user:create").then(setCanCreate) }, [])

  const filtered = users

  const handleDelete = async (id: string) => {
    try {
      await deleteUser(id)
      await fetchData()
    } catch {
      // no-op: permission check or DB error already surfaced upstream
    }
  }

  return (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="font-heading text-xl font-bold text-[#0B3C6D]">Users</h1>
          <p className="text-sm text-[#9CA3AF]">Kelola pengguna CMS Safiq Tour</p>
        </div>
        {canCreate && (
          <Link
            href="/admin/users/new"
            className="flex items-center gap-2 rounded-xl bg-[#0B3C6D] px-4 py-2.5 text-sm font-semibold text-white transition-all hover:bg-[#0B2D52] shadow-lg shadow-[#0B3C6D]/20"
          >
            <Plus className="size-4" />
            Tambah User
          </Link>
        )}
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
              {loading ? (
                <tr>
                  <td colSpan={6} className="px-4 py-12 text-center text-sm text-[#9CA3AF]">
                    Loading...
                  </td>
                </tr>
              ) : filtered.length === 0 ? (
                <tr>
                  <td colSpan={6} className="px-4 py-12 text-center text-sm text-[#9CA3AF]">
                    Tidak ada user ditemukan
                  </td>
                </tr>
              ) : (
                filtered.map((user, i) => {
                  const slug = user.role?.slug ?? ""
                  const Icon = roleIcons[slug] ?? Shield
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
                            {user.name?.charAt(0) ?? "?"}
                          </div>
                          <span className="text-sm font-medium text-[#0B3C6D]">{user.name}</span>
                        </div>
                      </td>
                      <td className="px-4 py-3 text-sm text-[#6B7280]">{user.email}</td>
                      <td className="px-4 py-3">
                        <span className={`inline-flex items-center gap-1 rounded-lg px-2.5 py-1 text-xs font-medium ${roleColors[slug] ?? "text-[#6B7280] bg-[#F8FAFC]"}`}>
                          <Icon className="size-3" />
                          {user.role?.name ?? "Tanpa Role"}
                        </span>
                      </td>
                      <td className="px-4 py-3">
                        {user.isActive ? (
                          <span className="inline-flex items-center gap-1 rounded-lg bg-emerald-50 px-2.5 py-1 text-xs font-medium text-emerald-600">
                            <span className="size-1.5 rounded-full bg-emerald-500" />
                            Active
                          </span>
                        ) : (
                          <span className="inline-flex items-center gap-1 rounded-lg bg-red-50 px-2.5 py-1 text-xs font-medium text-red-600">
                            <span className="size-1.5 rounded-full bg-red-500" />
                            Inactive
                          </span>
                        )}
                      </td>
                      <td className="px-4 py-3 text-sm text-[#6B7280]">{formatDate(user.createdAt)}</td>
                      <td className="px-4 py-3 text-right">
                        <div className="flex items-center justify-end gap-1">
                          <button className="flex size-8 items-center justify-center rounded-lg text-[#9CA3AF] hover:bg-[#F8FAFC] hover:text-[#0B3C6D] transition-colors">
                            <Eye className="size-4" />
                          </button>
                          {canUpdate && (
                            <Link
                              href={`/admin/users/${user.id}/edit`}
                              className="flex size-8 items-center justify-center rounded-lg text-[#9CA3AF] hover:bg-[#F8FAFC] hover:text-blue-600 transition-colors"
                            >
                              <Pencil className="size-4" />
                            </Link>
                          )}
                          {canDelete && (
                            <button
                              onClick={() => handleDelete(user.id)}
                              className="flex size-8 items-center justify-center rounded-lg text-[#9CA3AF] hover:bg-red-50 hover:text-red-600 transition-colors"
                            >
                              <Trash2 className="size-4" />
                            </button>
                          )}
                        </div>
                      </td>
                    </motion.tr>
                  )
                })
              )}
            </tbody>
          </table>
        </div>

        {!loading && totalPages > 1 && (
          <div className="flex items-center justify-between border-t border-[#E5E7EB] px-4 py-3">
            <p className="text-sm text-[#9CA3AF]">
              Menampilkan {(currentPage - 1) * itemsPerPage + 1} - {Math.min(currentPage * itemsPerPage, total)} dari {total}
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