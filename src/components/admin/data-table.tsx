"use client"

import { useState, useMemo } from "react"
import { motion } from "framer-motion"
import { Search, ChevronLeft, ChevronRight, ArrowUpDown, ArrowUp, ArrowDown, Trash2, RotateCcw, Eye, EyeOff } from "lucide-react"
import { cn } from "@/lib/utils"

export interface Column<T> {
  key: string
  header: string
  sortable?: boolean
  render?: (item: T) => React.ReactNode
  visible?: boolean
  hideOnMobile?: boolean
}

interface DataTableProps<T> {
  columns: Column<T>[]
  data: T[]
  loading?: boolean
  page: number
  totalPages: number
  total: number
  onPageChange: (page: number) => void
  sort?: string
  order?: "asc" | "desc"
  onSort?: (key: string) => void
  search?: string
  onSearch?: (value: string) => void
  searchPlaceholder?: string
  onDelete?: (id: string) => void
  onRestore?: (id: string) => void
  onToggleStatus?: (id: string, isActive: boolean) => void
  showDeleted?: boolean
  onToggleShowDeleted?: (show: boolean) => void
  actions?: (item: T) => React.ReactNode
  getId: (item: T) => string
  getIsDeleted?: (item: T) => boolean
}

export function DataTable<T>({
  columns,
  data,
  loading,
  page,
  totalPages,
  total,
  onPageChange,
  sort,
  order,
  onSort,
  search,
  onSearch,
  searchPlaceholder = "Search...",
  onDelete,
  onRestore,
  showDeleted,
  onToggleShowDeleted,
  actions,
  getId,
  getIsDeleted,
}: DataTableProps<T>) {
  const [columnVisibility, setColumnVisibility] = useState<Record<string, boolean>>(
    Object.fromEntries(columns.map((c) => [c.key, c.visible ?? true]))
  )
  const [showColumnMenu, setShowColumnMenu] = useState(false)

  const toggleColumn = (key: string) => {
    setColumnVisibility((prev) => ({ ...prev, [key]: !prev[key] }))
  }

  const visibleColumns = useMemo(() => columns.filter((c) => columnVisibility[c.key] !== false), [columns, columnVisibility])

  const SortIcon = ({ columnKey }: { columnKey: string }) => {
    if (sort !== columnKey) return <ArrowUpDown className="size-3 text-[#9CA3AF]" />
    return order === "asc" ? <ArrowUp className="size-3 text-[#0B3C6D]" /> : <ArrowDown className="size-3 text-[#0B3C6D]" />
  }

  return (
    <div className="space-y-4">
      <div className="flex flex-wrap items-center gap-3">
        {onSearch && (
          <div className="relative flex-1 min-w-[200px] max-w-sm">
            <Search className="absolute left-3 top-1/2 size-4 -translate-y-1/2 text-[#9CA3AF]" />
            <input
              type="text"
              value={search ?? ""}
              onChange={(e) => onSearch(e.target.value)}
              placeholder={searchPlaceholder}
              className="w-full rounded-xl border border-[#E5E7EB] bg-white py-2.5 pl-10 pr-4 text-sm text-[#0B3C6D] placeholder:text-[#9CA3AF] outline-none focus:border-[#C89B3C] focus:ring-2 focus:ring-[#C89B3C]/20 transition-all"
            />
          </div>
        )}
        <div className="flex items-center gap-2 ml-auto">
          {onToggleShowDeleted && (
            <button
              onClick={() => onToggleShowDeleted(!showDeleted)}
              className={cn(
                "flex items-center gap-1.5 rounded-xl border px-3 py-2 text-xs font-medium transition-all",
                showDeleted
                  ? "border-red-200 bg-red-50 text-red-600"
                  : "border-[#E5E7EB] bg-white text-[#6B7280] hover:bg-[#F8FAFC]"
              )}
            >
              {showDeleted ? <EyeOff className="size-3.5" /> : <Eye className="size-3.5" />}
              {showDeleted ? "Hide Deleted" : "Show Deleted"}
            </button>
          )}
          <div className="relative">
            <button
              onClick={() => setShowColumnMenu(!showColumnMenu)}
              className="flex items-center gap-1.5 rounded-xl border border-[#E5E7EB] bg-white px-3 py-2 text-xs font-medium text-[#6B7280] hover:bg-[#F8FAFC] transition-all"
            >
              <Eye className="size-3.5" />
              Columns
            </button>
            {showColumnMenu && (
              <motion.div
                initial={{ opacity: 0, y: 4 }}
                animate={{ opacity: 1, y: 0 }}
                className="absolute right-0 top-full mt-1 z-50 w-44 rounded-xl border border-[#E5E7EB] bg-white shadow-lg"
              >
                <div className="p-1.5 space-y-0.5">
                  {columns.map((col) => (
                    <button
                      key={col.key}
                      onClick={() => toggleColumn(col.key)}
                      className="flex w-full items-center gap-2 rounded-lg px-3 py-1.5 text-xs text-[#6B7280] hover:bg-[#F8FAFC] transition-colors"
                    >
                      <div className={cn("size-3.5 rounded border flex items-center justify-center", columnVisibility[col.key] !== false ? "bg-[#0B3C6D] border-[#0B3C6D]" : "border-[#D1D5DB]")}>
                        {columnVisibility[col.key] !== false && <span className="text-white text-[8px]">✓</span>}
                      </div>
                      {col.header}
                    </button>
                  ))}
                </div>
              </motion.div>
            )}
          </div>
        </div>
      </div>

      <div className="overflow-x-auto rounded-2xl border border-[#E5E7EB] bg-white">
        <table className="w-full">
          <thead>
            <tr className="border-b border-[#E5E7EB] bg-[#F8FAFC]">
              {visibleColumns.map((col) => (
                <th
                  key={col.key}
                  className={cn(
                    "px-4 py-3 text-left text-xs font-semibold text-[#6B7280] uppercase tracking-wider",
                    col.sortable && "cursor-pointer select-none hover:text-[#0B3C6D]",
                    col.hideOnMobile && "hidden lg:table-cell"
                  )}
                  onClick={() => col.sortable && onSort?.(col.key)}
                >
                  <div className="flex items-center gap-1">
                    {col.header}
                    {col.sortable && <SortIcon columnKey={col.key} />}
                  </div>
                </th>
              ))}
              {(actions || onDelete || onRestore) && (
                <th className="px-4 py-3 text-right text-xs font-semibold text-[#6B7280] uppercase tracking-wider">
                  Actions
                </th>
              )}
            </tr>
          </thead>
          <tbody>
            {loading ? (
              <tr>
                <td colSpan={visibleColumns.length + 1} className="px-4 py-12 text-center text-sm text-[#9CA3AF]">
                  Loading...
                </td>
              </tr>
            ) : data.length === 0 ? (
              <tr>
                <td colSpan={visibleColumns.length + 1} className="px-4 py-12 text-center text-sm text-[#9CA3AF]">
                  No data found
                </td>
              </tr>
            ) : (
              data.map((item) => {
                const id = getId(item)
                const isDeleted = getIsDeleted?.(item)
                return (
                  <tr
                    key={id}
                    className={cn(
                      "border-b border-[#E5E7EB] transition-colors hover:bg-[#F8FAFC]",
                      isDeleted && "bg-red-50/30"
                    )}
                  >
                    {visibleColumns.map((col) => (
                      <td
                        key={col.key}
                        className={cn(
                          "px-4 py-3 text-sm text-[#0B3C6D]",
                          col.hideOnMobile && "hidden lg:table-cell"
                        )}
                      >
                        {col.render ? col.render(item) : String((item as Record<string, unknown>)[col.key] ?? "")}
                      </td>
                    ))}
                    <td className="px-4 py-3">
                      <div className="flex items-center justify-end gap-1">
                        {isDeleted && onRestore && (
                          <button
                            onClick={() => onRestore(id)}
                            className="rounded-lg p-1.5 text-[#6B7280] hover:bg-green-50 hover:text-green-600 transition-colors"
                            title="Restore"
                          >
                            <RotateCcw className="size-4" />
                          </button>
                        )}
                        {!isDeleted && onDelete && (
                          <button
                            onClick={() => onDelete(id)}
                            className="rounded-lg p-1.5 text-[#6B7280] hover:bg-red-50 hover:text-red-600 transition-colors"
                            title="Delete"
                          >
                            <Trash2 className="size-4" />
                          </button>
                        )}
                        {actions?.(item)}
                      </div>
                    </td>
                  </tr>
                )
              })
            )}
          </tbody>
        </table>
      </div>

      <div className="flex items-center justify-between">
        <p className="text-xs text-[#9CA3AF]">
          {total > 0 ? `Showing ${(page - 1) * (data.length || 1) + 1} to ${Math.min(page * (data.length || 1), total)} of ${total}` : "No results"}
        </p>
        {totalPages > 1 && (
          <div className="flex items-center gap-1">
            <button
              onClick={() => onPageChange(page - 1)}
              disabled={page <= 1}
              className="flex size-8 items-center justify-center rounded-lg border border-[#E5E7EB] text-[#6B7280] hover:bg-[#F8FAFC] disabled:cursor-not-allowed disabled:opacity-40 transition-all"
            >
              <ChevronLeft className="size-4" />
            </button>
            {Array.from({ length: Math.min(5, totalPages) }, (_, i) => {
              let pageNum: number
              if (totalPages <= 5) {
                pageNum = i + 1
              } else if (page <= 3) {
                pageNum = i + 1
              } else if (page >= totalPages - 2) {
                pageNum = totalPages - 4 + i
              } else {
                pageNum = page - 2 + i
              }
              return (
                <button
                  key={pageNum}
                  onClick={() => onPageChange(pageNum)}
                  className={cn(
                    "flex size-8 items-center justify-center rounded-lg text-xs font-medium transition-all",
                    page === pageNum
                      ? "bg-[#0B3C6D] text-white"
                      : "border border-[#E5E7EB] text-[#6B7280] hover:bg-[#F8FAFC]"
                  )}
                >
                  {pageNum}
                </button>
              )
            })}
            <button
              onClick={() => onPageChange(page + 1)}
              disabled={page >= totalPages}
              className="flex size-8 items-center justify-center rounded-lg border border-[#E5E7EB] text-[#6B7280] hover:bg-[#F8FAFC] disabled:cursor-not-allowed disabled:opacity-40 transition-all"
            >
              <ChevronRight className="size-4" />
            </button>
          </div>
        )}
      </div>
    </div>
  )
}
