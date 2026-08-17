/**
 * SEO-friendly slug generation for the Article CMS.
 *
 * Article titles are often long ("Panduan Lengkap Persiapan Umroh Sebelum
 * Berangkat ke Tanah Suci"). A verbatim slugify would produce an unwieldy URL
 * that also hurts SEO. This module strips common Indonesian stop words and
 * filler adjectives, keeps the most important keywords, and caps the result at
 * a short, readable length.
 */

/** Common Indonesian stop words — removed because they carry no keyword value. */
export const ARTICLE_STOP_WORDS = new Set([
  "dan",
  "yang",
  "untuk",
  "dengan",
  "sebelum",
  "sesuai",
  "ke",
  "di",
  "dari",
  "pada",
])

/**
 * Common title fillers that bloat a URL without adding SEO value (e.g. the
 * "Lengkap" in "Panduan Lengkap ..."). Kept separate from stop words so the
 * intent is clear and the list is easy to extend.
 */
const ARTICLE_FILLER_WORDS = new Set([
  "lengkap",
  "terbaru",
  "terbaik",
  "mudah",
  "praktis",
  "efektif",
  "sederhana",
])

/** Maximum number of keywords kept in a slug — keeps URLs short and readable. */
const MAX_SLUG_WORDS = 3

/** Basic fallback slugifier used when every word is a stop/filler word. */
function basicSlugify(text: string): string {
  return text
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/(^-|-$)/g, "")
}

/**
 * Generate a short, keyword-dense slug from an article title.
 *
 * Example:
 *   "Panduan Lengkap Persiapan Umroh Sebelum Berangkat ke Tanah Suci"
 *   -> "panduan-persiapan-umroh"
 */
export function generateArticleSlug(title: string): string {
  const words = title
    .toLowerCase()
    .replace(/[^a-z0-9\s]+/g, " ")
    .split(/\s+/)
    .filter(Boolean)
    .filter((w) => !ARTICLE_STOP_WORDS.has(w) && !ARTICLE_FILLER_WORDS.has(w))
    .slice(0, MAX_SLUG_WORDS)

  const slug = words.join("-")
  return slug || basicSlugify(title)
}
