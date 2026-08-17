"use client"

import Link from "next/link"
import { ChevronRight } from "lucide-react"

type BreadcrumbItem = {
  label: string
  href?: string
}

type BreadcrumbProps = {
  items: BreadcrumbItem[]
}

export function Breadcrumb({ items }: BreadcrumbProps) {
  return (
    <nav aria-label="Breadcrumb" className="flex min-w-0 items-center gap-1.5 text-xs text-[#6B7280]">
      <Link href="/" className="shrink-0 whitespace-nowrap transition-colors duration-300 hover:text-[#C89B3C]">Beranda</Link>
      {items.map((item, i) => (
        <span key={i} className="flex min-w-0 items-center gap-1.5">
          <ChevronRight className="size-3 shrink-0" />
          {item.href ? (
            <Link href={item.href} className="shrink-0 whitespace-nowrap transition-colors duration-300 hover:text-[#C89B3C]">{item.label}</Link>
          ) : (
            <span className="truncate font-medium text-[#0B3C6D]">{item.label}</span>
          )}
        </span>
      ))}
    </nav>
  )
}
