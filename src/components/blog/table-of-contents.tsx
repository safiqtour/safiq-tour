"use client"

import { useEffect, useState } from "react"
import { motion } from "framer-motion"

type TocItem = {
  id: string
  text: string
  level: number
}

type TableOfContentsProps = {
  content: string
}

export function TableOfContents({ content }: TableOfContentsProps) {
  const [items, setItems] = useState<TocItem[]>([])
  const [activeId, setActiveId] = useState<string>("")

  useEffect(() => {
    const headingRegex = /^(#{2,3})\s+(.+)$/gm
    const toc: TocItem[] = []
    let match
    while ((match = headingRegex.exec(content)) !== null) {
      const level = match[1].length
      const text = match[2]
      const id = text.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/(^-|-$)/g, "")
      toc.push({ id, text, level })
    }
    setItems(toc)
  }, [content])

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          if (entry.isIntersecting) {
            setActiveId(entry.target.id)
            break
          }
        }
      },
      { rootMargin: "-80px 0px -80% 0px" },
    )

    for (const item of items) {
      const el = document.getElementById(item.id)
      if (el) observer.observe(el)
    }

    return () => observer.disconnect()
  }, [items])

  if (items.length === 0) return null

  return (
    <motion.nav
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className="rounded-2xl border border-[#E5E7EB] bg-white p-6 shadow-lg"
    >
      <h3 className="font-heading text-sm font-bold text-[#0B3C6D]">Daftar Isi</h3>
      <ul className="mt-4 space-y-2">
        {items.map((item) => (
          <li key={item.id} style={{ paddingLeft: item.level === 3 ? "1rem" : "0" }}>
            <a
              href={`#${item.id}`}
              onClick={(e) => {
                e.preventDefault()
                document.getElementById(item.id)?.scrollIntoView({ behavior: "smooth" })
              }}
              className={`block rounded-lg px-3 py-1.5 text-sm transition-all duration-300 ${
                activeId === item.id
                  ? "bg-[#C89B3C]/10 font-semibold text-[#C89B3C]"
                  : "text-[#6B7280] hover:bg-[#F8FAFC] hover:text-[#0B3C6D]"
              }`}
            >
              {item.text}
            </a>
          </li>
        ))}
      </ul>
    </motion.nav>
  )
}
