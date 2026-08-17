"use client"

import { useEffect, useState } from "react"
import { motion } from "framer-motion"
import {
  Package,
  Image,
  FileEdit,
  CheckCircle,
  Users,
  Upload,
  Calendar,
  TrendingUp,
} from "lucide-react"
import {
  AreaChart,
  Area,
  PieChart,
  Pie,
  Cell,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from "recharts"
import { getDashboardStats, type DashboardStats } from "@/actions/dashboard"

const visitorData = [
  { month: "Jan", visitors: 1200 }, { month: "Feb", visitors: 1900 }, { month: "Mar", visitors: 1600 },
  { month: "Apr", visitors: 2100 }, { month: "Mei", visitors: 1800 }, { month: "Jun", visitors: 2400 },
  { month: "Jul", visitors: 2800 }, { month: "Agu", visitors: 2600 }, { month: "Sep", visitors: 3100 },
  { month: "Okt", visitors: 2900 }, { month: "Nov", visitors: 3400 }, { month: "Des", visitors: 3800 },
]

const categoryData = [
  { name: "Edukasi", value: 8, color: "#0B3C6D" }, { name: "Tips", value: 6, color: "#C89B3C" },
  { name: "Sejarah", value: 5, color: "#059669" }, { name: "Dokumentasi", value: 7, color: "#7C3AED" },
  { name: "Informasi", value: 6, color: "#DC2626" },
]

const quickActions = [
  { label: "Tambah Paket", icon: Package, href: "/admin/packages/new", color: "text-blue-600", bg: "bg-blue-50" },
  { label: "Upload Gambar", icon: Upload, href: "/admin/gallery", color: "text-emerald-600", bg: "bg-emerald-50" },
  { label: "Tambah Jadwal", icon: Calendar, href: "/admin/schedule/new", color: "text-purple-600", bg: "bg-purple-50" },
  { label: "Kelola User", icon: Users, href: "/admin/users", color: "text-rose-600", bg: "bg-rose-50" },
]

const container = {
  hidden: { opacity: 0 },
  show: { opacity: 1, transition: { staggerChildren: 0.05 } },
}

const item = {
  hidden: { opacity: 0, y: 20 },
  show: { opacity: 1, y: 0 },
}

export default function DashboardPage() {
  const [data, setData] = useState<DashboardStats | null>(null)

  useEffect(() => {
    getDashboardStats().then(setData)
  }, [])

  const stats = [
    { label: "Total Paket", value: data?.totalPackages ?? 0, icon: Package, bg: "bg-blue-50", text: "text-blue-600" },
    { label: "Published", value: data?.publishedPackages ?? 0, icon: CheckCircle, bg: "bg-green-50", text: "text-green-600" },
    { label: "Draft", value: data?.draftPackages ?? 0, icon: FileEdit, bg: "bg-purple-50", text: "text-purple-600" },
    { label: "Total Media", value: data?.totalMedia ?? 0, icon: Image, bg: "bg-emerald-50", text: "text-emerald-600" },
    { label: "Total User", value: data?.totalUsers ?? 0, icon: Users, bg: "bg-rose-50", text: "text-rose-600" },
  ]

  return (
    <motion.div variants={container} initial="hidden" animate="show" className="space-y-6">
      <motion.div variants={item} className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-[#0B3C6D] to-[#0B2D52] p-6 lg:p-8">
        <div className="absolute -right-20 -top-20 size-64 rounded-full bg-[#C89B3C]/10 blur-3xl" />
        <div className="absolute -bottom-20 -left-20 size-48 rounded-full bg-white/5 blur-3xl" />
        <div className="relative">
          <motion.h1 className="font-heading text-xl font-bold text-white lg:text-2xl">
            Selamat Datang di STMS
          </motion.h1>
          <p className="mt-2 text-sm text-white/60">Safiq Tour Management System</p>
        </div>
      </motion.div>

      <motion.div variants={item} className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5">
        {stats.map((stat) => {
          const Icon = stat.icon
          return (
            <motion.div key={stat.label} whileHover={{ y: -2 }} className="rounded-2xl border border-[#E5E7EB] bg-white p-4 transition-shadow hover:shadow-lg">
              <div className="flex items-center gap-3">
                <div className={`flex size-10 items-center justify-center rounded-xl ${stat.bg}`}>
                  <Icon className={`size-5 ${stat.text}`} />
                </div>
                <div>
                  <p className="text-2xl font-bold text-[#0B3C6D]">{stat.value}</p>
                  <p className="text-xs text-[#9CA3AF]">{stat.label}</p>
                </div>
              </div>
            </motion.div>
          )
        })}
      </motion.div>

      <div className="grid gap-6 lg:grid-cols-3">
        <motion.div variants={item} className="lg:col-span-2 rounded-2xl border border-[#E5E7EB] bg-white p-6">
          <div className="mb-4 flex items-center justify-between">
            <h3 className="font-heading text-sm font-bold text-[#0B3C6D]">Grafik Visitor</h3>
            <span className="flex items-center gap-1 text-xs text-emerald-600"><TrendingUp className="size-3" /> +24.5%</span>
          </div>
          <div className="h-72">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={visitorData}>
                <defs>
                  <linearGradient id="vg" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#0B3C6D" stopOpacity={0.1} />
                    <stop offset="95%" stopColor="#0B3C6D" stopOpacity={0} />
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke="#F3F4F6" />
                <XAxis dataKey="month" stroke="#9CA3AF" fontSize={12} tickLine={false} />
                <YAxis stroke="#9CA3AF" fontSize={12} tickLine={false} />
                <Tooltip />
                <Area type="monotone" dataKey="visitors" stroke="#0B3C6D" strokeWidth={2} fill="url(#vg)" />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </motion.div>

        <motion.div variants={item} className="rounded-2xl border border-[#E5E7EB] bg-white p-6">
          <h3 className="mb-4 font-heading text-sm font-bold text-[#0B3C6D]">Kategori Artikel</h3>
          <div className="h-72">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie data={categoryData} cx="50%" cy="50%" innerRadius={60} outerRadius={90} paddingAngle={4} dataKey="value">
                  {categoryData.map((entry, i) => <Cell key={i} fill={entry.color} />)}
                </Pie>
                <Tooltip />
              </PieChart>
            </ResponsiveContainer>
          </div>
          <div className="mt-2 space-y-2">
            {categoryData.map((cat) => (
              <div key={cat.name} className="flex items-center justify-between text-sm">
                <div className="flex items-center gap-2">
                  <div className="size-2.5 rounded-full" style={{ backgroundColor: cat.color }} />
                  <span className="text-[#6B7280]">{cat.name}</span>
                </div>
                <span className="font-medium text-[#0B3C6D]">{cat.value}</span>
              </div>
            ))}
          </div>
        </motion.div>
      </div>

      <div className="grid gap-6 lg:grid-cols-2">
        <motion.div variants={item} className="rounded-2xl border border-[#E5E7EB] bg-white p-6">
          <h3 className="mb-4 font-heading text-sm font-bold text-[#0B3C6D]">Recent Activity</h3>
          <div className="space-y-4">
            {data?.recentActivities?.length ? data.recentActivities.map((activity) => (
              <div key={activity.id} className="flex items-start gap-3">
                <div className="mt-1 flex size-8 items-center justify-center rounded-xl bg-[#F8FAFC]">
                  <div className="size-2 rounded-full bg-blue-500" />
                </div>
                <div className="flex-1">
                  <p className="text-sm text-[#6B7280]">{activity.user} — {activity.action} {activity.resource}</p>
                  <p className="text-xs text-[#9CA3AF]">{new Date(activity.time).toLocaleString("id-ID")}</p>
                </div>
              </div>
            )) : (
              <p className="text-sm text-[#9CA3AF] text-center py-4">Belum ada aktivitas</p>
            )}
          </div>
        </motion.div>

        <motion.div variants={item} className="rounded-2xl border border-[#E5E7EB] bg-white p-6">
          <h3 className="mb-4 font-heading text-sm font-bold text-[#0B3C6D]">Quick Action</h3>
          <div className="grid grid-cols-2 gap-3">
            {quickActions.map((action) => {
              const Icon = action.icon
              return (
                <motion.a
                  key={action.label}
                  href={action.href}
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  className="flex flex-col items-center gap-2 rounded-2xl border border-[#E5E7EB] p-4 transition-colors hover:border-[#C89B3C]/30 hover:shadow-md"
                >
                  <div className={`flex size-10 items-center justify-center rounded-xl ${action.bg}`}>
                    <Icon className={`size-5 ${action.color}`} />
                  </div>
                  <span className="text-xs font-medium text-[#6B7280]">{action.label}</span>
                </motion.a>
              )
            })}
          </div>
        </motion.div>
      </div>
    </motion.div>
  )
}
