export function buildSort(sort?: string, order?: "asc" | "desc", defaultSort = "createdAt"): Record<string, string> {
  return { [sort ?? defaultSort]: order ?? "desc" }
}
