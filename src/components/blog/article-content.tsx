"use client"

import { useMemo } from "react"
import { injectHeadingIds, isHtmlContent, slugifyHeading } from "@/lib/blog/headings"

type ArticleContentProps = {
  content: string
}

export function ArticleContent({ content }: ArticleContentProps) {
  // Articles authored in the admin CMS rich-text editor are stored as HTML;
  // older seeded articles are markdown. Detect once and render accordingly.
  const isRichHtml = isHtmlContent(content)

  const html = useMemo(() => {
    if (isRichHtml) {
      // TipTap HTML headings lack id attributes — inject them so the Table of
      // Contents anchor links work, mirroring the markdown path below.
      return injectHeadingIds(content)
    }

    const lines = content.split("\n")
    let result = ""
    let inList = false

    for (const line of lines) {
      const trimmed = line.trim()

      if (trimmed.startsWith("### ")) {
        if (inList) { result += "</ul>\n"; inList = false }
        const text = trimmed.slice(4)
        const id = slugifyHeading(text)
        result += `<h3 id="${id}" class="mt-8 mb-4 font-heading text-lg font-bold text-[#0B3C6D]">${escapeHtml(text)}</h3>\n`
      } else if (trimmed.startsWith("## ")) {
        if (inList) { result += "</ul>\n"; inList = false }
        const text = trimmed.slice(3)
        const id = slugifyHeading(text)
        result += `<h2 id="${id}" class="mt-10 mb-4 font-heading text-xl font-bold text-[#0B3C6D] md:text-2xl">${escapeHtml(text)}</h2>\n`
      } else if (trimmed.startsWith("- ")) {
        if (!inList) { result += '<ul class="mb-4 space-y-2">\n'; inList = true }
        result += `<li class="flex items-start gap-2 text-sm leading-relaxed text-[#4B5563] md:text-base"><span class="mt-1.5 size-1.5 shrink-0 rounded-full bg-[#C89B3C]"></span><span>${parseInline(trimmed.slice(2))}</span></li>\n`
      } else if (trimmed.startsWith("**") && trimmed.endsWith("**")) {
        if (inList) { result += "</ul>\n"; inList = false }
        const text = trimmed.slice(2, -2)
        result += `<p class="mb-3 text-sm font-semibold text-[#0B3C6D] md:text-base">${escapeHtml(text)}</p>\n`
      } else if (trimmed === "") {
        if (inList) { result += "</ul>\n"; inList = false }
      } else {
        if (inList) { result += "</ul>\n"; inList = false }
        if (trimmed) {
          result += `<p class="mb-4 text-sm leading-[1.8] text-[#4B5563] md:text-base">${parseInline(trimmed)}</p>\n`
        }
      }
    }
    if (inList) result += "</ul>\n"

    return result
  }, [content, isRichHtml])

  return (
    <div
      className={isRichHtml ? "prose-content article-rich-text" : "prose-content"}
      dangerouslySetInnerHTML={{ __html: html }}
    />
  )
}

function escapeHtml(text: string): string {
  return text.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;").replace(/"/g, "&quot;")
}

function parseInline(text: string): string {
  let result = escapeHtml(text)
  result = result.replace(/\*\*(.+?)\*\*/g, '<strong class="font-semibold text-[#0B3C6D]">$1</strong>')
  return result
}
