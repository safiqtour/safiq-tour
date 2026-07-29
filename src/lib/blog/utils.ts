export function formatDate(dateString: string): string {
  return new Date(dateString).toLocaleDateString("id-ID", {
    year: "numeric",
    month: "long",
    day: "numeric",
  })
}

export function getReadingTime(content: string): number {
  const wordsPerMinute = 200
  const words = content.split(/\s+/).length
  return Math.max(1, Math.ceil(words / wordsPerMinute))
}

export function getArticleUrl(slug: string): string {
  return `/blog/${slug}`
}

export function copyToClipboard(text: string): Promise<void> {
  return navigator.clipboard.writeText(text)
}

export function shareWhatsApp(url: string, title: string): void {
  const text = encodeURIComponent(`${title}\n\n${url}`)
  window.open(`https://wa.me/?text=${text}`, "_blank")
}

export function shareFacebook(url: string): void {
  window.open(`https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(url)}`, "_blank")
}

export function shareX(url: string, title: string): void {
  const text = encodeURIComponent(`${title}\n${url}`)
  window.open(`https://twitter.com/intent/tweet?text=${text}`, "_blank")
}

export function printArticle(): void {
  window.print()
}
