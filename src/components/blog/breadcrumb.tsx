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
    <nav className="flex items-center gap-2 text-xs text-[#6B7280]">
      <Link href="/" className="transition-colors duration-300 hover:text-[#C89B3C]">Beranda</Link>
      {items.map((item, i) => (
        <span key={i} className="flex items-center gap-2">
          <ChevronRight className="size-3" />
          {item.href ? (
            <Link href={item.href} className="transition-colors duration-300 hover:text-[#C89B3C]">{item.label}</Link>
          ) : (
            <span className="text-[#0B3C6D] font-medium">{item.label}</span>
          )}
        </span>
      ))}
    </nav>
  )
}
