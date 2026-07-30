import slugifyLib from "slugify"

export function generateSlug(name: string): string {
  return slugifyLib(name, { lower: true, strict: true })
}

export function generateSlugWithSuffix(name: string, suffix?: string): string {
  const slug = generateSlug(name)
  return suffix ? `${slug}-${suffix}` : slug
}
