/**
 * Shared heading extraction + slug helpers for the article Table of Contents
 * and content renderer. Supports BOTH content shapes that reach /blog/[slug]:
 *
 *  - Markdown (older seeded articles): `## Heading` / `### Heading`
 *  - HTML (TipTap CMS articles): `<h2>Heading</h2>` / `<h3>Heading</h3>`
 *
 * Rendering-only — never touches stored content, the CMS, or the database.
 */

export type ArticleHeading = {
  id: string
  text: string
  level: number
}

/** Slug generator shared by the TOC and the content renderer so ids always match. */
export function slugifyHeading(text: string): string {
  return text
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/(^-|-$)/g, "")
}

/** Decode the common HTML entities that may appear inside a heading's text. */
function decodeEntities(text: string): string {
  return text
    .replace(/&amp;/g, "&")
    .replace(/&lt;/g, "<")
    .replace(/&gt;/g, ">")
    .replace(/&quot;/g, '"')
    .replace(/&#0?39;|&apos;/g, "'")
    .replace(/&nbsp;/g, " ")
}

/** Strip nested inline tags (e.g. `<strong>`) so a heading's visible text is clean. */
function stripTags(html: string): string {
  return decodeEntities(html.replace(/<[^>]+>/g, "")).trim()
}

/** True when the content is CMS rich-text HTML rather than markdown. */
export function isHtmlContent(content: string): boolean {
  return /<\/?(p|h[1-6]|ul|ol|li|img|strong|em|blockquote|br|figure)\b/i.test(content)
}

/**
 * Extract `<h2>` / `<h3>` (HTML) and `##` / `###` (markdown) headings, assigning
 * a unique slug id to each. Existing `id="..."` attributes on HTML headings are
 * preserved so anchor links keep working. Duplicate slugs are de-duped (`-2`, `-3`).
 */
export function extractHeadings(content: string): ArticleHeading[] {
  const headings: ArticleHeading[] = []
  const used = new Map<string, number>()

  const push = (level: number, text: string, existingId?: string) => {
    const clean = text.trim()
    if (!clean) return
    let id = existingId?.trim() || slugifyHeading(clean)
    if (!id) id = `section-${headings.length + 1}`
    const seen = used.get(id) ?? 0
    used.set(id, seen + 1)
    if (seen > 0) id = `${id}-${seen + 1}`
    headings.push({ id, text: clean, level })
  }

  if (isHtmlContent(content)) {
    const htmlHeading = /<h([23])\b([^>]*)>([\s\S]*?)<\/h\1>/gi
    let m: RegExpExecArray | null
    while ((m = htmlHeading.exec(content)) !== null) {
      const attrs = m[2] ?? ""
      const idMatch = /\bid\s*=\s*["']([^"']+)["']/i.exec(attrs)
      push(Number(m[1]), stripTags(m[3] ?? ""), idMatch?.[1])
    }
    return headings
  }

  const mdHeading = /^(#{2,3})\s+(.+)$/gm
  let m: RegExpExecArray | null
  while ((m = mdHeading.exec(content)) !== null) {
    push(m[1].length, stripTags(m[2] ?? ""))
  }
  return headings
}

/**
 * Inject `id="..."` into `<h2>` / `<h3>` tags that lack one, using the SAME
 * slug + de-dupe rules as `extractHeadings`. Returns the HTML unchanged when it
 * is markdown (the markdown renderer already adds ids) or has no headings.
 */
export function injectHeadingIds(html: string): string {
  if (!isHtmlContent(html)) return html
  const used = new Map<string, number>()
  const htmlHeading = /<h([23])\b([^>]*)>([\s\S]*?)<\/h\1>/gi

  return html.replace(htmlHeading, (whole, level: string, attrs: string, inner: string) => {
    const existing = /\bid\s*=\s*["']([^"']+)["']/i.exec(attrs ?? "")
    let id: string
    if (existing?.[1]?.trim()) {
      id = existing[1].trim()
    } else {
      id = slugifyHeading(stripTags(inner ?? "")) || "section"
    }
    const seen = used.get(id) ?? 0
    used.set(id, seen + 1)
    if (seen > 0) id = `${id}-${seen + 1}`
    // Preserve any existing attributes; only add id when it was absent.
    const cleanAttrs = existing ? attrs ?? "" : `${attrs ?? ""} id="${id}"`
    return `<h${level}${cleanAttrs}>${inner}</h${level}>`
  })
}
