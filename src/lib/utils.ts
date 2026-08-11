import { clsx, type ClassValue } from "clsx"
import { twMerge } from "tailwind-merge"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

/**
 * next/image rejects absolute same-origin localhost URLs unless the host is
 * whitelisted in next.config. Local uploads are served by the app itself, so
 * rewrite them as root-relative paths ("/uploads/...") — no config needed and
 * port/environment agnostic. External URLs (https://cdn...) pass through as-is.
 */
export function normalizeImageUrl(src: string | null | undefined): string {
  if (!src) return ""
  try {
    const url = new URL(src)
    if (url.hostname === "localhost" || url.hostname === "127.0.0.1") {
      return `${url.pathname}${url.search}${url.hash}`
    }
    return src
  } catch {
    // Already a relative path (or unparsable) — use as-is.
    return src
  }
}
