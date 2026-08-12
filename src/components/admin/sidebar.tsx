"use client"

import Link from "next/link"
import { usePathname } from "next/navigation"
import { useState } from "react"
import { motion, AnimatePresence } from "framer-motion"
import {
  LayoutDashboard,
  Package,
  FileText,
  Image,
  Calendar,
  Megaphone,
  MessageSquare,
  HelpCircle,
  Users,
  Settings,
  ChevronLeft,
  ChevronRight,
  ChevronDown,
  Globe,
  Flag,
  Hotel,
  Plane,
  Bus,
  List,
  Tag,
  LayoutGrid,
  ClipboardList,
  X,
} from "lucide-react"
import { cn } from "@/lib/utils"
import { matchesPermission } from "@/providers/auth/resolvers/permission.resolver"

// NOTE: Gallery, Jadwal, Testimoni, and FAQ carry `hidden: true` — they are
// temporarily removed from the sidebar display only (features to be developed
// later). Their routes, pages, components, and permissions remain fully
// intact. Remove the `hidden` flag to restore a menu item.
const menuItems = [
  { href: "/admin/dashboard", label: "Dashboard", icon: LayoutDashboard, permission: "dashboard:read" },
  { href: "/admin/customers", label: "Customers", icon: Users, permission: "customer:read" },
  { href: "/admin/bookings", label: "Booking", icon: ClipboardList, permission: "booking:read" },
  {
    label: "Master Data",
    icon: Globe,
    children: [
      { href: "/admin/geography/countries", label: "Country", icon: Flag, permission: "master.country:read" },
      { href: "/admin/geography/destinations", label: "Destination", icon: Globe, permission: "master.destination:read" },
      { href: "/admin/hospitality/hotels", label: "Hotel", icon: Hotel, permission: "master.hotel:read" },
      { href: "/admin/hospitality/airlines", label: "Airline", icon: Plane, permission: "master.airline:read" },
      { href: "/admin/hospitality/transportation", label: "Transportation", icon: Bus, permission: "master.transportation:read" },
      { href: "/admin/master/facilities", label: "Facility", icon: List, permission: "master.facility:read" },
      { href: "/admin/master/visas", label: "Visa", icon: Globe, permission: "master.visa:read" },
      { href: "/admin/master/package-categories", label: "Package Category", icon: LayoutGrid, permission: "master.package-category:read" },
      { href: "/admin/master/package-types", label: "Program Paket", icon: Plane, permission: "master.package-type:read" },
      { href: "/admin/master/tags", label: "Tags", icon: Tag, permission: "master.tag:read" },
      { href: "/admin/master/business-settings", label: "Business Settings", icon: Settings, permission: "master.business-setting:read" },
    ],
  },
  { href: "/admin/media", label: "Media Library", icon: Image, permission: "media:read" },
  { href: "/admin/packages", label: "Paket Umroh", icon: Package, permission: "package:read" },
  { href: "/admin/articles", label: "Artikel", icon: FileText, permission: "cms:read" },
  { href: "/admin/gallery", label: "Gallery", icon: Image, permission: "media:read", hidden: true },
  { href: "/admin/schedule", label: "Jadwal", icon: Calendar, permission: "booking:read", hidden: true },
  { href: "/admin/promo", label: "Promo", icon: Megaphone, permission: "marketing:read" },
  { href: "/admin/testimonials", label: "Testimoni", icon: MessageSquare, permission: "cms:read", hidden: true },
  { href: "/admin/faq", label: "FAQ", icon: HelpCircle, permission: "cms:read", hidden: true },
  { href: "/admin/users", label: "Users", icon: Users, permission: "user:read" },
  { href: "/admin/settings", label: "Settings", icon: Settings, permission: "setting:read" },
]

interface SidebarProps {
  collapsed: boolean
  onToggle: () => void
  mobileOpen: boolean
  onMobileClose: () => void
  permissions?: string[]
}

export function Sidebar({ collapsed, onToggle, mobileOpen, onMobileClose, permissions = [] }: SidebarProps) {
  const pathname = usePathname()
  const canSee = (permission?: string) =>
    permission ? matchesPermission(permission, permissions) : true
  const [expandedMenus, setExpandedMenus] = useState<string[]>(() => {
    return menuItems.filter((item) => "children" in item && item.children?.some((c) => pathname.startsWith(c.href))).map((item) => item.label)
  })

  const toggleMenu = (label: string) => {
    setExpandedMenus((prev) => prev.includes(label) ? prev.filter((m) => m !== label) : [...prev, label])
  }

  const sidebarContent = (
    <div className={cn(
      "flex h-full flex-col bg-[#0B3C6D] text-white transition-all duration-300",
      collapsed ? "w-16" : "w-64"
    )}>
      <div className="flex h-16 items-center justify-between px-4 border-b border-white/10">
        <AnimatePresence mode="wait">
          {!collapsed && (
            <motion.div
              initial={{ opacity: 0, x: -10 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -10 }}
              className="flex items-center gap-2"
            >
              <div className="flex size-8 items-center justify-center rounded-lg bg-[#C89B3C] text-xs font-bold text-white">
                ST
              </div>
              <span className="font-heading text-sm font-bold">Safiq Tour</span>
            </motion.div>
          )}
          {collapsed && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="mx-auto"
            >
              <div className="flex size-8 items-center justify-center rounded-lg bg-[#C89B3C] text-xs font-bold text-white">
                ST
              </div>
            </motion.div>
          )}
        </AnimatePresence>
        <button
          onClick={onToggle}
          className="hidden lg:flex size-6 items-center justify-center rounded-md text-white/60 hover:bg-white/10 hover:text-white transition-colors"
        >
          {collapsed ? <ChevronRight className="size-4" /> : <ChevronLeft className="size-4" />}
        </button>
      </div>

      <nav className="flex-1 overflow-y-auto p-2 space-y-1 scrollbar-hide">
        {menuItems.filter((item) => {
          if ("hidden" in item && item.hidden) return false
          if ("children" in item) {
            return item.children?.some((c) => canSee(c.permission))
          }
          return canSee(item.permission)
        }).map((item) => {
          if ("children" in item) {
            const Icon = item.icon
            const isExpanded = expandedMenus.includes(item.label)
            const anyChildActive = item.children?.some((c) => pathname.startsWith(c.href))
            const visibleChildren = item.children?.filter((c) => canSee(c.permission)) ?? []
            return (
              <div key={item.label}>
                <button
                  onClick={() => { if (!collapsed) toggleMenu(item.label) }}
                  className={cn(
                    "flex w-full items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-medium transition-all duration-200",
                    anyChildActive
                      ? "bg-white/10 text-white"
                      : "text-white/60 hover:bg-white/10 hover:text-white"
                  )}
                >
                  <Icon className={cn("size-5 shrink-0", collapsed && "mx-auto")} />
                  {!collapsed && (
                    <motion.span
                      initial={{ opacity: 0, x: -10 }}
                      animate={{ opacity: 1, x: 0 }}
                      className="flex-1 text-left"
                    >
                      {item.label}
                    </motion.span>
                  )}
                  {!collapsed && (
                    <ChevronDown className={cn("size-4 transition-transform", isExpanded && "rotate-180")} />
                  )}
                </button>
                {!collapsed && isExpanded && (
                  <div className="ml-4 mt-1 space-y-0.5 border-l border-white/10 pl-2">
                    {visibleChildren.map((child) => {
                      const ChildIcon = child.icon
                      const isChildActive = pathname === child.href || pathname.startsWith(child.href + "/")
                      return (
                        <Link
                          key={child.href}
                          href={child.href}
                          onClick={() => mobileOpen && onMobileClose()}
                          className={cn(
                            "flex items-center gap-2 rounded-lg px-3 py-2 text-xs font-medium transition-all duration-200",
                            isChildActive
                              ? "bg-[#C89B3C]/20 text-white"
                              : "text-white/50 hover:bg-white/5 hover:text-white"
                          )}
                        >
                          <ChildIcon className="size-3.5 shrink-0" />
                          {child.label}
                        </Link>
                      )
                    })}
                  </div>
                )}
              </div>
            )
          }

          const Icon = item.icon
          const isActive = pathname === item.href || pathname.startsWith(item.href + "/")
          return (
            <Link
              key={item.href}
              href={item.href}
              onClick={() => mobileOpen && onMobileClose()}
              className={cn(
                "flex items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-medium transition-all duration-200",
                isActive
                  ? "bg-[#C89B3C] text-white shadow-lg shadow-[#C89B3C]/20"
                  : "text-white/60 hover:bg-white/10 hover:text-white"
              )}
            >
              <Icon className={cn("size-5 shrink-0", collapsed && "mx-auto")} />
              <AnimatePresence mode="wait">
                {!collapsed && (
                  <motion.span
                    initial={{ opacity: 0, x: -10 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: -10 }}
                  >
                    {item.label}
                  </motion.span>
                )}
              </AnimatePresence>
            </Link>
          )
        })}
      </nav>

      <div className={cn(
        "border-t border-white/10 p-3",
        collapsed && "flex justify-center"
      )}>
        {!collapsed && (
          <p className="text-xs text-white/40">Safiq Tour CMS v1.0</p>
        )}
      </div>
    </div>
  )

  return (
    <>
      <aside className="hidden lg:block h-screen sticky top-0 shrink-0">
        {sidebarContent}
      </aside>

      <AnimatePresence>
        {mobileOpen && (
          <>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 z-40 bg-black/50 lg:hidden"
              onClick={onMobileClose}
            />
            <motion.aside
              initial={{ x: "-100%" }}
              animate={{ x: 0 }}
              exit={{ x: "-100%" }}
              transition={{ type: "spring", damping: 25, stiffness: 200 }}
              className="fixed inset-y-0 left-0 z-50 w-64 lg:hidden"
            >
              <div className="relative h-full">
                <button
                  onClick={onMobileClose}
                  className="absolute -right-10 top-4 flex size-8 items-center justify-center rounded-full bg-[#0B3C6D] text-white"
                >
                  <X className="size-4" />
                </button>
                {sidebarContent}
              </div>
            </motion.aside>
          </>
        )}
      </AnimatePresence>
    </>
  )
}
